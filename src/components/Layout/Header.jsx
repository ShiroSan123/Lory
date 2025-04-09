import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../../ThemeContext';

const Header = ({
	onToggleLeftSidebar,
	selectedMenu,
	selectedEmployee,
	selectedItem,
	onUpdateItem,
}) => {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const [userData, setUserData] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [headerHeight, setHeaderHeight] = useState(120);
	const [touchStart, setTouchStart] = useState(null);
	const [touchMove, setTouchMove] = useState(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isGlowing, setIsGlowing] = useState(false);

	const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
	const minExpandedHeight = screenHeight * 0.5;
	const maxExpandedHeight = screenHeight * 0.8;

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

	useEffect(() => {
		if (selectedItem) {
			setEditedItem(selectedItem);
		}
	}, [selectedItem]);

	useEffect(() => {
		let timer;
		const startGlow = () => {
			timer = setTimeout(() => {
				setIsGlowing(true);
			}, 1000);
		};

		const resetGlow = () => {
			clearTimeout(timer);
			setIsGlowing(false);
		};

		window.addEventListener("touchstart", resetGlow);
		window.addEventListener("touchmove", resetGlow);
		window.addEventListener("touchend", startGlow);
		window.addEventListener("mousemove", resetGlow);
		window.addEventListener("click", resetGlow);

		startGlow();

		return () => {
			clearTimeout(timer);
			window.removeEventListener("touchstart", resetGlow);
			window.removeEventListener("touchmove", resetGlow);
			window.removeEventListener("touchend", startGlow);
			window.removeEventListener("mousemove", resetGlow);
			window.removeEventListener("click", resetGlow);
		};
	}, []);

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
			setHeaderHeight(minExpandedHeight);
			setIsExpanded(true);
		} else if (distance > minSwipeDistance) {
			setHeaderHeight(120);
			setIsExpanded(false);
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
			{isExpanded && (
				<div
					className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
					onClick={() => {
						setHeaderHeight(120);
						setIsExpanded(false);
					}}
				/>
			)}

			<header
				className={`fixed bottom-0 left-0 right-0 flex md:gap-4 items-start justify-between shadow-md z-40 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
					}`}
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
						className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
							}`}
						aria-label="Toggle Sidebar"
					>
						<span className={isGlowing ? 'glow' : ''}>{selectedMenu}</span>
					</button>
					{selectedMenu === "Сотрудники" && selectedEmployee && (
						<div className="flex flex-col text-sm">
							<span>Сотрудник: {selectedEmployee.name}</span>
							<span>Телефон: {selectedEmployee.phone}</span>
						</div>
					)}
				</div>
				{selectedItem && (
					<div
						className={`flex flex-col p-2 border rounded m-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
							}`}
					>
						<label>
							Название:
							<input
								type="text"
								name="name"
								value={editedItem.name || ""}
								onChange={handleChange}
								className={`ml-2 border rounded p-1 ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-black border-gray-300'
									}`}
							/>
						</label>
						<label>
							Описание:
							<input
								type="text"
								name="description"
								value={editedItem.description || ""}
								onChange={handleChange}
								className={`ml-2 border rounded p-1 ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-black border-gray-300'
									}`}
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
				{headerHeight >= minExpandedHeight && (
					<div className="p-4 text-sm w-full">
						<p>Дополнительная информация</p>
						<button
							onClick={() => {
								setHeaderHeight(120);
								setIsExpanded(false);
							}}
							className={`mt-2 p-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
								}`}
						>
							Свернуть
						</button>
					</div>
				)}
				<button
					onClick={toggleTheme}
					className={`p-2 rounded-full m-4 ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'
						}`}
					aria-label="Toggle Theme"
				>
					{theme === 'dark' ? '☀️' : '🌙'}
				</button>
			</header>

			{/* Обновленные стили для свечения */}
			<style jsx>{`
        .glow {
          animation: ${theme === 'dark' ? 'glowDarkAnimation' : 'glowLightAnimation'} 1.5s infinite alternate;
        }

        @keyframes glowLightAnimation {
          0% {
            text-shadow: 0 0 5px rgba(0, 0, 255, 0.7), 
                        0 0 10px rgba(0, 0, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 20px rgba(0, 0, 255, 1), 
                        0 0 30px rgba(0, 0, 255, 0.9), 
                        0 0 40px rgba(0, 0, 255, 0.7);
          }
        }

        @keyframes glowDarkAnimation {
          0% {
            text-shadow: 0 0 5px rgba(0, 191, 255, 0.7), 
                        0 0 10px rgba(0, 191, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 25px rgba(0, 191, 255, 1), 
                        0 0 35px rgba(0, 191, 255, 0.9), 
                        0 0 50px rgba(0, 191, 255, 0.7);
          }
        }
      `}</style>
		</>
	);
};

export default Header;