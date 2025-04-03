function RightSidebar() {
	const notifications = [
		{ time: '16:30', name: 'Барбера Руслана' },
		{ time: '17:30', name: 'Барбера Анатолия' },
		{ time: '18:30', name: 'Барбера Николь' },
	];

	const contacts = [
		{ name: 'Петров Никита' },
		{ name: 'Павлов Бугаря' },
	];

	return (
		<aside className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white shadow p-4">
			<h3 className="text-lg font-semibold mb-4">Уведомления</h3>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-500">Средняя стоимость рекламы</span>
					<button className="text-blue-500">👁️</button>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-500">Заявка для поддержки Алексея</span>
					<button className="text-blue-500">📝</button>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-500">Добавлена бронь на 16:40</span>
					<button className="text-blue-500">➕</button>
				</div>
			</div>

			<h3 className="text-lg font-semibold mt-6 mb-4">Основной трафик</h3>
			<div className="space-y-2">
				{notifications.map((notification, index) => (
					<div key={index} className="flex items-center justify-between">
						<span className="text-sm">{notification.time} запись у {notification.name}</span>
						<button className="text-blue-500">❌</button>
					</div>
				))}
			</div>

			<h3 className="text-lg font-semibold mt-6 mb-4">Контакты</h3>
			<div className="space-y-2">
				{contacts.map((contact, index) => (
					<div key={index} className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
						<span>{contact.name}</span>
					</div>
				))}
			</div>
		</aside>
	);
}

export default RightSidebar;