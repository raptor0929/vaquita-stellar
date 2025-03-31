#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String};
use blend_contract_sdk::pool;

// mod pool {
//     soroban_sdk::contractimport!(file = "./wasm/pool.wasm");
// }

#[contract]
pub struct DepositContract;

// This is a sample contract. Replace this placeholder with your own contract logic.
// A corresponding test example is available in `test.rs`.
//
// For comprehensive examples, visit <https://github.com/stellar/soroban-examples>.
// The repository includes use cases for the Stellar ecosystem, such as data storage on
// the blockchain, token swaps, liquidity pools, and more.
//
// Refer to the official documentation:
// <https://developers.stellar.org/docs/build/smart-contracts/overview>.
#[contractimpl]
impl DepositContract {
    pub fn deposit(env: Env, uuid: String, pool_address: Address, token: Address, amount: i128) {
        // Create a deposit request
        let request = pool::Request {
            request_type: 0u32,
            address: token.clone(),
            amount,
        };

        // Create a vector with the deposit request
        let requests = soroban_sdk::vec![&env, request];

        // Get the caller's address
        let user = env.current_contract_address();

        // Submit the deposit to the Blend pool
        let pool_client = pool::Client::new(&env, &pool_address);
        pool_client.submit(&user, &user, &user, &requests);

        // You can emit an event with the UUID for tracking
        env.events().publish(
            ("deposit", user),
            (uuid, token, amount),
        );
    }

    pub fn withdraw(
        env: Env,
        uuid: String,
        pool_address: Address,
        token: Address,
        amount: i128,
    ) {
        // Create a withdrawal request
        let request = pool::Request {
            request_type: 1u32,
            address: token.clone(),
            amount,
        };

        // Create a vector with the withdrawal request
        let requests = soroban_sdk::vec![&env, request];

        // Get the caller's address
        let user = env.current_contract_address();

        // Submit the withdrawal to the Blend pool
        let pool_client = pool::Client::new(&env, &pool_address);
        pool_client.submit(&user, &user, &user, &requests);

        // Emit an event with the UUID for tracking
        env.events().publish(
            ("withdraw", user),
            (uuid, token, amount),
        );
    }
}
