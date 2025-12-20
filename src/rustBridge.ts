// Dependencies - Framework
import type * as RustModule from '../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js';

// Interfaces/Types
type RustBindings = typeof RustModule;

// Module Variables
let rustBindingsPromise: Promise<RustBindings> | undefined;

// Utilities
async function addNumbersWithRust(left: number, right: number): Promise<number> {
    const { add_numbers } = await loadRustBindings();
    return add_numbers(Math.trunc(left), Math.trunc(right));
}

// Utilities
async function checksumWithRust(input: string): Promise<number> {
    const { checksum_from_rust } = await loadRustBindings();
    return checksum_from_rust(input);
}

// Helpers
async function loadRustBindings(): Promise<RustBindings> {
    rustBindingsPromise ??= import('../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js');
    return rustBindingsPromise;
}

// Exposures
export { addNumbersWithRust, checksumWithRust };
