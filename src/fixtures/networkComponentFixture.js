import { test as baseTest } from '@playwright/test';
import EntityFactory from '../core/navigation/EntityFactory.js';
import { ENTITIES } from '../constants/entityConstants.js';

const networkModalFixture = async ({ page }, use) => {
    const networkModal = await EntityFactory.create(ENTITIES.NETWORK_MODAL, page);
    await use(networkModal);
};

export const networkComponentTest = baseTest.extend({
    networkModal: networkModalFixture,
});

export { networkModalFixture };
