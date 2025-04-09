import { useState, useEffect } from 'react';
import axios from 'axios';

function RightSidebarServices({ baseUrl, companyId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Состояние для отслеживания раскрытия товаров у каждой услуги
  const [expandedServices, setExpandedServices] = useState({});

  useEffect(() => {
    if (!companyId) return; // Если компания не выбрана, ничего не запрашиваем

    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        };
        const response = await axios.get(`${baseUrl}/services/${companyId}`, config);
        setServices(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке услуг');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    // При смене компании сбрасываем раскрытие услуг
    setExpandedServices({});
  }, [baseUrl, companyId]);

  const toggleService = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-gray-600">Загрузка услуг...</p>
      ) : error ? (
        <p className="text-red-600 mb-4">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-gray-600">Услуги не найдены.</p>
      ) : (
        services.map((service) => {
          // Предполагается, что товары для услуги находятся в customParameters.items
          const items = service.customParameters?.items || [];
          return (
            <div key={service.id} className="mb-4 rounded-lg">
              <button
                className="flex text-gray-500 text-lg items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded-lg border-0 focus:outline-none"
                onClick={() => toggleService(service.id)}
              >

                <span className="font-medium ">
                  {service.customParameters.name || 'Без названия услуги'}
                </span>
                <img
                  src={expandedServices[service.id] ? '/ico/arDown.svg' : '/ico/arRight.svg'}
                  alt={expandedServices[service.id] ? 'Свернуть' : 'Развернуть'}
                  className="w-4 h-4"
                />
              </button>
              {expandedServices[service.id] && (
                <div className="pl-4 mt-2">
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-700">Товары не найдены.</p>
                  ) : (
                    items.map((item, index) => (
                      <div key={index} className="mb-2">
                        <h3 className=" text-gray-500 text-lg" >{item.name || 'Без названия'}</h3>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default RightSidebarServices;
