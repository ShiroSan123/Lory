import './index.css';
import HeroSection from './sections/Home/hero';
import { useEffect, useRef, useState } from 'react';
import WhyWee from './sections/Home/WhyWe';
import Header from './components/navbar';
import Reviews from './sections/Home/Reviews';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './context/TelegramContext';

const HomePage = () => {
  const { isTelegram, userData } = useTelegram();
  const navigate = useNavigate();
  const authTriggered = useRef(false);
  const isLocalhost = window.location.hostname === 'localhost';

  // Состояния для тестового ввода (локальный режим)
  const [testTgId, setTestTgId] = useState('');
  const [testName, setTestName] = useState('');

  // Функция тестовой авторизации (для локального запуска)
  const handleTestAuth = () => {
    const payload = {
      telegramId: testTgId,
      name: testName,
    };
	console.log( testTgId + " " + testName) 
    // Запрос авторизации через эндпоинт auth/oauth
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        // Сохраняем полученные токены
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
		console.log( data.accessToken)
        // Запрос дополнительных данных пользователя через эндпоинт auth/me,
        // используя accessToken для авторизации
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        });
      })
      .then((res) => res.json())
      .then((userInfo) => {
		console.log( userInfo)
		console.log("auth")
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
		  localStorage.setItem("auth_me", JSON.stringify(userInfo));
        localStorage.setItem("id", userInfo.id);
        localStorage.setItem("telegramId", userInfo.telegramId);
        localStorage.setItem("name", userInfo.name);
		  localStorage.setItem("user", userInfo.name);

        // Переход к Dashboard через 2 секунды
        setTimeout(() => navigate("/Dashboard"), 2000);
      })
      .catch((err) => {
        console.error('Authorization error:', err);
      });
  };

  useEffect(() => {
    // Если приложение запущено на localhost, не выполняем автоавторизацию
    if (window.location.hostname === 'localhost') return;
  
    // Убедимся, что Telegram данные доступны
    if (isTelegram && userData) {
      const doAuth = async () => {
        try {
          // Ждем 1 секунду перед авторизацией (если требуется задержка)
  
          const payload = {
            telegramId: String(userData.user.id),
            name: userData.user.first_name,
          };
  
          // Авторизация через endpoint auth/oauth
          const authResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
  
          const authData = await authResponse.json();
  
          // Сохраняем токены
          localStorage.setItem('token', authData.accessToken);
          localStorage.setItem('refreshToken', authData.refreshToken);
  
          // Запрашиваем дополнительные данные пользователя через auth/me
          const meResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authData.accessToken}`,
            },
          });
  
          const userInfo = await meResponse.json();
          console.log("Полученные данные auth:", userInfo);
  
          // Сохраняем данные пользователя
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem("auth_me", JSON.stringify(userInfo));
          localStorage.setItem("id", userInfo.id);
          localStorage.setItem("telegramId", userInfo.telegramId);
          localStorage.setItem("name", userInfo.name);
          localStorage.setItem("user", userInfo.name);
  
          // Переход к Dashboard через 2 секунды
          navigate("/Dashboard")
        } catch (err) {
          console.error('Authorization error:', err);
        }
      };
  
      doAuth();
    }
  }, [isTelegram, userData, navigate]);
  

  return (
    <>
      <Header />
      {/* Если приложение запущено на localhost, отображаем тестовые инпуты */}
      {isLocalhost && (
        <div className="test-auth-container" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Telegram ID"
            value={testTgId}
            onChange={(e) => setTestTgId(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          <input
            type="text"
            placeholder="Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          <button onClick={handleTestAuth}>Test Authorization</button>
        </div>
      )}
      <HeroSection />
      <WhyWee />
      <Reviews />
      <Footer />
    </>
  );
};

export default HomePage;
