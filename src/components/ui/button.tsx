import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"focus:none inline-flex cursor-pointer items-center whitespace-nowrap rounded-lg font-medium text-sm ring-offset-background transition-all transition-colors duration-200 focus:outline-hidden focus:ring-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>div]:inline-flex [&>div]:items-center [&>div]:justify-center [&>div]:whitespace-nowrap [&>div]:transition-all",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/80",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-transparent hover:bg-black/10 hover:text-foreground dark:hover:bg-black/20",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-primary hover:text-primary-foreground",
				link: "px-0! text-primary underline-offset-4 hover:underline",
				"inline-link": "inline-block underline underline-offset-4",
				outlineDestructive:
					"border border-destructive-border bg-transparent text-secondary-foreground/80 hover:bg-secondary/20",
				success: "bg-success text-success-foreground hover:bg-success/80",
			},
			size: {
				default: "h-8 px-4 py-2 has-[svg]:pl-3",
				sm: "h-7 rounded-lg px-3",
				xs: "h-auto px-2 py-1 font-light text-sm",
				lg: "h-7 rounded-lg px-4 text-sm sm:h-10 sm:px-8 sm:text-base",
				icon: "grid aspect-1 h-8 w-8 items-center [&>div]:grid [&>div]:size-full [&>div]:items-center",
				"icon-sm": "h-6 w-6",
				"icon-xs": "h-5 w-5",
			},
			iconAnimation: {
				true: "transition-all has-[svg]:gap-2 has-[svg]:hover:gap-4 [&>div]:transition-all has-[svg]:[&>div]:gap-2 hover:has-[svg]:[&>div]:gap-4",
				false: "has-[svg]:gap-2 has-[svg]:[&>div]:gap-2",
			},
			fullWidth: {
				true: "w-full [&>div]:w-full",
				false: "",
			},
			contentAlignment: {
				left: "justify-start",
				center: "justify-center",
				right: "justify-end",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			iconAnimation: true,
			contentAlignment: "center",
		},
		compoundVariants: [
			{
				size: "xs",
				iconAnimation: true,
				className:
					"has-[svg]:gap-0.5 has-[svg]:hover:gap-1.5 has-[svg]:[&>div]:gap-0.5 hover:has-[svg]:[&>div]:gap-1.5",
			},
			{
				size: "xs",
				variant: "default",
				className: "font-normal",
			},
			{
				size: "xs",
				variant: "inline-link",
				className: "text-[0.75rem]",
			},
			{
				size: "sm",
				variant: "inline-link",
				className: "text-xs",
			},
		],
	},
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants> & {
		children: React.ReactNode;
		asChild?: boolean;
		as?: "div" | "button";
		status?: "idle" | "pending" | "success" | "error";
		renderPending?: () => React.ReactNode;
		renderSuccess?: () => React.ReactNode;
		renderError?: () => React.ReactNode;
	};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			iconAnimation = true,
			fullWidth = false,
			contentAlignment = "center",
			children,
			status,
			renderPending,
			renderSuccess,
			renderError,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : (props?.as ?? "button");

		const buttonClassName = cn(
			buttonVariants({
				variant,
				size,
				iconAnimation,
				fullWidth,
				contentAlignment,
				className,
			}),
		);

		if (!status)
			return (
				<Comp
					className={buttonClassName}
					// @ts-expect-error - not useful error -> both divs and buttons have refs
					ref={ref}
					{...props}
				>
					{children}
				</Comp>
			);
		return (
			<Comp
				className={buttonClassName}
				// @ts-expect-error - not useful error -> both divs and buttons have refs
				ref={ref}
				{...props}
			>
				<AnimatePresence mode="wait">
					{(status === "idle" || status === "error") && (
						<motion.div
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							key="content"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						>
							{children}
						</motion.div>
					)}
					{status === "pending" && (
						<motion.div
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							key="pending"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						>
							{renderPending?.() ?? (
								<Loader2Icon className="h-4 w-4 animate-spin" />
							)}
						</motion.div>
					)}
					{status === "success" && (
						<motion.div
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							key="success"
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						>
							{renderSuccess ? renderSuccess() : children}
						</motion.div>
					)}
				</AnimatePresence>
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
