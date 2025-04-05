import { React, useState } from 'react';

const ProgressBar = ({ currentStep }) => {
	const [step, setStep] = useState(1);
	const steps = ['Информация', 'Описание', 'Логотип', 'Конструктор'];
	const prevStep = () => {
		setStep(step - 1);
	};

	return (
		<div className="flex items-center justify-between max-w-[720px] mx-auto mb-6 relative">
			{steps.map((label, index) => {
				const stepIndex = index + 1;
				const isCompleted = currentStep > stepIndex;
				const isCurrent = currentStep === stepIndex;

				return (
					<div onClick={prevStep} key={label} className="flex-1 flex gap-2 items-center relative">
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
								className={`text-[14px] font-medium ${isCompleted ? 'text-[#00A445]' : 'text-black'
									}`}
							>
								✓
							</span>
						</div>
						{/* Текст под кругом */}
						<span className="text-[#6B7280] text-xs text-center">{label}</span>
					</div>
				);
			})}
		</div>
	);
};

export default ProgressBar;