import { useState, useCallback } from 'react';
import RightSidebar from './components/Layout/RightSideBar';
import MainContent from './components/Layout/MainContent';
import Header from './components/Layout/Header';
import './App.css';

const Dashboard = () => {
	const [selectedMenu, setSelectedMenu] = useState('Главная');
	const [touchStart, setTouchStart] = useState(null);
	const [touchMove, setTouchMove] = useState(null);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedService, setSelectedService] = useState(null);
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

	const setIsSidebarOpenCallback = useCallback((value) => {
		setIsLeftSidebarOpen(value);
	}, []);

	const handleSelectMenu = (menu, data = null) => {
		console.log('Selected Menu in Dashboard:', menu, data);
		setSelectedMenu(menu);
		if (menu === 'Business' && data) {
			setSelectedCompany(data);
			setSelectedEmployee(null);
		} else if (menu === 'Сотрудники' && data && !data.companyId) {
			setSelectedEmployee(data);
		} else if (data && data.id) {
			setSelectedCompany(data);
			setSelectedEmployee(null);
		}
		setIsLeftSidebarOpen(true);
	};

	const handleSelectCompany = (company) => {
		console.log("Выбрана компания: " + company);
		setSelectedMenu("Menu");
		setSelectedCompany(company);
	};

	const handleSelectService = (service) => {
		console.log('Selected Сервис in Dashboard:', service);
		setSelectedService({ serviceId: service.id, index: service.index });
		setSelectedMenu("Menu");
	};

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

	const handleSelectItem = useCallback((item) => {
		setSelectedItem(item);
	}, []);

	const handleUpdateItem = useCallback((updatedItem) => {
		setSelectedItem(updatedItem);
	}, []);

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
				selectedItem={selectedItem}
				onUpdateItem={handleUpdateItem}
			/>
			<RightSidebar
				isOpen={!isLeftSidebarOpen}
				onClose={() => setIsLeftSidebarOpen(true)}
				onSelectMenu={(menu, data) => setSelectedMenu(menu)}
				selectCompany={(company) => setSelectedCompany(company)}
				selectedService={handleSelectService}
			/>
			<MainContent
				selectedMenu={selectedMenu}
				isSidebarOpen={isLeftSidebarOpen}
				selectedEmployee={selectedEmployee}
				selectedCompany={selectedCompany}
				selectedService={selectedService}
				onSelectItem={handleSelectItem}
			/>
		</div>
	);
};

export default Dashboard;