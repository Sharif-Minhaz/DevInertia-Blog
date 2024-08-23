export default function SubscriptionBox() {
	return (
		<form class="flex relative">
			<input
				class="w-full pl-[30px] pr-[120px] py-[11px] rounded text-[17px] outline-none border border-[#e2e8f0] shadow-sm focus:border-[rgba(106,78,233,0.4)] focus:shadow-[0px_0px_10px_-3px_rgba(106,78,233,0.4)] dark:bg-[#010409] dark:border-[#1a1a1a]"
				type="email"
				name="email"
				id="email"
				placeholder="Enter your email address"
				required
			/>

			<button
				class="right-1.5 top-1.5 absolute bg-[#6A4EE9] hover:bg-[#282424] transition-colors rounded text-[18px] h-[calc(100%-12px)] px-[16px] text-white"
				type="submit"
			>
				Subscribe
			</button>
		</form>
	);
}
