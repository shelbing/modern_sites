/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_STRIPE_KEY: string;
    readonly STRIPE_SECRET_KEY: string;
    readonly APALEO_API_URL: string;
    readonly APALEO_CLIENT_ID: string;
    readonly APALEO_CLIENT_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Declare Svelte components for Astro integration
declare module '*.svelte' {
    import type { ComponentType, SvelteComponentTyped } from 'svelte';
    
    // MegaChatBot specific props declaration
    class MegaChatBotComponent extends SvelteComponentTyped<{
        startMessage: string;
    }> {}
    
    // Add more component declarations as needed
    
    // Default export for all Svelte components
    const component: ComponentType;
    export default component;
}
