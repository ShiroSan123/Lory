import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';
import { useTelegram } from './context/TelegramContext';

const Gallery = () => {
  const { userData } = useTelegram();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  // Запрос авторизации через Telegram
  useEffect(() => {
    if (userData) {
      fetch('https://bims14.ru/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initData: userData })
      })
        .then(response => response.json())
        .then(data => {
          const { accessToken, refreshToken } = data;
          // Сохраняем токены в cookies
          document.cookie = `ACCESS_TOKEN=${accessToken}; path=/; secure; SameSite=Strict`;
          document.cookie = `REFRESH_TOKEN=${refreshToken}; path=/; secure; SameSite=Strict`;
          // Выводим токены в alert
          alert(`Access Token: ${accessToken}\nRefresh Token: ${refreshToken}`);
        })
        .catch(error => {
          console.error('Ошибка авторизации через Telegram:', error);
        });
    }
  }, [userData]);
 
  // Запрос списка компаний
  useEffect(() => {
    fetch('{{BASE_URL}}/catalog/companies')
      .then(response => response.json())
      .then(data => {
        setCompanies(data);
      })
      .catch(error => {
        console.error('Ошибка загрузки компаний:', error);
      });
  }, []);

  return (
    <div className="gallery-container">
      <div className="telegram-auth">
        <h2>Telegram Auth</h2>
        <p>zaebis</p>
        <button onClick={() => navigate('/TelegramProfile')}>ProfileClick</button>
      </div>
      <div className="companies">
        <h2>Список компаний</h2>
        <ul className="company-list">
          {companies.map(company => (
            <li key={company.id} className="company-item">
              <h3>{company.name}</h3>
              <p>{company.description}</p>
              <p>
                <strong>Тип бизнеса:</strong> {company.businessType}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
