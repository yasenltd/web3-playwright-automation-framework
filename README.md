# Web3 Playwright Automation Framework

A modular, extensible automation framework built with Playwright for testing blockchain applications, specifically focusing on bridge functionality between different networks.

## Purpose

This framework is designed to automate testing of blockchain applications with a focus on:

- Testing bridge functionality between different blockchain networks (using Ethereum Sepolia and Neura as example networks)
- Automating wallet interactions (primarily MetaMask)
- Providing a modular, reusable architecture for test components
- Supporting parallel test execution

## Architecture

The framework follows a modular architecture with the following components:

### Core Components

- **Fixtures**: Reusable test setup components that provide configured browser contexts, page objects, and UI components
  - `bridgeFixture.js`: Sets up browser context with MetaMask wallet and bridge page
  - `networkComponentFixture.js`: Provides network modal components
  - `combinedFixture.js`: Combines multiple fixtures for complex test scenarios

- **Page Objects**: Represent pages and UI components in the application
  - `BridgePage.js`: Represents the bridge page for cross-chain transactions
  - `NetworkModal.js`: Represents the network selection modal

- **Utilities**:
  - `extensionUtils.js`: Handles downloading and configuring browser extensions (wallet extensions)
  - `dataCleaner.js`: Manages user data directories for clean test execution

- **Constants**:
  - `extensionConstants.js`: Configuration for wallet extensions
  - `entityConstants.js`: Constants for UI components

- **Locators**: Element selectors and locators for UI components

- **Patterns**: Reusable design patterns for test implementation

### Design Patterns

The framework uses several design patterns:

1. **Page Object Model (POM)**: Encapsulates page structure and behavior in dedicated classes
2. **Fixture Pattern**: Provides reusable test setup and teardown
3. **Factory Pattern**: Creates UI components and entities dynamically
4. **Composition Pattern**: Combines fixtures to create complex test scenarios
5. **Strategy Pattern**: Encapsulates different algorithms (like wallet onboarding flows) and makes them interchangeable
6. **Registry Pattern**: Maintains a registry of available implementations (like wallet types)

## Test Types

The framework supports the following types of tests:

1. **UI Tests**: Testing the user interface and interactions
2. **Wallet Integration Tests**: Testing integration with cryptocurrency wallets (MetaMask)
3. **Network Bridge Tests**: Testing cross-chain transactions and network switching

## Wallet Pages and Patterns

The framework uses a combination of Page Objects and Design Patterns to provide a flexible, extensible architecture for wallet automation:

### Wallet Page Hierarchy

The framework implements a class hierarchy for wallet pages:

- **WalletPage**: Base abstract class that provides common functionality for all wallet extensions:
  - Extension handling (finding extension ID, opening/closing extension)
  - Browser context setup
  - Abstract methods that subclasses must implement

- **MetamaskPage**: Concrete implementation for MetaMask wallet that extends WalletPage:
  - Implements MetaMask-specific UI interactions
  - Provides methods for wallet operations (connecting, confirming transactions, etc.)
  - Implements abstract methods from WalletPage

This hierarchy allows the framework to support different wallet types by extending the WalletPage class.

### Pattern Implementation

The framework uses the Strategy Pattern for wallet onboarding flows:

- **WalletOnboardingFlow**: Abstract class that defines the interface for wallet onboarding:
  - `import()`: Method to import a wallet using credentials
  - `configureNetworks()`: Method to configure networks for the wallet

- **MetamaskOnboardingFlow**: Concrete implementation for MetaMask:
  - Implements the onboarding flow specific to MetaMask
  - Calls appropriate methods on MetamaskPage

This pattern allows the framework to support different wallet onboarding flows without changing the client code.

### Adding New Wallet Support

To add support for a new wallet:

1. **Create a new wallet page class** that extends WalletPage:

   ```javascript
   // src/pages/wallet/YourWalletPage.js
   import WalletPage from './WalletPage.js';
   import selectors from '../../locators/yourWalletLocators.js';
   
   class YourWalletPage extends WalletPage {
       constructor(page, strategy) {
           super(page);
           this.selectors = selectors;
           this._extensionNamePattern = 'your-wallet';
           this._defaultExtensionId = 'your-default-extension-id';
           this.onboardingStrategy = strategy;
       }
       
       // Implement abstract methods
       getExtensionUrl(extensionId) {
           return `chrome-extension://${extensionId}/your-wallet-path.html`;
       }
       
       createExtensionPageInstance(page) {
           return new YourWalletPage(page, this.onboardingStrategy);
       }
       
       // Implement wallet-specific methods
       async connectWallet() {
           // Your implementation
       }
       
       // Other methods...
   }
   
   export default YourWalletPage;
   ```

2. **Create a new onboarding flow** that extends WalletOnboardingFlow:

   ```javascript
   // src/patterns/wallet/YourWalletOnboardingFlow.js
   import WalletOnboardingFlow from './WalletOnboardingFlow.js';
   
   export default class YourWalletOnboardingFlow extends WalletOnboardingFlow {
       async import(walletPage, credentials, password) {
           // Implement your wallet's onboarding flow
       }
       
       async configureNetworks(walletPage, networksToSetup) {
           // Implement network configuration
       }
   }
   ```

3. **Register your wallet** in the wallet registry:

   ```javascript
   // src/utils/walletRegistry.js
   export const walletRegistry = {
       // Existing wallets...
       yourWallet: {
           page: () => import('../pages/wallet/YourWalletPage.js').then(m => m.default),
           strategy: () => import('../patterns/wallet/YourWalletOnboardingFlow.js').then(m => m.default),
       },
   };
   ```

4. **Create locators** for your wallet:

   ```javascript
   // src/locators/yourWalletLocators.js
   export default {
       // Your wallet's selectors
   };
   ```

This modular approach allows the framework to be extended with new wallet types without modifying existing code.

## Bridge Testing

The framework includes specialized components for testing blockchain bridge functionality:

### Example Bridge Implementation

The current implementation focuses on testing bridge functionality between Ethereum Sepolia and Neura testnet networks as examples. This specific bridge implementation:

- Allows testing token transfers between these two networks
- Supports network switching via the UI
- Includes fixtures for different network combinations
- Provides locators for bridge-specific UI elements

### Adapting to Other Networks

The framework is designed to be adaptable to other blockchain networks. To test bridges between different networks:

1. **Update Network Constants**: Add new network configurations in `networkConstants.js`:

   ```javascript
   const networks = {
       // Existing networks...
       
       // Your new network
       yourNetwork: {
           networkName: 'Your Network',
           rpcUrl: process.env.YOUR_NETWORK_RPC_URL,
           chainId: 'your-chain-id',
           currencySymbol: 'YOUR-SYMBOL',
           name: 'Your Network',
           explorer: 'https://your-network-explorer.com'
       }
   };
   ```

2. **Update Wallet Controller**: Modify the `setupNetworks` method in `WalletController.js` to include your networks

3. **Create Network-Specific Locators**: Add or modify locators in `neuraLocators.js` or create a new locators file for your specific networks

4. **Update Environment Variables**: Add required environment variables for your networks in the `.env` file:
   ```
   YOUR_NETWORK_RPC_URL=https://your-network-rpc-url.com
   ```

5. **Create Custom Test Fixtures**: Create new test fixtures with your network combinations using the `createTestFixture` function:
   ```javascript
   const testWithYourNetwork = createTestFixture({
       setupSepoliaNetwork: false,
       setupNeuraNetwork: false,
       setupYourNetwork: true
   });
   ```

Note that bridge implementations vary between different blockchain networks, and you may need to adapt the framework to handle specific bridge protocols and interfaces.

## Running Tests

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Environment variables set up in a `.env` file:
  - `SEED_PHRASE`: Wallet seed phrase for testing
  - `WALLET_PASSWORD`: Wallet password
  - `NEURA_TESTNET_URL`: URL for the Neura testnet bridge
  - `NEURA_TESTNET_RPC_URL`: RPC URL for the Neura testnet
  - `SEPOLIA_RPC_URL`: RPC URL for the Ethereum Sepolia testnet
  - `SEPOLIA_EXPLORER`: Block explorer URL for Sepolia

Note: These environment variables are specific to the example implementation using Ethereum Sepolia and Neura testnet networks. If you adapt the framework to other networks, you'll need to define different environment variables.

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in a specific file
npx playwright test src/tests/singleFixtureDemoTest.spec.js

# Run tests with UI mode
npx playwright test --ui

# Run tests with debug mode
npx playwright test --debug
```

### Test Configuration

Tests can be configured in the `playwright.config.js` file:

- **Browser**: Currently configured for Chromium
- **Headless Mode**: Set to `false` by default for visibility
- **Viewport**: 1280x720
- **Tracing**: Enabled for debugging
- **Screenshots**: Captured on test failure
- **Video Recording**: Disabled by default
- **Slow Motion**: Set to 500ms for better visibility of actions
- **Parallelism**: Set to 1 worker by default, can be increased for parallel execution

## Project Structure

```
web3-playwright-automation-framework/
├── src/
│   ├── asserters/           # Test assertion utilities
│   ├── constants/           # Constant values and configurations
│   ├── core/                # Core framework components
│   │   ├── navigation/      # Navigation utilities
│   │   └── wallet/          # Wallet interaction utilities
│   ├── extensions/          # Downloaded browser extensions
│   ├── fixtures/            # Test fixtures
│   ├── locators/            # Element selectors and locators
│   ├── pages/               # Page objects
│   │   └── components/      # Reusable UI components
│   ├── patterns/            # Reusable design patterns
│   ├── tests/               # Test files
│   └── utils/               # Utility functions
├── user_data/               # Browser user data
├── playwright-report/       # Test reports
├── test-results/            # Test results and artifacts
├── playwright.config.js     # Playwright configuration
└── package.json             # Project dependencies and scripts
```

## Best Practices

1. **Use Fixtures**: Leverage the fixture pattern for test setup and teardown
2. **Combine Fixtures**: Use combined fixtures for complex test scenarios
3. **Page Objects**: Create page objects for each page or significant UI component
4. **Clean Data**: Use dataCleaner utilities to ensure clean test execution
5. **Environment Variables**: Store sensitive information in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
