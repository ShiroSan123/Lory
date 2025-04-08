import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatBot from '../../components/chatBot';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

export const MainContent = memo(({ selectedMenu, isLoading = false, isSidebarOpen, setIsSidebarOpen, selectedEmployee, selectedCompany }) => {
	const mainRef = useRef(null);
	const navigate = useNavigate();
	const [isSwiped, setIsSwiped] = useState(false);
	const [companyData, setCompanyData] = useState(null);
	const [updateError, setUpdateError] = useState('');
	const [updateSuccess, setUpdateSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Registration form state and functions remain unchanged for brevity
	const [formData, setFormData] = useState({
		name: '',
		businessType: 'RESTAURANT',
		businessTerm: '',
		city: '',
		street: '',
		workTime: '',
		holidays: '',
		description: '',
		descriptionAI: '',
		logo: null,
		calendar: false,
		analytics: false,
		telegram: false,
		aiText: false,
		socials: false,
		delivery: false,
	});
	const [step, setStep] = useState(1);
	const [isRegistering, setIsRegistering] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');
	const [error, setError] = useState('');
	const [showDescriptionButtons, setShowDescriptionButtons] = useState(false);
	const [isReenteringDescription, setIsReenteringDescription] = useState(false);

	// Swipe and registration logic remains unchanged
	const handleSwipeRight = () => setIsSwiped(true);
	const handleSwipeToggle = () => setIsSwiped((prev) => !prev);
	const handleTouchStart = (e) => { mainRef.current.startX = e.touches[0].clientX; };
	const handleTouchMove = (e) => {
		const deltaX = e.touches[0].clientX - mainRef.current.startX;
		if (deltaX > 50) setIsSwiped(true);
	};

	// Placeholder products (to be replaced with dynamic data in a real app)
	const products = [
		{ id: 1, image: '/images/cherry.jpeg', title: 'Зимняя вишня', description: 'Стрижка женская...', price: 650 },
		{ id: 2, image: '/images/crop.jpeg', title: 'Кроп', description: 'Стрижка мужская...', price: 650 },
		{ id: 3, image: '/images/mallet.jpeg', title: 'Маллет', description: 'Стрижка мужская...', price: 650 },
	];

	const renderMainContent = () => {
		console.log('Rendering MainContent with selectedMenu:', selectedMenu);
		switch (selectedMenu) {
			case 'LoryAI':
				return (
					<ChatBot
						onSubmitData={handleCustomInput}
						customBotMessage={getBotMessage()}
						showButtons={showDescriptionButtons}
						onButtonClick={(choice) => handleDescriptionChoice(choice, (msg) => handleCustomInput('', (m) => msg.sender === 'bot' && m.text))}
						startRegistration={startRegistration}
					/>
				);
			case 'telegram': // Employees or Masters
				if (!selectedCompany) {
					return <div className="p-4">Сначала выберите компанию</div>;
				}
				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">
							{selectedCompany.businessType === 'Service' ? 'Мастера' : 'Сотрудники'}
						</h1>
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"></th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Имя</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Телефон</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Посещений</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Отмененные</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Выручка</th>
									</tr>
								</thead>
								<tbody>
									{/* Hardcoded for demo; replace with dynamic data */}
									<tr>
										<td className="px-4 py-2 border-b"><input type="checkbox" className="h-4 w-4 text-blue-600" /></td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Владимир Трубиков</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 914 218-30-18</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">2</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">1 000</td>
									</tr>
									{/* Add more rows as needed */}
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'analytics':
				return <h1 className="p-4">Аналитика</h1>;
			case 'calendar':
				return <h1 className="p-4">Календарь</h1>;
			case 'socials': // Clients
				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">Клиенты</h1>
						{/* Existing clients content remains unchanged */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">11 410</h2>
								<p className="text-sm text-gray-600">Клиенты за 6 мес.</p>
							</div>
							{/* Other stats */}
						</div>
					</div>
				);
			case 'delivery': // Dynamic based on businessType
				if (!selectedCompany) {
					return <div className="p-4">Сначала выберите компанию</div>;
				}
				let title, content;
				switch (selectedCompany.businessType) {
					case 'Restaurant':
						title = 'Блюда и доставка';
						content = 'Список блюд и информация о доставке для ресторана.';
						break;
					case 'Service':
						title = 'Услуги';
						content = 'Список услуг, предлагаемых бизнесом.';
						break;
					case 'Estate':
						title = 'Апартаменты';
						content = 'Список доступных апартаментов.';
						break;
					default:
						title = 'Товары';
						content = 'Общий список товаров.';
				}
				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">{title}</h1>
						<p>{content}</p>
						{/* Replace with dynamic data */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{products.map((product) => (
								<div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
									<img src={product.image} alt={product.title} className="w-full h-60 object-cover rounded-t-lg" />
									<div className="p-4 bg-[#F6F7F8] rounded-2xl">
										<h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
										<p className="text-sm text-gray-600 mt-1">{product.description}</p>
										<p className="text-lg font-bold text-gray-800 mt-2">{product.price} ₽</p>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'Business':
				if (!selectedCompany) {
					return <div className="p-4">Компания не найдена</div>;
				}
				if (!companyData) {
					setCompanyData(selectedCompany);
				}
				const confirmSaveChanges = () => {
					if (window.confirm('Вы уверены, что хотите сохранить изменения?')) {
						handleUpdateCompany(selectedCompany.id);
					}
				};
				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">Компания: {selectedCompany.name}</h1>
						{isEditing ? (
							<div className="grid grid-cols-1 gap-4">
								{/* Editing form remains unchanged */}
								<button
									onClick={confirmSaveChanges}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
								>
									Сохранить изменения
								</button>
							</div>
						) : (
							<div className="p-6">
								<p className="text-base text-gray-800 mb-3"><strong>ID:</strong> {selectedCompany.id}</p>
								<p className="text-base text-gray-800 mb-3"><strong>Название:</strong> {selectedCompany.name || 'Не указано'}</p>
								<p className="text-base text-gray-800 mb-3"><strong>Сфера:</strong> {selectedCompany.businessType || 'Не указано'}</p>
								{/* Other fields */}
								<button
									onClick={() => setIsEditing(true)}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
								>
									Изменить
								</button>
							</div>
						)}
					</div>
				);
			default:
				return <div className="p-4">Выберите пункт меню</div>;
		}
	};

	// Registration and update functions remain unchanged
	const handleUpdateCompany = async (companyId) => {
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_BASE_URL}/companies/${companyId}`,
				companyData,
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
				}
			);
			const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
			const updatedCompanies = savedCompanies.map((company) =>
				company.id === companyId ? { ...company, ...companyData } : company
			);
			localStorage.setItem('companies', JSON.stringify(updatedCompanies));
			setUpdateSuccess('Данные компании успешно обновлены!');
			setUpdateError('');
			window.location.reload();
		} catch (err) {
			setUpdateError('Ошибка при обновлении данных.');
			setUpdateSuccess('');
		}
	};

	return (
		<main
			ref={mainRef}
			onClick={handleSwipeRight}
			className={`md:fixed rounded-br-2xl bg-white pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'
				} ${!isSidebarOpen ? 'md:hidden' : 'md:block'} md:translate-x-0 z-10`}
		>
			{isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
		</main>
	);
});

export default MainContent;