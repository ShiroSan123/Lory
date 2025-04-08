import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
	const [formData, setFormData] = useState({
		telegramId: "",
		name: "",
		email: "",
	});
	const [responseMessage, setResponseMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setResponseMessage("");
		setError("");

		try {
			// Шаг 1: Авторизация (POST /auth/oauth)
			console.log("Sending request to:", `${import.meta.env.VITE_API_BASE_URL}/auth/oauth`);
			console.log("Form data:", formData);

			const authResponse = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Auth response data:", authResponse.data);

			const { accessToken, user, id } = authResponse.data;
			if (!accessToken) {
				setError("No access token received from server.");
				return;
			}

			// Шаг 2: Получение данных пользователя (GET /auth/me)
			let userData = null;
			try {
				console.log("Fetching user data with token:", accessToken);
				const userResponse = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/auth/me`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				console.log("Fetched user data:", userResponse.data);

				// Добавляем accessToken в данные пользователя
				userData = {
					...userResponse.data, // Данные из /auth/me
					token: accessToken,   // Добавляем token
				};

				// Сохраняем userData в localStorage
				localStorage.setItem("userData", JSON.stringify(userData));
			} catch (fetchErr) {
				console.error("Error fetching user data:", fetchErr);
				setError("Failed to fetch user data, but login was successful.");
				// Продолжаем, даже если не удалось получить данные
			}

			// Сохраняем остальные данные в localStorage
			localStorage.setItem("token", accessToken);
			localStorage.setItem("user", user);
			localStorage.setItem("id", id);
			console.log("Saved token:", localStorage.getItem("token"));

			// Шаг 3: Успешное завершение
			setResponseMessage("Login successful!");
			setTimeout(() => navigate("/Dashboard"), 2000);
		} catch (err) {
			setError(err.response?.data?.message || "Login failed. Please try again.");
			console.error("Error:", err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="telegramId" className="block text-sm font-medium">
							Telegram ID
						</label>
						<input
							type="text"
							name="telegramId"
							id="telegramId"
							value={formData.telegramId}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
							placeholder="Enter telegram ID"
							required
						/>
					</div>
					<div>
						<label htmlFor="name" className="block text-sm font-medium">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							value={formData.name}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
							placeholder="Enter name"
							required
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
							placeholder="Enter email"
							required
						/>
					</div>
					{responseMessage && (
						<p className="text-green-600 text-center">{responseMessage}</p>
					)}
					{error && <p className="text-red-600 text-center">{error}</p>}
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginUser;