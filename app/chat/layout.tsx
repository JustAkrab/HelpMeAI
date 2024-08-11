import Sidebar from '@/components/sidebar';
import { createClient } from '@/utils/supabase/server';

export default async function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	const fetchAllChats = async () => {
		if (!user) return;
		const { data, error } = await supabase.from('chats').select('*').eq('user_id', user.id);
		if (error) {
			console.log(error);
		}
		return data;
	};

	const allChats = await fetchAllChats();
	return (
		<>
			<Sidebar allChats={allChats} user={user} />
			{children}
		</>
	);
}
