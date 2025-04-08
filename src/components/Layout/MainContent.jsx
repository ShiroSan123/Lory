import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ChatBot from '../../components/chatBot';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

export const MainContent = memo(({
	selectedMenu,
	isLoading = false,
	isSidebarOpen,
	setIsSidebarOpen,
	selectedEmployee
}) => {
	const mainRef = useRef(null);
	const navigate = useNavigate();
	const [isSwiped, setIsSwiped] = useState(false);

	// Company states
	const [companyData, setCompanyData] = useState(null);
	const [updateError, setUpdateError] = useState('');
	const [updateSuccess, setUpdateSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Registration states
	const initialFormData = {
		name: '',
		description: '',
		descriptionAI: '',
		type: '',
		theme: { color: '' },
	};

	const [formData, setFormData] = useState(initialFormData);
	const [step, setStep] = useState(1);
	const [isRegistering, setIsRegistering] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');
	const [error, setError] = useState('');
	const [showButtons, setShowButtons] = useState(false);
	const [buttonOptions, setButtonOptions] = useState([]);
	const [businesses, setBusinesses] = useState([]);
	const [isChoosingDescription, setIsChoosingDescription] = useState(false);

	// Новые состояния для товаров
	const [companies, setCompanies] = useState([]);
	const [services, setServices] = useState({});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCompanyId, setSelectedCompanyId] = useState(null);

	const openModalForService = (companyId) => {
		setSelectedCompanyId(companyId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedCompanyId(null);
	};

	const steps = ['name', 'description', 'type', 'theme'];

	const stepQuestions = {
		name: 'Как называется твой бизнес? (обязательное поле)',
		description: 'Расскажи немного о своем бизнесе.',
		type: 'Выбери тип бизнеса:',
		theme: 'Выбери цветовую тему для бизнеса:',
	};

	const buttonOptionsMap = {
		type: [
			{ label: 'Услуги', value: 'SERVICE' },
			{ label: 'Ресторан', value: 'RESTAURANT' },
			{ label: 'Недвижимость', value: 'REAL_ESTATE' },
		],
		theme: [
			{ label: 'Синий', value: 'blue' },
			{ label: 'Зеленый', value: 'green' },
			{ label: 'Красный', value: 'red' },
		],
		chooseDescription: [
			{ label: 'Использовать мое описание', value: 'user' },
			{ label: 'Использовать описание ИИ', value: 'ai' },
		],
	};

	const token = localStorage.getItem('token');
	const baseUrl = import.meta.env.VITE_API_BASE_URL;

	// Функция для получения списка компаний
	const fetchCompanies = useCallback(async () => {
		try {
			const response = await axios.get(
				`${baseUrl}/business/admin`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setCompanies(response.data);
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при получении списка компаний.');
		}
	}, [token, baseUrl]);

	// Функция для добавления новой услуги
	// Функция для добавления новой услуги
	const addService = useCallback(async (businessId, serviceData) => {
		// Формируем объект новой услуги в соответствии с ожидаемой структурой API
		const newService = {
			moduleType: "MENU",
			customParameters: {
				displayType: "list",
				categories: ["Entrées"], // Можно сделать динамическим в будущем
				items: [{
					name: serviceData.name,
					description: serviceData.description,
					price: serviceData.price,
				}],
			},
		};

		try {
			// Отправляем запрос на добавление услуги
			const response = await axios.post(
				`${baseUrl}/services/${businessId}`,
				newService,
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);

			// После успешного добавления обновляем список услуг
			setServices(prev => ({
				...prev,
				[businessId]: [
					...(prev[businessId] || []), // Сохраняем существующие услуги
					newService.customParameters.items[0], // Добавляем новую услугу
				],
			}));

			closeModal(); // Закрываем модальное окно
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при добавлении услуги.');
			console.error('[addService] Error:', err.response?.data || err.message);
		}
	}, [token, baseUrl]);

	// Функция для получения услуг компании (оставим для проверки)
	const fetchServices = useCallback(async (businessId) => {
		try {
			const response = await axios.get(
				`${baseUrl}/services/${businessId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(`[fetchServices] Response for businessId ${businessId}:`, response.data);

			// Извлекаем все элементы items из ответа
			const items = response.data.flatMap(service =>
				service.customParameters?.items || []
			);

			setServices(prev => ({
				...prev,
				[businessId]: items,
			}));
		} catch (err) {
			console.error(`[fetchServices] Error for businessId ${businessId}:`, err.response?.data || err.message);
			setError(err.response?.data?.message || `Ошибка при получении услуг для компании ${businessId}.`);
			setServices(prev => ({
				...prev,
				[businessId]: [],
			}));
		}
	}, [token, baseUrl]);

	// Загружаем компании при монтировании компонента
	useEffect(() => {
		if (selectedMenu === 'Товары') {
			fetchCompanies();
		}
	}, [selectedMenu, fetchCompanies]);

	// Загружаем услуги для каждой компании
	useEffect(() => {
		if (selectedMenu === 'Товары' && companies.length > 0) {
			companies.forEach(company => {
				fetchServices(company.id);
			});
		}
	}, [companies, selectedMenu, fetchServices]);

	const generateDescriptionAI = useCallback(async (addMessage) => {
		setLocalLoading(true);
		setResponseMessage('');
		setError('');

		const data = {
			company_name: formData.name,
			industry: formData.type,
			description: formData.description,
		};

		try {
			const response = await axios.post(
				'https://my-vercel-server-seven.vercel.app/api/generate_description',
				data,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer a8f3cd34d3ad67e1f4b3f1a8d3cc432f9b2f9c9ac4d84c79e0d40a8c9ef0c8dd`,
					},
				}
			);

			const { text } = response.data;
			setFormData(prev => ({ ...prev, descriptionAI: text }));
			setResponseMessage('Описание успешно сгенерировано!');
			localStorage.setItem('descBusiness', text);

			addMessage({ sender: 'bot', text: 'Вот сгенерированное описание:' });
			addMessage({ sender: 'bot', text });
			addMessage({ sender: 'bot', text: 'Какое описание ты хочешь использовать?' });
			setShowButtons(true);
			setButtonOptions(buttonOptionsMap.chooseDescription);
			setIsChoosingDescription(true);
		} catch (err) {
			const errorMessage = err.response?.data?.message || 'Не удалось сгенерировать описание.';
			setError(errorMessage);
			addMessage({ sender: 'bot', text: errorMessage });
		} finally {
			setLocalLoading(false);
		}
	}, [formData]);

	const validateInput = useCallback((field, input) => {
		if (field === 'name' && !input) {
			setError('Название бизнеса обязательно.');
			return false;
		}
		setError('');
		return true;
	}, []);

	const updateFormData = useCallback((field, value) => {
		setFormData(prev => ({
			...prev,
			[field === 'theme' ? 'theme' : field]: field === 'theme' ? { color: value } : value
		}));
	}, []);

	const proceedToNextStep = useCallback((addMessage) => {
		setShowButtons(false);
		setButtonOptions([]);

		if (step < steps.length) {
			setStep(prev => prev + 1);
			addMessage({ sender: 'bot', text: stepQuestions[steps[step]] });
			if (buttonOptionsMap[steps[step]]) {
				setShowButtons(true);
				setButtonOptions(buttonOptionsMap[steps[step]]);
			}
		} else {
			displayFormData(addMessage);
			handleSubmit(addMessage);
		}
	}, [step, steps, buttonOptionsMap, stepQuestions]);

	const handleChatSubmit = useCallback(async (userInput, addMessage) => {
		const currentField = steps[step - 1];
		const trimmedInput = userInput.trim();

		if (buttonOptionsMap[currentField] && !isChoosingDescription) {
			setShowButtons(true);
			setButtonOptions(buttonOptionsMap[currentField]);
			return;
		}

		if (!validateInput(currentField, trimmedInput)) return;

		updateFormData(currentField, trimmedInput);

		if (currentField === 'description') {
			await generateDescriptionAI(addMessage);
			return;
		}

		proceedToNextStep(addMessage);
	}, [step, steps, buttonOptionsMap, isChoosingDescription, validateInput, updateFormData, generateDescriptionAI]);

	const displayFormData = useCallback((addMessage) => {
		addMessage({ sender: 'bot', text: 'Вот данные, которые ты ввел:' });
		addMessage({
			sender: 'bot',
			text: `Название: ${formData.name}\nОписание: ${formData.description}\nТип бизнеса: ${formData.type}\nЦветовая тема: ${formData.theme.color}`,
		});
	}, [formData]);

	const handleSubmit = useCallback(async (addMessage) => {
		setIsRegistering(true);
		setResponseMessage('');
		setError('');

		if (!token) {
			setError('Требуется авторизация. Пожалуйста, войдите.');
			addMessage({ sender: 'bot', text: 'Требуется авторизация. Пожалуйста, войдите.' });
			setIsRegistering(false);
			return;
		}

		const formPayload = {
			name: formData.name,
			description: formData.description,
			type: formData.type,
			theme: formData.theme,
		};

		try {
			const response = await axios.post(
				`${baseUrl}/business`,
				formPayload,
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);
			addMessage({ sender: 'bot', text: 'Бизнес успешно зарегистрирован!' });
			setResponseMessage('Бизнес успешно зарегистрирован!');
			await fetchBusinesses(addMessage);
			setTimeout(() => navigate('/Dashboard'), 2000);
		} catch (err) {
			const errorMessage = err.response?.data?.message || 'Ошибка при регистрации.';
			setError(errorMessage);
			addMessage({ sender: 'bot', text: errorMessage });
		} finally {
			setIsRegistering(false);
		}
	}, [formData, token, navigate, baseUrl]);

	const fetchBusinesses = useCallback(async (addMessage) => {
		try {
			const response = await axios.get(
				`${baseUrl}/business/admin`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setBusinesses(response.data);
			addMessage({ sender: 'bot', text: 'Вот список твоих компаний:' });
			response.data.forEach(business => {
				addMessage({
					sender: 'bot',
					text: `Название: ${business.name}, Тип: ${business.type}, Описание: ${business.description}, Тема: ${business.theme.color}`,
				});
			});
		} catch (err) {
			const errorMessage = err.response?.data?.message || 'Ошибка при получении данных о компаниях.';
			setError(errorMessage);
			addMessage({ sender: 'bot', text: errorMessage });
		}
	}, [token, baseUrl]);

	const handleButtonClick = useCallback((value, addMessage) => {
		addMessage({ sender: 'user', text: value });

		if (isChoosingDescription) {
			if (value === 'user') {
				addMessage({ sender: 'bot', text: 'Выбрано твое описание.' });
			} else if (value === 'ai') {
				setFormData(prev => ({ ...prev, description: prev.descriptionAI }));
				addMessage({ sender: 'bot', text: 'Выбрано описание, сгенерированное ИИ.' });
			}
			setIsChoosingDescription(false);
			proceedToNextStep(addMessage);
		} else {
			updateFormData(steps[step - 1], value);
			proceedToNextStep(addMessage);
		}
	}, [isChoosingDescription, steps, step, updateFormData, proceedToNextStep]);

	const getBotMessage = useCallback(() => {
		if (isRegistering) return 'Регистрирую твой бизнес...';
		if (localLoading) return 'Генерирую описание...';
		if (responseMessage) return responseMessage;
		if (error) return error;
		if (isChoosingDescription) return 'Какое описание ты хочешь использовать?';
		return stepQuestions[steps[step - 1]];
	}, [isRegistering, localLoading, responseMessage, error, isChoosingDescription, step]);

	const startRegistration = useCallback(() => {
		setStep(1);
		setFormData(initialFormData);
		setIsRegistering(false);
		setLocalLoading(false);
		setResponseMessage('');
		setError('');
		setShowButtons(false);
		setButtonOptions([]);
		setIsChoosingDescription(false);
	}, []);

	const handleUpdateCompany = useCallback(async (companyId) => {
		try {
			const response = await axios.put(
				`${baseUrl}/companies/${companyId}`,
				companyData,
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
			const updatedCompanies = savedCompanies.map(company =>
				company.id === companyId ? { ...company, ...companyData } : company
			);
			localStorage.setItem('companies', JSON.stringify(updatedCompanies));

			setUpdateSuccess('Данные компании успешно обновлены!');
			setUpdateError('');
			setTimeout(() => window.location.reload(), 1000);
		} catch (err) {
			setUpdateError('Произошла ошибка при обновлении данных. Попробуйте снова.');
			setUpdateSuccess('');
		}
	}, [companyData, token, baseUrl]);

	const renderMainContent = () => {
		switch (selectedMenu) {
			case 'LoryAI':
				return (
					<ChatBot
						onSubmitData={handleChatSubmit}
						customBotMessage={getBotMessage()}
						showButtons={showButtons}
						buttonOptions={buttonOptions}
						onButtonClick={handleButtonClick}
						isLoading={localLoading}
						startRegistration={startRegistration}
					/>
				);
			case 'Сотрудники':
				return (
					<div className="p-4">
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"></th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Клиент</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Телефон</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Посещений</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Отмененные</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Выручка</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Владимир Трубиков</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 914 218-30-18</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">2</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">1 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Григорий Акаев</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 924 664-33-35</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">33</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">36 478</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Павел Буздарь</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 964 432-85-36</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">15</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">5</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">69 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Ханалыев Ленат</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 962 724-88-34</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">4</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10 000</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'Аналитика':
				return <h1 className="p-4">Аналитика</h1>;
			case 'Календарь':
				return <h1 className="p-4">Календарь</h1>;
			case 'Клиенты':
				return (
					<div className="p-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">11 410</h2>
								<p className="text-sm text-gray-600">Клиенты за 6 мес.</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">2 129</h2>
								<p className="text-sm text-gray-600">Постоянные</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">4 738</h2>
								<p className="text-sm text-gray-600">Потенциальные (менее 3 посещений)</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg shadow">
								<h2 className="text-2xl font-bold text-gray-800">4 543</h2>
								<p className="text-sm text-gray-600">Общо по посещению за 6 мес.</p>
							</div>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"></th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Клиент</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Телефон</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Посещений</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Отмененные</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Выручка</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Владимир Трубиков</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 914 218-30-18</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">2</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">1 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Григорий Акаев</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 924 664-33-35</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">33</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">36 478</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Павел Буздарь</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 964 432-85-36</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">15</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">5</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">69 000</td>
									</tr>
									<tr>
										<td className="px-4 py-2 border-b">
											<input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
										</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">Ханалыев Ленат</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">+7 962 724-88-34</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">4</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">0</td>
										<td className="px-4 py-2 border-b text-sm text-gray-800">10 000</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'Товары':
				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">Товары</h1>
						{companies.length === 0 ? (
							<p className="text-gray-600">Компании не найдены или данные загружаются...</p>
						) : (
							companies.map(company => (
								<div key={company.id} className="mb-6">
									<h2 className="text-lg font-semibold text-gray-800 mb-2">{company.name}</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
										{(services[company.id] || []).length > 0 ? (
											services[company.id].map((service, index) => (
												<div
													key={index}
													className="bg-white rounded-2xl shadow-md overflow-hidden"
												>
													<img
														src="/images/placeholder.jpg"
														alt={service.name || 'Товар'}
														className="w-full h-60 object-cover rounded-t-lg"
													/>
													<div className="p-4 bg-white rounded-2xl">
														<h3 className="text-lg font-semibold text-gray-800">
															{service.name || 'Без названия'}
														</h3>
														<p className="text-sm text-gray-600 mt-1">
															{service.description || 'Описание отсутствует'}
														</p>
														<p className="text-lg font-bold text-gray-800 mt-2">
															{service.price ? `${service.price} ₽` : 'Цена не указана'}
														</p>
													</div>
												</div>
											))
										) : (
											<p className="text-gray-600">Товары для {company.name} отсутствуют.</p>
										)}
									</div>
									<button
										onClick={() => openModalForService(company.id)}
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
									>
										Добавить
									</button>
								</div>
							))
						)}

						{/* Modal for adding a new service */}
						{isModalOpen && (
							<div className="fixed inset-0 z-50 flex items-center justify-center">
								{/* Darkened Background Overlay */}
								<div
									className="absolute inset-0 bg-black opacity-25"
									onClick={closeModal}
								></div>

								{/* Modal Content */}
								<div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
									<h2 className="text-xl font-bold mb-4">Добавить новый товар</h2>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											const formData = new FormData(e.target);
											const newService = {
												name: formData.get('name'),
												description: formData.get('description'),
												price: parseFloat(formData.get('price')),
											};
											addService(selectedCompanyId, newService);
										}}
									>
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700">Название</label>
											<input
												type="text"
												name="name"
												defaultValue=""
												className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
												required
											/>
										</div>
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700">Описание</label>
											<textarea
												name="description"
												defaultValue=""
												className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
												rows="3"
												required
											/>
										</div>
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700">Цена (₽)</label>
											<input
												type="number"
												name="price"
												defaultValue=""
												step="0.01"
												className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
												required
											/>
										</div>
										<div className="flex justify-end space-x-2">
											<button
												type="button"
												onClick={closeModal}
												className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
											>
												Отмена
											</button>
											<button
												type="submit"
												className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
											>
												Добавить
											</button>
										</div>
									</form>
								</div>
							</div>
						)}
					</div>
				);
			case 'Business':
				const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
				const companyId = selectedEmployee?.companyId;
				// Fallback to JSON data if no companyId or no match in localStorage
				const companyFromJson = businesses.find(b => b.id === companyId) || businesses[0]; // Default to first company if no match
				const company = savedCompanies.find(c => c.id === companyId) || companyFromJson;

				if (!company) {
					return <div className="p-4">Компания не найдена</div>;
				}

				if (!companyData) {
					setCompanyData(company);
				}

				const confirmSaveChanges = () => {
					if (window.confirm('Вы уверены, что хотите сохранить изменения?')) {
						handleUpdateCompany(companyId);
					}
				};

				return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">Компания: {company.name}</h1>
						{updateError && <p className="text-red-600 mb-4">{updateError}</p>}
						{updateSuccess && <p className="text-green-600 mb-4">{updateSuccess}</p>}

						{isEditing ? (
							<div className="grid grid-cols-1 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Название</label>
									<input
										type="text"
										value={companyData?.name || ''}
										onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Описание</label>
									<textarea
										value={companyData?.description || ''}
										onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
										rows="3"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Тип бизнеса</label>
									<input
										type="text"
										value={companyData?.type || ''}
										onChange={(e) => setCompanyData({ ...companyData, type: e.target.value })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Цветовая тема</label>
									<input
										type="text"
										value={companyData?.theme?.color || ''}
										onChange={(e) => setCompanyData({ ...companyData, theme: { color: e.target.value } })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div className="flex space-x-2">
									<button
										onClick={confirmSaveChanges}
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
									>
										Сохранить изменения
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
									>
										Отмена
									</button>
								</div>
							</div>
						) : (
							<div className="p-6">
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">ID:</strong> {company.id}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Название:</strong> {company.name || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Описание:</strong> {company.description || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Тип бизнеса:</strong> {company.type || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Цветовая тема:</strong> {company.theme?.color || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Режим работы:</strong>
									{company.workingHours && company.workingHours.length > 0 ? (
										<ul className="list-disc pl-4 mt-1">
											{company.workingHours.map((hours, index) => (
												<li key={index}>{`${hours.day}: ${hours.start} - ${hours.end}`}</li>
											))}
										</ul>
									) : (
										' Не указано'
									)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Владелец (ID):</strong> {company.ownerId || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Дата создания:</strong>{' '}
									{company.createdAt ? new Date(company.createdAt).toLocaleString() : 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Дата обновления:</strong>{' '}
									{company.updatedAt ? new Date(company.updatedAt).toLocaleString() : 'Не указано'}
								</p>
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

	return (
		<main
			ref={mainRef}
			onClick={() => setIsSwiped(true)}
			className={`md:fixed rounded-br-2xl bg-white pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'
				} ${!isSidebarOpen ? 'md:hidden' : 'md:block'} md:translate-x-0 z-10`}
		>
			{isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
		</main>
	);
});

export default MainContent;