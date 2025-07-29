import { entityRegistry } from '../../utils/entityRegistry.js';

export default class EntityFactory {
    /**
     * Create an instance of a Page, Component, or Wallet by entityKey
     * @param {string} entityKey
     * @param {import('playwright').Page} page - Playwright page instance (if applicable)
     * @param  {...any} args - Additional constructor args
     * @returns {Promise<object>} Instance of requested class
     */
    static async create(entityKey, page, ...args) {
        const loader = entityRegistry[entityKey];
        if (!loader) {
            throw new Error(`Entity key "${entityKey}" not found in registry`);
        }

        const EntityClass = await loader();
        return new EntityClass(page, ...args);
    }
}
