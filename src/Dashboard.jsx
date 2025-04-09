import { useState, useCallback } from 'react';
import RightSidebar from './components/Layout/RightSideBar';
import MainContent from './components/Layout/MainContent';
import Header from './components/Layout/Header';
import './App.css';

const Dashboard = () => {
	const [selectedMenu, setSelectedMenu] = useState('Главная');
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [selectedCompany, setSelectedCompany] = useState(null); // New state for selected company
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
	const [touchStart, setTouchStart] = useState(null);
	const [touchMove, setTouchMove] = useState(null);

	const menuItems = [
		{ icon: '/ico/astronomy.svg', label: 'LoryAI' },
		{ icon: '/ico/user.svg', label: 'Сотрудники' },
		{ icon: '/ico/statistic.svg', label: 'Аналитика' },
		{ icon: '/ico/calendar.svg', label: 'Календарь' },
		{ icon: '/ico/user-1.svg', label: 'Клиенты' },
		{ icon: '/ico/shopping.svg', label: 'Товары' },
	];

	const setIsSidebarOpenCallback = useCallback((value) => {
		setIsLeftSidebarOpen(value);
	}, []);

	const handleSelectMenu = (menu, data = null) => {
		console.log('Selected Menu in Dashboard:', menu);
		setSelectedMenu(menu);
		if (menu === 'Business' && data) {
			setSelectedCompany(data); // data is the company object
			setSelectedEmployee(null);
		} else if (menu === 'Сотрудники' && data && !data.companyId) {
			setSelectedEmployee(data); // data is an employee object
		} else if (data && data.id) { // For features, data is the company
			setSelectedCompany(data);
			setSelectedEmployee(null);
		}
		setIsLeftSidebarOpen(true);
	};

	const handleSelectCompany = (company) => {
		console.log("Выбрана компания: " + company);
		
		setSelectedCompany(company);

	};

	// Touch event handlers remain unchanged
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e) => {
		setTouchMove(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchMove) return;
		const distance = touchMove - touchStart;
		const minSwipeDistance = 50;
		if (distance > minSwipeDistance) {
			setIsLeftSidebarOpen(true);
		} else if (distance < -minSwipeDistance) {
			setIsLeftSidebarOpen(false);
		}
		setTouchStart(null);
		setTouchMove(null);
	};

	return (
		<div
			className="relative h-screen overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			<Header
				onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
				selectedMenu={selectedMenu}
				selectedEmployee={selectedEmployee}
				onSelectMenu={handleSelectMenu}
			/>
			<RightSidebar
				isOpen={!isLeftSidebarOpen}
				onClose={() => setIsLeftSidebarOpen(true)}
				menuItems={menuItems}
				onSelectMenu={handleSelectMenu}
				selectCompany={handleSelectCompany}
			/>
			<MainContent
				selectedMenu={selectedMenu}
				isSidebarOpen={isLeftSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpenCallback}
				selectedEmployee={selectedEmployee}
				selectedCompany={selectedCompany} // Pass selectedCompany
			/>
		</div>
	);
};

export default Dashboard;