import Chat from '@/components/chat';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

const ChatPage = async () => {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (!user || error) {
		redirect('/login');
	}
	return (
		<div className="fc w-full max-w-md py-24 mx-auto">
			<Chat user_id={user.id} />
		</div>
	);
};

export default ChatPage;
