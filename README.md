# Event Ticketing App

## How to Run the Project

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## How to Install Foundry

1. Install Foundry using the following command:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

2. Run `foundryup` to install Foundry's components:
```bash
foundryup
```

This will install four main components:
- forge (build & test tool)
- cast (contract interaction tool)
- anvil (local node)
- chisel (Solidity REPL)

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## What Foundry Can Do for Smart Contract Development:

1. **High-Performance Development**:
   - Fast compilation with automatic Solidity compiler version detection
   - Supports both Solidity and Vyper
   - Incremental compilation (only recompiles changed files)
   - Parallelized compilation pipeline
   - Compatible with non-standard directory structures

2. **Advanced Testing Capabilities**:
   - Write tests directly in Solidity
   - Fuzz testing to find edge cases
   - Invariant testing for system properties
   - Debug logging with `console.sol`
   - Interactive debugger for stepping through code
   - Gas usage reports and optimization

3. **Deployment & Interaction**:
   - Deploy contracts using Solidity scripts
   - Interact with contracts using the `cast` command-line tool
   - Support for multiple networks and RPC endpoints
   - Built-in support for contract verification

4. **Local Development**:
   - Run a local blockchain with `anvil`
   - Fork mainnet or testnet states
   - Fast RPC forking capabilities
   - No dependency on external package managers

5. **Contract Interaction Features**:
   - Send transactions and read contract state
   - Convert between different data formats
   - Debug transaction traces
   - Simulate transactions before sending
   - Interact with contracts using human-readable ABIs

6. **Development Tools**:
   - Interactive Solidity REPL (Chisel)
   - Comprehensive testing framework
   - Built-in gas optimization tools
   - Contract verification tools
   - Dependency management through git submodules

7. **CI/CD Integration**:
   - GitHub Actions support
   - Automated testing and deployment
   - Gas reporting in CI
   - Coverage analysis

8. **Configuration & Customization**:
   - Configurable through `foundry.toml`
   - Support for multiple profiles
   - Environment variable overrides
   - Custom test configurations

Foundry has become a popular choice for Ethereum development due to its speed, comprehensive feature set, and developer-friendly approach to smart contract development. Its ability to write tests in Solidity and provide powerful debugging tools makes it particularly attractive for complex smart contract systems.