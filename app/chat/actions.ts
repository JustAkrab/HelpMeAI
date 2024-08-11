'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/utils/supabase/server';
export async function continueConversation(messages: CoreMessage[]) {
	const result = await streamText({
		model: google('models/gemini-1.5-flash-latest'),
		messages:
			messages.length === 2
				? [
						{
							role: 'system',
							content:
								"Your name is TubeAssist (always state your name in bold). You are a helpful AI Assistant that is specialized in helping customers of Youtube. You must be very respectful at all times, understand the user's requests, and provide accurate information and solutions at all times. If the user asks that is not related to Youtube help, please state that the user is going off topic, and that you are made specifically for help with Youtube. YOU MUST NOT PROVIDE ANY INFORMATION THAT IS NOT RELATED TO YOUTUBE, INSTEAD SAY THAT YOU ARE NOT PROGRAMMED TO HELP WITH THAT TOPIC.",
						},
						...messages,
				  ]
				: messages,
	});

	const stream = createStreamableValue(result.textStream);
	return stream.value;
}

// a function that is called every time the user sends a message, receives a message from the AI chatbot and checks if the conversation has enough context to be renamed from "New Chat" to whatever they're talking about
export async function renameChat(messages: CoreMessage[], id: string) {
	const supabase = createClient();

	const { data, error } = await supabase.from('chats').select('*').eq('id', parseInt(id));
	if (error) {
		console.error(error);
		return;
	}

	if (data[0].name !== 'New Chat') return;

	console.log('Renaming chat...');
	const result = await generateText({
		model: google('models/gemini-1.5-flash-latest'),
		system: 'You are an expert AI chat renamer, you come up with short yet descriptive names for the chat based on the conversation. Looking at the following conversation, what would you name this chat? (only provide the chat name and nothing else)',
		prompt: JSON.stringify(messages),
	});
	console.log(result.text);

	// update the chat name
	const { data: iData, error: iError } = await supabase.from('chats').update({ name: result.text }).eq('id', parseInt(id));
	if (iError) {
		console.error(iError);
	}
}
