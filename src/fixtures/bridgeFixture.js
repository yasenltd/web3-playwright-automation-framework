import { test as baseTest } from '@playwright/test';
import dotenv from 'dotenv';
import WalletFactory from '../core/wallet/WalletFactory.js';
import BridgePage from '../pages/BridgePage.js';

dotenv.config();

const createTestFixture = (options = { setupSepoliaNetwork: true, setupNeuraNetwork: true }) => {
    const slowTest = baseTest.extend({});
    slowTest.slow();

    return slowTest.extend({
        bridgePage: async ({}, use) => {
            let context;
            let walletController;
            let bridgePageInstance;

            try {
                const config = {
                    seedPhrase: process.env.SEED_PHRASE,
                    password: process.env.WALLET_PASSWORD,
                    bridgePageUrl: process.env.NEURA_TESTNET_URL,
                };

                if (!config.seedPhrase || !config.password || !config.bridgePageUrl) {
                    throw new Error('Missing required env variables: SEED_PHRASE, WALLET_PASSWORD, NEURA_TESTNET_URL');
                }

                const { context: browserContext, wallet } = await WalletFactory.createWallet('metamask');
                context = browserContext;
                walletController = wallet;

                await walletController.importWallet(config.seedPhrase, config.password);

                bridgePageInstance = await BridgePage.initialize(context, config.bridgePageUrl);

                await walletController.setupNetworks({
                    setupSepoliaNetwork: options.setupSepoliaNetwork,
                    setupNeuraNetwork: options.setupNeuraNetwork,
                });

                bridgePageInstance.setWallet(walletController.walletPage);

                await use(bridgePageInstance);

                if (context) {
                    await context.close();
                    console.log('✅ Browser context closed successfully');
                }
            } catch (error) {
                console.error(`❌ Error in test setup: ${error.message}`);
                if (context) {
                    await context.close();
                }
                throw error;
            }
        },

        wallet: async ({ bridgePage }, use) => {
            await use(bridgePage.wallet);
        },

        context: async ({ bridgePage }, use) => {
            await use(bridgePage.context);
        },
    });
};

const testWithNeuraAndSepolia = createTestFixture({
    setupSepoliaNetwork: true,
    setupNeuraNetwork: true,
});

const testWithoutNeura = createTestFixture({
    setupSepoliaNetwork: true,
    setupNeuraNetwork: false,
});

const testWithoutSepolia = createTestFixture({
    setupSepoliaNetwork: false,
    setupNeuraNetwork: true,
});

const testWithoutNeuraAndSepolia = createTestFixture({
    setupSepoliaNetwork: false,
    setupNeuraNetwork: false,
});

export {
    createTestFixture,
    testWithNeuraAndSepolia,
    testWithoutNeura,
    testWithoutSepolia,
    testWithoutNeuraAndSepolia,
};