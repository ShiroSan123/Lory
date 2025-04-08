// import { useState, useEffect, useMemo } from 'react';
// import axiosInstance from '../../scripts/axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import arRight from '/ico/arRight.svg';
// import arDown from '/ico/arDown.svg';

// function RightSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
// 	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
// 	const [error, setError] = useState('');
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [companies, setCompanies] = useState([]);
// 	const [expandedCompany, setExpandedCompany] = useState(null);

// 	const token = localStorage.getItem('token');
// 	const navigate = useNavigate();

// 	const featureLabels = useMemo(
// 		() => ({
// 			calendar: { label: 'Календарь', icon: menuItems.find((item) => item.label === 'Календарь')?.icon || '/ico/calendar.svg' },
// 			analytics: { label: 'Аналитика', icon: menuItems.find((item) => item.label === 'Аналитика')?.icon || '/ico/statistic.svg' },
// 			telegram: { label: 'Сотрудники', icon: menuItems.find((item) => item.label === 'Сотрудники')?.icon || '/ico/user.svg' },
// 			aiText: { label: 'LoryAI', icon: menuItems.find((item) => item.label === 'LoryAI')?.icon || '/ico/astronomy.svg' },
// 			socials: { label: 'Клиенты', icon: menuItems.find((item) => item.label === 'Клиенты')?.icon || '/ico/user-1.svg' },
// 			delivery: { label: 'Товары', icon: menuItems.find((item) => item.label === 'Товары')?.icon || '/ico/shopping.svg' },
// 		}),
// 		[menuItems]
// 	);

// 	const features = ['calendar', 'analytics', 'telegram', 'aiText', 'socials', 'delivery'];

// 	const getTrueFeatures = (company) => {
// 		return features
// 			.filter((feature) => company[feature] === 'true')
// 			.map((feature) => ({
// 				key: feature,
// 				label: featureLabels[feature].label,
// 				icon: featureLabels[feature].icon,
// 			}));
// 	};

// 	const restaurantMenuItems = [
// 		{ label: 'Торг - наполеон', icon: '/ico/cake.svg' },
// 		{ label: 'Торг - красный бархат', icon: '/ico/cake.svg' },
// 		{ label: 'Торг - медовый', icon: '/ico/cake.svg' },
// 		{ label: 'Торг - тирамису', icon: '/ico/cake.svg' },
// 	];

// 	const toggleNotifications = () => {
// 		setIsNotificationsOpen(!isNotificationsOpen);
// 	};

// 	const toggleCompany = (companyId) => {
// 		setExpandedCompany(expandedCompany === companyId ? null : companyId);
// 	};

// 	useEffect(() => {
// 		const fetchCompanies = async () => {
// 			if (!token) {
// 				setError('Токен авторизации отсутствует. Пожалуйста, войдите в систему.');
// 				navigate('/LoginUser');
// 				return;
// 			}
// 			setIsLoading(true);
// 			setError('');
// 			try {
// 				const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
// 				const response = await axiosInstance.get('/business/admin', config);
// 				const businesses = response.data;
// 				if (!businesses || businesses.length === 0) {
// 					setError('Данные о бизнесе не найдены.');
// 					setCompanies([]);
// 				} else {
// 					const mappedBusinesses = businesses.map((business) => ({
// 						id: business.id,
// 						name: business.name,
// 						description: business.description,
// 						businessType: business.type,
// 						theme: business.theme?.color || '',
// 						calendar: business.calendar || 'false',
// 						analytics: business.analytics || 'false',
// 						telegram: business.telegram || 'false',
// 						aiText: business.aiText || 'true',
// 						socials: business.socials || 'false',
// 						delivery: business.delivery || 'false',
// 					}));
// 					localStorage.setItem('businesses', JSON.stringify(mappedBusinesses));
// 					setCompanies(mappedBusinesses);
// 					if (mappedBusinesses.length > 0) {
// 						setExpandedCompany(mappedBusinesses[0].id);
// 					}
// 				}
// 			} catch (err) {
// 				const status = err.response?.status;
// 				const errorMessage =
// 					status === 401
// 						? 'Недействительный токен. Пожалуйста, войдите снова.'
// 						: err.response?.data?.message || 'Не удалось загрузить бизнес.';
// 				setError(errorMessage);
// 				const savedBusinesses = JSON.parse(localStorage.getItem('businesses'));
// 				if (savedBusinesses && savedBusinesses.length > 0) {
// 					setCompanies(savedBusinesses);
// 					if (savedBusinesses.length > 0) {
// 						setExpandedCompany(savedBusinesses[0].id);
// 					}
// 				}
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};
// 		fetchCompanies();
// 	}, [token, navigate]);

// 	return (
// 		<aside
// 			className={`fixed top-0 right-0 w-64 h-[calc(100vh-136px)] rounded-bl-2xl bg-white z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
// 				} md:translate-x-0 md:top-0 flex flex-col`}
// 			aria-label="Боковая панель"
// 		>
// 			{/* Прокручиваемая область */}
// 			<div className="flex-1 overflow-y-auto p-4">
// 				{isLoading ? (
// 					<p className="text-gray-600">Загрузка компаний...</p>
// 				) : error ? (
// 					<p className="text-red-600 mb-4">{error}</p>
// 				) : companies.length === 0 ? (
// 					<p className="text-gray-600">Компании не найдены.</p>
// 				) : (
// 					companies.map((company) => (
// 						<div key={company.id} className="mb-4">
// 							<button
// 								className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
// 								onClick={() => toggleCompany(company.id)}
// 								aria-expanded={expandedCompany === company.id}
// 								aria-controls={`company-menu-${company.id}`}
// 							>
// 								<span className="font-medium text-lg">{company.name || 'Без названия'}</span>
// 								<img
// 									src={expandedCompany === company.id ? arDown : arRight}
// 									alt={expandedCompany === company.id ? 'Свернуть' : 'Развернуть'}
// 									className="w-4 h-4 ml-auto"
// 								/>
// 							</button>
// 							{expandedCompany === company.id && (
// 								<div id={`company-menu-${company.id}`} className="pl-4 mt-2 max-h-40 overflow-y-auto">
// 									{company.businessType === 'RESTAURANT' ? (
// 										restaurantMenuItems.map((item, index) => (
// 											<div
// 												key={index}
// 												className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
// 												onClick={() => onSelectMenu(item.label)}
// 											>
// 												<img src={item.icon} alt={item.label} className="w-5 h-5" />
// 												<span>{item.label}</span>
// 											</div>
// 										))
// 									) : (
// 										getTrueFeatures(company).length > 0 ? (
// 											getTrueFeatures(company).map((feature) => (
// 												<div
// 													key={feature.key}
// 													className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
// 													onClick={() => onSelectMenu(feature.label)}
// 												>
// 													{feature.icon ? (
// 														<img src={feature.icon} alt={feature.label} className="w-5 h-5" />
// 													) : (
// 														<span className="w-5 h-5 bg-gray-200 rounded-full" />
// 													)}
// 													<span>{feature.label}</span>
// 												</div>
// 											))
// 										) : (
// 											<p className="text-gray-600">Функции не добавлены.</p>
// 										)
// 									)}
// 								</div>
// 							)}
// 						</div>
// 					))
// 				)}

// 				{/* Уведомления */}
// 				<div className="mt-6 mb-6">
// 					<button
// 						className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
// 						onClick={toggleNotifications}
// 						aria-expanded={isNotificationsOpen}
// 						aria-controls="notifications-section"
// 					>
// 						<img src="/ico/bell.svg" alt="Уведомления" className="w-5 h-5" />
// 						<span className="text-lg font-semibold">Уведомления</span>
// 					</button>
// 					{isNotificationsOpen && (
// 						<div id="notifications-section" className="mt-2 pl-4 max-h-40">
// 							{menuItems?.length > 0 ? (
// 								menuItems.map((item, index) => (
// 									<div
// 										key={index}
// 										className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
// 										onClick={() => onSelectMenu(item.label)}
// 									>
// 										<img src={item.icon} alt={item.label} className="w-5 h-5" />
// 										<span>{item.label}</span>
// 									</div>
// 								))
// 							) : (
// 								<p className="text-gray-600">Уведомлений нет.</p>
// 							)}
// 						</div>
// 					)}
// 				</div>
// 			</div>

// 			{/* Футер с профилем */}
// 			<div className="p-4 border-t border-gray-200 shrink-0">
// 				<div className="flex items-center gap-3">
// 					<img src="/ico/user-profile.svg" alt="User Profile" className="w-10 h-10 rounded-full" />
// 					<div>
// 						<p className="text-sm font-medium text-gray-800">Grigo_Ayaal</p>
// 						<p className="text-xs text-gray-500">Администратор</p>
// 					</div>
// 				</div>
// 			</div>
// 		</aside>
// 	);
// }

// export default RightSidebar;
import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../scripts/axiosInstance';
import { useNavigate } from 'react-router-dom';
import arRight from '/ico/arRight.svg';
import arDown from '/ico/arDown.svg';

function RightSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [expandedCompany, setExpandedCompany] = useState(null);
	const [expandedEmployees, setExpandedEmployees] = useState(null); // Для отслеживания развернутых сотрудников по companyId

	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	const employees = [
		{ name: 'Владимир Трубиков', phone: '+7 914 218-30-18', visits: 2, canceled: 0, revenue: 1000 },
		{ name: 'Григорий Акаев', phone: '+7 924 664-33-35', visits: 33, canceled: 10, revenue: 36478 },
		{ name: 'Павел Буздарь', phone: '+7 964 432-85-36', visits: 15, canceled: 5, revenue: 69000 },
		{ name: 'Ханалыев Ленат', phone: '+7 962 724-88-34', visits: 4, canceled: 0, revenue: 10000 },
	];

	const featureLabels = useMemo(
		() => ({
			calendar: { label: 'Календарь', icon: menuItems.find((item) => item.label === 'Календарь')?.icon || '/ico/calendar.svg' },
			analytics: { label: 'Аналитика', icon: menuItems.find((item) => item.label === 'Аналитика')?.icon || '/ico/statistic.svg' },
			telegram: { label: 'Сотрудники', icon: menuItems.find((item) => item.label === 'Сотрудники')?.icon || '/ico/user.svg' },
			aiText: { label: 'LoryAI', icon: menuItems.find((item) => item.label === 'LoryAI')?.icon || '/ico/astronomy.svg' },
			socials: { label: 'Клиенты', icon: menuItems.find((item) => item.label === 'Клиенты')?.icon || '/ico/user-1.svg' },
			delivery: { label: 'Товары', icon: menuItems.find((item) => item.label === 'Товары')?.icon || '/ico/shopping.svg' },
		}),
		[menuItems]
	);

	const features = ['calendar', 'analytics', 'telegram', 'aiText', 'socials', 'delivery'];

	const getTrueFeatures = (company) => {
		return features
			.filter((feature) => company[feature] === 'true')
			.map((feature) => ({
				key: feature,
				label: featureLabels[feature].label,
				icon: featureLabels[feature].icon,
			}));
	};

	const restaurantMenuItems = [
		{ label: 'Торг - наполеон', icon: '/ico/cake.svg' },
		{ label: 'Торг - красный бархат', icon: '/ico/cake.svg' },
		{ label: 'Торг - медовый', icon: '/ico/cake.svg' },
		{ label: 'Торг - тирамису', icon: '/ico/cake.svg' },
	];

	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	const toggleCompany = (companyId) => {
		setExpandedCompany(expandedCompany === companyId ? null : companyId);
		// Сбрасываем развернутый список сотрудников при переключении компании
		if (expandedCompany !== companyId) setExpandedEmployees(null);
	};

	const toggleEmployees = (companyId) => {
		setExpandedEmployees(expandedEmployees === companyId ? null : companyId);
	};

	useEffect(() => {
		const fetchCompanies = async () => {
			if (!token) {
				setError('Токен авторизации отсутствует. Пожалуйста, войдите в систему.');
				navigate('/LoginUser');
				return;
			}
			setIsLoading(true);
			setError('');
			try {
				const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
				const response = await axiosInstance.get('/business/admin', config);
				const businesses = response.data;
				if (!businesses || businesses.length === 0) {
					console.log('[RightSidebar] fetchCompanies: No business data returned');
					//setError('Данные о бизнесе не найдены.');
					setCompanies([]);
				} else {
					const mappedBusinesses = businesses.map((business) => ({
						id: business.id,
						name: business.name,
						description: business.description,
						businessType: business.type,
						theme: business.theme?.color || '',
						calendar: business.calendar || 'false',
						analytics: business.analytics || 'false',
						telegram: business.telegram || 'false',
						aiText: business.aiText || 'true',
						socials: business.socials || 'false',
						delivery: business.delivery || 'false',
					}));
					localStorage.setItem('businesses', JSON.stringify(mappedBusinesses));
					setCompanies(mappedBusinesses);
					if (mappedBusinesses.length > 0) {
						setExpandedCompany(mappedBusinesses[0].id);
					}
				}
			} catch (err) {
				const status = err.response?.status;
				const errorMessage =
					status === 401
						? 'Недействительный токен. Пожалуйста, войдите снова.'
						: err.response?.data?.message || 'Не удалось загрузить бизнес.';
				setError(errorMessage);
				const savedBusinesses = JSON.parse(localStorage.getItem('businesses'));
				if (savedBusinesses && savedBusinesses.length > 0) {
					setCompanies(savedBusinesses);
					if (savedBusinesses.length > 0) {
						setExpandedCompany(savedBusinesses[0].id);
					}
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchCompanies();
	}, [token, navigate]);

	return (
		<aside
			className={`fixed top-0 right-0 w-64 h-[calc(100vh-136px)] rounded-bl-2xl bg-white z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 md:top-0 flex flex-col`}
			aria-label="Боковая панель"
		>
			<div className="flex-1 overflow-y-auto p-4">
				{isLoading ? (
					<p className="text-gray-600">Загрузка компаний...</p>
				) : error ? (
					<p className="text-red-600 mb-4">{error}</p>
				) : companies.length === 0 ? (
					<p className="text-gray-600">Компании не найдены.</p>
				) : (
					companies.map((company) => (
						<div key={company.id} className="mb-4">
							<button
								className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
								onClick={() => toggleCompany(company.id)}
								aria-expanded={expandedCompany === company.id}
								aria-controls={`company-menu-${company.id}`}
							>
								<span className="font-medium text-lg">{company.name || 'Без названия'}</span>
								<img
									src={expandedCompany === company.id ? arDown : arRight}
									alt={expandedCompany === company.id ? 'Свернуть' : 'Развернуть'}
									className="w-4 h-4 ml-auto"
								/>
							</button>
							{expandedCompany === company.id && (
								<div id={`company-menu-${company.id}`} className="pl-4 mt-2 overflow-y-auto">
									{company.businessType === 'RESTAURANT' ? (
										restaurantMenuItems.map((item, index) => (
											<div
												key={index}
												className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
												onClick={() => onSelectMenu(item.label)}
											>
												<img src={item.icon} alt={item.label} className="w-5 h-5" />
												<span>{item.label}</span>
											</div>
										))
									) : (
										getTrueFeatures(company).map((feature) => (
											<div key={feature.key}>
												<button
													className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
													onClick={() => {
														if (feature.label === 'Сотрудники') {
															toggleEmployees(company.id);
														} else {
															onSelectMenu(feature.label);
														}
													}}
													aria-expanded={feature.label === 'Сотрудники' && expandedEmployees === company.id}
													aria-controls={`employees-${company.id}`}
												>
													<img src={feature.icon} alt={feature.label} className="w-5 h-5" />
													<span>{feature.label}</span>
												</button>
												{feature.label === 'Сотрудники' && expandedEmployees === company.id && (
													<div id={`employees-${company.id}`} className="pl-4 mt-2">
														{employees.map((employee, index) => (
															<div
																key={index}
																className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
																onClick={() => onSelectMenu(feature.label, employee)}
															>
																<span>{employee.name}</span>
															</div>
														))}
													</div>
												)}
											</div>
										))
									)}
									{/* Add notification items */}
									{menuItems?.length > 0 && (
										menuItems.map((item, index) => (
											<div
												key={`notification-${index}`}
												className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
												onClick={() => onSelectMenu(item.label)}
											>
												<img src={item.icon} alt={item.label} className="w-5 h-5" />
												<span>{item.label}</span>
											</div>
										))
									)}
								</div>
							)}
						</div>
					))
				)}

				<div className="mt-6 mb-6">
					<button
						className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
						onClick={toggleNotifications}
						aria-expanded={isNotificationsOpen}
						aria-controls="notifications-section"
					>
						<img src="/ico/bell.svg" alt="Уведомления" className="w-5 h-5" />
						<span className="text-lg font-semibold">Уведомления</span>
					</button>
					{isNotificationsOpen && (
						<div id="notifications-section" className="mt-2 pl-4 max-h-40">
							{menuItems?.length > 0 ? (
								menuItems.map((item, index) => (
									<div
										key={index}
										className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
										onClick={() => onSelectMenu(item.label)}
									>
										<img src={item.icon} alt={item.label} className="w-5 h-5" />
										<span>{item.label}</span>
									</div>
								))
							) : (
								<p className="text-gray-600">Уведомлений нет.</p>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="p-4 border-t border-gray-200 shrink-0">
				<div className="flex items-center gap-3">
					<img src="/ico/user-profile.svg" alt="User Profile" className="w-10 h-10 rounded-full" />
					<div>
						<p className="text-sm font-medium text-gray-800">Grigo_Ayaal</p>
						<p className="text-xs text-gray-500">Администратор</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default RightSidebar;