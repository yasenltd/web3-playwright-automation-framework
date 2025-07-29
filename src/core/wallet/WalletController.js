import networks from '../../constants/networkConstants.js';

export default class WalletController {
    /**
     * @param {WalletPage} walletPage - A subclass instance like MetamaskPage
     * @param {WalletOnboardingFlow} strategy - The onboarding flow strategy
     */
    constructor(walletPage, strategy) {
        this.walletPage = walletPage;      // Actual subclass
        this.strategy = strategy;
    }

    /**
     * Import wallet using strategy and credentials
     * @param {string} seedPhrase
     * @param {string} password
     */
    async importWallet(seedPhrase, password) {
        await this.strategy.import(this.walletPage, seedPhrase, password);
    }

    async setupNetworks(options = { setupSepoliaNetwork: true, setupNeuraNetwork: true }) {
        const shouldSetupSepolia = options.setupSepoliaNetwork ?? true;
        const shouldSetupNeura = options.setupNeuraNetwork ?? true;

        if (!shouldSetupSepolia && !shouldSetupNeura) return;
        const { extensionPage, previousPage } = await this.walletPage.openExtension();

        const networksToConfigure = [];
        if (shouldSetupSepolia) networksToConfigure.push(networks.sepolia);
        if (shouldSetupNeura) networksToConfigure.push(networks.neuraTestnet);

        await this.strategy.configureNetworks(extensionPage, networksToConfigure);
        await this.walletPage.closeExtension(extensionPage, previousPage);
    }

}
