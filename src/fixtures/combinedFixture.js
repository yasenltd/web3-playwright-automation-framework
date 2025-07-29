import { testWithoutSepolia } from './bridgeFixture.js';
import { networkModalFixture } from './networkComponentFixture.js';

const test = testWithoutSepolia.extend({
    networkModal: async ({ bridgePage }, use) => {
        await networkModalFixture({ page: bridgePage.page }, use);
    },
});

export { test };
