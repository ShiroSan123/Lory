import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Компонент для отображения карточек меню (moduleType = "MENU")
const MenuCard = ({ service }) => {
  const { customParameters } = service;
  return (
    <div>
      <h2 className="text-xl font-bold my-4">{customParameters.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customParameters.items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p>{item.description}</p>
            <p className="mt-2 text-gray-600">Цена: {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент для отображения карточек бронирования (moduleType = "BOOKING")
const BookingCard = ({ service }) => {
  const { customParameters } = service;
  return (
    <div>
      <h2 className="text-xl font-bold my-4">{customParameters.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customParameters.items.map((table, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 shadow-md flex items-center ${
              table.occupied ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            <img
              src={table.image}
              alt={table.name}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="text-lg font-bold">{table.name}</h3>
              <p>Мест: {table.seats}</p>
              <p>{table.nearWindow ? 'У окна' : 'Не у окна'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessContent = ({ token, baseUrl, selectedServiceId, index }) => {
  const navigate = useNavigate();

  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // Функция для загрузки данных компаний и поиска сервиса по идентификатору
  const fetchCompanyData = useCallback(async () => {
    console.log("fetch", selectedServiceId, token);
    
    if (!selectedServiceId || !token) {
      setFetchError('Отсутствует ID услуги или токен авторизации2');
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

      // Ищем компанию, у которой среди сервисов есть нужный сервис
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

      // Нормализуем данные компании
      const normalizedCompany = {
        id: foundCompany.id,
        name: foundCompany.name || 'Не указано',
        description: foundCompany.description || 'Не указано',
        type: foundCompany.type || foundCompany.businessType || 'Не указано',
        theme: foundCompany.theme || { color: 'Не указано' },
        calendar: foundCompany.calendar || false,
        analytics: foundCompany.analytics || false,
        telegram: foundCompany.telegram || false,
        aiText: foundCompany.aiText || false,
        socials: foundCompany.socials || false,
        delivery: foundCompany.delivery || false,
        createdAt: foundCompany.createdAt,
        updatedAt: foundCompany.updatedAt,
        ownerId: foundCompany.ownerId,
        services: foundCompany.services || []
      };

      setCompanyData(normalizedCompany);
      setSelectedService(foundService);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Ошибка при загрузке данных компании';
      setFetchError(errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, [selectedServiceId, token, baseUrl]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  if (isFetching) {
    return <div className="p-4">Загрузка данных компании...</div>;
  }
  if (fetchError || !companyData || !selectedService) {
    return <div className="p-4 text-red-600">{fetchError || 'Данные отсутствуют'}</div>;
  }

  return (
    <div className="p-4">
      <div className="mt-8">
        {(() => {
          switch (selectedService.moduleType) {
            case 'MENU':
              return <MenuCard key={selectedService.id} service={selectedService} />;
            case 'BOOKING':
              return <BookingCard key={selectedService.id} service={selectedService} />;
            default:
              return <p>Неизвестный тип сервиса</p>;
          }
        })()}
      </div>
    </div>
  );
};

export default BusinessContent;
