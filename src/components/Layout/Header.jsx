function Header({ onToggleLeftSidebar, onToggleRightSidebar }) {
	return (
		<header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-20 flex items-center justify-between px-4 sm:px-6">
			<div className="flex items-center space-x-4">
				{/* Кнопка для левого меню (видна только на мобильных) */}
				<button
					className="md:hidden p-2 rounded-full hover:bg-gray-200"
					onClick={onToggleLeftSidebar}
				>
					<span>☰</span>
				</button>
				<span className="text-lg font-bold">Grigo_Ayaal</span>
			</div>
			<div className="flex items-center space-x-4">
				<button className="p-2 rounded-full hover:bg-gray-200">
					<span>⚙️</span>
				</button>
				<button className="p-2 rounded-full hover:bg-gray-200">
					<span>🔔</span>
				</button>
				{/* Кнопка для правого меню (видна только на мобильных) */}
				<button
					className="md:hidden p-2 rounded-full hover:bg-gray-200"
					onClick={onToggleRightSidebar}
				>
					<span>🔔</span>
				</button>
			</div>
		</header>
	);
}

export default Header;