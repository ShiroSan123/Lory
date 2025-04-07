import { useState } from 'react';

function LeftSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

	// Функция для переключения видимости нижней части
	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	return (
		<aside
			className={`fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-white rounded-tr-2xl shadow p-4 z-10 transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 md:block`}
		>
			{/* Логотип и кнопка закрытия */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center">
					<img src="/Logo-ico.svg" alt="Logo" className="h-8" />
					<span className="ml-2 text-lg font-bold">LoryCRM</span>
				</div>
				<button className="md:hidden p-2" onClick={onClose}>
					<span>✖</span>
				</button>
			</div>

			{/* Меню */}
			<nav>
				<div
					className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					onClick={toggleNotifications} // Добавляем обработчик клика
				>
					{/* <img src="/path-to-dragons-icon.svg" alt="DragonsD" className="w-5 h-5" /> */}
					<span>DragonsD</span>
					{/* Стрелка для индикации состояния */}
					<span className="ml-auto">{isNotificationsOpen ? '▼' : '▶'}</span>
				</div>
				<a href="/BusinessRegPage">зарегестировать бизнес</a>
			</nav>

			{/* Условное отображение нижней части */}
			{isNotificationsOpen && (
				menuItems.map((item, index) => (
					<div
						key={index}
						className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
						onClick={() => onSelectMenu(item.label)}
					>
						<img src={item.icon} alt="Lory Logo" className="w-5 h-5" />
						<span>{item.label}</span>
					</div>
				))
			)}
		</aside>
	);
}

export default LeftSidebar;