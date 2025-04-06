function LeftSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	return (
		<aside
			className={`fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-white rounded-tr-2xl shadow p-4 z-10 transform transition-transform duration-300
		 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 md:block`}
		>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center">
					<img src="/logo.png" alt="Logo" className="h-8" />
					<span className="ml-2 text-lg font-bold">LoryCRM</span>
				</div>
				<button className="md:hidden p-2" onClick={onClose}>
					<span>✖</span>
				</button>
			</div>
			<nav>
				{menuItems.map((item, index) => (
					<div
						key={index}
						className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
						onClick={() => onSelectMenu(item.label)} // Обновляем состояние при клике
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