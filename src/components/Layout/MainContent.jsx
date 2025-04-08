import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatBot from '../../components/chatBot';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

export const MainContent = memo(({ selectedMenu, isLoading = false, isSidebarOpen, setIsSidebarOpen, selectedEmployee }) => {
	const mainRef = useRef(null);
	const navigate = useNavigate();
	const [isSwiped, setIsSwiped] = useState(false); // Новое состояние для свайпа

	const [companyData, setCompanyData] = useState(null);
	const [updateError, setUpdateError] = useState('');
	const [updateSuccess, setUpdateSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Состояние для регистрации бизнеса
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

	const handleSwipeRight = () => {
		setIsSwiped(true); // Устанавливаем состояние свайпа вправо
	};

	const handleSwipeToggle = () => {
		setIsSwiped((prev) => !prev); // Переключение состояния
	};

	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		mainRef.current.startX = touch.clientX;
	};

	const handleTouchMove = (e) => {
		const touch = e.touches[0];
		const deltaX = touch.clientX - mainRef.current.startX;
		if (deltaX > 50) setIsSwiped(true); // Свайп вправо при движении на 50px
	};

	const steps = [
		'name', 'businessTerm', 'city', 'street', 'workTime', 'holidays',
		'description', 'descriptionAI', 'logo', 'calendar', 'analytics',
		'telegram', 'aiText', 'socials', 'delivery',
	];

	const stepQuestions = {
		name: 'Как называется твой бизнес? (обязательное поле)',
		businessTerm: 'Какой тег подходит твоему бизнесу? Выбери: "Краткосрочный" или "Долгосрочный" (обязательное поле)',
		city: 'В каком городе находится твой бизнес?',
		street: 'Укажи улицу и номер дома.',
		workTime: 'Какой у тебя режим работы? (например, "Пн-Пт 9:00-18:00")',
		holidays: 'Какие у тебя выходные? Выбери: "Суббота" или "Воскресенье"',
		description: 'Расскажи немного о своем бизнесе.',
		descriptionAI: 'Хочешь, чтобы я сгенерировал описание для твоего бизнеса? Напиши "да" или "нет".',
		logo: 'Пришли файл логотипа или напиши "нет", если его пока нет.',
		calendar: 'Нужен ли календарь бронирования? (да/нет)',
		analytics: 'Хочешь включить аналитику? (да/нет)',
		telegram: 'Подключить сотрудников через Telegram? (да/нет)',
		aiText: 'Использовать генерацию текста ИИ? (да/нет)',
		socials: 'Подключить клиентов через соцсети? (да/нет)',
		delivery: 'Нужна ли доставка? (да/нет)',
	};

	const validationRules = {
		businessTerm: ['Краткосрочный', 'Долгосрочный'],
		holidays: ['Суббота', 'Воскресенье'],
	};

	const products = [
		{
			id: 1,
			image: '/images/cherry.jpeg',
			title: 'Зимняя вишня',
			description: 'Стрижка женская, Яркий акцент на челке, стильный рисунок сзади.',
			price: 650,
		},
		{
			id: 2,
			image: '/images/crop.jpeg',
			title: 'Кроп',
			description: 'Стрижка мужская. стильная. подойдет для многих мужчин',
			price: 650,
		},
		{
			id: 3,
			image: '/images/mallet.jpeg',
			title: 'Маллет',
			description: 'Стрижка мужская. самая крутая. подойдет для всех',
			price: 650,
		},
	];

	const handleChatSubmit = async (userInput, addMessage) => {
		const currentField = steps[step - 1];
		const trimmedInput = userInput.trim();

		if (isReenteringDescription) {
			if (trimmedInput.toLowerCase() === 'да') {
				await generateDescriptionAI(addMessage);
			} else {
				setFormData((prev) => ({ ...prev, description: trimmedInput }));
				await generateDescriptionAI(addMessage);
			}
			setIsReenteringDescription(false);
			return;
		}

		if (!validateInput(currentField, trimmedInput)) return;

		updateFormData(currentField, trimmedInput);

		if (currentField === 'descriptionAI' && trimmedInput.toLowerCase() === 'да') {
			await generateDescriptionAI(addMessage);
			return;
		}

		proceedToNextStepOrSubmit(addMessage);
	};

	const validateInput = (field, input) => {
		if (field === 'name' && !input) {
			setError('Название бизнеса обязательно.');
			return false;
		}
		if (validationRules[field] && !validationRules[field].includes(input)) {
			setError(`Выбери одну из опций: "${validationRules[field].join('" или "')}".`);
			return false;
		}
		setError('');
		return true;
	};

	const updateFormData = (field, value) => {
		const booleanFields = ['calendar', 'analytics', 'telegram', 'aiText', 'socials', 'delivery'];
		setFormData((prev) => ({
			...prev,
			[field]: booleanFields.includes(field) ? value.toLowerCase() === 'да' : value,
			...(field === 'logo' && { logo: value === 'нет' ? null : value }),
		}));
	};

	const proceedToNextStepOrSubmit = (addMessage) => {
		if (step < steps.length) {
			setStep((prev) => prev + 1);
			addMessage({ sender: 'bot', text: stepQuestions[steps[step]] });
		} else {
			handleSubmit(addMessage);
		}
	};

	const handleSubmit = async (addMessage) => {
		setIsRegistering(true);
		setResponseMessage('');
		setError('');

		const token = localStorage.getItem('token');
		if (!token) {
			setError('Требуется авторизация. Пожалуйста, войдите.');
			addMessage({ sender: 'bot', text: 'Требуется авторизация. Пожалуйста, войдите.' });
			setIsRegistering(false);
			return;
		}

		const formPayload = createFormPayload();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/companies`,
				formPayload,
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
			);
			addMessage({ sender: 'bot', text: 'Бизнес успешно зарегистрирован!' });
			setResponseMessage('Бизнес успешно зарегистрирован!');
			setTimeout(() => navigate('/Dashboard'), 2000);
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при регистрации.');
			addMessage({ sender: 'bot', text: err.response?.data?.message || 'Ошибка при регистрации.' });
		} finally {
			setIsRegistering(false);
		}
	};

	const createFormPayload = () => {
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, typeof value === 'boolean' ? value.toString() : value || '');
		});
		return data;
	};

	const generateDescriptionAI = async (addMessage) => {
		setLocalLoading(true);
		try {
			const response = await axios.post(
				'https://my-vercel-server-seven.vercel.app/api/generate_description',
				{ company_name: formData.name, industry: formData.businessType, description: formData.description },
				{ headers: { 'Content-Type': 'application/json', Authorization: `Bearer a8f3cd34d3ad67e1f4b3f1a8d3cc432f9b2f9c9ac4d84c79e0d40a8c9ef0c8dd` } }
			);
			const generatedText = response.data.text;
			setFormData((prev) => ({ ...prev, descriptionAI: generatedText }));
			addMessage({ sender: 'bot', text: 'Вот что я сгенерировал для твоего бизнеса:' });
			addMessage({ sender: 'bot', text: generatedText });
			addMessage({ sender: 'bot', text: 'Оставить это описание или поменять? Напиши "оставить" или "поменять".' });
			setShowDescriptionButtons(true);
			localStorage.setItem('descBusiness', generatedText);
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка генерации описания.');
			addMessage({ sender: 'bot', text: err.response?.data?.message || 'Ошибка генерации описания.' });
		} finally {
			setLocalLoading(false);
		}
	};

	const handleDescriptionChoice = (choice, addMessage) => {
		if (choice === 'оставить') {
			setShowDescriptionButtons(false);
			setStep((prev) => prev + 1);
			addMessage({ sender: 'bot', text: stepQuestions[steps[step]] });
		} else if (choice === 'поменять') {
			setFormData((prev) => ({ ...prev, descriptionAI: '' }));
			setShowDescriptionButtons(false);
			setIsReenteringDescription(true);
			setStep((prev) => prev - 1);
			addMessage({ sender: 'bot', text: 'Введи новое описание для генерации или напиши "да" для повторной генерации.' });
		}
	};

	const getBotMessage = () => {
		if (isRegistering) return 'Регистрирую твой бизнес...';
		if (responseMessage) return responseMessage;
		if (error) return error;
		if (isReenteringDescription) return 'Введи новое описание для генерации или напиши "да" для повторной генерации.';
		if (showDescriptionButtons) return 'Оставить это описание или поменять? Напиши "оставить" или "поменять".';
		return stepQuestions[steps[step - 1]];
	};

	const handleCustomInput = (input, addMessage) => {
		if (showDescriptionButtons) {
			handleDescriptionChoice(input.trim().toLowerCase(), addMessage);
		} else {
			handleChatSubmit(input, addMessage);
		}
	};

	const startRegistration = () => {
		setStep(1);
		setFormData({
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
		setIsRegistering(false);
		setResponseMessage('');
		setError('');
		setShowDescriptionButtons(false);
		setIsReenteringDescription(false);
	};

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
			console.error('Ошибка при обновлении компании:', err);
			setUpdateError('Произошла ошибка при обновлении данных. Попробуйте снова.');
			setUpdateSuccess('');
		}
	};

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
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{products.map((product) => (
								<div
									key={product.id}
									className="bg-white rounded-2xl shadow-md overflow-hidden"
								>
									<img
										src={product.image}
										alt={product.title}
										className="w-full h-60 object-cover rounded-t-lg"
									/>
									<div className="p-4 bg-[#F6F7F8] rounded-2xl">
										<h3 className="text-lg font-semibold text-gray-800">
											{product.title}
										</h3>
										<p className="text-sm text-gray-600 mt-1">
											{product.description}
										</p>
										<p className="text-lg font-bold text-gray-800 mt-2">
											{product.price} ₽
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'Business':
				const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
				const companyId = selectedEmployee?.companyId;
				const company = savedCompanies.find((c) => c.id === companyId);

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
										onChange={(e) =>
											setCompanyData({ ...companyData, name: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Сфера</label>
									<input
										type="text"
										value={companyData?.businessType || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, businessType: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Описание</label>
									<textarea
										value={companyData?.description || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, description: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
										rows="3"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Город</label>
									<input
										type="text"
										value={companyData?.city || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, city: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Улица</label>
									<input
										type="text"
										value={companyData?.street || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, street: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Режим работы</label>
									<input
										type="text"
										value={companyData?.workTime || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, workTime: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Выходные</label>
									<input
										type="text"
										value={companyData?.holidays || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, holidays: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Описание от ИИ</label>
									<textarea
										value={companyData?.descriptionAI || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, descriptionAI: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
										rows="3"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Логотип (URL)</label>
									<input
										type="text"
										value={companyData?.logo || ''}
										onChange={(e) =>
											setCompanyData({ ...companyData, logo: e.target.value })
										}
										className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Календарь</label>
									<input
										type="checkbox"
										checked={companyData?.calendar === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, calendar: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Аналитика</label>
									<input
										type="checkbox"
										checked={companyData?.analytics === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, analytics: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Сотрудники</label>
									<input
										type="checkbox"
										checked={companyData?.telegram === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, telegram: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">LoryAI</label>
									<input
										type="checkbox"
										checked={companyData?.aiText === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, aiText: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Клиенты</label>
									<input
										type="checkbox"
										checked={companyData?.socials === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, socials: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Товары</label>
									<input
										type="checkbox"
										checked={companyData?.delivery === 'true'}
										onChange={(e) =>
											setCompanyData({ ...companyData, delivery: e.target.checked ? 'true' : 'false' })
										}
										className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
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
									<strong className="font-semibold">Сфера:</strong> {company.businessType || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Описание:</strong> {company.description || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Город:</strong> {company.city || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Улица:</strong> {company.street || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Режим работы:</strong> {company.workTime || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Выходные:</strong> {company.holidays || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Описание от ИИ:</strong> {company.descriptionAI || 'Не указано'}
								</p>
								<p className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Логотип:</strong>{' '}
									{company.logo ? (
										<a href={company.logo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
											Ссылка
										</a>
									) : (
										'Не указано'
									)}
								</p>
								<p className={`text-base mb-3 ${company.calendar === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">Календарь:</strong> {company.calendar === 'true' ? 'Да' : 'Нет'}
								</p>
								<p className={`text-base mb-3 ${company.analytics === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">Аналитика:</strong> {company.analytics === 'true' ? 'Да' : 'Нет'}
								</p>
								<p className={`text-base mb-3 ${company.telegram === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">Сотрудники:</strong> {company.telegram === 'true' ? 'Да' : 'Нет'}
								</p>
								<p className={`text-base mb-3 ${company.aiText === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">LoryAI:</strong> {company.aiText === 'true' ? 'Да' : 'Нет'}
								</p>
								<p className={`text-base mb-3 ${company.socials === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">Клиенты:</strong> {company.socials === 'true' ? 'Да' : 'Нет'}
								</p>
								<p className={`text-base mb-3 ${company.delivery === 'true' ? 'text-green-600' : 'text-gray-800'}`}>
									<strong className="font-semibold">Товары:</strong> {company.delivery === 'true' ? 'Да' : 'Нет'}
								</p>
								<div className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Филиалы:</strong>
									{company.branches && company.branches.length > 0 ? (
										<ul className="list-disc pl-4 mt-1">
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
								<div className="text-base text-gray-800 mb-3">
									<strong className="font-semibold">Сотрудники:</strong>
									{company.members && company.members.length > 0 ? (
										<ul className="list-disc pl-4 mt-1">
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
			onClick={handleSwipeRight}
			className={`md:fixed rounded-br-2xl bg-white pr-4 md:pt-2 md:px-6 md:left-0 w-screen md:w-[calc(100vw-17rem)] h-[calc(100vh-136px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'
				} ${!isSidebarOpen ? 'md:hidden' : 'md:block'} md:translate-x-0 z-10`}
		>
			{isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
		</main>
	);
})

export default MainContent;