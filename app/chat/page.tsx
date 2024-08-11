import Chat from '@/components/chat';
import Sidebar from '@/components/Sidebar';
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

	return <Chat user_id={user.id} />;
};

export default ChatPage;
