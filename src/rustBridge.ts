// type RustBindings = typeof import('../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js');
import type * as RustModule from '../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js';

type RustBindings = typeof RustModule;

let rustBindingsPromise: Promise<RustBindings> | undefined;

async function loadRustBindings(): Promise<RustBindings> {
    rustBindingsPromise ??= import('../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js');
    return rustBindingsPromise;
}

export async function addNumbersWithRust(left: number, right: number): Promise<number> {
    const { add_numbers } = await loadRustBindings();
    return add_numbers(Math.trunc(left), Math.trunc(right));
}

export async function checksumWithRust(input: string): Promise<number> {
    const { checksum_from_rust } = await loadRustBindings();
    return checksum_from_rust(input);
}
