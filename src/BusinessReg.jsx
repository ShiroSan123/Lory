import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import LogoIcon from '/Logo-ico.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusinessRegistration = () => {
	const token = localStorage.getItem("token");
	const [isLoading, setIsLoading] = useState(false);

	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		businessName: '',
		businessType: '',
		businessTerm: '',
		address: '',
		city: '',
		street: '',
		workEmail: '',
		workTime: '',
		holidays: '',
		description: '', // Добавлено для шага 3
		descriptionAI: '', // Добавлено для шага 3 (генерация ИИ)
		logo: null, // Для хранения файла логотипа
		calendar: false, // Для шага 5
		analytics: false,
		telegram: false,
		aiText: false,
		socials: false,
		delivery: false,
	});

	const [responseMessage, setResponseMessage] = useState(''); // Для сообщения об успехе
	const [error, setError] = useState(''); // Для сообщения об ошибке
	const steps = ['Начало', 'Информация', 'Описание', 'Логотип', 'Конструктор'];
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		if (type === 'file') {
			setFormData({ ...formData, [name]: files[0] }); // Для загрузки файла
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const nextStep = () => {
		setStep(step + 1);
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	const goToStep = (stepIndex) => {
		setStep(stepIndex);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		setResponseMessage('');
		setError('');

		if (!token) {
			setError('Authorization token is missing. Please log in.');
			setIsLoading(false);
			return;
		}

		console.log('Token before request:', token);
		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		console.log('Token expiration:', new Date(decodedToken.exp * 1000));
		console.log('Current time:', new Date());

		if (decodedToken.exp * 1000 < Date.now()) {
			setError('Token has expired. Please log in again.');
			setIsLoading(false);
			navigate('/login');
			return;
		}

		const data = new FormData();
		data.append('name', formData.businessName);
		data.append('businessType', formData.businessType || '');
		// data.append('businessTerm', formData.businessTerm);
		// data.append('city', formData.city);
		// data.append('street', formData.street);
		// data.append('workTime', formData.workTime);
		// data.append('holidays', formData.holidays);
		data.append('description', formData.description);
		// data.append('descriptionAI', formData.descriptionAI);
		// if (formData.logo) {
		// 	data.append('logo', formData.logo);
		// }
		// data.append('calendar', formData.calendar);
		// data.append('analytics', formData.analytics);
		// data.append('telegram', formData.telegram);
		// data.append('aiText', formData.aiText);
		// data.append('socials', formData.socials);
		// data.append('delivery', formData.delivery);

		console.log('Sending data:');
		for (let [key, value] of data.entries()) {
			console.log(`${key}: ${value}`);
		}

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/companies`,
				data,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
				}
			);
			setResponseMessage('Business registered successfully!');
			console.log('Response:', response.data);
			setTimeout(() => navigate('/Dashboard'), 2000);
		} catch (err) {
			console.error('Server error response:', err.response?.data);
			setError(
				err.response?.data?.message || 'Something went wrong. Please try again.'
			);
			console.error('Error details:', {
				message: err.message,
				status: err.response?.status,
				data: err.response?.data,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRadioToggle = (name) => {
		setFormData((prev) => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	const Logo = () => (
		<div className="flex justify-center items-center mb-8">
			<div className="flex-col gap-4 items-center text-center space-x-3">
				<img src={LogoIcon} alt="Lory Logo" className="w-80 h-80" />
				<span className="text-3xl font-bold text-black">LoryCRM</span>
			</div>
		</div>
	);

	const isStepValid = () => {
		if (step === 2) return formData.businessName && formData.businessType !== '';
		return true;
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className="text-center flex-col">
						<Logo />
						<h2 className="text-xl font-semibold text-black mt-6">Добро пожаловать!</h2>
						<p className="text-[#858585] w-1/2 mx-auto text-[18px]">
							Введите данные о своем бизнесе и начинайте работать в Lory
						</p>
						<div className="space-y-4"></div>
					</div>
				);
			case 2:
				return (
					<div className="grid gap-8">
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Основная информация</h2>
							<div className="space-y-4">
								<input
									type="text"
									name="businessName"
									value={formData.businessName}
									onChange={handleChange}
									placeholder="Название бизнеса *"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
								<select
									name="businessType"
									value={formData.businessType}
									onChange={handleChange}
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<option value="">Сфера бизнеса *</option>
									<option value="RESTAURANT">Общепит</option>
									<option value="RESTAURANT">Услуги</option>
									<option value="RESTAURANT">Недвижимость</option>
								</select>
								<select
									name="businessTerm"
									value={formData.businessTerm}
									onChange={handleChange}
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<option value="">Теги бизнеса *</option>
									<option value="short">Краткосрочный</option>
									<option value="long">Долгосрочный</option>
								</select>
							</div>
						</div>
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Адрес</h2>
							<div className="space-y-4">
								<input
									type="text"
									name="city"
									value={formData.city}
									onChange={handleChange}
									placeholder="Город"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
								<input
									type="text"
									name="street"
									value={formData.street}
									onChange={handleChange}
									placeholder="Улица и дом"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
							</div>
						</div>
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Режим работы</h2>
							<div className="space-y-4">
								<input
									type="text"
									name="workTime"
									value={formData.workTime}
									onChange={handleChange}
									placeholder="Время *"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
								<select
									name="holidays"
									value={formData.holidays}
									onChange={handleChange}
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<option value="">Выходные *</option>
									<option value="saturday">Суббота</option>
									<option value="sunday">Воскресенье</option>
								</select>
							</div>
						</div>
					</div>
				);
			case 3:
				return (
					<div className="grid gap-8">
						<h2 className="text-xl font-semibold text-black mb-6">Описание</h2>
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Описание бизнеса</h2>
							<div className="space-y-4">
								<input
									type="text"
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="Описание бизнеса"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
							</div>
						</div>
						<button
							onClick={nextStep}
							className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${isStepValid()
								? 'bg-[#0A80E8] hover:bg-[#2563EB]'
								: 'bg-[#9CA3AF] cursor-not-allowed'
								} ${step > 1 ? 'ml-auto w-auto px-6' : ''}`}
						>
							Выбрать
						</button>
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Генерация ИИ</h2>
							<div className="space-y-4">
								<input
									type="text"
									name="descriptionAI"
									value={formData.descriptionAI}
									onChange={handleChange}
									placeholder="Text that's generated by AI"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
							</div>
						</div>
					</div>
				);
			case 4:
				return (
					<div className="grid gap-8">
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Логотип бизнеса</h2>
							<div className="space-y-4">
								<label
									htmlFor="logo-upload"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] flex items-center cursor-pointer hover:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<svg
										className="w-5 h-5 mr-2 text-[#9CA3AF]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 00-5.656-5.656L7 9.172V7H5v5.172l5.172-5.172a6 6 0 018.486 8.486L12 21.828a4 4 0 01-5.656-5.656L13.172 9H9V7h6.172z"
										/>
									</svg>
									Прикрепить логотип бизнеса
								</label>
								<input
									id="logo-upload"
									type="file"
									name="logo"
									onChange={handleChange}
									className="hidden"
								/>
							</div>
						</div>

						<button
							onClick={nextStep}
							disabled={!isStepValid()}
							className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${isStepValid()
								? 'bg-[#0A80E8] hover:bg-[#2563EB]'
								: 'bg-[#9CA3AF] cursor-not-allowed'
								}`}
						>
							Выбрать
						</button>

						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Генерация ИИ</h2>
							<div className="space-y-4">
								<div className="w-full h-48 bg-gray-50 rounded flex items-center justify-center">
									<div className="text-center">
										<p className="text-lg font-semibold text-black">BelliGoal</p>
										<div className="flex justify-center mt-2">
											<span className="w-2 h-2 bg-white rounded-full mx-1"></span>
											<span className="w-2 h-2 bg-[#FFD700] rounded-full mx-1"></span>
										</div>
									</div>
								</div>
								<div className="flex justify-center mt-4">
									<span className="w-3 h-3 bg-gray-300 rounded-full mx-1"></span>
									<span className="w-3 h-3 bg-gray-300 rounded-full mx-1"></span>
									<span className="w-3 h-3 bg-gray-300 rounded-full mx-1"></span>
								</div>
							</div>
						</div>
					</div>
				);
			case 5:
				return (
					<div className="grid gap-8">
						<div className="p-6 rounded-[16px] border border-gray-200">
							<h2 className="text-xl font-medium text-black mb-6">Функциональность</h2>
							<div className="space-y-6">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Календарь бронирования
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="calendar"
											checked={formData.calendar}
											onChange={() => handleRadioToggle('calendar')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Аналитика
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="analytics"
											checked={formData.analytics}
											onChange={() => handleRadioToggle('analytics')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Уведомление и поддержка через Telegram
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="telegram"
											checked={formData.telegram}
											onChange={() => handleRadioToggle('telegram')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Генерация текста и изображений LoryAI
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="aiText"
											checked={formData.aiText}
											onChange={() => handleRadioToggle('aiText')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Соцсети
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="socials"
											checked={formData.socials}
											onChange={() => handleRadioToggle('socials')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px]">
									<label className="text-base font-medium text-gray-700">
										Зона доставки
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="delivery"
											checked={formData.delivery}
											onChange={() => handleRadioToggle('delivery')}
											className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
									</label>
								</div>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] p-4">
			<div className="max-w-[720px] w-full pb-5">
				<h1 className="text-2xl text-left">Мои бизнесы</h1>
			</div>
			<div className="w-full max-w-3xl">
				{/* Прогресс-бар */}
				<div className="flex items-center justify-between max-w-[720px] mx-auto mb-6 relative">
					{steps.map((label, index) => {
						const stepIndex = index + 1;
						const isCompleted = step > stepIndex;
						const isCurrent = step === stepIndex;

						return (
							<div
								key={label}
								onClick={() => goToStep(stepIndex)}
								className="flex-1 flex gap-2 items-center relative cursor-pointer"
							>
								<div
									className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'border-[#00A445]' : isCurrent ? '' : ''
										} z-10`}
								>
									<span
										className={`text-[14px] font-medium ${isCompleted ? 'text-[#00A445]' : isCurrent ? '' : ''
											}`}
									>
										{isCompleted ? '✓' : stepIndex}
									</span>
								</div>
								<span
									className={`text-xs text-center ${isCompleted ? 'text-[#00A445]' : 'text-black'
										}`}
								>
									{label}
								</span>
							</div>
						);
					})}
				</div>
				<div className="">
					{renderStep()}
					<div className="flex-col text-center justify-between mt-6">
						{/* Сообщения об успехе или ошибке */}
						{responseMessage && (
							<p className="text-green-600 text-center mb-4">{responseMessage}</p>
						)}
						{error && <p className="text-red-600 text-center mb-4">{error}</p>}

						<button
							onClick={step === 5 ? handleSubmit : nextStep}
							disabled={!isStepValid() || isLoading}
							className={`w-full h-14 rounded-[14px] text-white text-base font-medium ${isStepValid() && !isLoading
								? 'bg-[#0A80E8] hover:bg-[#2563EB]'
								: 'bg-[#9CA3AF] cursor-not-allowed'
								} ${step > 1 ? 'ml-auto w-auto px-6' : ''}`}
						>
							{isLoading ? 'Loading...' : step === 1 ? 'Перейти к регистрации' : step === 5 ? 'Зарегистрировать' : 'Далее'}
						</button>
						{step === 1 ? (
							<p className="text-[#858585] text-[14px]">
								Если вы сотрудник, то обратитесь к начальству
							</p>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessRegistration;