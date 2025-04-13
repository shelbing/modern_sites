<script>
	export let startMessage;
	// Import components directly to ensure they're bundled properly
	import InterfaceMessage from "./interfaceMessage.svelte";
	import BotComponent from "./botComponent.svelte";
	import { useChat } from "ai/svelte";

	// Initialize chat with default message if startMessage is available
	const { input, handleSubmit, stop, messages } = useChat({
		initialMessages: [
			{
				id: "1",
				role: "assistant",
				content: startMessage || "Wie kann ich Ihnen helfen?",
			},
		],
	});
</script>

<div class="w-full">
	<BotComponent {input} {stop} {handleSubmit}>
		{#each $messages as message}
			<InterfaceMessage
				messageType={message.role}
				invocation={message.toolInvocations}
				message={message.content}
				messageTime="10:32"
			/>
		{/each}
	</BotComponent>
</div>
