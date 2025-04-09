import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MenuCard from './Items/MenuCard';
import BookingCard from './Items/BookingCard';
import DashboardAnalytics from './Items/Dashboard';
import { useNavigate } from 'react-router-dom';

const BusinessContent = ({ token, baseUrl, selectedServiceId, onSelectItem, index }) => {
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const fetchCompanyData = useCallback(async () => {
    if (!selectedServiceId || !token) {
      setFetchError('Отсутствует ID услуги или токен авторизации');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    try {
      const response = await axios.get(
        `${baseUrl}/business/admin`,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      const businesses = response.data;

      let foundCompany = null;
      let foundService = null;

      for (const business of businesses) {
        if (business.services && business.services.length > 0) {
          const serviceItem = business.services.find(
            service => service.id === selectedServiceId
          );
          if (serviceItem) {
            foundCompany = business;
            foundService = serviceItem;
            break;
          }
        }
      }

      if (!foundCompany || !foundService) {
        setFetchError('Сервис не найден');
        return;
      }

      setCompanyData(foundCompany);
      setSelectedService(foundService);
    } catch (err) {
      setFetchError(err.response?.data?.message || 'Ошибка при загрузке данных компании');
    } finally {
      setIsFetching(false);
    }
  }, [selectedServiceId, token, baseUrl]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  // Сброс выбранного элемента при смене сервиса
  useEffect(() => {
    setSelectedItemIndex(-1);
  }, [selectedService]);

  const handleItemClick = (index) => {
    const itemsArray = selectedService?.customParameters?.items;
    if (!itemsArray || itemsArray.length <= index) {
      console.warn('Нет доступных айтемов или выбран неверный индекс');
      return;
    }
    setSelectedItemIndex(index);
    const selectedItem = itemsArray[index];
    onSelectItem(selectedItem);
  };

  const handleBack = () => {
    setSelectedItemIndex(-1);
    onSelectItem(null);
  };

  if (isFetching)
    return <div className="p-4">Загрузка данных компании...</div>;
  if (fetchError || !companyData || !selectedService)
    return <div className="p-4 text-red-600">{fetchError || 'Данные отсутствуют'}</div>;

  // Если выбран конкретный элемент, отображаем аналитический дешборд
  if (selectedItemIndex !== -1) {
    const itemsArray = selectedService.customParameters?.items;
    if (!itemsArray || itemsArray.length <= selectedItemIndex) {
      return <div className="p-4 text-red-600">Нет доступных айтемов для отображения</div>;
    }
    return (
      <div className="p-4">
        <button onClick={handleBack} className="mb-4 text-blue-500 underline">
          Назад к карточкам
        </button>
        <DashboardAnalytics
          item={itemsArray[selectedItemIndex]}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mt-8">
        {selectedService.moduleType === 'MENU' ? (
          <MenuCard
            key={selectedService.id}
            service={selectedService}
            onItemClick={handleItemClick}
          />
        ) : selectedService.moduleType === 'BOOKING' ? (
          <BookingCard
            key={selectedService.id}
            service={selectedService}
            onItemClick={handleItemClick}
          />
        ) : (
          <p>Неизвестный тип сервиса</p>
        )}
      </div>
    </div>
  );
};

export default BusinessContent;
