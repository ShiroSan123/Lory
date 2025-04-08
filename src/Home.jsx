import './index.css';
import HeroSection from './sections/Home/hero';
import { useEffect, useRef } from 'react';
import WhyWee from './sections/Home/WhyWe';
import Header from './components/navbar';
import Reviews from './sections/Home/Reviews';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './context/TelegramContext';

const HomePage = () => {
  const { isTelegram, userData } = useTelegram();
  const navigate = useNavigate();
  // Флаг, для того чтобы запрос выполнился только один раз
  const authTriggered = useRef(false);

  useEffect(() => {
    if (!authTriggered.current && isTelegram && userData) {
      authTriggered.current = true; // помечаем, что запрос уже выполнен

      // Формируем полезную нагрузку для запроса авторизации
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
        .then((res) => {
			alert(userData.user.id + " " + userData.user.first_name)
			alert(JSON.stringify(res, null, 2))
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
