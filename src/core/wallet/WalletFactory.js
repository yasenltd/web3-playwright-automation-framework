import { walletRegistry } from '../../utils/walletRegistry.js';
import WalletController from './WalletController.js';

export default class WalletFactory {
    /**
     * Creates a wallet instance with its strategy and controller
     * @param {string} walletKey - Key to identify the wallet (e.g., 'metamask')
     * @returns {Promise<{ context: BrowserContext, wallet: WalletController }>}
     */
    static async createWallet(walletKey) {
        const entry = walletRegistry[walletKey];
        if (!entry) {
            throw new Error(`Unsupported wallet: ${walletKey}`);
        }

        // Load wallet page class and onboarding strategy in parallel
        const [PageClass, StrategyClass] = await Promise.all([
            entry.page(),
            entry.strategy(),
        ]);

        // Instantiate the onboarding strategy class
        const strategyInstance = new StrategyClass();

        // Initialize the wallet page with the strategy
        const { context, walletPage } = await PageClass.initWithStrategy(strategyInstance);

        // Wrap wallet page and strategy with controller for unified API
        const controller = new WalletController(walletPage, strategyInstance);

        return { context, wallet: controller };
    }
}
