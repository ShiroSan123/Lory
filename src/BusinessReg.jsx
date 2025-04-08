// import React, { useState } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';
// import LogoIcon from '/Logo-ico.svg';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const BusinessRegistration = () => {
// 	const token = localStorage.getItem('token');
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [localLoading, setLocalLoading] = useState(false); // Для загрузки в descAI
// 	const [step, setStep] = useState(1);
// 	const [formData, setFormData] = useState({
// 		businessName: '',
// 		businessType: '',
// 		businessTerm: '',
// 		address: '',
// 		city: '',
// 		street: '',
// 		workEmail: '',
// 		workTime: '',
// 		holidays: '',
// 		description: '',
// 		descriptionAI: '', // Поле для сгенерированного описания
// 		logo: null,
// 		calendar: false,
// 		analytics: false,
// 		telegram: false,
// 		aiText: false,
// 		socials: false,
// 		delivery: false,
// 	});
// 	const [responseMessage, setResponseMessage] = useState('');
// 	const [error, setError] = useState('');
// 	const steps = ['Начало', 'Информация', 'Описание', 'Логотип', 'Конструктор'];
// 	const navigate = useNavigate();

// 	const handleChange = (e) => {
// 		const { name, value, type, files } = e.target;
// 		if (type === 'file') {
// 			setFormData({ ...formData, [name]: files[0] });
// 		} else {
// 			setFormData({ ...formData, [name]: value });
// 		}
// 	};

// 	const nextStep = () => setStep(step + 1);
// 	const prevStep = () => setStep(step - 1);
// 	const goToStep = (stepIndex) => setStep(stepIndex);

// 	const handleSubmit = async () => {
// 		setIsLoading(true);
// 		setResponseMessage('');
// 		setError('');

// 		if (!token) {
// 			setError('Authorization token is missing. Please log in.');
// 			setIsLoading(false);
// 			return;
// 		}

// 		// Создаем объект FormData и добавляем все поля из formData
// 		const data = new FormData();
// 		data.append('name', formData.businessName);
// 		data.append('description', formData.description || '');
// 		data.append('businessType', formData.businessType || '');
// 		data.append('businessTerm', formData.businessTerm || '');
// 		data.append('city', formData.city || '');
// 		data.append('street', formData.street || '');
// 		data.append('workTime', formData.workTime || '');
// 		data.append('holidays', formData.holidays || '');
// 		data.append('descriptionAI', formData.descriptionAI || '');

// 		// Добавляем файл logo, если он есть
// 		if (formData.logo) {
// 			data.append('logo', formData.logo);
// 		}

// 		// Добавляем булевы значения (преобразуем в строки, так как FormData работает со строками)
// 		data.append('calendar', formData.calendar.toString());
// 		data.append('analytics', formData.analytics.toString());
// 		data.append('telegram', formData.telegram.toString());
// 		data.append('aiText', formData.aiText.toString());
// 		data.append('socials', formData.socials.toString());
// 		data.append('delivery', formData.delivery.toString());


// 		try {
// 			const response = await axios.post(
// 				`${import.meta.env.VITE_API_BASE_URL}/companies`,
// 				data,
// 				{
// 					headers: {
// 						'Authorization': `Bearer ${token}`,
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			);
// 			setResponseMessage('Business registered successfully!');
// 			console.log('Response:', response.data);
// 			setTimeout(() => navigate('/Dashboard'), 2000);
// 		} catch (err) {
// 			setError(err.response?.data?.message || 'Something went wrong. Please try again.');
// 			console.error('Error details:', err.response?.data);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	const descAI = async (e) => {
// 		e.preventDefault();
// 		setLocalLoading(true);
// 		setResponseMessage('');
// 		setError('');

// 		const data = {
// 			company_name: formData.businessName, // Используем businessName
// 			industry: formData.businessType,     // Используем businessType
// 			description: formData.description,
// 		};

// 		try {
// 			const response = await axios.post(
// 				'https://my-vercel-server-seven.vercel.app/api/generate_description',
// 				data,
// 				{
// 					headers: {
// 						'Content-Type': 'application/json',
// 						'Authorization': `Bearer a8f3cd34d3ad67e1f4b3f1a8d3cc432f9b2f9c9ac4d84c79e0d40a8c9ef0c8dd`,
// 					},
// 				}
// 			);
// 			const { text } = response.data;
// 			setFormData((prev) => ({ ...prev, descriptionAI: text })); // Сохраняем сгенерированное описание
// 			setResponseMessage('Description generated successfully!');
// 			localStorage.setItem('descBusiness', text);
// 		} catch (err) {
// 			setError(err.response?.data?.message || 'Failed to generate description.');
// 			console.error('Error details:', err.response?.data);
// 		} finally {
// 			setLocalLoading(false);
// 		}
// 	};

// 	const handleRadioToggle = (name) => {
// 		setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
// 	};

// 	const Logo = () => (
// 		<div className="flex justify-center items-center mb-8">
// 			<div className="flex-col gap-4 items-center text-center space-x-3">
// 				<img src={LogoIcon} alt="Lory Logo" className="w-80 h-80" />
// 				<span className="text-3xl font-bold text-black">LoryCRM</span>
// 			</div>
// 		</div>
// 	);

// 	const isStepValid = () => {
// 		if (step === 2) return formData.businessName && formData.businessType !== '';
// 		return true;
// 	};

// 	const renderStep = () => {
// 		switch (step) {
// 			case 1:
// 				return (
// 					<div className="text-center flex-col">
// 						<Logo />
// 						<h2 className="text-xl font-semibold text-black mt-6">Добро пожаловать!</h2>
// 						<p className="text-[#858585] w-1/2 mx-auto text-[18px]">
// 							Введите данные о своем бизнесе и начинайте работать в Lory
// 						</p>
// 					</div>
// 				);
// 			case 2:
// 				return (
// 					<div className="grid gap-8">
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Основная информация</h2>
// 							<div className="space-y-4">
// 								<input
// 									type="text"
// 									name="businessName"
// 									value={formData.businessName}
// 									onChange={handleChange}
// 									placeholder="Название бизнеса *"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								/>
// 								<select
// 									name="businessType"
// 									value={formData.businessType}
// 									onChange={handleChange}
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								>
// 									<option value="">Сфера бизнеса *</option>
// 									<option value="RESTAURANT">Общепит</option>
// 									<option value="SERVICES">Услуги</option>
// 									<option value="REAL_ESTATE">Недвижимость</option>
// 								</select>
// 								<select
// 									name="businessTerm"
// 									value={formData.businessTerm}
// 									onChange={handleChange}
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								>
// 									<option value="">Теги бизнеса *</option>
// 									<option value="short">Краткосрочный</option>
// 									<option value="long">Долгосрочный</option>
// 								</select>
// 							</div>
// 						</div>
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Адрес</h2>
// 							<div className="space-y-4">
// 								<input
// 									type="text"
// 									name="city"
// 									value={formData.city}
// 									onChange={handleChange}
// 									placeholder="Город"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								/>
// 								<input
// 									type="text"
// 									name="street"
// 									value={formData.street}
// 									onChange={handleChange}
// 									placeholder="Улица и дом"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								/>
// 							</div>
// 						</div>
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Режим работы</h2>
// 							<div className="space-y-4">
// 								<input
// 									type="text"
// 									name="workTime"
// 									value={formData.workTime}
// 									onChange={handleChange}
// 									placeholder="Время *"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								/>
// 								<select
// 									name="holidays"
// 									value={formData.holidays}
// 									onChange={handleChange}
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								>
// 									<option value="">Выходные *</option>
// 									<option value="saturday">Суббота</option>
// 									<option value="sunday">Воскресенье</option>
// 								</select>
// 							</div>
// 						</div>
// 					</div>
// 				);
// 			case 3:
// 				return (
// 					<div className="grid gap-8">
// 						<h2 className="text-xl font-semibold text-black mb-6">Описание</h2>
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Описание бизнеса</h2>
// 							<div className="space-y-4">
// 								<input
// 									type="text"
// 									name="description"
// 									value={formData.description}
// 									onChange={handleChange}
// 									placeholder="Описание бизнеса"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 								/>
// 							</div>
// 						</div>
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Генерация ИИ</h2>
// 							<form onSubmit={descAI} className="space-y-4">
// 								<input
// 									type="text"
// 									name="businessName"
// 									value={formData.businessName}
// 									onChange={handleChange}
// 									placeholder="Название компании"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 									required
// 								/>
// 								<input
// 									type="text"
// 									name="businessType"
// 									value={formData.businessType}
// 									onChange={handleChange}
// 									placeholder="Сфера бизнеса"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 									required
// 								/>
// 								<input
// 									type="text"
// 									name="description"
// 									value={formData.description}
// 									onChange={handleChange}
// 									placeholder="Краткое описание"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
// 									required
// 								/>
// 								<button
// 									type="submit"
// 									disabled={localLoading}
// 									className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${localLoading ? 'bg-[#9CA3AF] cursor-not-allowed' : 'bg-[#0A80E8] hover:bg-[#2563EB]'
// 										}`}
// 								>
// 									{localLoading ? 'Генерация...' : 'Сгенерировать описание'}
// 								</button>
// 								{formData.descriptionAI && (
// 									<div className="mt-4">
// 										<label className="text-base font-medium text-gray-700">Сгенерированное описание:</label>
// 										<textarea
// 											name="descriptionAI"
// 											value={formData.descriptionAI}
// 											onChange={handleChange}
// 											className="w-full p-2 border border-[#E5E7EB] rounded text-base"
// 											rows="4"
// 											placeholder="Сгенерированное описание появится здесь"
// 										/>
// 									</div>
// 								)}
// 							</form>
// 						</div>
// 					</div>
// 				);
// 			case 4:
// 				return (
// 					<div className="grid gap-8">
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Логотип бизнеса</h2>
// 							<div className="space-y-4">
// 								<label
// 									htmlFor="logo-upload"
// 									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] flex items-center cursor-pointer hover:border-[#3B82F6]"
// 								>
// 									<svg
// 										className="w-5 h-5 mr-2 text-[#9CA3AF]"
// 										fill="none"
// 										stroke="currentColor"
// 										viewBox="0 0 24 24"
// 									>
// 										<path
// 											strokeLinecap="round"
// 											strokeLinejoin="round"
// 											strokeWidth="2"
// 											d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 00-5.656-5.656L7 9.172V7H5v5.172l5.172-5.172a6 6 0 018.486 8.486L12 21.828a4 4 0 01-5.656-5.656L13.172 9H9V7h6.172z"
// 										/>
// 									</svg>
// 									Прикрепить логотип бизнеса
// 								</label>
// 								<input
// 									id="logo-upload"
// 									type="file"
// 									name="logo"
// 									onChange={handleChange}
// 									className="hidden"
// 								/>
// 							</div>
// 						</div>
// 						<button
// 							onClick={nextStep}
// 							disabled={!isStepValid()}
// 							className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${isStepValid() ? 'bg-[#0A80E8] hover:bg-[#2563EB]' : 'bg-[#9CA3AF] cursor-not-allowed'
// 								}`}
// 						>
// 							Выбрать
// 						</button>
// 					</div>
// 				);
// 			case 5:
// 				return (
// 					<div className="grid gap-8">
// 						<div className="p-6 rounded-[16px] border border-gray-200">
// 							<h2 className="text-xl font-medium text-black mb-6">Функциональность</h2>
// 							<div className="space-y-6">
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Календарь бронирования</label>
// 									<input
// 										type="checkbox"
// 										name="calendar"
// 										checked={formData.calendar}
// 										onChange={() => handleRadioToggle('calendar')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Аналитика</label>
// 									<input
// 										type="checkbox"
// 										name="analytics"
// 										checked={formData.analytics}
// 										onChange={() => handleRadioToggle('analytics')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 								{/* Добавляем остальные чекбоксы, которые были опущены в исходном коде */}
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Telegram</label>
// 									<input
// 										type="checkbox"
// 										name="telegram"
// 										checked={formData.telegram}
// 										onChange={() => handleRadioToggle('telegram')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Генерация ИИ</label>
// 									<input
// 										type="checkbox"
// 										name="aiText"
// 										checked={formData.aiText}
// 										onChange={() => handleRadioToggle('aiText')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Соцсети</label>
// 									<input
// 										type="checkbox"
// 										name="socials"
// 										checked={formData.socials}
// 										onChange={() => handleRadioToggle('socials')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
// 									<label className="text-base font-medium text-gray-700">Доставка</label>
// 									<input
// 										type="checkbox"
// 										name="delivery"
// 										checked={formData.delivery}
// 										onChange={() => handleRadioToggle('delivery')}
// 										className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				);
// 			default:
// 				return null;
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] p-4">
// 			<div className="max-w-[720px] w-full pb-5">
// 				<h1 className="text-2xl text-left">Мои бизнесы</h1>
// 			</div>
// 			<div className="w-full max-w-3xl">
// 				<div className="flex items-center justify-between max-w-[720px] mx-auto mb-6 relative">
// 					{steps.map((label, index) => {
// 						const stepIndex = index + 1;
// 						const isCompleted = step > stepIndex;
// 						const isCurrent = step === stepIndex;
// 						return (
// 							<div
// 								key={label}
// 								onClick={() => goToStep(stepIndex)}
// 								className="flex-1 flex gap-2 items-center relative cursor-pointer"
// 							>
// 								<div
// 									className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'border-[#00A445]' : isCurrent ? '' : ''
// 										} z-10`}
// 								>
// 									<span
// 										className={`text-[14px] font-medium ${isCompleted ? 'text-[#00A445]' : isCurrent ? '' : ''}`}
// 									>
// 										{isCompleted ? '✓' : stepIndex}
// 									</span>
// 								</div>
// 								<span className={`text-xs text-center ${isCompleted ? 'text-[#00A445]' : 'text-black'}`}>
// 									{label}
// 								</span>
// 							</div>
// 						);
// 					})}
// 				</div>
// 				<div>
// 					{renderStep()}
// 					<div className="flex-col text-center justify-between mt-6">
// 						{responseMessage && <p className="text-green-600 text-center mb-4">{responseMessage}</p>}
// 						{error && <p className="text-red-600 text-center mb-4">{error}</p>}
// 						<button
// 							onClick={step === 5 ? handleSubmit : nextStep}
// 							disabled={!isStepValid() || isLoading}
// 							className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${isStepValid() && !isLoading
// 								? 'bg-[#0A80E8] hover:bg-[#2563EB]'
// 								: 'bg-[#9CA3AF] cursor-not-allowed'
// 								} ${step > 1 ? 'ml-auto w-auto px-6' : ''}`}
// 						>
// 							{isLoading ? 'Loading...' : step === 1 ? 'Перейти к регистрации' : step === 5 ? 'Зарегистрировать' : 'Далее'}
// 						</button>
// 						{step === 1 && (
// 							<p className="text-[#858585] text-[14px]">Если вы сотрудник, то обратитесь к начальству</p>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default BusinessRegistration;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusinessRegistration = () => {
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

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
	const [isLoading, setIsLoading] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');
	const [error, setError] = useState('');
	const [showDescriptionButtons, setShowDescriptionButtons] = useState(false);
	const [isReenteringDescription, setIsReenteringDescription] = useState(false); // Новое состояние для повторного ввода описания

	const steps = [
		'name', 'businessTerm', 'city', 'street', 'workTime', 'holidays',
		'description', 'descriptionAI', 'logo', 'calendar', 'analytics',
		'telegram', 'aiText', 'socials', 'delivery',
	];

	const stepQuestions = {
		name: 'Как называется твой бизнес? (обязательное поле)',
		businessTerm: 'Какой направление подходит твоему бизнесу? напиши по типу "ресторан, услуги, барбершоп и т.д."',
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
		holidays: ['Суббота', 'Воскресенье'],
	};

	const handleChatSubmit = async (userInput, addMessage) => {
		const currentField = steps[step - 1];
		const trimmedInput = userInput.trim();

		if (isReenteringDescription) {
			// Если пользователь меняет описание
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
		setIsLoading(true);
		setResponseMessage('');
		setError('');

		if (!token) {
			setError('Требуется авторизация. Пожалуйста, войдите.');
			addMessage({ sender: 'bot', text: 'Требуется авторизация. Пожалуйста, войдите.' });
			setIsLoading(false);
			return;
		}

		const formPayload = createFormPayload();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/companies`,
				formPayload,
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);
			addMessage({ sender: 'bot', text: 'Бизнес успешно зарегистрирован!' });
			setResponseMessage('Бизнес успешно зарегистрирован!');
			setTimeout(() => navigate('/Dashboard'), 2000);
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при регистрации.');
			addMessage({ sender: 'bot', text: err.response?.data?.message || 'Ошибка при регистрации.' });
		} finally {
			setIsLoading(false);
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
				{ company_name: formData.name, industry: formData.businessTerm, description: formData.description },
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
			setIsReenteringDescription(true); // Устанавливаем флаг для повторного ввода
			setStep((prev) => prev - 1); // Возвращаем шаг назад к descriptionAI
			addMessage({ sender: 'bot', text: 'Введи новое описание для генерации или напиши "да" для повторной генерации.' });
		}
	};

	const getBotMessage = () => {
		if (isLoading) return 'Регистрирую твой бизнес...';
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

	return (
		<div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] p-4">
			<div className="max-w-[720px] w-full pb-5">
				<h1 className="text-2xl text-left">Регистрация бизнеса</h1>
			</div>
			<div className="w-full max-w-3xl">
				<ChatBot
					onSubmitData={handleCustomInput}
					customBotMessage={getBotMessage()}
					showButtons={showDescriptionButtons}
					onButtonClick={(choice) => handleDescriptionChoice(choice, (msg) => handleCustomInput('', (m) => msg.sender === 'bot' && m.text))}
				/>
			</div>
		</div>
	);
};

export default BusinessRegistration;