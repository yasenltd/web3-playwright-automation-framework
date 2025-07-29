import PlaywrightFactory from '../../core/playwright/PlaywrightFactory.js';
import selectors from '../../locators/neuraLocators.js';
import * as timeouts from "../../constants/timeoutConstants.js";

class BasePage {
    constructor(page) {
        this.page = page;
        this.play = PlaywrightFactory.getWrapper(page);
        this.wallet = null;
        this.context = page.context();
        this.selectors = selectors;
    }

    setWallet(wallet) {
        this.wallet = wallet;
    }

    /**
     * Common static initializer used by all Page classes.
     * @param {BrowserContext} context
     * @param {string} url
     * @param {typeof BasePage} PageClass
     * @param {any} [selectors]
     * @returns {Promise<BasePage>}
     */
    static async initPage(context, url, PageClass, selectors = {}) {
        const page = await context.newPage();
        await page.goto(url);
        const pageInstance = new PageClass(page, selectors);
        await pageInstance.closeUnnecessaryPages(context);
        return pageInstance;
    }

    async connectMetamask(context) {
        await this.play.clickDescLoc(selectors.connection.connectWalletButton);
        await this.play.clickDescLoc(selectors.connection.selectMetaMaskWallet);
        await this.attachWallet(context);
    }

    async attachWallet(context) {
        const [extensionPopup] = await Promise.all([context.waitForEvent('page')]);
        await extensionPopup.waitForLoadState('domcontentloaded');
        await extensionPopup.bringToFront();

        const WalletClass = this.wallet?.constructor ?? Object.getPrototypeOf(this.wallet)?.constructor;
        if (!WalletClass) throw new Error('Cannot find wallet class constructor');

        const popupWallet = new WalletClass(extensionPopup);

        if (typeof popupWallet.connectWallet !== 'function') {
            throw new Error('Wallet instance does not have connectWallet method');
        }

        console.log('Connecting wallet');
        await popupWallet.connectWallet();
        await new Promise(r => setTimeout(r, timeouts.METAMASK_POPUP_TIMEOUT / 2));
        console.log('Confirming MetaMask transaction after signing authentication message');
        await this.confirmTransaction(context);
        console.log('Signing message for authentication');
        await this.play.click(this.selectors.connection.signMessage);
        await new Promise(r => setTimeout(r, timeouts.METAMASK_POPUP_TIMEOUT / 2));
        console.log('MetaMask wallet connected and authenticated successfully');
        await this.page.bringToFront();
    }

    async confirmTransaction(context) {
        const [popup] = await Promise.all([context.waitForEvent('page')]);
        await popup.waitForLoadState('domcontentloaded');
        await popup.bringToFront();
        const popupWallet = new this.wallet.constructor(popup);
        await popupWallet.confirmTransaction();
        await this.page.bringToFront();
    }

    async disconnectWallet() {
        await this.play.clickDescLoc(this.selectors.connection.settingsButton);
        await this.play.click(this.selectors.connection.disconnectWallet);
    }

    /**
     * Close any unnecessary pages to keep the browser clean
     * @param {context} context - The browser context
     * @returns {Promise<void>}
     */
    async closeUnnecessaryPages(context) {
        const allPages = context.pages();
        const pagesToClose = allPages.filter(page => page !== this.page);
        if (pagesToClose.length > 0) {
            console.log(`Found ${pagesToClose.length} unnecessary pages to close:`);
            for (const page of pagesToClose) {
                try {
                    const url = page.url();
                    console.log(`- Closing page with URL: ${url}`);
                    await page.close();
                } catch (error) {
                    console.error(`Failed to close page: ${error.message}`);
                }
            }
            console.log('Page cleanup complete');
        } else {
            console.log('No unnecessary pages to close');
        }
    }
}

export default BasePage;
