import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import LogoIcon from '/Logo-ico.svg';

const BusinessRegistration = () => {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		businessName: '',
		businessField: '',
		businessTerm: '',
		address: '',
		city: '',
		street: '',
		workEmail: '',
		workTime: '',
		holidays: '',
	});
	const steps = ['Информация', 'Описание', 'Логотип', 'Конструктор'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
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

	const handleSubmit = () => {
		console.log('Form submitted:', formData);
	};

	const Logo = () => (
		<div className="flex justify-center items-center mb-8">
			<div className="flex-col gap-4 items-center text-center space-x-3">
				<img src={LogoIcon} alt="Lory Logo" className="w-40 h-40" />
				<span className="text-3xl font-bold text-black">LoryCRM</span>
			</div>
		</div>
	);

	const isStepValid = () => {
		if (step === 1) return formData.businessName && formData.region;
		if (step === 2) return formData.businessName && formData.businessField && formData.businessTerm && formData.workEmail && formData.workTime && formData.holidays;
		return true; // Другие шаги пока не проверяем
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div>
						<Logo />
						<h2 className="text-xl font-semibold text-black mb-6">Регистрация</h2>
						<div className="space-y-4">
							<input
								type="text"
								name="businessName"
								value={formData.businessName}
								onChange={handleChange}
								placeholder="Название бизнеса *"
								className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
							/>
							<input
								type="text"
								name="region"
								value={formData.region}
								onChange={handleChange}
								placeholder="Регион *"
								className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
							/>
						</div>
					</div>
				);
			case 2:
				return (
					<div className="grid gap-4">
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
									name="businessField"
									value={formData.businessField}
									onChange={handleChange}
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<option value="">Сфера бизнеса *</option>
									<option value="retail">Розничная торговля</option>
									<option value="service">Услуги</option>
								</select>
								<select
									name="businessTerm"
									value={formData.businessTerm}
									onChange={handleChange}
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								>
									<option value="">Термин бизнеса *</option>
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
									name="address"
									value={formData.address}
									onChange={handleChange}
									placeholder="Адрес"
									className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
								/>
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
								<input
									type="email"
									name="workEmail"
									value={formData.workEmail}
									onChange={handleChange}
									placeholder="Почта работы *"
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
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Описание</h2>
						<div className="space-y-4">
							<p>Контент для шага 3 (пример)</p>
						</div>
					</div>
				);
			case 4:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Логотип</h2>
						<div className="space-y-4">
							<p>Контент для шага 4 (пример)</p>
						</div>
					</div>
				);
			case 5:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Конструктор</h2>
						<div className="space-y-4">
							<p>Контент для шага 5 (пример)</p>
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
								{/* Круг */}
								<div
									className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isCompleted
										? 'border-[#00A445]'
										: isCurrent
											? ''
											: ''
										} z-10`}
								>
									<span
										className={`text-[14px] font-medium ${isCompleted
											? 'text-[#00A445]'
											: isCurrent
												? ''
												: ''
											}`}
									>
										{isCompleted ? '✓' : stepIndex}
									</span>
								</div>
								{/* Текст под кругом */}
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
					<div className="flex justify-between mt-6">
						{step > 1 && (
							<button
								onClick={prevStep}
								className="flex items-center space-x-2 text-[#6B7280] text-sm"
							>
								<FaArrowLeft className="w-4 h-4" />
								<span>Назад</span>
							</button>
						)}
						<button
							onClick={step === 5 ? handleSubmit : nextStep}
							disabled={!isStepValid()}
							className={`w-full h-12 rounded text-white text-base font-medium ${isStepValid()
								? 'bg-[#0A80E8] hover:bg-[#2563EB]'
								: 'bg-[#9CA3AF] cursor-not-allowed'
								} ${step > 1 ? 'ml-auto w-auto px-6' : ''}`}
						>
							{step === 4 ? 'Начать' : 'Далее'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessRegistration;