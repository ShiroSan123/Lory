import { useState, useEffect, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import ChatBot from '../../components/chatBot';
import { useNavigate } from 'react-router-dom';
import BusinessContent from './BusinessContent';
import Content from './Content';
import { useTheme } from '../../ThemeContext';

export const MainContent = memo(({
	selectedMenu,
	isLoading = false,
	isSidebarOpen,
	setIsSidebarOpen,
	selectedEmployee,
	selectedCompany,
	selectedService
}) => {
	const mainRef = useRef(null);
	const navigate = useNavigate();
	const [isSwiped, setIsSwiped] = useState(false);
	const { theme } = useTheme(); // Получаем текущую тему

	const [companyData, setCompanyData] = useState(null);
	const [updateError, setUpdateError] = useState('');
	const [updateSuccess, setUpdateSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	const [companyDataFromApi, setCompanyDataFromApi] = useState(null);
	const [fetchError, setFetchError] = useState('');
	const [isFetching, setIsFetching] = useState(false);

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

	// Остальные состояния
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
			{ label: 'Ресторан', value: 'CATERING' },
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
				{},
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
									<div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
										}`}>
										<h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
											}`}>Настройка бизнеса</h3>
										<div className="space-y-2">
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.analytics}
													onChange={(e) => setConfigData(prev => ({ ...prev, analytics: e.target.checked }))}
													className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
														}`}
												/>
												<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Аналитика</span>
											</label>
											{formData.type === 'CATERING' ? (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.menu}
														onChange={(e) => setConfigData(prev => ({ ...prev, menu: e.target.checked }))}
														className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
															}`}
													/>
													<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Меню</span>
												</label>
											) : (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.products}
														onChange={(e) => setConfigData(prev => ({ ...prev, products: e.target.checked }))}
														className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
															}`}
													/>
													<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Товары</span>
												</label>
											)}
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.calendar}
													onChange={(e) => setConfigData(prev => ({ ...prev, calendar: e.target.checked }))}
													className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
														}`}
												/>
												<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Календарь</span>
											</label>
											<label className="flex items-center">
												<input
													type="checkbox"
													checked={configData.masters}
													onChange={(e) => setConfigData(prev => ({ ...prev, masters: e.target.checked }))}
													className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
														}`}
												/>
												<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Мастера</span>
											</label>
											{formData.type === 'CATERING' && (
												<label className="flex items-center">
													<input
														type="checkbox"
														checked={configData.delivery}
														onChange={(e) => setConfigData(prev => ({ ...prev, delivery: e.target.checked }))}
														className={`mr-2 ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
															}`}
													/>
													<span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Доставка</span>
												</label>
											)}
										</div>
										<button
											onClick={() => {
												console.log('[Save Button] Clicked');
												submitConfig(addMessage);
											}}
											className={`mt-4 px-4 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
												}`}
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
			case 'Клиенты':
				return (
					<div className="p-4">
						{selectedMenu === 'Клиенты' && (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
									}`}>
									<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
										}`}>11 410</h2>
									<p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
										}`}>Клиенты за 6 мес.</p>
								</div>
								<div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
									}`}>
									<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
										}`}>2 129</h2>
									<p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
										}`}>Постоянные</p>
								</div>
								<div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
									}`}>
									<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
										}`}>4 738</h2>
									<p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
										}`}>Потенциальные (менее 3 посещений)</p>
								</div>
								<div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
									}`}>
									<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
										}`}>4 543</h2>
									<p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
										}`}>Общо по посещению за 6 мес.</p>
								</div>
							</div>
						)}
						<div className="overflow-x-auto">
							<table className={`min-w-full rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
								}`}>
								<thead>
									<tr className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}></th>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}>Клиент</th>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}>Телефон</th>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}>Посещений</th>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}>Отмененные</th>
										<th className={`px-4 py-2 text-left text-sm font-medium border-b ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-200'
											}`}>Выручка</th>
									</tr>
								</thead>
								<tbody>
									<tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
										<td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
											}`}>
											<input
												type="checkbox"
												className={`h-4 w-4 rounded ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
													}`}
											/>
										</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>Владимир Трубиков</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>+7 914 218-30-18</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>2</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>0</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>1 000</td>
									</tr>
									<tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
										<td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
											}`}>
											<input
												type="checkbox"
												className={`h-4 w-4 rounded ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
													}`}
											/>
										</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>Григорий Акаев</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>+7 924 664-33-35</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>33</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>10</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>36 478</td>
									</tr>
									<tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
										<td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
											}`}>
											<input
												type="checkbox"
												className={`h-4 w-4 rounded ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
													}`}
												checked
											/>
										</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>Павел Буздарь</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>+7 964 432-85-36</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>15</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>5</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>69 000</td>
									</tr>
									<tr className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
										<td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
											}`}>
											<input
												type="checkbox"
												className={`h-4 w-4 rounded ${theme === 'dark' ? 'text-blue-400 border-gray-500' : 'text-blue-600 border-gray-300'
													}`}
												checked
											/>
										</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>Ханалыев Ленат</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>+7 962 724-88-34</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>4</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>0</td>
										<td className={`px-4 py-2 border-b text-sm ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-200'
											}`}>10 000</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			case 'Аналитика':
				return <h1 className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Аналитика</h1>;
			case 'Календарь':
				return <h1 className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Календарь</h1>;
			case 'Товары':
				return (
					<div className="p-4">
						<h1 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'
							}`}>Товары</h1>
						{companies.length === 0 ? (
							<p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Компании не найдены или данные загружаются...</p>
						) : (
							companies.map(company => (
								<div key={company.id} className="mb-6">
									<h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
										}`}>{company.name}</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
										{(services[company.id] || []).length > 0 ? (
											services[company.id].map((service, index) => (
												<div
													key={index}
													className={`rounded-2xl shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'
														}`}
												>
													<img
														src="/images/placeholder.jpg"
														alt={service.name || 'Товар'}
														className="w-full h-60 object-cover rounded-t-lg"
													/>
													<div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'
														}`}>
														<h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
															}`}>
															{service.name || 'Без названия'}
														</h3>
														<p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
															}`}>
															{service.description || 'Описание отсутствует'}
														</p>
														<p className={`text-lg font-bold mt-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
															}`}>
															{service.price ? `${service.price} ₽` : 'Цена не указана'}
														</p>
													</div>
												</div>
											))
										) : (
											<p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Товары для {company.name} отсутствуют.</p>
										)}
									</div>
									<button
										onClick={() => openModalForService(company.id)}
										className={`mt-4 px-4 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
											}`}
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
								<div className={`relative rounded-lg shadow-lg p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
									}`}>
									<h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'
										}`}>Добавить новый товар</h2>
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
											<label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
												}`}>Название</label>
											<input
												type="text"
												name="name"
												defaultValue=""
												className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
													}`}
												required
											/>
										</div>
										<div className="mb-4">
											<label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
												}`}>Описание</label>
											<textarea
												name="description"
												defaultValue=""
												className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
													}`}
												rows="3"
												required
											/>
										</div>
										<div className="mb-4">
											<label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
												}`}>Цена (₽)</label>
											<input
												type="number"
												name="price"
												defaultValue=""
												step="0.01"
												className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
													}`}
												required
											/>
										</div>
										<div className="flex justify-end space-x-2">
											<button
												type="button"
												onClick={closeModal}
												className={`px-4 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'
													}`}
											>
												Отмена
											</button>
											<button
												type="submit"
												className={`px-4 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
													}`}
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
				{
					const companyId = selectedCompany.companyId;
					console.log("Business: ", companyId);
					return (
						<BusinessContent
							token={localStorage.getItem("token")}
							baseUrl={import.meta.env.VITE_API_BASE_URL}
							companyId={companyId}
						/>
					);
				}
			case 'Menu':
				{
					const selectedServiceId = selectedService.serviceId;
					const index = selectedService.index;
					console.log("menu2: ", selectedService);
					return (
						<BusinessContent
							token={localStorage.getItem("token")}
							baseUrl={import.meta.env.VITE_API_BASE_URL}
							selectedServiceId={selectedServiceId}
							index={index}
						/>
					);
				}
			default:
				return (
					<Content
						token={localStorage.getItem('token')}
						baseUrl={import.meta.env.VITE_API_BASE_URL}
						selectedEmployee={selectedEmployee}
						handleUpdateCompany={handleUpdateCompany}
					/>
				);
		}
	};

	return (
		<main
			ref={mainRef}
			onClick={() => setIsSwiped(true)}
			className={`md:fixed rounded-br-2xl pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'
				} ${!isSidebarOpen ? 'md:hidden' : 'md:block'} md:translate-x-0 z-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
				}`}
		>
			{isLoading ? (
				<div className="p-4">Loading...</div>
			) : renderMainContent()}
		</main>
	);
});

export default MainContent;