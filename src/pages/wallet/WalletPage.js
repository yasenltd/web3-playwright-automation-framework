import BasePage from '../core/BasePage.js';
import BrowserManager from '../../core/browser/BrowserManager.js';

/**
 * Base class for wallet extension pages
 * Implements shared extension handling and context setup
 */
class WalletPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this._extensionNamePattern = '';
        this._defaultExtensionId = '';
    }

    /**
     * Static factory method to launch wallet extension and return page instance
     * Subclasses are responsible for calling `new SubWallet(page)` after this.
     *
     * @param {string} walletName
     * @param {string} onboardingUrlPart
     * @returns {Promise<{ context: BrowserContext, page: Page }>}
     */
    static async initialize(walletName, onboardingUrlPart) {
        const browserManager = new BrowserManager(walletName);
        const context = await browserManager.launch();
        const page = await context.waitForEvent('page');
        await page.waitForURL(`**/${onboardingUrlPart}`);
        await page.bringToFront();
        return { context, page };
    }

    // === SHARED UTILITIES ===

    async findExtensionId() {
        const pattern = this._extensionNamePattern;
        if (!pattern) return this._defaultExtensionId;

        try {
            const page = await this.page.context().newPage();
            await page.goto('chrome://extensions');

            const extensionId = await page.evaluate((namePattern) => {
                return new Promise((resolve) => {
                    chrome.management.getAll((extensions) => {
                        const ext = extensions.find(
                            (e) => e.name.toLowerCase().includes(namePattern)
                        );
                        resolve(ext?.id || null);
                    });
                });
            }, pattern);

            await page.close();
            return extensionId || this._defaultExtensionId;
        } catch (err) {
            console.warn(`Could not detect extension: ${err.message}`);
            return this._defaultExtensionId;
        }
    }

    async openExtension() {
        const previousPage = this.page;
        const context = this.page.context();

        const extensionId = await this.findExtensionId();
        const extensionUrl = this.getExtensionUrl(extensionId); // subclass responsibility

        const newPage = await context.newPage();
        await newPage.goto(extensionUrl);
        await newPage.waitForLoadState('networkidle');
        await newPage.bringToFront();

        const extensionPage = this.createExtensionPageInstance(newPage); // subclass responsibility
        extensionPage._previousPageContext = context;

        return { extensionPage, previousPage };
    }

    async closeExtension(extensionPage, previousPage) {
        // If extensionPage is a wrapped WalletPage instance, get underlying Playwright page
        const rawExtensionPage = extensionPage.page ?? extensionPage;

        const context = rawExtensionPage.context();

        try {
            await rawExtensionPage.close();
        } catch (e) {
            console.error('Error closing extension page:', e.message);
        }

        let targetPage =
            previousPage && !previousPage.isClosed()
                ? previousPage
                : context.pages().find((p) => p !== rawExtensionPage && !p.isClosed());

        if (!targetPage) {
            targetPage = await context.newPage();
        }

        try {
            await targetPage.bringToFront();
        } catch {
            targetPage = await context.newPage();
        }

        // Return WalletPage subclass instance for the target page
        return this.createExtensionPageInstance(targetPage);
    }
}

export default WalletPage;