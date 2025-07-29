import WalletPage from './WalletPage.js';
import selectors from '../../locators/metamaskLocators.js';
import {NETWORK_OPERATION_TIMEOUT} from "../../constants/timeoutConstants.js";

class MetamaskPage extends WalletPage {
    constructor(page, strategy) {
        super(page);
        this.selectors = selectors;
        this._extensionNamePattern = 'metamask';
        this._defaultExtensionId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
        this.onboardingStrategy = strategy;
    }

    static async initWithStrategy(strategy) {
        const onboardingUrl = 'home.html#onboarding/welcome';
        const { context, page } = await super.initialize('metamask', onboardingUrl);
        const walletPage = new MetamaskPage(page, strategy);
        return { context, walletPage };
    }

    getExtensionUrl(extensionId) {
        return `chrome-extension://${extensionId}/home.html`;
    }

    createExtensionPageInstance(page) {
        return new MetamaskPage(page, this.onboardingStrategy);
    }

    async completeInitialOnboarding() {
        await this.play.click(this.selectors.onboarding.agreementCheckbox);
        await this.play.click(this.selectors.onboarding.importExistingButton);
        await this.play.click(this.selectors.onboarding.denyMetricsButton);
    }

    async processCredentials(seedPhrase) {
        await this.fillSeedPhrase(seedPhrase);
        await this.play.click(this.selectors.seedPhrase.confirmButton);
    }

    async setupPassword(password) {
        await this.play.fill(this.selectors.password.newInput, password);
        await this.play.fill(this.selectors.password.confirmInput, password);
        await this.play.click(this.selectors.password.termsCheckbox);
        await this.play.click(this.selectors.password.importButton);
    }

    async completeFinalOnboarding() {
        await this.play.click(this.selectors.onboarding.doneButton);
        await this.play.click(this.selectors.onboarding.extensionNextButton);
        await this.play.click(this.selectors.onboarding.extensionDoneButton);
    }

    async fillSeedPhrase(seedPhrase) {
        const words = seedPhrase.split(/[\s,]+/).filter(word => word.trim().length > 0);
        const validLengths = [12, 15, 18, 21, 24];
        if (!validLengths.includes(words.length)) {
            throw new Error(`Seed phrase must contain 12, 15, 18, 21, or 24 words. Received ${words.length}.`);
        }

        await this.play.selectOptionByValue(this.selectors.seedPhrase.dropdown, String(words.length), 1);
        for (let i = 0; i < words.length; i++) {
            await this.play.fill(this.selectors.seedPhrase.wordInputPrefix + i, words[i]);
        }
    }

    async connectWallet() {
        await this.play.waitForElementToBeVisible(this.selectors.connection.connectWalletButton);
        await this.play.click(this.selectors.connection.connectWalletButton);
    }

    async confirmTransaction() {
        await this.play.waitForElementToBeVisible(this.selectors.transaction.confirm);
        await this.play.click(this.selectors.transaction.confirm);
    }

    async cancelTransaction() {
        await this.play.waitForElementToBeVisible(this.selectors.transaction.cancel);
        await this.play.click(this.selectors.transaction.cancel);
    }

    async approveCustomNetwork() {
        await this.play.waitForElementToBeVisible(this.selectors.transaction.submit);
        await this.play.click(this.selectors.transaction.submit);
    }

    async addRpcUrl(rpcUrl) {
        await this.play.click(this.selectors.network.addRpcDropdownButton);
        await this.play.click(this.selectors.network.addRpcUrlInModalButton);
        await this.play.fill(this.selectors.network.networkForm.rpcUrl, rpcUrl);
        await this.play.click(this.selectors.network.addUrlButton);
    }

    async addAndSelectNetwork(networkDetails) {
        await this.addCustomNetwork(networkDetails);
        await this.searchAndSelectNetwork(networkDetails.networkName);
    }

    async addCustomNetwork({ networkName, rpcUrl, chainId, currencySymbol }) {
        const popoverVisible = await this.play.isElementVisible(this.selectors.network.popOverSelector);
        if (popoverVisible) {
            await this.play.click(this.selectors.network.popOverSelector);
        }
        await this.play.click(this.selectors.network.networkSelector);
        await this.play.click(this.selectors.network.addCustomNetworkButton);
        await this.play.fill(this.selectors.network.networkForm.networkName, networkName);
        await this.addRpcUrl(rpcUrl);
        await this.play.fill(this.selectors.network.networkForm.chainId, chainId);
        await this.play.fill(this.selectors.network.networkForm.currencySymbol, currencySymbol);
        await this.play.click(this.selectors.network.networkForm.saveButton);
    }

    async searchAndSelectNetwork(networkName) {
        await this.play.click(this.selectors.network.networkSelector);
        await this.play.fill(this.selectors.network.searchSelector, networkName);
        await new Promise(r => setTimeout(r, NETWORK_OPERATION_TIMEOUT)); // slight wait for DOM update
        const exactMatchSelector = `[data-testid="${networkName}"]`;

        if (!(await this.play.isElementVisible(exactMatchSelector))) {
            throw new Error(`Network "${networkName}" not found.`);
        }

        await this.play.click(exactMatchSelector);
    }
}

export default MetamaskPage;
