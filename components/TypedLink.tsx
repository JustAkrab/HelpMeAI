import Link, { LinkProps } from 'next/link';
import React from 'react';
import { TubeAssistRoute } from '@/lib/routes';

type TypedLinkProps = Omit<LinkProps, 'href'> & {
	href: TubeAssistRoute;
	children: React.ReactNode;
};

export const TypedLink = ({ href, children, ...props }: TypedLinkProps) => {
	return (
		<Link href={href} {...props}>
			{children}
		</Link>
	);
};
