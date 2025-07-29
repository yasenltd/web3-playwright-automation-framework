import { testWithoutSepolia as test } from '../fixtures/bridgeFixture.js';
import { expect } from '@playwright/test';

test('User connects with Metamask using single bridge fixture', async ({ bridgePage, context }) => {
    await expect(bridgePage.page).toHaveURL(/neura/);
    await bridgePage.connectMetamask(context);
    await bridgePage.switchNetworkDirection();
});
