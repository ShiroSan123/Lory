import { useState } from 'react';
import LeftSidebar from './components/Layout/LeftSideBar';
import MainContent from './components/Layout/MainContent';
import Header from './components/Layout/Header';

import './App.css'

const Dashboar = () => {
	// Состояние для отслеживания выбранного пункта меню
	const [selectedMenu, setSelectedMenu] = useState('Главная');
	// Состояние для управления открытием левой колонки на мобильных устройствах
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

	// Список пунктов меню (можно вынести в отдельный файл или пропсы)
	const menuItems = [
		{ icon: '🏠', label: 'Главная' },
		{ icon: '📊', label: 'Канальная аналитика' },
		{ icon: '📅', label: 'Календарь броней' },
		{ icon: '🌍', label: 'Страны' },
		{ icon: '📈', label: 'Финансы' },
		{ icon: '⚙️', label: 'Настройки' },
	];

	// Функция для динамического рендеринга содержимого MainContent
	const renderMainContent = () => {
		switch (selectedMenu) {
			case 'Главная':
				return <h1>дом</h1>
			case 'Канальная аналитика':
				return <h1>аналитика</h1>
			case 'Календарь броней':
				return <h1>календарь</h1>
			case 'Страны':
				return <h1>страна</h1>
			case 'Финансы':
				return <h1>финансы</h1>
			case 'Настройки':
				return <h1>настройки</h1>
			default:
				return <div>Выберите пункт меню</div>;
		}
	};

	return (
		<>
			<Header
				onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
				selectedMenu={selectedMenu} // Передаем выбранный пункт в шапку
			/>
			<LeftSidebar
				isOpen={isLeftSidebarOpen}
				onClose={() => setIsLeftSidebarOpen(false)}
				menuItems={menuItems}
				onSelectMenu={setSelectedMenu} // Передаем функцию для изменения состояния
			/>
			<MainContent>{renderMainContent()}</MainContent>
		</>
	);
}

export default Dashboar;