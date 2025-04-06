function Header({ onToggleLeftSidebar, onToggleRightSidebar }) {
	const token = localStorage.getItem("token");
	const userName = localStorage.getItem("userName");

	return (
		<header className="fixed top-0 left-0 right-0 h-16 flex md:gap-4 *:items-center justify-between md:justify-normal bg-white md:bg-inherit">
			<div className="flex items-center space-x-4 md:w-64 md:pl-6 md:rounded-br-2xl bg-white">
				{/* Button for left menu (visible only on mobile) */}
				<button
					className="md:hidden p-2 rounded-full hover:bg-gray-200"
					onClick={onToggleLeftSidebar}
					aria-label="Toggle left sidebar"
				>
					<span>☰</span>
				</button>
				{token ? (
					<a className="text-lg font-bold" href="/dashboard">
						<p>{userName}</p>
					</a>
				) : (
					<a className="text-lg font-bold" href="/BusinessRegPage">
						Регистрация
					</a>
				)}
			</div>
			<div className="flex items-center space-x-4 md:rounded-bl-2xl md:w-[calc(100vw-16rem)] bg-white">
				<button
					className="p-2 rounded-full hover:bg-gray-200"
					aria-label="Settings"
				>
					<span>⚙️</span>
				</button>
				<button
					className="p-2 rounded-full hover:bg-gray-200"
					aria-label="Notifications"
				>
					<span>🔔</span>
				</button>
			</div>
		</header>
	);
}

export default Header;