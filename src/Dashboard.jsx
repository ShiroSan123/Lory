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
		setSelectedMenu("Menu");
		setSelectedCompany(company);

	};

	const handleSelectService = (service) => {
		console.log('Selected Сервис in Dashboard:', service);
		setSelectedService({ serviceId: service.id, index: service.index });
		setSelectedMenu("Menu");
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


  
	// Обработчик выбора элемента (например, при клике в BusinessContent)
	const handleSelectItem = useCallback((item) => {
	  setSelectedItem(item);
	}, []);
  
	// Функция для обновления элемента – вызывается из Header после редактирования
	const handleUpdateItem = useCallback((updatedItem) => {
	  setSelectedItem(updatedItem);
	  // Дополнительно можно обновить данные в выбранном сервисе или компании,
	  // если это требуется логикой приложения.
	}, []);
  
	// Пример передачи выбранного сервиса, если он хранится отдельно


	return (
		<div className="relative h-screen overflow-hidden">
		  <Header
			onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
			selectedMenu={selectedMenu}
			selectedEmployee={selectedEmployee}
			// Передаём selectedItem в Header – если он есть, отображается форма редактирования
			selectedItem={selectedItem}
			onUpdateItem={handleUpdateItem}
		  />
		  <RightSidebar
			isOpen={!isLeftSidebarOpen}
			onClose={() => setIsLeftSidebarOpen(true)}
			// Здесь передаём обработчики выбора меню, компаний и сервисов
			onSelectMenu={(menu, data) => setSelectedMenu(menu)}
			selectCompany={(company) => setSelectedCompany(company)}
			selectedService={handleSelectService}
		  />
		  <MainContent
			selectedMenu={selectedMenu}
			isSidebarOpen={isLeftSidebarOpen}
			selectedEmployee={selectedEmployee}
			selectedCompany={selectedCompany}
			// Передаём выбранный сервис, а также функцию для выбора отдельного айтема
			selectedService={selectedService}
			onSelectItem={handleSelectItem}
		  />
		</div>
	  );
	};

export default Dashboard;