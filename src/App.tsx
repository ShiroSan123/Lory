import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { TelegramProvider } from './context/TelegramContext';
import { ThemeProvider } from './ThemeContext'; // Импортируем ThemeProvider
import ProtectedRoute from './server/ProtectedRoute';

// Pages
import HomePage from './Home';
import BusinessRegPage from './BusinessReg';
import Dashboard from './Dashboard';
import RegUser from './RegUser';
import LoginUser from './LoginUser';
import Gallery from './Gallery';
import TelegramProfile from './TelegramProfile';

// Интерфейс для пользователя Telegram
interface TelegramUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code?: string;
	is_premium?: boolean;
	allows_write_to_pm?: boolean;
	photo_url?: string;
}

// Интерфейс для initDataUnsafe
interface InitDataUnsafe {
	user: TelegramUser;
	chat_instance?: string;
	chat_type?: string;
	auth_date?: string;
	signature?: string;
	hash?: string;
}

function App() {
	return (
		<ThemeProvider> {/* Оборачиваем всё приложение в ThemeProvider */}
			<TelegramProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
						<Route path="/BusinessRegPage" element={<BusinessRegPage />} />
						{/* <Route path="/RegUser" element={<RegUser />} /> */}
						<Route path="/Gallery" element={<Gallery />} />
						<Route path="/TelegramProfile" element={<TelegramProfile />} />
						<Route path="/LoginUser" element={<LoginUser />} />
					</Routes>
				</BrowserRouter>
			</TelegramProvider>
		</ThemeProvider>
	);
}

export default App;