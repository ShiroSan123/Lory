import Header from './components/Layout/Header';
import LeftSidebar from './components/Layout/LeftSidebar';
import RightSidebar from './components/Layout/RightSidebar';
import MainContent from './components/Layout/MainContent';

export function Dashboard() {
	return (
		<div className="relative h-full">
			{/* Фиксированная шапка */}
			<Header />

			{/* Фиксированное левое меню */}
			<LeftSidebar />

			{/* Фиксированное правое меню */}
			<RightSidebar />

			{/* Прокручиваемый контент */}
			<MainContent />
		</div>
	);
}