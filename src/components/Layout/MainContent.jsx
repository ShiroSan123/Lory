import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function MainContent({ selectedMenu, isLoading = false }) {
	const [formData, setFormData] = useState({
		company_name: '',
		industry: '',
		description: ''
	});
	const [responseMessage, setResponseMessage] = useState('');
	const [error, setError] = useState('');
	const [localLoading, setLocalLoading] = useState(false);
	const navigate = useNavigate();

	// For this example, we'll assume token is stored in localStorage
	const token = localStorage.getItem('authToken');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const renderMainContent = () => {
		switch (selectedMenu) {
			case 'Главная':
				return <h1 className="p-4">дом</h1>;
			case 'Канальная аналитика':
				return <h1 className="p-4">аналитика</h1>;
			case 'Календарь броней':
				return <h1 className="p-4">календарь</h1>;
			case 'Страны':
				return <h1 className="p-4">страна</h1>;
			case 'Финансы':
				return <h1 className="p-4">финансы</h1>;
			case 'Настройки':
				return <h1 className="p-4">настройки</h1>;
			default:
				return <div className="p-4">Выберите пункт меню</div>;
		}
	};

	return (
		<main
			className="fixed top-20 md:left-4 w-full rounded-2xl bg-white px-4 md:pt-2 md:px-6 md:ml-64 h-[calc(100vh-5rem)] overflow-y-auto"
		>
			<h1 className="text-xl sm:text-2xl font-bold mb-6">Дашборд</h1>
			{isLoading || localLoading ? (
				<div className="p-4">Loading...</div>
			) : (
				renderMainContent()
			)}
		</main>
	);
}

export default MainContent;