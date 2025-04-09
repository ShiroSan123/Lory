// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// const Header = ({ onToggleLeftSidebar, selectedMenu, selectedEmployee }) => {
// 	const navigate = useNavigate();
// 	const [userData, setUserData] = useState(null);
// 	const [error, setError] = useState("");
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		const storedUserData = localStorage.getItem("userData");
// 		if (storedUserData) {
// 			try {
// 				const parsedUserData = JSON.parse(storedUserData);
// 				setUserData(parsedUserData);
// 			} catch (err) {
// 				console.error("Error parsing userData:", err);
// 				setError("Failed to load user data.");
// 			}
// 		} else {
// 			setError("No user data found. Please log in again.");
// 		}
// 		setIsLoading(false);
// 	}, []);

// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		localStorage.removeItem("refreshToken");
// 		localStorage.removeItem("user");
// 		localStorage.removeItem("id");
// 		localStorage.removeItem("companies");
// 		localStorage.removeItem("userData"); // Удаляем userData при выходе
// 		navigate("/");
// 	};

// 	const token = userData?.token; // Получаем token из userData

// 	return (
// 		<header className="fixed bottom-0 left-0 right-0 h-30 flex md:gap-4 *:items-center justify-between md:justify-normal bg-white md:bg-inherit">
// 			<div className="flex items-center space-x-4 md:pl-4 md:rounded-tr-2xl md:w-[calc(100vw-16rem)] bg-white">
// 				<button className="p-2 rounded-full hover:bg-gray-200" aria-label="Settings">
// 					<span>{selectedMenu}</span>
// 				</button>
// 				{selectedMenu === "Сотрудники" && selectedEmployee && (
// 					<div className="flex flex-col text-sm">
// 						<span>Телефон: {selectedEmployee.phone}</span>
// 						<span>Посещений: {selectedEmployee.visits}</span>
// 						<span>Отмененные: {selectedEmployee.canceled}</span>
// 						<span>Выручка: {selectedEmployee.revenue}</span>
// 					</div>
// 				)}
// 			</div>
// 			<div className="flex items-center space-x-4 md:w-64 md:pl-6 md:rounded-tl-2xl bg-white">
// 				<button
// 					className="md:hidden p-2 rounded-full hover:bg-gray-200"
// 					onClick={onToggleLeftSidebar}
// 					aria-label="Toggle left sidebar"
// 				>
// 					<span>☰</span>
// 				</button>
// 				{isLoading ? (
// 					<p>Loading...</p>
// 				) : error ? (
// 					<p className="text-red-600">{error}</p>
// 				) : token ? (
// 					<div className="flex items-center gap-4">
// 						<a className="text-lg font-bold" href="/dashboard">
// 							<p>{userData?.name || "User"}</p>
// 						</a>
// 						{/* <p className="text-sm">Token: {token}</p> Отображаем token */}
// 						<button
// 							onClick={handleLogout}
// 							className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left text-red-600"
// 						>
// 							Выйти
// 						</button>
// 					</div>
// 				) : (
// 					<a className="text-lg font-bold" href="/BusinessRegPage">
// 						Регистрация
// 					</a>
// 				)}
// 			</div>
// 		</header>
// 	);
// };

// export default Header;

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ onToggleLeftSidebar, selectedMenu, selectedEmployee }) => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedUserData = localStorage.getItem("token");

		if (storedUserData) {
			try {

				// Устанавливаем состояние с полученным объектом
				setUserData(storedUserData);

			} catch (err) {
				console.error("Error parsing userData:", err);
				setError("Failed to load user data.");
			}
		} else {
			setError("No user data found. Please log in again.");
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (userData) {
			console.log("Updated user data:", userData);
		}
	}, [userData]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
		localStorage.removeItem("id");
		localStorage.removeItem("companies");
		localStorage.removeItem("userData");
		navigate("/");
	};



	return (
		<header className="fixed bottom-0 left-0 right-0 h-30 flex md:gap-4 *:items-center justify-between md:justify-normal bg-white md:bg-inherit">
			<div className="flex items-center space-x-4 md:pl-4 md:rounded-tl-2xl и md:rounded-tr-2xl md:w-[calc(100vw)] bg-white">
				<button className="p-2 rounded-full hover:bg-gray-200" aria-label="Settings">
					<span>{selectedMenu}</span>
				</button>
				{selectedMenu === "Сотрудники" && selectedEmployee && (
					<div className="flex flex-col text-sm">
						<span>Сотрудник: {selectedEmployee.name}</span>
						<span>Телефон: {selectedEmployee.phone}</span>
						<span>Посещений: {selectedEmployee.visits}</span>
						<span>Отмененные: {selectedEmployee.canceled}</span>
						<span>Выручка: {selectedEmployee.revenue}</span>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;