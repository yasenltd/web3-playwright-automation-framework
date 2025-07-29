import BasePage from '../../pages/core/BasePage.js';
import selectors from '../../locators/neuraLocators.js';
import LayoutAsserter from '../../asserters/LayoutAsserter.js';

class NetworkModal extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = selectors;
    }

    async openModal() {
        await this.play.clickDescLoc(this.selectors.sourceChainModal.openNetworkSourceMenu);
    }

    async verifySourceChainModalLayout() {
        await this.openModal();
        await LayoutAsserter.assertSourceChainModalLayout(this.play, this.selectors);
    }
}

export default NetworkModal;
