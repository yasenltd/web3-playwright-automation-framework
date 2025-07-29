import BasePage from './core/BasePage.js';
import selectors from '../locators/neuraLocators.js';

class BridgePage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = selectors;
    }

    static async initialize(context, bridgePageUrl) {
        return BasePage.initPage(context, bridgePageUrl, BridgePage, selectors);
    }

    async switchNetworkDirection() {
        await this.play.clickDescLoc(this.selectors.bridgeDescriptors.switchBridgeBtn);
        console.log('Switched network direction successfully');
    }
}

export default BridgePage;
