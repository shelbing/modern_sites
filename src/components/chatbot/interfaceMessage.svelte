<script>
	import UserMessage from "./userMessage.svelte";
	import BotMessage from "./botMessage.svelte";
	export let messageType;
	export let message;
	export let invocation;
	export let messageTime;
	import { fade } from "svelte/transition";
	console.log(invocation);
	if (invocation == undefined) {
		message = "Loading ...";
	}
</script>

<div
	data-id={Date.now()}
	class="w-3/4"
	in:fade={{ duration: 400 }}
	out:fade={{ duration: 400 }}
>
	{#if messageType === "user"}
		<UserMessage {messageTime} {message} />
	{:else}
		<BotMessage {messageTime} {message} />
	{/if}
</div>
