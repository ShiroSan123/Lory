import React, { useState } from 'react';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import LogoIcon from '/Logo-ico.svg';

const BusinessRegistration = () => {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		businessName: '',
		region: '',
		businessVolume: '',
		employeeCount: '',
		platforms: [],
		description: '',
		logo: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handlePlatformChange = (platform) => {
		const updatedPlatforms = formData.platforms.includes(platform)
			? formData.platforms.filter((p) => p !== platform)
			: [...formData.platforms, platform];
		setFormData({ ...formData, platforms: updatedPlatforms });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, logo: e.target.files[0] });
	};

	const nextStep = () => {
		setStep(step + 1);
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	const handleSubmit = () => {
		console.log('Form submitted:', formData);
	};

	const Logo = () => (
		<div className="flex justify-center items-center mb-8">
			<div className="flex-row items-center space-y-6">
				<img src={LogoIcon} alt="LoryCRM Logo" className="w-40 h-40 mx-auto" />
				<span className="text-5xl font-bold text-black">LoryCRM</span>
			</div>
		</div>
	);

	const isStepValid = () => {
		if (step === 1) return formData.businessName && formData.region;
		if (step === 2) return formData.businessVolume;
		if (step === 3) return formData.employeeCount;
		if (step === 4) return formData.platforms.length > 0;
		if (step === 5) return formData.description;
		if (step === 6) return formData.logo;
		return true;
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div>
						<h2 className="text-2xl text-center font-medium text-black mb-6">Регистрация</h2>
						<div className="space-y-4">
							<input
								type="text"
								name="businessName"
								value={formData.businessName}
								onChange={handleChange}
								placeholder="Название бизнеса *"
								className="w-full h-12 px-4 bg-[#F9F9FA] rounded text-base placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
							/>
							<input
								type="text"
								name="region"
								value={formData.region}
								onChange={handleChange}
								placeholder="Регион *"
								className="w-full h-12 px-4 bg-[#F9F9FA] rounded text-base placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
							/>
						</div>
					</div>
				);
			case 2:
				return (
					<div>
						<h2 className="text-2xl text-center font-medium text-black mb-6">Ввод объема бизнеса</h2>
						<div className="space-y-3">
							{['catering', 'services', 'estate'].map((volume) => (
								<label key={volume} className="flex items-center space-x-3">
									<input
										type="radio"
										name="businessVolume"
										value={volume}
										checked={formData.businessVolume === volume}
										onChange={handleChange}
										className="w-5 h-5 border border-[#E5E7EB] rounded-full text-[#3B82F6] focus:ring-[#3B82F6]"
									/>
									<span className="text-base text-black">
										{volume === 'catering' ? 'Общепит' : volume === 'Услуги' ? 'estate' : 'Недвижимость'}
									</span>
								</label>
							))}
						</div>
					</div>
				);
			case 3:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Ввод количества сотрудников</h2>
						<select
							name="employeeCount"
							value={formData.employeeCount}
							onChange={handleChange}
							className="w-full h-12 px-4 border border-[#E5E7EB] rounded text-base text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
						>
							<option value="">Укажите</option>
							<option value="1-10">1-10</option>
							<option value="11-50">11-50</option>
							<option value="51-100">51-100</option>
							<option value="100+">100+</option>
						</select>
					</div>
				);
			case 4:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Выберите используемые платформы</h2>
						<div className="space-y-3">
							{['Telegram', 'WhatsApp', 'Instagram', 'Вконтакте'].map((platform) => (
								<label key={platform} className="flex items-center space-x-3">
									<input
										type="checkbox"
										checked={formData.platforms.includes(platform)}
										onChange={() => handlePlatformChange(platform)}
										className="w-5 h-5 border border-[#E5E7EB] rounded text-[#3B82F6] focus:ring-[#3B82F6]"
									/>
									<span className="text-base text-black">{platform}</span>
								</label>
							))}
						</div>
					</div>
				);
			case 5:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Описание бизнеса</h2>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Напишите описание бизнеса"
							className="w-full h-32 p-4 border border-[#E5E7EB] rounded text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
						/>
						<p className="text-sm text-[#6B7280] mt-3">
							BellGoal - это универсальное решение для бизнеса. Опишите ваш бизнес, чтобы мы могли адаптировать функционал под ваши задачи. Опишите вашу целевую аудиторию, особенности бизнеса, цели, которые вы хотите достичь с помощью BellGoal, а также любые другие важные детали.
						</p>
					</div>
				);
			case 6:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Загрузка изображения бизнеса</h2>
						<label className="flex items-center justify-center w-full h-12 border border-[#E5E7EB] rounded cursor-pointer">
							<FaUpload className="mr-2 text-[#6B7280]" />
							<span className="text-base text-[#9CA3AF]">Выберите файл</span>
							<input
								type="file"
								onChange={handleFileChange}
								className="hidden"
							/>
						</label>
						{formData.logo && (
							<p className="mt-3 text-sm text-[#6B7280]">Выбрано: {formData.logo.name}</p>
						)}
					</div>
				);
			case 7:
				return (
					<div>
						<h2 className="text-xl font-semibold text-black mb-6">Создание нового бизнеса</h2>
						<div className="p-4 bg-[#F3F4F6] rounded text-center">
							<p className="text-base font-semibold text-black">
								{formData.businessName || 'BellGoal'}
							</p>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-[600px]">
				<Logo />
				<div className="bg-white p-6 rounded-lg">
					{renderStep()}
					<div className="justify-between flex mt-6 relative">
						{step > 1 && (
							<button
								onClick={prevStep}
								className="absolute flex items-center space-x-2 text-[#6B7280] text-sm"
							>
								<FaArrowLeft className="w-4 h-4" />
								<span>Назад</span>
							</button>
						)}
						<button
							onClick={step === 7 ? handleSubmit : nextStep}
							disabled={!isStepValid()}
							className={`w-1/2 mx-auto h-12 rounded-2xl text-white text-base font-medium ${isStepValid()
								? 'bg-[#0754B1] hover:bg-[#2563EB]'
								: 'bg-[#9CA3AF] cursor-not-allowed'
								} ${step > 1 ? 'ml-auto w-auto px-6' : ''}`}
						>
							{step === 7 ? 'Начать' : 'Далее'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessRegistration;