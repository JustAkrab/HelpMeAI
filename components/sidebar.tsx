'use client';
import React, { useState } from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { logout } from '@/app/login/actions';
import Link from 'next/link';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { IoAdd, IoMenu, IoTrash } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { TextGenerateEffect } from './ui/text-generate-effect';

const Sidebar = ({ user, allChats }: { user: any; allChats: any }) => {
	const [chats, setChats] = useState(allChats || []);

	const supabase = createClient();
	const pathname = usePathname();
	const router = useRouter();
	useEffect(() => {
		const channel = supabase
			.channel('realtime chats')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'chats',
				},
				(payload) => {
					if (payload.eventType === 'DELETE') {
						// filter so that its only the user's chats
						setChats((prev) => prev.filter((chat) => chat.id !== payload.old.id && chat.user_id === user.id));
						return;
					}
					if (payload.eventType === 'UPDATE') {
						setChats((prev) => {
							const newChats = [...prev];
							const index = newChats.findIndex((chat) => chat.id === payload.old.id);
							newChats[index] = payload.new;
							return newChats;
						});
						return;
					}
					if (payload.new.user_id !== user.id) return;
					setChats((prev) => [...prev, payload.new]);
				}
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase]);

	const [visible, setVisible] = useState(false);
	const parseDate = (dateString: string) => new Date(dateString);

	return (
		<>
			<div className="fixed top-0 py-4 px-5 gap-3 fr justify-start sm:hidden w-full bg-white/60 backdrop-blur-2xl">
				<button className="text-2xl" onClick={() => setVisible(!visible)}>
					<IoMenu />
				</button>
				<h1 className="text-xl font-bold">TubeAssist</h1>
			</div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: visible ? 1 : 0 }}
				transition={{ ease: 'linear', duration: 0.3 }}
				className={cn('fixed w-screen h-screen bg-black/60 z-20 inset-0', { 'pointer-events-none': !visible })}
				onClick={() => setVisible(false)}
			/>

			<motion.aside
				animate={{ x: visible ? 0 : '-100%' }}
				transition={{ duration: 0.3 }}
				id="sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:!translate-x-0 text-white"
				aria-label="Sidebar"
			>
				<div className="h-full px-3 py-4 fc items-start overflow-y-auto bg-gray-900 relative">
					<h2 className="flex items-center p-2 font-bold mb-4 font rounded-lg group">TubeAssist</h2>
					<div className="h-full fc items-start justify-start w-full gap-2">
						<Link href="/chat" className="w-full px-3 text-sm py-2 fr justify-start rounded-xl transition-colors hover:bg-gray-600">
							<IoAdd className="mr-2 text-xl" /> New Chat
						</Link>
						<AnimatePresence>
							{chats
								.sort((a, b) => parseDate(b.created_at).getTime() - parseDate(a.created_at).getTime())
								.map((chat) => {
									console.log(chat.id);
									return (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											key={chat.id}
											className={cn(
												'w-full px-3 text-sm py-2 fr justify-between rounded-xl transition-colors hover:bg-gray-600',
												{
													'bg-gray-700': pathname.includes(chat.id),
												}
											)}
										>
											<Link className="w-full" href={`/chat/${chat.id}`}>
												{chat.name !== 'New Chat' ? <TextGenerateEffect words={chat.name} /> : 'New Chat'}
											</Link>
											<Popover>
												<PopoverTrigger asChild>
													<button>
														<BsThreeDotsVertical />
													</button>
												</PopoverTrigger>
												<PopoverContent className="w-48">
													<div>
														<button
															onClick={async (e) => {
																e.stopPropagation();
																const { data, error } = await supabase.from('chats').delete().eq('id', chat.id);
																if (error) {
																	console.error(error);
																	return;
																}

																console.log(data);

																router.push('/chat');
															}}
															className="w-full bg-white rounded-md fr px-2 py-1 gap-2 transition-colors hover:bg-gray-100"
														>
															<IoTrash className="text-red-500" />
															<span className="w-full text-left">Delete</span>
														</button>
													</div>
												</PopoverContent>
											</Popover>
										</motion.div>
									);
								})}
						</AnimatePresence>
					</div>
					<form className="flex items-center p-2 rounded-lg group" action={logout}>
						<FaArrowRightFromBracket />
						<button className="ms-3 whitespace-nowrap" type="submit">
							Logout
						</button>
					</form>
				</div>
			</motion.aside>
		</>
	);
};

export default Sidebar;
