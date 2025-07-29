/**
 * Interface for wallet onboarding flows.
 * Implement using the Strategy Pattern.
 */
export default class WalletOnboardingFlow {
    /**
     * Run the wallet import onboarding process.
     * @param {import('../../pages/wallet/WalletPage.js').default} walletPage
     * @param {string} credentials - Seed phrase or private key
     * @param {string} password - Wallet password
     * @returns {Promise<void>}
     */
    async import(walletPage, credentials, password) {
        throw new Error('import() must be implemented by subclass');
    }

    async configureNetworks(walletPage, networks) {
        throw new Error('configureNetworks() must be implemented by subclass');
    }
}
