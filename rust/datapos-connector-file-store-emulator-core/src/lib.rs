use wasm_bindgen::prelude::*;
use datapos_engine_shared::add_numbers;

/// Computes a simple checksum by summing every byte in the input string.
#[wasm_bindgen]
pub fn checksum_from_rust(input: &str) -> u32 {
    input.bytes().fold(0_u32, |acc, byte| acc.wrapping_add(byte as u32))
}

/// Adds two signed 32-bit integers using native Rust arithmetic.
#[wasm_bindgen]
pub fn add_my_numbers(left: i64, right: i64) -> i32 {
    // Delegate to shared i64 implementation and downcast to i32 for the WASM interface.
    add_numbers(left as i64, right as i64) as i32
}
