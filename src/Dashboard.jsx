import { useState } from 'react';
import RightSidebar from './components/Layout/RightSideBar';
import MainContent from './components/Layout/MainContent';
import Header from './components/Layout/Header';
import { useCallback } from 'react';
import './App.css';

const Dashboard = () => {
	const [selectedMenu, setSelectedMenu] = useState('Главная');
	const [selectedEmployee, setSelectedEmployee] = useState(null); // Добавляем состояние для выбранного сотрудника
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); // Для свайпа
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

	// Обновляем функцию onSelectMenu для принятия сотрудника
	const handleSelectMenu = (menu, employee = null) => {
		console.log('Selected Menu in Dashboard:', menu);
		setSelectedMenu(menu);
		setSelectedEmployee(employee);
		setIsLeftSidebarOpen(true);
	};

	// Обработка начала касания
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	// Обработка движения пальца
	const handleTouchMove = (e) => {
		setTouchMove(e.targetTouches[0].clientX);
	};

	// Обработка окончания касания
	const handleTouchEnd = () => {
		if (!touchStart || !touchMove) return;
		const distance = touchMove - touchStart;
		const minSwipeDistance = 50; // Минимальная дистанция для свайпа

		if (distance > minSwipeDistance) {
			// Свайп вправо — показать MainContent
			setIsLeftSidebarOpen(true);
		} else if (distance < -minSwipeDistance) {
			// Свайп влево — скрыть MainContent
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
			/>
			<RightSidebar
				isOpen={!isLeftSidebarOpen}
				onClose={() => setIsLeftSidebarOpen(true)}
				menuItems={menuItems}
				onSelectMenu={handleSelectMenu}
			/>
			<MainContent
				selectedMenu={selectedMenu}
				isSidebarOpen={isLeftSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpenCallback} // Используем useCallback
				selectedEmployee={selectedEmployee}
			/>
		</div>
	);
};

export default Dashboard;