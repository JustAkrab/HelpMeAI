'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useMousePosition from '@/lib/useMousePosition';

export default function Home() {
	const { x, y } = useMousePosition();
	return (
		<div className="h-screen w-full gradient-bg relative flex flex-col px-5 sm:px-10 items-center justify-center antialiased overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					animate={{
						backgroundColor: 'var(--gr)',
					}}
					style={{
						translate: `${x - 96}px ${y - 96}px`,
					}}
					className="rounded-full blur-2xl size-48 opacity-70 transition-colors blur-circle"
				/>
			</div>
			<motion.div
				initial={{ opacity: 0.5, y: 100 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: 'easeInOut',
				}}
				className="text-center relative z-30"
			>
				<h1 className="mt-8 bg-gradient-to-br from-slate-200 to-slate-400 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
					TubeAssist: Quick Answers for <br /> everything YouTube
				</h1>
				<p className="text-neutral-200 max-w-xl mx-auto my-6 text-sm text-center relative z-10">
					TubeAssist is a platform that helps you get quick answers to your questions about YouTube. Whether you're a creator or a viewer,
					we've got you covered with our AI-powered chatbot.
				</p>
				<div className="flex justify-center gap-4 mt-10">
					<Button className="px-6 py-2 text-white bg-slate-800 hover:bg-[#D6355C] rounded-md">
						<Link href="/login">Login</Link>
					</Button>
					<Button className="px-6 py-2 text-white bg-[#D6355C] hover:bg-slate-800 rounded-md">
						<Link href="/chat">Chat</Link>
					</Button>
				</div>
			</motion.div>
		</div>
	);
}
