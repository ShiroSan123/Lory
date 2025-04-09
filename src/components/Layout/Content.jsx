// BusinessContent.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Content = ({ token, baseUrl, selectedEmployee, handleUpdateCompany }) => {
  const navigate = useNavigate();
  const companyId = selectedEmployee?.companyId;
  const [companyData, setCompanyData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchCompanyData = useCallback(async () => {
    console.log(companyId, token);
    
    // if (!companyId || !token) {
    //   setFetchError('Отсутствует ID компании или токен авторизации');
    //   return;
    // }
    setIsFetching(true);
    setFetchError('');
    try {
      const response = await axios.get(
        `${baseUrl}/business/admin`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const businesses = response.data;
      const selectedCompany = businesses.find(b => b.id === companyId) || businesses[0];
      if (!selectedCompany) {
        setFetchError('Компания не найдена в списке');
        return;
      }
      const normalizedCompany = {
        id: selectedCompany.id,
        name: selectedCompany.name || 'Не указано',
        description: selectedCompany.description || 'Не указано',
        type: selectedCompany.type || selectedCompany.businessType || 'Не указано',
        theme: selectedCompany.theme || { color: 'Не указано' },
        calendar: selectedCompany.calendar || false,
        analytics: selectedCompany.analytics || false,
        telegram: selectedCompany.telegram || false,
        aiText: selectedCompany.aiText || false,
        socials: selectedCompany.socials || false,
        delivery: selectedCompany.delivery || false,
        createdAt: selectedCompany.createdAt,
        updatedAt: selectedCompany.updatedAt,
        ownerId: selectedCompany.ownerId
      };

      setCompanyData(normalizedCompany);

      // Сохранение в localStorage (если требуется)
      const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
      const updatedCompanies = savedCompanies.some(c => c.id === normalizedCompany.id)
        ? savedCompanies.map(c => (c.id === normalizedCompany.id ? normalizedCompany : c))
        : [...savedCompanies, normalizedCompany];
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке данных компании';
      setFetchError(errorMessage);
      const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
      const cachedCompany = savedCompanies.find(c => c.id === companyId);
      if (cachedCompany) {
        setCompanyData(cachedCompany);
      }
    } finally {
      setIsFetching(false);
    }
  }, [companyId, token, baseUrl]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const confirmSaveChanges = () => {
    if (window.confirm('Вы уверены, что хотите сохранить изменения?')) {
      // Передаём companyId в handleUpdateCompany, который определён в родительском компоненте
      handleUpdateCompany(companyId);
    }
  };

  const formatBoolean = (value) => (value === 'true' || value === true ? 'Да' : 'Нет');

  if (isFetching) {
    return <div className="p-4">Загрузка данных компании...</div>;
  }

  if (fetchError && !companyData) {
    return <div className="p-4 text-red-600">{fetchError}</div>;
  }

  if (!companyData) {
    return <div className="p-4">Данные компании отсутствуют</div>;
  }

  return (
    <div className="p-4">
      <h1>Добро пожаловать в LoryCRM</h1>
    </div>
  );
};

export default Content;
