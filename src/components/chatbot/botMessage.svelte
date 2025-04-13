<script>
    import { marked } from "marked";
    import { onMount } from "svelte";
    import { chatbotColors } from "./chatbotColors.js";

    export let message;
    export let messageTime;

    // Use client-side color utility instead of server-side configuration
    const botMessageBgClass = chatbotColors.botMessage.bg;
    const botMessageTextClass = chatbotColors.botMessage.text;
    const botMessageTimeClass = chatbotColors.botMessage.time;

    const renderer = new marked.Renderer();
    const originalParagraphRenderer = renderer.paragraph.bind(renderer);
    renderer.paragraph = (text) => originalParagraphRenderer(text) + "<br/>";

    marked.setOptions({ renderer });

    onMount(() => {
        htmlMessage = marked(message);
    });

    $: htmlMessage = marked(message);
</script>

<div class="flex items-start space-x-4">
    <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <span
            class="flex h-full w-full items-center justify-center rounded-full bg-muted"
        ></span>
    </span>
    <div
        class="flex-1 w-full rounded-lg {botMessageBgClass} p-4 {botMessageTextClass} text-left shadow-sm border border-primarybutton-light border-opacity-10 dark:border-primarybutton-dark dark:border-opacity-10"
    >
        <div class="text-left prose-sm prose-p:my-1">{@html htmlMessage}</div>
        <p class="text-xs {botMessageTimeClass} text-left mt-2">{messageTime}</p>
    </div>
</div>
