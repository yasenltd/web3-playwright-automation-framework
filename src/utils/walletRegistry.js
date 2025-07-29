export const walletRegistry = {
    metamask: {
        page: () => import('../pages/wallet/MetamaskPage.js').then(m => m.default),
        strategy: () => import('../patterns/wallet/MetamaskOnboardingFlow.js').then(m => m.default),
    },
};
