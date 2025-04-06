import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegUser = () => {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
	});

	// Состояние для отображения ответа или ошибки
	const [responseMessage, setResponseMessage] = useState("");
	const [error, setError] = useState("");

	// Обработчик изменения полей формы
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const navigate = useNavigate();

	// Обработчик отправки формы
	const handleSubmit = async (e) => {
		e.preventDefault();
		setResponseMessage("");
		setError("");

		try {
			// Отправляем POST-запрос
			const response = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/register`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			// Успешный ответ
			setResponseMessage("User registered successfully!");
			setTimeout(() => navigate("/"), 2000);
			console.log(response.data); // Здесь будут данные, которые вернул сервер
		} catch (err) {
			// Обработка ошибки
			setError(
				err.response?.data?.message || "Something went wrong. Please try again."
			);
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Register Your Business
				</h2>

				{/* Форма */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium">
							Business Name
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

					<div>
						<label htmlFor="password" className="block text-sm font-medium">
							Password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
							placeholder="Enter password"
							required
						/>
					</div>

					{/* Сообщение об успехе или ошибке */}
					{responseMessage && (
						<p className="text-green-600 text-center">{responseMessage}</p>
					)}
					{error && <p className="text-red-600 text-center">{error}</p>}

					{/* Кнопка отправки */}
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
					>
						Register Business
					</button>
				</form>
				<p className="mt-4 text-center text-sm">
					Have an account?{" "}
					<a href="/LoginUser" className="text-blue-600 hover:underline">
						Sign in here
					</a>
				</p>
			</div>
		</div>
	)
}

export default RegUser;