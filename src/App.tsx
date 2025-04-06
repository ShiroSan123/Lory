import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Убраны дубликаты импортов
import './index.css';
import { TelegramProvider } from './context/TelegramContext';
import ProtectedRoute from './server/ProtectedRoute';

// Pages
import HomePage from './Home';
import BusinessRegPage from './BusinessReg';
import Dashboard from './Dashboard';
import RegUser from './RegUser';
import LoginUser from './LoginUser';
import Gallery from './Gallery';

// function App() {
// 	const [count, setCount] = useState<number>(0); // Тип для count

// 	return (
// 		<BrowserRouter>
// 			<Routes>
// 				<Route path="/" element={<HomePage />} />
// 				<Route path="/Dashboard" element={<Dashboard />} />
// 				<Route path="/BusinessRegPage" element={<BusinessRegPage />} />
// 			</Routes>
// 		</BrowserRouter>
// 	);
// }

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
		<TelegramProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
					<Route path="/BusinessRegPage" element={<BusinessRegPage />} />
					<Route path="/RegUser" element={<RegUser />} />
					<Route path="/Gallery" element={<Gallery />} />
					<Route path="/LoginUser" element={<LoginUser />} />
				</Routes>
			</BrowserRouter>
		</TelegramProvider>
	);
}

export default App;