import { useState, useEffect } from 'react';
import axiosInstance from '../../scripts/axiosInstance'; // Импортируем настроенный экземпляр Axios
import { useNavigate } from 'react-router-dom';

function RightSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [companyName, setCompanyName] = useState('');
	const [expandedCompany, setExpandedCompany] = useState(null);
	const [expandedMenu, setExpandedMenu] = useState(null); // Добавляем состояние для раскрытия меню
	const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	// Список сотрудников (можно получить с сервера или определить здесь)
	const employees = [
		{ id: 1, name: 'Владимир Трубиков', phone: '+7 914 218-30-18', visits: 2, canceled: 0, revenue: 1000 },
		{ id: 2, name: 'Григорий Акаев', phone: '+7 924 664-33-35', visits: 33, canceled: 10, revenue: 36478 },
		{ id: 3, name: 'Павел Буздарь', phone: '+7 964 432-85-36', visits: 15, canceled: 5, revenue: 69000 },
		{ id: 4, name: 'Ханалыев Ленат', phone: '+7 962 724-88-34', visits: 4, canceled: 0, revenue: 10000 },
	];

	const toggleMenu = (menuLabel) => {
		setExpandedMenu(expandedMenu === menuLabel ? null : menuLabel);
	};

	const toggleCompanies = () => {
		setIsCompaniesOpen(!isCompaniesOpen); // Переключение видимости списка компаний
	};

	const handleEmployeeSelect = (employee) => {
		onSelectMenu('Сотрудники', employee); // Передаем сотрудника вместе с пунктом меню
	};

	// Функция для переключения видимости уведомлений
	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	// Функция для переключения выпадающего списка компании
	const toggleCompany = (companyId) => {
		setExpandedCompany(expandedCompany === companyId ? null : companyId);
	};

	// Получение списка компаний и сохранение их в localStorage
	useEffect(() => {
		const fetchCompanies = async () => {
			// Проверяем наличие токена
			if (!token) {
				setError('Authorization token is missing. Please log in.');
				navigate('/LoginUser'); // Перенаправляем на страницу логина
				return;
			}

			setIsLoading(true); // Устанавливаем состояние загрузки
			try {
				// 1. Получаем список ID компаний через GET /companies/me
				const response = await axiosInstance.get('/companies/me');

				const companyIds = response.data; // Предполагаем, что это массив ID, например [1, 2, 3]
				console.log('Company IDs:', companyIds);

				if (!companyIds || companyIds.length === 0) {
					// Если компаний нет, сохраняем пустой массив в localStorage
					localStorage.setItem('companies', JSON.stringify([]));
					setIsLoading(false);
					return;
				}

				// 2. Для каждого ID запрашиваем полные данные компании через GET /companies/{id}
				const companyPromises = companyIds.map((id) =>
					axiosInstance.get(`/companies/${id}`)
				);

				// 3. Выполняем все запросы параллельно и собираем данные
				const companyResponses = await Promise.all(companyPromises);
				const companyData = companyResponses.map((res) => res.data);

				// 4. Сохраняем данные в localStorage
				localStorage.setItem('companies', JSON.stringify(companyData));
				console.log('Companies saved to localStorage:', companyData);

				// 5. Извлекаем компанию с индексом 1 и её название
				const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
				if (savedCompanies.length > 1) {
					// Проверяем, есть ли компания с индексом 1
					setCompanyName(savedCompanies[1].name || 'Название не указано');
				} else {
					setCompanyName('Компания с индексом 1 не найдена');
				}
			} catch (err) {
				setError(
					err.response?.data?.message || 'Failed to fetch companies. Please try again.'
				);
				console.error('Error fetching companies:', err.response?.data);
			} finally {
				setIsLoading(false); // Сбрасываем состояние загрузки
			}
		};

		fetchCompanies();
	}, [token, navigate]);

	// Извлекаем компании из localStorage
	const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];

	return (
		<aside className={`fixed top-0 right-0 w-full md:w-64 h-[calc(100vh-136px)] bg-white rounded-bl-2xl p-4 z-20 overflow-y-auto transform transition-transform duration-300
			 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:top-0`}>
			{/* Логотип и кнопка закрытия */}
			<a href="/">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center">
						<img src="/Logo-ico.svg" alt="Logo" className="h-8" />
						<span className="ml-2 text-lg font-bold">LoryCRM</span>
					</div>
					<button className="md:hidden p-2" onClick={onClose}>
						<span>✖</span>
					</button>
				</div>
			</a>

			{/* Меню */}
			<nav>
				{menuItems.map((item) => (
					<div key={item.label}>
						<div
							className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
							onClick={() => {
								toggleMenu(item.label);
								onSelectMenu(item.label);
							}}
						>
							<img src={item.icon} alt={item.label} className="w-5 h-5" />
							<span>{item.label}</span>
							<span className="ml-auto">{expandedMenu === item.label ? '▼' : '▶'}</span>
						</div>
						{/* Выпадающий список сотрудников */}
						{expandedMenu === 'Сотрудники' && item.label === 'Сотрудники' && (
							<div className="pl-4">
								{employees.map((employee) => (
									<div
										key={employee.id}
										className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
										onClick={() => handleEmployeeSelect(employee)}
									>
										{employee.name}
									</div>
								))}
							</div>
						)}
					</div>
				))}
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
				<div
					className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					onClick={toggleCompanies}
				>
					<span className="text-lg font-semibold">Мои компании</span>
					<span className="ml-auto">{isCompaniesOpen ? '▼' : '▶'}</span>
				</div>
				{isCompaniesOpen && (
					<div className="pl-2">
						{isLoading ? (
							<p className="text-gray-600">Загрузка компаний...</p>
						) : error ? (
							<p className="text-red-600 mb-4">{error}</p>
						) : savedCompanies.length === 0 ? (
							<p className="text-gray-600">Компании не найдены.</p>
						) : (
							savedCompanies.map((company) => (
								<div key={company.id} className="mb-4">
									<div
										className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
										onClick={() => toggleCompany(company.id)}
									>
										<span className="font-medium">{company.name}</span>
										<span className="ml-auto">
											{expandedCompany === company.id ? '▼' : '▶'}
										</span>
									</div>
									{expandedCompany === company.id && (
										<div className="pl-4 pt-2 pb-2 bg-gray-50 rounded-lg mt-1">
											<p className="text-sm text-gray-700">
												<strong>ID:</strong> {company.id}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Название:</strong> {company.name || 'Не указано'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
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
											<p className="text-sm text-gray-700 mt-1">
												<strong>Описание от ИИ:</strong> {company.descriptionAI || 'Не указано'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Логотип:</strong>{' '}
												{company.logo ? (
													<a href={company.logo} target="_blank" rel="noopener noreferrer">
														Ссылка
													</a>
												) : (
													'Не указано'
												)}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Календарь:</strong> {company.calendar ? 'Да' : 'Нет'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Аналитика:</strong> {company.analytics ? 'Да' : 'Нет'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Telegram:</strong> {company.telegram ? 'Да' : 'Нет'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Генерация ИИ:</strong> {company.aiText ? 'Да' : 'Нет'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Соцсети:</strong> {company.socials ? 'Да' : 'Нет'}
											</p>
											<p className="text-sm text-gray-700 mt-1">
												<strong>Доставка:</strong> {company.delivery ? 'Да' : 'Нет'}
											</p>
											<div className="text-sm text-gray-700 mt-1">
												<strong>Филиалы:</strong>
												{company.branches && company.branches.length > 0 ? (
													<ul className="list-disc pl-4">
														{company.branches.map((branch, index) => (
															<li key={index}>
																{typeof branch === 'object' && branch !== null
																	? branch.name || JSON.stringify(branch)
																	: branch || 'Не указано'}
															</li>
														))}
													</ul>
												) : (
													' Не указано'
												)}
											</div>
											<div className="text-sm text-gray-700 mt-1">
												<strong>Сотрудники:</strong>
												{company.members && company.members.length > 0 ? (
													<ul className="list-disc pl-4">
														{company.members.map((member, index) => (
															<li key={index}>
																{typeof member === 'object' && member !== null
																	? member.role || JSON.stringify(member)
																	: member || 'Не указано'}
															</li>
														))}
													</ul>
												) : (
													' Не указано'
												)}
											</div>
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}
			</div>
		</aside>
	);
}

export default RightSidebar;