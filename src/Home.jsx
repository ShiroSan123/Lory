import './index.css';
import HeroSection from './sections/Home/hero';
import { useEffect } from 'react';
import WhyWee from './sections/Home/WhyWe';
import Header from './components/navbar';
import Reviews from './sections/Home/Reviews';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './context/TelegramContext';

const HomePage = () => {
  const { isTelegram, userData } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTelegram && userData) {
      // Формируем полезную нагрузку для запроса авторизации
      const payload = {
        telegramId: userData.telegramId,
        name: userData.name,
      };

      // Отправляем POST-запрос на эндпоинт авторизации через Telegram OAuth
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Authorization failed');
          }
          return res.json();
        })
        .then((data) => {
          // Сохраняем полученные токены
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // Далее отправляем запрос к эндпоинту auth/me для получения дополнительных данных пользователя
          return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Передаём токен для авторизации запроса
              'Authorization': `Bearer ${data.accessToken}`,
            },
          });
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Fetching user info failed');
          }
          return res.json();
        })
        .then((userInfo) => {
          // Сохраняем данные пользователя, полученные с auth/me
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          // Переходим на страницу Dashboard
          navigate('/Dashboard');
        })
        .catch((err) => {
          console.error('Authorization error:', err);
        });
    }
  }, [isTelegram, userData, navigate]);

  return (
    <>
      <Header />
      <HeroSection />
      <WhyWee />
      <Reviews />
      <Footer />
    </>
  );
};

export default HomePage;
