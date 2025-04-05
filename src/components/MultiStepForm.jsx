import React, { useState } from 'react';
import WelcomeStep from './steps/WelcomeStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import TagsStep from './steps/TagsStep';
import DescriptionStep from './steps/DescriptionStep';
import GroupStep from './steps/GroupStep';
import ConfirmationStep from './steps/ConfirmationStep';

const MultiStepForm = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		businessName: '',
		region: '',
		address: '',
		category: '',
		tags: [],
		description: '',
		group: '',
	});

	const handleNext = () => {
		setCurrentStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTagsChange = (tags) => {
		setFormData((prev) => ({
			...prev,
			tags,
		}));
	};

	const handleGroupChange = (group) => {
		setFormData((prev) => ({
			...prev,
			group,
		}));
	};

	const steps = [
		<WelcomeStep onNext={handleNext} />,
		<BusinessInfoStep
			formData={formData}
			handleChange={handleChange}
			onNext={handleNext}
			onBack={handleBack}
		/>,
		<TagsStep
			tags={formData.tags}
			setTags={handleTagsChange}
			onNext={handleNext}
			onBack={handleBack}
		/>,
		<DescriptionStep
			formData={formData}
			handleChange={handleChange}
			onNext={handleNext}
			onBack={handleBack}
		/>,
		<GroupStep
			group={formData.group}
			setGroup={handleGroupChange}
			onNext={handleNext}
			onBack={handleBack}
		/>,
		<ConfirmationStep formData={formData} onBack={handleBack} />,
	];

	return (
		<div className="min-h-screen bg-white flex flex-col items-center">
			{steps[currentStep]}
		</div>
	);
};

export default MultiStepForm;