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
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
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
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        // Переход на страницу Dashboard после успешной авторизации
        navigate('/Dashboard');
      })
      .catch((err) => {
        console.error('Authorization error:', err);
      });
  };

  useEffect(() => {
    // Если приложение запущено на localhost, не выполняем автоавторизацию
    if (isLocalhost) return;
    
    if (!authTriggered.current && isTelegram && userData) {
      authTriggered.current = true; // помечаем, что запрос уже выполнен

      const payload = {
        telegramId: userData.user.id,
        name: userData.user.first_name,
      };

      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
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
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          navigate('/Dashboard');
        })
        .catch((err) => {
          console.error('Authorization error:', err);
        });
    }
  }, [isTelegram, userData, navigate, isLocalhost]);

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
