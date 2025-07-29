import { ENTITIES } from '../constants/entityConstants.js';

export const entityRegistry = {
    // Pages
    [ENTITIES.BRIDGE_PAGE]: () => import('../pages/BridgePage.js').then(m => m.default),
    [ENTITIES.SWAP_PAGE]: () => import('../pages/SwapPage.js').then(m => m.default),
    [ENTITIES.WALLET_PAGE]: () => import('../pages/wallet/WalletPage.js').then(m => m.default),

    // Components
    [ENTITIES.NETWORK_MODAL]: () => import('../pages/components/NetworkModal.js').then(m => m.default),

    // Wallets: now objects with both page() and strategy()
    [ENTITIES.METAMASK_WALLET]: {
        page: () => import('../pages/wallet/MetamaskPage.js').then(m => m.default),
        strategy: () => import('../patterns/wallet/MetamaskOnboardingFlow.js').then(m => m.default),
    }
};
