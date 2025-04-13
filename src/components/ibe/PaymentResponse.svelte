<script>
    // Component to display payment response data
    export let paymentResponseData = null;
    export let language;

    import { formTranslations } from "../../lib/translations";

    $: t = formTranslations[language] || formTranslations.en;

    // Format currency value
    function formatCurrency(value, currency = "EUR") {
        if (!value && value !== 0) return "";

        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: currency,
        }).format(value);
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return "";

        return new Date(dateString).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

{#if paymentResponseData}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">
            {!paymentResponseData.Status
                ? t.webhookFailed || "Webhook Failed"
                : paymentResponseData.Status === "Failure"
                  ? t.paymentFailure || "Payment Failed"
                  : t.paymentInformation || "Payment Intent Created"}
        </h2>

        {#if !paymentResponseData.Status}
            <div
                class="p-4 mb-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
            >
                <p class="font-medium">{t.webhookFailedError || "Error"}:</p>
                <p>
                    {t.webhookFailedMessage ||
                        "The webhook request failed. No status information was returned."}
                </p>
            </div>
        {:else if paymentResponseData.Status === "Failure" && paymentResponseData.Error_Reason}
            <div
                class="p-4 mb-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
            >
                <p class="font-medium">{t.errorReason || "Error Reason"}:</p>
                <p>{paymentResponseData.Error_Reason}</p>
            </div>
        {/if}

        <!-- Payment Details Section -->
        <div class="space-y-4">
            <!-- Payment Details Table -->
            <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
                <table
                    class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                >
                    <tbody
                        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                        <tr>
                            <td
                                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                >{t.status || "Status"}:</td
                            >
                            <td
                                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                >{paymentResponseData.Status || "--"}</td
                            >
                        </tr>
                        <tr>
                            <td
                                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                >{t.paymentIntent || "Payment Intent"}:</td
                            >
                            <td
                                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                >{paymentResponseData.Payment_Intent ||
                                    "--"}</td
                            >
                        </tr>
                        <tr>
                            <td
                                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                >{t.paymentId || "Payment ID"}:</td
                            >
                            <td
                                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                >{paymentResponseData.Payment_ID || "--"}</td
                            >
                        </tr>
                        <tr>
                            <td
                                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                >{t.bookingId || "Booking ID"}:</td
                            >
                            <td
                                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                >{paymentResponseData.Booking_ID || "--"}</td
                            >
                        </tr>
                        {#if paymentResponseData.Amount}
                            <tr>
                                <td
                                    class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                    >{t.amount || "Amount"}:</td
                                >
                                <td
                                    class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                >
                                    {formatCurrency(
                                        paymentResponseData.Amount,
                                        paymentResponseData.Currency,
                                    ) || "--"}
                                </td>
                            </tr>
                        {/if}
                        {#if paymentResponseData.Error_Reason && paymentResponseData.Status === "Failure"}
                            <tr>
                                <td
                                    class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                    >{t.errorReason || "Error Reason"}:</td
                                >
                                <td
                                    class="px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium"
                                    >{paymentResponseData.Error_Reason}</td
                                >
                            </tr>
                        {/if}
                        {#if paymentResponseData.PaymentDate}
                            <tr>
                                <td
                                    class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                    >{t.paymentDate || "Payment Date"}:</td
                                >
                                <td
                                    class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                    >{formatDate(
                                        paymentResponseData.PaymentDate,
                                    ) || "--"}</td
                                >
                            </tr>
                        {/if}
                        {#if paymentResponseData.PaymentMethod}
                            <tr>
                                <td
                                    class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                                    >{t.paymentMethod || "Payment Method"}:</td
                                >
                                <td
                                    class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium"
                                    >{paymentResponseData.PaymentMethod ||
                                        "--"}</td
                                >
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>

            <!-- Additional Information -->
            {#if paymentResponseData.AdditionalInfo}
                <div class="mt-4">
                    <h3
                        class="text-md font-medium text-gray-900 dark:text-gray-100 mb-2"
                    >
                        {t.additionalInfo || "Additional Information"}
                    </h3>
                    <div
                        class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                    >
                        {paymentResponseData.AdditionalInfo}
                    </div>
                </div>
            {/if}

            <!-- Payment Instructions -->
            {#if !paymentResponseData.Status}
                <div
                    class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                    <h3
                        class="text-md font-medium text-red-800 dark:text-red-300 mb-2"
                    >
                        {t.webhookFailedInstructions || "Webhook Failed"}
                    </h3>
                    <p class="text-sm text-red-700 dark:text-red-400">
                        {t.webhookFailedInstructionsText ||
                            "There was a problem with the webhook request. Please try again or contact support."}
                    </p>
                </div>
            {:else if paymentResponseData.Status !== "Failure"}
                <div
                    class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                    <h3
                        class="text-md font-medium text-blue-800 dark:text-blue-300 mb-2"
                    >
                        {t.paymentInstructions || "Payment Instructions"}
                    </h3>
                    <p class="text-sm text-blue-700 dark:text-blue-400">
                        {t.paymentInstructionsText ||
                            "Payment intent created. We will now collect cc data."}
                    </p>
                </div>
            {:else}
                <div
                    class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                    <h3
                        class="text-md font-medium text-red-800 dark:text-red-300 mb-2"
                    >
                        {t.paymentFailureInstructions || "Payment Failed"}
                    </h3>
                    <p class="text-sm text-red-700 dark:text-red-400">
                        {t.paymentFailureInstructionsText ||
                            "There was a problem with your payment. Please try again or contact support."}
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}
