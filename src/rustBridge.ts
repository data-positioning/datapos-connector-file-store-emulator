// Dependencies - Framework
import type * as RustModule from '../rust/datapos-connector-file-store-emulator-core/pkg/datapos_connector_file_store_emulator_core.js';

// Interfaces/Types
type RustBindings = typeof RustModule;

// Module Variables
let rustBindingsPromise: Promise<RustBindings> | undefined;

// Utilities
async function addNumbersWithRust(left: number, right: number): Promise<number> {
    const { add_my_numbers } = await loadRustBindings();
    console.log(1111, left, right);
    const yyyy = add_my_numbers(Math.trunc(left), Math.trunc(right));
    console.log(2222, yyyy);
    return yyyy;
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
