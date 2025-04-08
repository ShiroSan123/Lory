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

	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	// Dynamic feature labels using menuItems for icons
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

	// Mock menu items for RESTAURANT type
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
	};

	useEffect(() => {
		const fetchCompanies = async () => {
			if (!token) {
				console.log('[RightSidebar] fetchCompanies: No token found');
				setError('Токен авторизации отсутствует. Пожалуйста, войдите в систему.');
				navigate('/LoginUser');
				return;
			}

			setIsLoading(true);
			setError('');

			try {
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				};

				console.log('[RightSidebar] fetchCompanies: Fetching companies with token:', token);
				const response = await axiosInstance.get('/business/admin', config);
				console.log('[RightSidebar] fetchCompanies: Success response:', response.data);

				const businesses = response.data;
				if (!businesses || businesses.length === 0) {
					console.log('[RightSidebar] fetchCompanies: No business data returned');
					//setError('Данные о бизнесе не найдены.');
					setCompanies([]);
				} else {
					// Map the API response to match the expected structure
					const mappedBusinesses = businesses.map((business) => ({
						id: business.id,
						name: business.name,
						description: business.description,
						businessType: business.type,
						theme: business.theme?.color || '',
						// Mock feature flags since they're not in the API response
						calendar: business.calendar || 'false',
						analytics: business.analytics || 'false',
						telegram: business.telegram || 'false',
						aiText: business.aiText || 'true', // Mocking as true for testing
						socials: business.socials || 'false',
						delivery: business.delivery || 'false',
					}));
					localStorage.setItem('businesses', JSON.stringify(mappedBusinesses));
					setCompanies(mappedBusinesses);
					// Automatically expand the first company by default
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
				console.error('[RightSidebar] fetchCompanies: Error:', err.message, err.response?.data);

				// Fallback to localStorage if API fails
				const savedBusinesses = JSON.parse(localStorage.getItem('businesses'));
				if (savedBusinesses && savedBusinesses.length > 0) {
					console.log('[RightSidebar] fetchCompanies: Using fallback data from localStorage:', savedBusinesses);
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
			className={`fixed top-0 right-0 h-[calc(100vh-136px)] w-64 rounded-bl-2xl bg-white p-4 z-20 overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 md:top-0`}
			aria-label="Боковая панель"
		>
			{/* Companies Section */}
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
							<div id={`company-menu-${company.id}`} className="pl-4 mt-2">
								{company.businessType === 'RESTAURANT' ? (
									// Menu items for RESTAURANT type
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
									// Menu items for SERVICE type (or default)
									getTrueFeatures(company).length > 0 ? (
										getTrueFeatures(company).map((feature) => (
											<div
												key={feature.key}
												className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
												onClick={() => onSelectMenu(feature.label)}
											>
												{feature.icon ? (
													<img src={feature.icon} alt={feature.label} className="w-5 h-5" />
												) : (
													<span className="w-5 h-5 bg-gray-200 rounded-full" />
												)}
												<span>{feature.label}</span>
											</div>
										))
									) : (
										<p className="text-gray-600">Функции не добавлены.</p>
									)
								)}
							</div>
						)}
					</div>
				))
			)}

			{/* Notifications Section */}
			<div className="mt-6 mb-6">
				<button
					className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
					onClick={toggleNotifications}
					aria-expanded={isNotificationsOpen}
					aria-controls="notifications-section"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9991 1.25C7.71886 1.25 4.24906 4.71979 4.24906 9V9.7041C4.24906 10.401 4.04277 11.0824 3.65619 11.6622L2.50759 13.3851C1.17449 15.3848 2.1922 18.1028 4.51079 18.7351C5.2664 18.9412 6.0284 19.1155 6.7948 19.2581L6.7967 19.2632C7.56569 21.3151 9.62101 22.75 11.999 22.75C14.377 22.75 16.4323 21.3151 17.2013 19.2632L17.2032 19.2581C17.9696 19.1155 18.7317 18.9412 19.4873 18.7351C21.8059 18.1028 22.8236 15.3848 21.4905 13.3851L20.3419 11.6622C19.9554 11.0824 19.7491 10.401 19.7491 9.7041V9C19.7491 4.71979 16.2793 1.25 11.9991 1.25ZM15.3755 19.537C13.1325 19.805 10.8655 19.8049 8.62251 19.5369C9.33347 20.5585 10.57 21.25 11.999 21.25C13.428 21.25 14.6645 20.5585 15.3755 19.537ZM5.74906 9C5.74906 5.54822 8.54728 2.75 11.9991 2.75C15.4508 2.75 18.2491 5.54822 18.2491 9V9.7041C18.2491 10.6972 18.543 11.668 19.0939 12.4943L20.2425 14.2172C21.0076 15.3649 20.4235 16.925 19.0927 17.288C14.4484 18.5546 9.54972 18.5546 4.90547 17.288C3.57464 16.925 2.99049 15.3649 3.75566 14.2172L4.90427 12.4943C5.45512 11.668 5.74906 10.6972 5.74906 9.7041V9Z" fill="#858585"/>
</svg>

					<span className="text-lg font-semibold">Уведомления</span>
				</button>
				{isNotificationsOpen && (
					<div id="notifications-section" className="mt-2 pl-4">
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

			{/* User Profile Section */}
			<div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
				<div className="flex items-center gap-3">
					<img
						src={localStorage.getItem("photo")}
						alt="User Profile"
						className="w-10 h-10 rounded-full"
					/>
					<div>
						<p className="text-sm font-medium text-gray-800">{localStorage.getItem("name")}</p>
						<p className="text-xs text-gray-500">Администратор</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default RightSidebar;