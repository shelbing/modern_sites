<script>
    import { formTranslations } from "../../lib/translations";
    import { cartStore } from "../../stores/cartStore";
    import SelectedServicesList from "./SelectedServicesList.svelte";

    export let language;
    $: t = formTranslations[language] || formTranslations.en;

    // Get base amounts (already adjusted)
    $: roomAmounts = $cartStore?.calculatedAmounts?.base || {
        gross: 0,
        net: 0
    };

    // Get included services amounts (already adjusted)
    $: includedServicesAmounts = $cartStore?.calculatedAmounts?.services || {
        gross: 0,
        net: 0
    };

    // Get selected services amounts (not adjusted)
    $: selectedServicesAmounts = $cartStore?.selectedServices?.amounts || {
        gross: 0,
        net: 0
    };

    // Get percentages for display
    $: preisanpassungProzent = parseFloat($cartStore?.offer?.PreisanpassungProzent || 0);
    $: anzahlungProzent = parseFloat($cartStore?.offer?.AnzahlungProzent || 0);

    // Sum up the pre-adjusted base amounts
    $: adjustedBaseGross = roomAmounts.gross + includedServicesAmounts.gross;
    $: adjustedBaseNet = roomAmounts.net + includedServicesAmounts.net;

    // Add selected services (not adjusted)
    $: totalGross = adjustedBaseGross + selectedServicesAmounts.gross;
    $: totalNet = adjustedBaseNet + selectedServicesAmounts.net;

    // Calculate deposit
    $: depositGross = anzahlungProzent ? totalGross * (anzahlungProzent / 100) : totalGross;
    $: depositNet = anzahlungProzent ? totalNet * (anzahlungProzent / 100) : totalNet;

    // Calculate total tax
    $: totalTax = totalGross - totalNet;

    // Update cart store with new calculated amounts
    $: if ($cartStore) {
        cartStore.update(cart => ({
            ...cart,
            calculatedAmounts: {
                base: roomAmounts,
                services: includedServicesAmounts,
                total: {
                    gross: totalGross,
                    net: totalNet
                },
                Anzahlung: {
                    gross: depositGross,
                    net: depositNet
                }
            }
        }));
    }

    $: currency = $cartStore?.room?.totalGrossAmount?.currency || 'EUR';

    function formatPrice(amount, curr = 'EUR') {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: curr
        }).format(amount);
    }
</script>

<div class="bg-background-light dark:bg-background-dark rounded-lg shadow-md p-4">
    <div class="space-y-2">
        <!-- Room and Included Services (already adjusted) -->
        <div class="flex justify-between items-center">
            <span>{t.roomAndIncludedServices}</span>
            <span>{formatPrice(adjustedBaseGross, currency)}</span>
        </div>

        <!-- Show price adjustment percentage for information -->
        {#if preisanpassungProzent}
            <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                ({t.includesAdjustment.replace('{percent}', preisanpassungProzent)})
            </div>
        {/if}

        <!-- Selected Services List -->
        <SelectedServicesList {language} />

        <!-- Total -->
        <div class="border-t border-inputBorder-light dark:border-inputBorder-dark pt-3 mt-3">
            <div class="flex justify-between items-center font-semibold text-h6">
                <span>{t.totalGross}</span>
                <span class="text-price-light dark:text-price-dark">
                    {formatPrice(totalGross, currency)}
                </span>
            </div>
            <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark mt-1">
                {t.includingTax.replace('{tax}', formatPrice(totalTax, currency))}
            </div>
            
            <!-- Deposit Amount if available -->
            {#if anzahlungProzent > 0}
                <div class="flex justify-between items-center mt-4 pt-3 border-t border-inputBorder-light dark:border-inputBorder-dark font-medium text-sm text-price-light dark:text-price-dark">
                    <span>{t.depositAmount} ({anzahlungProzent}%)</span>
                    <span>{formatPrice(depositGross, currency)}</span>
                </div>
            {/if}
        </div>
    </div>
</div>
