import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({
	onToggleLeftSidebar,
	selectedMenu,
	selectedEmployee,
	selectedItem,
	onUpdateItem,
}) => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [headerHeight, setHeaderHeight] = useState(120); // Начальная высота
	const [touchStart, setTouchStart] = useState(null);
	const [touchMove, setTouchMove] = useState(null);
	const [isExpanded, setIsExpanded] = useState(false); // Состояние для затемнения

	// Вычисляем минимальную высоту (50% экрана)
	const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
	const minExpandedHeight = screenHeight * 0.5; // 50% высоты экрана
	const maxExpandedHeight = screenHeight * 0.8; // Максимальная высота (80% экрана, можно настроить)

	// Локальное состояние для редактируемых полей выбранного элемента
	const [editedItem, setEditedItem] = useState(selectedItem || {});

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setUserData(storedToken);
		} else {
			setError("No user data found. Please log in again.");
		}
		setIsLoading(false);
	}, []);

	// Обновление локального состояния при изменении selectedItem
	useEffect(() => {
		if (selectedItem) {
			setEditedItem(selectedItem);
		}
	}, [selectedItem]);

	// Обработчики свайпов
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientY);
	};

	const handleTouchMove = (e) => {
		setTouchMove(e.targetTouches[0].clientY);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchMove) return;

		const distance = touchMove - touchStart;
		const minSwipeDistance = 50;

		if (distance < -minSwipeDistance) {
			// Свайп вверх: открываем на 50% экрана
			setHeaderHeight(minExpandedHeight);
			setIsExpanded(true); // Включаем затемнение
		} else if (distance > minSwipeDistance) {
			// Свайп вниз: возвращаем к исходной высоте
			setHeaderHeight(120);
			setIsExpanded(false); // Выключаем затемнение
		}

		setTouchStart(null);
		setTouchMove(null);
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedItem((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = () => {
		onUpdateItem(editedItem);
	};

	return (
		<>
			{/* Затемняющий слой */}
			{isExpanded && (
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 transition-opacity duration-300"
					onClick={() => {
						setHeaderHeight(120); // При клике на затемнение сворачиваем Header
						setIsExpanded(false);
					}}
				/>
			)}

			{/* Header */}
			<header
				className="fixed bottom-0 left-0 right-0 flex md:gap-4 items-start justify-between bg-white shadow-md z-40"
				style={{
					height: `${headerHeight}px`,
					transition: "height 0.3s ease",
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div className="flex items-center space-x-4 md:pl-4 p-4">
					<button
						onClick={onToggleLeftSidebar}
						className="p-2 rounded-full hover:bg-gray-200"
						aria-label="Toggle Sidebar"
					>
						<span>{selectedMenu}</span>
					</button>
					{selectedMenu === "Сотрудники" && selectedEmployee && (
						<div className="flex flex-col text-sm">
							<span>Сотрудник: {selectedEmployee.name}</span>
							<span>Телефон: {selectedEmployee.phone}</span>
						</div>
					)}
				</div>
				{selectedItem && (
					<div className="flex flex-col p-2 bg-gray-50 border rounded m-4">
						<label>
							Название:
							<input
								type="text"
								name="name"
								value={editedItem.name || ""}
								onChange={handleChange}
								className="ml-2 border rounded p-1"
							/>
						</label>
						<label>
							Описание:
							<input
								type="text"
								name="description"
								value={editedItem.description || ""}
								onChange={handleChange}
								className="ml-2 border rounded p-1"
							/>
						</label>
						<button
							onClick={handleSave}
							className="mt-2 p-1 bg-blue-500 text-white rounded"
						>
							Сохранить
						</button>
					</div>
				)}
				{/* Дополнительный контент при увеличении */}
				{headerHeight >= minExpandedHeight && (
					<div className="p-4 text-sm text-gray-600 w-full">
						<p>Дополнительная информация</p>
						<button
							onClick={() => {
								setHeaderHeight(120);
								setIsExpanded(false);
							}}
							className="mt-2 p-1 bg-gray-200 rounded"
						>
							Свернуть
						</button>
					</div>
				)}
			</header>
		</>
	);
};

export default Header;