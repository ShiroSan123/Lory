function LeftSidebar() {
	const menuItems = [
		{ icon: '🏠', label: 'Главная' },
		{ icon: '📊', label: 'Канальная аналитика' },
		{ icon: '📅', label: 'Календарь броней' },
		{ icon: '🌍', label: 'Страны' },
		{ icon: '📈', label: 'Финансы' },
		{ icon: '⚙️', label: 'Настройки' },
	];

	return (
		<aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow p-4">
			<div className="flex items-center mb-6">
				<img src="/logo.png" alt="Logo" className="h-8" />
				<span className="ml-2 text-lg font-bold">LoryCRM</span>
			</div>
			<nav>
				{menuItems.map((item, index) => (
					<div
						key={index}
						className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					>
						<span className="text-xl mr-3">{item.icon}</span>
						<span>{item.label}</span>
					</div>
				))}
			</nav>
		</aside>
	);
}

export default LeftSidebar;