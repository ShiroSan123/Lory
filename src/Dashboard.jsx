import { useState } from 'react';
import LeftSidebar from './components/Layout/LeftSideBar';
import MainContent from './components/Layout/MainContent';
import Header from './components/Layout/Header';
import './App.css'
import astronomy from '/ico/astronomy.svg';

const Dashboard = () => {
	const [selectedMenu, setSelectedMenu] = useState('Главная');
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

	const menuItems = [
		{ icon: '/ico/astronomy.svg', label: 'LoryAI' },
		{ icon: '/ico/user.svg', label: 'Сотрудники' },
		{ icon: '/ico/statistic.svg', label: 'Аналитика' },
		{ icon: '/ico/calendar.svg', label: 'Календарь' },
		{ icon: '/ico/user-1.svg', label: 'Клиенты' },
		{ icon: '/ico/shopping.svg', label: 'Товары' },
	];

	return (
		<>
			<Header
				onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
				selectedMenu={selectedMenu}
			/>
			<LeftSidebar
				isOpen={isLeftSidebarOpen}
				onClose={() => setIsLeftSidebarOpen(false)}
				menuItems={menuItems}
				onSelectMenu={setSelectedMenu}
			/>
			<MainContent selectedMenu={selectedMenu} />
		</>
	);
}

export default Dashboard;