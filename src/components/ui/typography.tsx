import { Slot } from "@radix-ui/react-slot";
import type { HTMLAttributes, ReactNode } from "react";

type TypographyType = "h1" | "h2" | "h3" | "h4" | "p" | "blockquote";
type AsProp = TypographyType | "child";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
	type: TypographyType;
	children: ReactNode;
	className?: string;
	as?: AsProp;
}

const baseStyles: Record<TypographyType, string> = {
	h1: "scroll-m-20 text-balance text-center font-extrabold text-4xl tracking-tight",
	h2: "scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0",
	h3: "scroll-m-20 font-semibold text-2xl tracking-tight",
	h4: "scroll-m-20 font-semibold text-xl tracking-tight",
	p: "not-first:mt-6 leading-7",
	blockquote: "mt-6 border-l-2 pl-6 italic",
};

export function Typography({
	type,
	as,
	children,
	className = "",
	...props
}: TypographyProps) {
	const Component = as === "child" ? Slot : as ? as : type;

	// We need to widen `props` for <Slot> in case as="child"
	return (
		<Component
			className={`${baseStyles[type]}${className ? ` ${className}` : ""}`}
			{...props}
		>
			{children}
		</Component>
	);
}
