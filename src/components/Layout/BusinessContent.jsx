// BusinessContent.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusinessContent = ({ token, baseUrl, selectedEmployee, handleUpdateCompany }) => {
  const navigate = useNavigate();
  const companyId = selectedEmployee?.companyId;
  const [companyData, setCompanyData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchCompanyData = useCallback(async () => {
    if (!companyId || !token) {
      setFetchError('Отсутствует ID компании или токен авторизации');
      return;
    }
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
      <h1 className="text-xl font-bold mb-4">Компания: {companyData.name}</h1>
      {updateError && <p className="text-red-600 mb-4">{updateError}</p>}
      {updateSuccess && <p className="text-green-600 mb-4">{updateSuccess}</p>}
      {fetchError && <p className="text-red-600 mb-4">{fetchError} (используются кэшированные данные)</p>}

      {isEditing ? (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              type="text"
              value={companyData.name || ''}
              onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={companyData.description || ''}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Тип бизнеса</label>
            <select
              value={companyData.type || ''}
              onChange={(e) => setCompanyData({ ...companyData, type: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SERVICE">Услуги</option>
              <option value="RESTAURANT">Ресторан</option>
              <option value="REAL_ESTATE">Недвижимость</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Цветовая тема</label>
            <select
              value={companyData.theme?.color || ''}
              onChange={(e) =>
                setCompanyData({ ...companyData, theme: { ...companyData.theme, color: e.target.value } })
              }
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blue">Синий</option>
              <option value="green">Зеленый</option>
              <option value="red">Красный</option>
            </select>
          </div>
          {/* Можно добавить остальные поля редактирования */}
          <div className="flex space-x-2">
            <button
              onClick={confirmSaveChanges}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Сохранить изменения
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">ID:</strong> {companyData.id}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Название:</strong> {companyData.name}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Описание:</strong> {companyData.description}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Тип бизнеса:</strong> {companyData.type}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Цветовая тема:</strong> {companyData.theme.color}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Календарь:</strong> {formatBoolean(companyData.calendar)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Аналитика:</strong> {formatBoolean(companyData.analytics)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Сотрудники:</strong> {formatBoolean(companyData.telegram)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">LoryAI:</strong> {formatBoolean(companyData.aiText)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Клиенты:</strong> {formatBoolean(companyData.socials)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Доставка:</strong> {formatBoolean(companyData.delivery)}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Владелец (ID):</strong> {companyData.ownerId || 'Не указано'}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Дата создания:</strong>{' '}
            {companyData.createdAt ? new Date(companyData.createdAt).toLocaleString() : 'Не указано'}
          </p>
          <p className="text-base text-gray-800 mb-3">
            <strong className="font-semibold">Дата обновления:</strong>{' '}
            {companyData.updatedAt ? new Date(companyData.updatedAt).toLocaleString() : 'Не указано'}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Изменить
            </button>
            <button
              onClick={fetchCompanyData}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              Обновить данные
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessContent;
