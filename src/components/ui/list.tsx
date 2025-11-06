import type * as React from "react";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
	children: React.ReactNode;
	className?: string;
}

/**
 * A flexible, styled unordered list component.
 */
export function List({ children, className = "", ...props }: ListProps) {
	return (
		<ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`} {...props}>
			{children}
		</ul>
	);
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	children: React.ReactNode;
	className?: string;
}

/**
 * A list item component to be used inside List.
 */
export function ListItem({
	children,
	className = "",
	...props
}: ListItemProps) {
	return (
		<li className={className} {...props}>
			{children}
		</li>
	);
}
