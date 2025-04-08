import { useState, useEffect } from 'react';
import axiosInstance from '../../scripts/axiosInstance';
import { useNavigate } from 'react-router-dom';
import arRight from '/ico/arRight.svg';
import arDown from '/ico/arDown.svg';

function RightSidebar({ isOpen, onClose, menuItems, onSelectMenu }) {
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [companyName, setCompanyName] = useState('');
	const [expandedCompany, setExpandedCompany] = useState(null);
	const [expandedMenu, setExpandedMenu] = useState(null);
	const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

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
		setIsCompaniesOpen(!isCompaniesOpen);
	};

	const handleEmployeeSelect = (employee) => {
		onSelectMenu('Сотрудники', employee);
	};

	const toggleNotifications = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	const toggleCompany = (companyId) => {
		setExpandedCompany(expandedCompany === companyId ? null : companyId);
	};

	useEffect(() => {
		const fetchCompanies = async () => {
			if (!token) {
				setError('Authorization token is missing. Please log in.');
				navigate('/LoginUser');
				return;
			}

			setIsLoading(true);
			try {
				const response = await axiosInstance.get('/companies/me');
				const companyIds = response.data;
				if (!companyIds || companyIds.length === 0) {
					localStorage.setItem('companies', JSON.stringify([]));
					setIsLoading(false);
					return;
				}

				const companyPromises = companyIds.map((id) => axiosInstance.get(`/companies/${id}`));
				const companyResponses = await Promise.all(companyPromises);
				const companyData = companyResponses.map((res) => res.data);

				localStorage.setItem('companies', JSON.stringify(companyData));
				const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
				if (savedCompanies.length > 1) {
					setCompanyName(savedCompanies[1].name || 'Название не указано');
				} else {
					setCompanyName('Компания с индексом 1 не найдена');
				}
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to fetch companies.');
				console.error('Error fetching companies:', err.response?.data);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCompanies();
	}, [token, navigate]);

	const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];

	// Dynamic feature labels based on businessType
	const featureLabels = (businessType) => ({
		calendar: { label: 'Календарь', icon: '/ico/calendar.svg' },
		analytics: { label: 'Аналитика', icon: '/ico/statistic.svg' },
		telegram: {
			label: businessType === 'Service' ? 'Мастера' : 'Сотрудники',
			icon: '/ico/user.svg',
		},
		aiText: { label: 'LoryAI', icon: '/ico/astronomy.svg' },
		socials: { label: 'Клиенты', icon: '/ico/user-1.svg' },
		delivery: {
			label:
				businessType === 'Restaurant' ? 'Блюда и доставка' :
					businessType === 'Service' ? 'Услуги' :
						businessType === 'Estate' ? 'Апартаменты' : 'Товары',
			icon: '/ico/shopping.svg',
		},
	});

	const getTrueFeatures = (company) => {
		const features = ['calendar', 'analytics', 'telegram', 'aiText', 'socials', 'delivery'];
		const labels = featureLabels(company.businessType || 'Default');
		return features
			.filter((feature) => company[feature] === 'true')
			.map((feature) => ({
				key: feature,
				label: labels[feature].label,
				icon: labels[feature].icon,
			}));
	};

	return (
		<aside
			className={`fixed top-0 right-0 w-full md:w-64 h-[calc(100vh-136px)] bg-white rounded-bl-2xl p-4 z-20 overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
				} md:translate-x-0 md:top-0`}
		>
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

			{savedCompanies.length > 0 && (
				<div className="mb-6">
					{savedCompanies.map((company) => (
						<div key={company.id} className="mb-4">
							<div className="flex items-center p-2 gap-2 rounded-lg bg-gray-50">
								<span
									className="font-medium hover:text-amber-700 cursor-pointer"
									onClick={() => onSelectMenu('Business', company)}
								>
									{company.name}
								</span>
							</div>
							{getTrueFeatures(company).length > 0 ? (
								getTrueFeatures(company).map((feature) => (
									<div
										key={feature.key}
										className="flex items-center p-2 gap-2 mt-2 rounded-lg hover:bg-gray-100 cursor-pointer"
										onClick={() => onSelectMenu(feature.key, company)}
									>
										<img src={feature.icon} alt={feature.label} className="w-5 h-5" />
										<span>{feature.label}</span>
									</div>
								))
							) : (
								<button
									className="mt-2 p-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
									onClick={() => onSelectMenu('Business', company)}
								>
									Добавить функции
								</button>
							)}
						</div>
					))}
				</div>
			)}

			<nav>
				<a href="/BusinessRegPage">Зарегистрировать бизнес</a>
			</nav>

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

			<div className="mt-6">
				<div
					className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					onClick={toggleCompanies}
				>
					<span className="text-lg font-semibold">Мои компании</span>
					<span className="ml-auto">
						<img
							src={isCompaniesOpen ? arDown : arRight}
							alt={isCompaniesOpen ? 'Collapse' : 'Expand'}
							className="w-4 h-4"
						/>
					</span>
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
											<img
												src={expandedCompany === company.id ? arDown : arRight}
												alt={expandedCompany === company.id ? 'Collapse' : 'Expand'}
												className="w-4 h-4"
											/>
										</span>
									</div>
									{expandedCompany === company.id && (
										<div className="pl-4 pt-2 pb-2 bg-gray-50 rounded-lg mt-1">
											<p className="text-sm text-gray-700"><strong>ID:</strong> {company.id}</p>
											<p className="text-sm text-gray-700 mt-1"><strong>Название:</strong> {company.name || 'Не указано'}</p>
											<p className="text-sm text-gray-700 mt-1"><strong>Сфера:</strong> {company.businessType || 'Не указано'}</p>
											{/* Other company details remain unchanged */}
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}
			</div>

			<div className="absolute bottom-0 left-0 w-full p-4">
				<div
					className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					onClick={() => onSelectMenu('Агенты')}
				>
					<img src="/ico/user.svg" alt="Агенты" className="w-5 h-5" />
					<span>Агенты</span>
				</div>
				<div
					className="flex items-center p-2 gap-2 rounded-lg hover:bg-gray-100 cursor-pointer"
					onClick={() => onSelectMenu('Клиенты')}
				>
					<img src="/ico/user-1.svg" alt="Клиенты" className="w-5 h-5" />
					<span>Клиенты</span>
				</div>
			</div>
		</aside>
	);
}

export default RightSidebar;