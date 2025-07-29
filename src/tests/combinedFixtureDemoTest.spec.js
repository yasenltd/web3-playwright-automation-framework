import { test } from '../fixtures/combinedFixture.js';
import { expect } from '@playwright/test';

test('User connects with Metamask using combined fixture', async ({ bridgePage, networkModal }) => {
    await expect(bridgePage.page).toHaveURL(/neura/);
    await bridgePage.connectMetamask(bridgePage.context);
    await bridgePage.switchNetworkDirection();
    await networkModal.verifySourceChainModalLayout();
});
