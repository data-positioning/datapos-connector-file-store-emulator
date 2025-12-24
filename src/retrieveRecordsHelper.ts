import type { Tool as CSVParseTool } from '@datapos/datapos-tool-csv-parse';
import { loadTool } from '@datapos/datapos-shared/component/tool';
import type { ConnectorInterface, RetrieveRecordsSettings, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
import { buildFetchError, normalizeToError, OperationalError } from '@datapos/datapos-shared/errors';

const CALLBACK_RETRIEVE_ABORTED = 'Connector failed to abort retrieve all records operation.';
const DEFAULT_RETRIEVE_CHUNK_SIZE = 1000;
const DEFAULT_URL_PREFIX = 'https://sample-data-eu.datapos.app';
const DEFAULT_TOOL_ID = 'csv-parse';

type RetrieveRecordsConfig = {
    urlPrefix?: string;
    chunkSize?: number;
    csvToolId?: string;
};

type RowBuffer = {
    push: (row: string[]) => void;
    flush: () => void;
};

type CsvParser = ReturnType<CSVParseTool['buildParser']>;

type StreamConfig = {
    url: string;
    path: string;
    encodingId?: string;
    signal: AbortSignal;
    parser: CsvParser;
};

export async function retrieveRecordsStream(
    connector: ConnectorInterface,
    settings: RetrieveRecordsSettings,
    chunk: (records: string[][]) => void,
    complete: (result: RetrieveRecordsSummary) => void,
    config: RetrieveRecordsConfig = {}
): Promise<void> {
    const { urlPrefix = DEFAULT_URL_PREFIX, chunkSize = DEFAULT_RETRIEVE_CHUNK_SIZE, csvToolId = DEFAULT_TOOL_ID } = config;
    const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, csvToolId);

    return new Promise((resolve, reject) => {
        let settled = false;
        const fail = (error: unknown) => {
            if (settled) return;
            settled = true;
            connector.abortController = undefined;
            reject(normalizeToError(error));
        };

        try {
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener(
                'abort',
                () => fail(new OperationalError(CALLBACK_RETRIEVE_ABORTED, 'datapos-connector-file-store-emulator|Connector|retrieve.abort')),
                { once: true }
            );

            const buffer = createRowBuffer(chunk, chunkSize);
            const parser = csvParseTool.buildParser({ delimiter: settings.valueDelimiterId, info: true, relax_column_count: true, relax_quotes: true });

            parser.on('readable', () => handleReadable(parser, signal, buffer, fail));
            parser.on('error', fail);
            parser.on('end', () => {
                try {
                    signal.throwIfAborted();
                    buffer.flush();
                    connector.abortController = undefined;
                    settled = true;
                    complete({
                        byteCount: parser.info.bytes,
                        commentLineCount: parser.info.comment_lines,
                        emptyLineCount: parser.info.empty_lines,
                        invalidFieldLengthCount: parser.info.invalid_field_length,
                        lineCount: parser.info.lines,
                        recordCount: parser.info.records
                    });
                    resolve();
                } catch (error) {
                    fail(error);
                }
            });

            const url = `${urlPrefix}/fileStore${settings.path}`;
            void streamIntoParser({ url, path: settings.path, encodingId: settings.encodingId, signal, parser }).catch(fail);
        } catch (error) {
            fail(error);
        }
    });
}

function handleReadable(parser: CsvParser, signal: AbortSignal, buffer: RowBuffer, fail: (error: unknown) => void): void {
    try {
        let data: string[] | null;
        while ((data = parser.read() as string[] | null) !== null) {
            signal.throwIfAborted();
            buffer.push(data);
        }
    } catch (error) {
        fail(error);
    }
}

function createRowBuffer(chunk: (records: string[][]) => void, size: number): RowBuffer {
    let pending: string[][] = [];
    const flush = () => {
        if (pending.length === 0) return;
        chunk(pending);
        pending = [];
    };
    return {
        push(row: string[]) {
            pending.push(row);
            if (pending.length >= size) flush();
        },
        flush
    };
}

async function streamIntoParser({ url, path, encodingId, signal, parser }: StreamConfig): Promise<void> {
    const response = await fetch(encodeURI(url), { signal });
    if (!response.ok || !response.body) {
        throw await buildFetchError(response, `Failed to fetch '${path}' file.`, 'datapos-connector-file-store-emulator|Connector|retrieve');
    }

    const reader = response.body.pipeThrough(new TextDecoderStream(encodingId ?? 'utf-8')).getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        signal.throwIfAborted();
        await new Promise<void>((resolve, reject) => {
            parser.write(value, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    parser.end();
}
