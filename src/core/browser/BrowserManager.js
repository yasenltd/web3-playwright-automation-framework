import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';
import extensionConsts from '../../constants/extensionConstants.js';
import { downloadAndExtractWalletAuto } from '../../utils/extensionUtils.js';
import { clearUserDataDir } from '../../utils/dataCleaner.js';

// ── resolve __dirname in ESM ─────────────────────
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// ── constants ─────────────────────────────────────
const USER_DATA_DIR = path.join(process.cwd(), 'user_data');
const CHANNEL = process.env.BROWSER_CHANNEL || 'chrome';
const HEADLESS = false;

export default class BrowserManager {
    /**
     * Manages launching a Chromium browser with a wallet extension.
     *
     * @param {string} walletName - The key from `extensionConstants.js`, e.g., 'metamask'
     * @param {object} options - Optional settings (e.g., custom user data dir)
     */
    constructor(walletName, options = {}) {
        this.walletName = walletName;
        this.userDataDir = options.userDataDir || USER_DATA_DIR;
        this.extensionPath = null;
    }

    /**
     * Prepares the extension directory and clears user data.
     * Should be called before launching the browser.
     */
    async setup() {
        clearUserDataDir(this.userDataDir);

        const wallet = extensionConsts[this.walletName];
        if (!wallet) {
            throw new Error(`Unsupported wallet: ${this.walletName}`);
        }

        this.extensionPath = await downloadAndExtractWalletAuto(this.walletName);
    }

    /**
     * Launches the browser with the selected wallet extension loaded.
     *
     * @returns {Promise<import('@playwright/test').BrowserContext>}
     */
    async launch() {
        if (!this.extensionPath) {
            await this.setup();
        }

        console.log(`Launching browser with:
          - Wallet: ${this.walletName}
          - Channel: ${CHANNEL}
          - Headless: ${HEADLESS}
          - Extension path: ${this.extensionPath}`);

        return chromium.launchPersistentContext(this.userDataDir, {
            headless: HEADLESS,
            channel: CHANNEL,
            args: [
                `--disable-extensions-except=${this.extensionPath}`,
                `--load-extension=${this.extensionPath}`,
                '--no-sandbox',
            ],
        });
    }
}
