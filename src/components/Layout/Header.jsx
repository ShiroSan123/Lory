function Header({ onToggleLeftSidebar, selectedMenu }) {
	const token = localStorage.getItem('token');
	const userName = localStorage.getItem('userName');

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userName');
		// Можно добавить редирект, например: window.location.href = '/login';
	};

	return (
		<header className="fixed bottom-0 left-0 right-0 h-16 flex md:gap-4 *:items-center justify-between md:justify-normal bg-white md:bg-inherit">
			<div className="flex items-center space-x-4 md:pl-4 md:rounded-tr-2xl md:w-[calc(100vw-16rem)] bg-white">
				<button
					className="p-2 rounded-full hover:bg-gray-200"
					aria-label="Settings"
				>
					<span>{selectedMenu}</span>
				</button>
				<button
					className="p-2 rounded-full hover:bg-gray-200"
					aria-label="Notifications"
				>
					<span>🔔</span>
				</button>
			</div>
			<div className="flex items-center space-x-4 md:w-64 md:pl-6 md:rounded-tl-2xl bg-white">
				<button
					className="md:hidden p-2 rounded-full hover:bg-gray-200"
					onClick={onToggleLeftSidebar}
					aria-label="Toggle left sidebar"
				>
					<span>☰</span>
				</button>
				{token ? (
					<div className="flex items-center gap-4">
						<a className="text-lg font-bold" href="/dashboard">
							<p>{userName}</p>
						</a>
						<button onClick={handleLogout} className="text-sm text-gray-600">
							Выйти
						</button>
					</div>
				) : (
					<a className="text-lg font-bold" href="/BusinessRegPage">
						Регистрация
					</a>
				)}
			</div>
		</header>
	);
}

export default Header;