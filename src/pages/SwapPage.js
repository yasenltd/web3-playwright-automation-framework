import BasePage from './core/BasePage.js';
import swapSelectors from '../locators/swapLocators.js';
import selectors from "../locators/neuraLocators.js";

class SwapPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = selectors;
    }

    static async initialize(context, url) {
        return BasePage.initPage(context, url, SwapPage, swapSelectors);
    }
}

export default SwapPage;
