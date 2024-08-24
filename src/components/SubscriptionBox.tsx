import { useState, type FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function SubscriptionBox() {
	const [email, setEmail] = useState("");

	const handleSubscription = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch("https://dev-inertia-newsletter.vercel.app/subscribe", {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result = await res.json();

			if (result.success) {
				setEmail("");
				return toast(
					"Subscription successful! We've sent you a greeting email. If you don't see it, please check your spam box."
				);
			}

			if (!result.success && result.error === 11000) {
				return toast.error("This email is already subscribed. Please use a different one.");
			}

			toast.error(result.message);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message);
		}
	};

	return (
		<form className="flex relative" onSubmit={handleSubscription}>
			<input
				className="w-full pl-[30px] pr-[120px] py-[11px] rounded text-[17px] outline-none border border-[#e2e8f0] shadow-sm focus:border-[rgba(106,78,233,0.4)] focus:shadow-[0px_0px_10px_-3px_rgba(106,78,233,0.4)] dark:bg-[#010409] dark:border-[#1a1a1a]"
				type="email"
				name="email"
				value={email}
				id="email"
				placeholder="Enter your email address"
				required
				onChange={(e) => setEmail(e.target.value)}
			/>

			<button
				className="right-1.5 top-1.5 absolute bg-[#6A4EE9] hover:bg-[#282424] transition-colors rounded text-[18px] h-[calc(100%-12px)] px-[16px] text-white"
				type="submit"
			>
				Subscribe
			</button>
			<ToastContainer icon={false} position="bottom-left" autoClose={12000} theme="dark" />
		</form>
	);
}
