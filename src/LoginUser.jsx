import { useState } from 'react';
import axiosInstance from './scripts/axiosInstance'; // Импортируем настроенный экземпляр Axios
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [responseMessage, setResponseMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setResponseMessage('');
		setError('');

		try {
			console.log('Sending request to:', `${import.meta.env.VITE_API_BASE_URL}/auth/login`);
			console.log('Form data:', formData);

			const response = await axiosInstance.post('/auth/login', formData);

			console.log('Response data:', response.data);

			const { accessToken, refreshToken, user, id } = response.data;
			if (accessToken) {
				localStorage.setItem('token', accessToken); // Сохраняем accessToken
				localStorage.setItem('refreshToken', refreshToken); // Сохраняем refreshToken
				localStorage.setItem('user', user); // Сохраняем User
				localStorage.setItem('id', id); // Сохраняем Id
				console.log('Saved token:', localStorage.getItem('token'));
				console.log('Saved refresh token:', localStorage.getItem('refreshToken'));
				setResponseMessage('Login successful!');
				setTimeout(() => navigate('/Dashboard'), 2000);
			} else {
				setError('No access token received from server.');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed. Please try again.');
			console.error('Error:', err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
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
				<p className="mt-4 text-center text-sm">
					Don't have an account?{' '}
					<a href="/RegUser" className="text-blue-600 hover:underline">
						Register here
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginUser;