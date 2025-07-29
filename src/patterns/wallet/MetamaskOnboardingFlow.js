import WalletOnboardingFlow from './WalletOnboardingFlow.js';

/**
 * Onboarding flow strategy for MetaMask wallet.
 */
export default class MetamaskOnboardingFlow extends WalletOnboardingFlow {
    /**
     * @override
     * @param {import('../../pages/wallet/MetamaskPage.js').default} walletPage
     * @param {string} credentials
     * @param {string} password
     */
    async import(walletPage, credentials, password) {
        await walletPage.completeInitialOnboarding();
        await walletPage.processCredentials(credentials);
        await walletPage.setupPassword(password);
        await walletPage.completeFinalOnboarding();
    }

    async configureNetworks(walletPage, networksToSetup) {
        for (const net of networksToSetup) {
            await walletPage.addAndSelectNetwork(net);
        }
    }
}
