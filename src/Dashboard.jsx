import { useState } from 'react';
import Header from './components/Layout/Header';
import LeftSidebar from './components/Layout/LeftSideBar';
import RightSidebar from './components/Layout/RightSideBar';
import MainContent from './components/Layout/MainContent';

export function Dashboard() {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

	return (
		<div className="relative h-screen">
			{/* Фиксированная шапка */}
			<Header
				onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
				onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
			/>

			{/* Левое меню (скрыто на мобильных по умолчанию) */}
			<LeftSidebar isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />

			{/* Правое меню (скрыто на мобильных по умолчанию) */}
			<RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />

			{/* Прокручиваемый контент */}
			<MainContent />
		</div>
	);
}