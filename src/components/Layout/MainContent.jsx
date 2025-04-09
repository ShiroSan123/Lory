// MainContent.jsx
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import ChatBot from '../../components/chatBot';
import { useNavigate } from 'react-router-dom';
import BusinessContent from './BusinessContent'; // Импорт нового компонента
import Content from './Content';

export const MainContent = memo(({
  selectedMenu,
  isLoading = false,
  isSidebarOpen,
  setIsSidebarOpen,
  selectedEmployee,
  selectedCompany
}) => {
  const mainRef = useRef(null);
  const navigate = useNavigate();
  const [isSwiped, setIsSwiped] = useState(false);

	// Company states (были ранее)
	const [companyData, setCompanyData] = useState(null);
	const [updateError, setUpdateError] = useState('');
	const [updateSuccess, setUpdateSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Новые состояния для Business, вынесенные на верхний уровень
	const [companyDataFromApi, setCompanyDataFromApi] = useState(null);
	const [fetchError, setFetchError] = useState('');
	const [isFetching, setIsFetching] = useState(false);

	// Registration states (были ранее)
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

	// Остальные состояния остаются без изменений
	const [companies, setCompanies] = useState([]);
	const [services, setServices] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCompanyId, setSelectedCompanyId] = useState(null);
	const [isConfiguring, setIsConfiguring] = useState(false);
	const [configData, setConfigData] = useState({
		analytics: false,
		products: false,
		menu: false,
		calendar: false,
		masters: false,
		delivery: false,
	});

	const [registeredBusinessId, setRegisteredBusinessId] = useState(null);
	const [configError, setConfigError] = useState('');

	const openModalForService = (companyId) => {
		setSelectedCompanyId(companyId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedCompanyId(null);
	};

	const steps = ['name', 'type', 'description', 'theme'];

	const stepQuestions = {
		name: 'Как называется твой бизнес? (обязательное поле)',
		type: 'Выбери тип бизнеса:',
		description: 'Расскажи немного о своем бизнесе.',
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
		configureChoice: [
			{ label: 'Оставить как есть', value: 'keep' },
			{ label: 'Настроить', value: 'configure' },
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
	const addService = useCallback(async (businessId, serviceData) => {
		const newService = {
			moduleType: "MENU",
			customParameters: {
				displayType: "list",
				categories: ["Entrées"],
				items: [{
					name: serviceData.name,
					description: serviceData.description,
					price: serviceData.price,
				}],
			},
		};

		try {
			const response = await axios.post(
				`${baseUrl}/services/${businessId}`,
				newService,
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);

			setServices(prev => ({
				...prev,
				[businessId]: [
					...(prev[businessId] || []),
					newService.customParameters.items[0],
				],
			}));

			closeModal();
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при добавлении услуги.');
			console.error('[addService] Error:', err.response?.data || err.message);
		}
	}, [token, baseUrl]);

	// Функция для получения услуг компании
	const fetchServices = useCallback(async (businessId) => {
		try {
			const response = await axios.get(
				`${baseUrl}/services/${businessId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(`[fetchServices] Response for businessId ${businessId}:`, response.data);

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
			console.log('[handleSubmit] Business registered:', response.data);
			// Проверяем возможные ключи для ID
			const businessId = response.data.id || response.data.businessId || response.data._id;
			if (!businessId) {
				throw new Error('ID бизнеса не получен от сервера.');
			}
			setRegisteredBusinessId(businessId);
			addMessage({ sender: 'bot', text: `Бизнес успешно зарегистрирован! ID: ${businessId}` });
			addMessage({ sender: 'bot', text: 'Хочешь оставить как есть или настроить?' });
			setShowButtons(true);
			setButtonOptions(buttonOptionsMap.configureChoice);
			setResponseMessage('Бизнес успешно зарегистрирован!');
		} catch (err) {
			const errorMessage = err.response?.data?.message || 'Ошибка при регистрации: ' + err.message;
			console.error('[handleSubmit] Error:', err);
			setError(errorMessage);
			addMessage({ sender: 'bot', text: errorMessage });
		} finally {
			setIsRegistering(false);
		}
	}, [formData, token, baseUrl]);

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

	const submitConfig = useCallback(async (addMessage) => {
		console.log('[submitConfig] Starting with businessId:', registeredBusinessId);
		console.log('[submitConfig] Config data:', configData);

		if (!registeredBusinessId) {
			const errorMsg = 'ID бизнеса не найден. Попробуйте зарегистрировать бизнес заново.';
			setConfigError(errorMsg);
			addMessage({ sender: 'bot', text: errorMsg });
			console.error('[submitConfig] No businessId');
			return;
		}

		try {
			if (configData.menu || configData.products) {
				const servicePayload = {
					moduleType: "MENU",
					customParameters: {
						displayType: "list",
						categories: ["Entrées"],
						items: [
							{
								name: "Пример продукта",
								description: "Описание примера",
								price: 10.0,
							},
						],
					},
				};
				console.log('[submitConfig] Sending service payload:', servicePayload);
				const response = await axios.post(
					`${baseUrl}/services/${registeredBusinessId}`,
					servicePayload,
					{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
				);
				console.log('[submitConfig] Service added:', response.data);
				addMessage({ sender: 'bot', text: 'Модуль успешно добавлен!' });
			}
			// Здесь можно добавить логику для других модулей (аналитика, календарь, мастера, доставка)
			addMessage({ sender: 'bot', text: 'Настройки успешно применены!' });
			setTimeout(() => {
				console.log('[submitConfig] Navigating to /Dashboard');
				navigate('/Dashboard');
			}, 2000);
		} catch (err) {
			const errorMessage = err.response?.data?.message || 'Ошибка при сохранении настроек: ' + err.message;
			console.error('[submitConfig] Error:', err);
			setConfigError(errorMessage);
			addMessage({ sender: 'bot', text: errorMessage });
		}
	}, [configData, registeredBusinessId, token, baseUrl, navigate]);

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
		} else if (registeredBusinessId && buttonOptionsMap.configureChoice.some(opt => opt.value === value)) {
			if (value === 'keep') {
				addMessage({ sender: 'bot', text: 'Отлично, бизнес зарегистрирован без дополнительных настроек!' });
				setTimeout(() => navigate('/Dashboard'), 2000);
			} else if (value === 'configure') {
				setIsConfiguring(true);
				addMessage({ sender: 'bot', text: 'Давай настроим твой бизнес. Укажи, что хочешь включить.' });
			}
			setShowButtons(false);
		} else {
			updateFormData(steps[step - 1], value);
			proceedToNextStep(addMessage);
		}
	}, [isChoosingDescription, steps, step, updateFormData, proceedToNextStep, registeredBusinessId, navigate]);

	const getBotMessage = useCallback(() => {
		if (isRegistering) return 'Регистрирую твой бизнес...';
		if (localLoading) return 'Генерирую описание...';
		if (isConfiguring) return 'Укажи, что хочешь включить в настройках.';
		if (configError) return configError;
		if (responseMessage) return responseMessage;
		if (error) return error;
		if (isChoosingDescription) return 'Какое описание ты хочешь использовать?';
		return stepQuestions[steps[step - 1]];
	}, [isRegistering, localLoading, isConfiguring, configError, responseMessage, error, isChoosingDescription, step]);

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
		setIsConfiguring(false);
		setRegisteredBusinessId(null);
		setConfigError('');
	}, []);

  const handleUpdateCompany = useCallback(async (companyId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/companies/${companyId}`,
        {}, // companyData – можно передать актуальные данные или использовать другой механизм
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
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
      console.error('[handleUpdateCompany] Ошибка:', err.response?.data || err.message);
    }
  }, []);

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
						isLoading={localLoading || isRegistering}
						startRegistration={startRegistration}
          >
            {(addMessage) => (
							<>
								{isConfiguring && (
									<div className="mt-4 p-4 bg-gray-100 rounded-lg">
										<h3 className="text-lg font-bold mb-2">Настройка бизнеса</h3>
										<div className="space-y-2">
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.analytics}
													onChange={(e) => setConfigData(prev => ({ ...prev, analytics: e.target.checked }))}
													className="mr-2"
												/>
												Аналитика
											</label>
											{formData.type === 'RESTAURANT' ? (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.menu}
														onChange={(e) => setConfigData(prev => ({ ...prev, menu: e.target.checked }))}
														className="mr-2"
													/>
													Меню
												</label>
											) : (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.products}
														onChange={(e) => setConfigData(prev => ({ ...prev, products: e.target.checked }))}
														className="mr-2"
													/>
													Товары
												</label>
											)}
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.calendar}
													onChange={(e) => setConfigData(prev => ({ ...prev, calendar: e.target.checked }))}
													className="mr-2"
												/>
												Календарь
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.masters}
													onChange={(e) => setConfigData(prev => ({ ...prev, masters: e.target.checked }))}
													className="mr-2"
												/>
												Мастера
											</label>
											{formData.type === 'RESTAURANT' && (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.delivery}
														onChange={(e) => setConfigData(prev => ({ ...prev, delivery: e.target.checked }))}
														className="mr-2"
													/>
													Доставка
												</label>
											)}
										</div>
										<button
											onClick={() => {
												console.log('[Save Button] Clicked');
												submitConfig(addMessage);
											}}
											className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
										>
											Сохранить настройки
										</button>
									</div>
								)}
							</>
            )}
          </ChatBot>
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

						{isModalOpen && (
							<div className="fixed inset-0 z-50 flex items-center justify-center">
								<div
									className="absolute inset-0 bg-black opacity-25"
									onClick={closeModal}
								></div>
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
				{ const companyId = selectedEmployee?.companyId;

				// Функция для получения данных компании
				const fetchCompanyData = useCallback(async () => {
					if (!companyId || !token) {
						setFetchError('Отсутствует ID компании или токен авторизации');
						return;
					}

					setIsFetching(true);
					setFetchError('');

					try {
						const response = await axios.get(
							`${baseUrl}/business/admin`,
							{
								headers: {
									'Authorization': `Bearer ${token}`,
									'Content-Type': 'application/json'
								}
							}
						);

						const businesses = response.data;
						const selectedCompany = businesses.find(b => b.id === companyId) || businesses[0];

						if (!selectedCompany) {
							setFetchError('Компания не найдена в списке');
							return;
						}

						const normalizedCompany = {
							id: selectedCompany.id,
							name: selectedCompany.name || 'Не указано',
							description: selectedCompany.description || 'Не указано',
							type: selectedCompany.type || selectedCompany.businessType || 'Не указано',
							theme: selectedCompany.theme || { color: 'Не указано' },
							calendar: selectedCompany.calendar || false,
							analytics: selectedCompany.analytics || false,
							telegram: selectedCompany.telegram || false,
							aiText: selectedCompany.aiText || false,
							socials: selectedCompany.socials || false,
							delivery: selectedCompany.delivery || false,
							createdAt: selectedCompany.createdAt,
							updatedAt: selectedCompany.updatedAt,
							ownerId: selectedCompany.ownerId
						};

						setCompanyDataFromApi(normalizedCompany);
						setCompanyData(normalizedCompany);
						const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
						const updatedCompanies = savedCompanies.some(c => c.id === normalizedCompany.id)
							? savedCompanies.map(c => c.id === normalizedCompany.id ? normalizedCompany : c)
							: [...savedCompanies, normalizedCompany];
						localStorage.setItem('companies', JSON.stringify(updatedCompanies));
					} catch (err) {
						const errorMessage = err.response?.data?.message || 'Ошибка при загрузке данных компании';
						setFetchError(errorMessage);
						const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
						const cachedCompany = savedCompanies.find(c => c.id === companyId);
						if (cachedCompany) {
							setCompanyDataFromApi(cachedCompany);
							setCompanyData(cachedCompany);
						}
					} finally {
						setIsFetching(false);
					}
				}, [companyId, token, baseUrl]);

				useEffect(() => {
					fetchCompanyData();
				}, [fetchCompanyData]);

				const confirmSaveChanges = () => {
					if (window.confirm('Вы уверены, что хотите сохранить изменения?')) {
						handleUpdateCompany(companyId);
					}
				};

				const formatBoolean = (value) => value === 'true' || value === true ? 'Да' : 'Нет';

				if (isFetching) {
					return <div className="p-4">Загрузка данных компании...</div>;
				}

				if (fetchError && !companyDataFromApi) {
					return <div className="p-4 text-red-600">{fetchError}</div>;
				}

				if (!companyDataFromApi) {
					return <div className="p-4">Данные компании отсутствуют</div>;
				}

        return (
					<div className="p-4">
						<h1 className="text-xl font-bold mb-4">Компания: {companyDataFromApi.name}</h1>
						{updateError && <p className="text-red-600 mb-4">{updateError}</p>}
						{updateSuccess && <p className="text-green-600 mb-4">{updateSuccess}</p>}
						{fetchError && <p className="text-red-600 mb-4">{fetchError} (используются кэшированные данные)</p>}

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
									<select
										value={companyData?.type || ''}
										onChange={(e) => setCompanyData({ ...companyData, type: e.target.value })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="SERVICE">Услуги</option>
										<option value="RESTAURANT">Ресторан</option>
										<option value="REAL_ESTATE">Недвижимость</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Цветовая тема</label>
									<select
										value={companyData?.theme?.color || ''}
										onChange={(e) => setCompanyData({ ...companyData, theme: { ...companyData.theme, color: e.target.value } })}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="blue">Синий</option>
										<option value="green">Зеленый</option>
										<option value="red">Красный</option>
									</select>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.calendar || false}
											onChange={(e) => setCompanyData({ ...companyData, calendar: e.target.checked })}
											className="mr-2"
										/>
										Календарь
									</label>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.analytics || false}
											onChange={(e) => setCompanyData({ ...companyData, analytics: e.target.checked })}
											className="mr-2"
										/>
										Аналитика
									</label>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.telegram || false}
											onChange={(e) => setCompanyData({ ...companyData, telegram: e.target.checked })}
											className="mr-2"
										/>
										Сотрудники
									</label>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.aiText || false}
											onChange={(e) => setCompanyData({ ...companyData, aiText: e.target.checked })}
											className="mr-2"
										/>
										LoryAI
									</label>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.socials || false}
											onChange={(e) => setCompanyData({ ...companyData, socials: e.target.checked })}
											className="mr-2"
										/>
										Клиенты
									</label>
								</div>
								<div>
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={companyData?.delivery || false}
											onChange={(e) => setCompanyData({ ...companyData, delivery: e.target.checked })}
											className="mr-2"
										/>
										Доставка
									</label>
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
									<strong className="font-semibold">ID:</strong> {companyDataFromApi.id}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Название:</strong> {companyDataFromApi.name}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Описание:</strong> {companyDataFromApi.description}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Тип бизнеса:</strong> {companyDataFromApi.type}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Цветовая тема:</strong> {companyDataFromApi.theme.color}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Календарь:</strong> {formatBoolean(companyDataFromApi.calendar)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Аналитика:</strong> {formatBoolean(companyDataFromApi.analytics)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Сотрудники:</strong> {formatBoolean(companyDataFromApi.telegram)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">LoryAI:</strong> {formatBoolean(companyDataFromApi.aiText)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Клиенты:</strong> {formatBoolean(companyDataFromApi.socials)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Доставка:</strong> {formatBoolean(companyDataFromApi.delivery)}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Владелец (ID):</strong> {companyDataFromApi.ownerId || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Дата создания:</strong>{' '}
									{companyDataFromApi.createdAt ? new Date(companyDataFromApi.createdAt).toLocaleString() : 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Дата обновления:</strong>{' '}
									{companyDataFromApi.updatedAt ? new Date(companyDataFromApi.updatedAt).toLocaleString() : 'Не указано'}
								</p>
								<div className="flex space-x-2">
									<button
										onClick={() => setIsEditing(true)}
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
									>
										Изменить
									</button>
									<button
										onClick={fetchCompanyData}
										className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
									>
										Обновить данные
									</button>
								</div>
							</div>
						)}
					</div>
        ); }
      default:
        return   <Content
		token={localStorage.getItem('token')}
		baseUrl={import.meta.env.VITE_API_BASE_URL}
		selectedEmployee={selectedEmployee}
		handleUpdateCompany={handleUpdateCompany}
	  />;
    }
  };

  return (
    <main
      ref={mainRef}
      onClick={() => setIsSwiped(true)}
      className={`md:fixed rounded-br-2xl bg-white pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'} ${!isSidebarOpen ? 'md:hidden' : 'md:block'} md:translate-x-0 z-10`}
    >
      {isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
    </main>
  );
});

export default MainContent;
