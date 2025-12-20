use wasm_bindgen::prelude::*;

/// Computes a simple checksum by summing every byte in the input string.
#[wasm_bindgen]
pub fn checksum_from_rust(input: &str) -> u32 {
    input.bytes().fold(0_u32, |acc, byte| acc.wrapping_add(byte as u32))
}

/// Adds two signed 32-bit integers using native Rust arithmetic.
#[wasm_bindgen]
pub fn add_numbers(left: i32, right: i32) -> i32 {
    left + right
}
