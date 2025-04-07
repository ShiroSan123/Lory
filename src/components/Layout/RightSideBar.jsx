import { useState, useEffect } from 'react';
import axios from 'axios';

function RightSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [companies, setCompanies] = useState([]); // Состояние для списка компаний
	const [expandedCompany, setExpandedCompany] = useState(null); // Для управления выпадающими списками
	const [error, setError] = useState(''); // Для обработки ошибок

	const token = localStorage.getItem('token'); // Получаем токен из localStorage
	const idFromStorage = localStorage.getItem('id'); // Получаем id из localStorage
	const id = idFromStorage ? parseInt(idFromStorage, 10) : null; // Преобразуем id в int

	// Функция для переключения видимости уведомлений
	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	// Функция для переключения выпадающего списка компании
	const toggleCompany = (companyId) => {
		setExpandedCompany(expandedCompany === companyId ? null : companyId);
	};

	// Получение списка компаний при монтировании компонента
	useEffect(() => {
		const fetchCompanies = async () => {
			// Проверяем наличие токена
			if (!token) {
				setError('Authorization token is missing. Please log in.');
				return;
			}

			// Проверяем, что id является валидным числом
			if (!id || isNaN(id)) {
				setError('Invalid or missing company ID. Please try again.');
				return;
			}

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/companies/me`,
					{
						headers: {
							'Authorization': `${token}`,
						},
					}
				);
				setCompanies(response.data); // Сохраняем список компаний
			} catch (err) {
				setError(
					err.response?.data?.message || 'Failed to fetch companies. Please try again.'
				);
				console.error('Error fetching companies:', err.response?.data);
			}
		};

		fetchCompanies();
	}, [token, id]); // Добавляем id в зависимости useEffect

	return (
		<aside
			className={`fixed top-0 right-0 w-full md:w-64 h-[calc(100vh-5rem)] bg-white rounded-bl-2xl p-4 z-20 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:top-0`}
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
					onClick={toggleNotifications}
				>
					<span>DragonsD</span>
					<span className="ml-auto">{isNotificationsOpen ? '▼' : '▶'}</span>
				</div>
				<a href="/BusinessRegPage">Зарегистрировать бизнес</a>
			</nav>

			{/* Уведомления */}
			{isNotificationsOpen && (
				<div className="mt-4">
					{menuItems.map((item, index) => (
						<div
							key={index}
							className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
							onClick={() => onSelectMenu(item.label)}
						>
							<img src={item.icon} alt={item.label} className="w-5 h-5" />
							<span>{item.label}</span>
						</div>
					))}
				</div>
			)}

			{/* Список компаний */}
			<div className="mt-6">
				<h3 className="text-lg font-semibold mb-4">Мои компании</h3>
				{error && <p className="text-red-600 mb-4">{error}</p>}
				{companies.length === 0 && !error ? (
					<p className="text-gray-600">Компании не найдены.</p>
				) : (
					companies.map((company) => (
						<div key={company.id} className="mb-4">
							{/* Заголовок компании с кнопкой раскрытия */}
							<div
								className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
								onClick={() => toggleCompany(company.id)}
							>
								<span className="font-medium">{company.name}</span>
								<span className="ml-auto">
									{expandedCompany === company.id ? '▼' : '▶'}
								</span>
							</div>
							{/* Выпадающий список с информацией о компании */}
							{expandedCompany === company.id && (
								<div className="pl-4 pt-2 pb-2 bg-gray-50 rounded-lg mt-1">
									<p className="text-sm text-gray-700">
										<strong>Сфера:</strong> {company.businessType || 'Не указано'}
									</p>
									<p className="text-sm text-gray-700 mt-1">
										<strong>Описание:</strong> {company.description || 'Не указано'}
									</p>
									<p className="text-sm text-gray-700 mt-1">
										<strong>Город:</strong> {company.city || 'Не указано'}
									</p>
									<p className="text-sm text-gray-700 mt-1">
										<strong>Улица:</strong> {company.street || 'Не указано'}
									</p>
									<p className="text-sm text-gray-700 mt-1">
										<strong>Режим работы:</strong> {company.workTime || 'Не указано'}
									</p>
									<p className="text-sm text-gray-700 mt-1">
										<strong>Выходные:</strong> {company.holidays || 'Не указано'}
									</p>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</aside>
	);
}

export default RightSidebar;