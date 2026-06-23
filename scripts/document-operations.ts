import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateConnectorOperationsTable } from '@dpuse/dpuse-shared/component/module/connector';
import type { ConnectorOperationName } from '@dpuse/dpuse-shared/component/module/connector';
import config from '../config.json' with { type: 'json' };

const START_TAG = '<!-- CONNECTOR_OPERATIONS_START -->';
const END_TAG = '<!-- CONNECTOR_OPERATIONS_END -->';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const README_PATH = join(ROOT, 'README.md');

const table = generateConnectorOperationsTable(config.operations as ConnectorOperationName[]);
const block = `${START_TAG}\n\n${table}\n${END_TAG}`;

let readme = await readFile(README_PATH, 'utf-8');
const start = readme.indexOf(START_TAG);
const end = readme.indexOf(END_TAG);
if (start === -1 || end === -1) throw new Error('Insertion tags not found in README.md');
readme = readme.slice(0, start) + block + readme.slice(end + END_TAG.length);
await writeFile(README_PATH, readme, 'utf-8');
console.log('Operations table updated in README.md');
