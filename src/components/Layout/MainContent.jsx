import { useState } from 'react';

export function MainContent({ selectedMenu, isLoading = false, isSidebarOpen }) {
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
			className={`fixed rounded-2xl bg-white px-4 md:pt-2 md:px-6 md:left-0 w-full md:w-[calc(100vw-17rem)] h-[calc(100vh-5rem)] overflow-y-auto ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'} md:translate-x-0 z-10`}
		>
			<h1 className="text-xl sm:text-2xl font-bold mb-6">Дашборд</h1>
			{isLoading ? <div className="p-4">Loading...</div> : renderMainContent()}
		</main>
	);
}

export default MainContent;