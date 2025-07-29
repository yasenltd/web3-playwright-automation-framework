import { expect } from '@playwright/test';

class LayoutAsserter {
    /**
     * Assert the layout of the Source Chain modal.
     * @param {object} play - Your PlaywrightWrapper instance or page helper
     * @param {object} selectors - Selectors object containing sourceChainModal keys
     */
    static async assertSourceChainModalLayout(play, selectors) {
        const title = await play.getElementWithDescLoc(selectors.sourceChainModal.selectSourceChainTitle);
        expect(await title.isVisible()).toBe(true);
        await expect(play.doesTextMatchDescriptor(selectors.sourceChainModal.neuraLabel)).resolves.toBe(true);
        await expect(play.doesTextMatchDescriptor(selectors.sourceChainModal.sepoliaLabel)).resolves.toBe(true);
    }
}

export default LayoutAsserter;
