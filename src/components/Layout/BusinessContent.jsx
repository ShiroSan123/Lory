import { useState, useEffect } from 'react';
import axios from 'axios';

function RightSidebarServices({ baseUrl, companyId, service }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Состояние для отслеживания раскрытия услуг (аккордеон)
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  // Состояния для кастомной услуги
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customService, setCustomService] = useState('');
  // Состояние для отслеживания последнего клика
  const [lastClicked, setLastClicked] = useState({ serviceId: null, index: null });

  // Функция для вызова родительского обработчика с объектом параметров
  const onService = (params) => {
    service(params);
  };

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
    setExpandedServiceId(null);
  }, [baseUrl, companyId]);

  // Загрузка кастомной услуги из localStorage при монтировании
  useEffect(() => {
    const storedCustomService = localStorage.getItem('customService');
    if (storedCustomService) {
      setCustomService(storedCustomService);
    }
  }, []);

  const toggleService = (serviceId) => {
    setExpandedServiceId((prevServiceId) =>
      prevServiceId === serviceId ? null : serviceId
    );
  };

  const saveCustomService = () => {
    if (customInput.trim() === '') return;
    setCustomService(customInput);
    localStorage.setItem('customService', customInput);
    setCustomInput('');
    setShowCustomInput(false);
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
        <>
          {services.map((serviceItem) => {
            const items = serviceItem.customParameters?.items || [];
            return (
              <div key={serviceItem.id} className="mb-4 rounded-lg">
                {/* Заголовок услуги */}
                <button
                  className={`flex text-gray-500 text-lg items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded-lg border-0 focus:outline-none ${
                    lastClicked.serviceId === serviceItem.id && lastClicked.index === -1
                      ? 'bg-blue-200'
                      : ''
                  }`}
                  onClick={() => {
                    toggleService(serviceItem.id);
                    onService({ id: serviceItem.id, index: -1 });
                    setLastClicked({ serviceId: serviceItem.id, index: -1 });
                  }}
                >
                  <span className="font-medium">
                    {serviceItem.customParameters.name || 'Без названия услуги'}
                  </span>
                  <img
                    src={
                      expandedServiceId === serviceItem.id
                        ? '/ico/arDown.svg'
                        : '/ico/arRight.svg'
                    }
                    alt={
                      expandedServiceId === serviceItem.id
                        ? 'Свернуть'
                        : 'Развернуть'
                    }
                    className="w-4 h-4"
                  />
                </button>
                {expandedServiceId === serviceItem.id && (
                  <div className="pl-4 mt-2">
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-700">Товары не найдены.</p>
                    ) : (
                      items.map((item, index) => (
                        <div key={index} className="mb-2">
                          <button
                            className={`text-gray-500 text-lg hover:underline focus:outline-none ${
                              lastClicked.serviceId === serviceItem.id && lastClicked.index === index
                                ? 'bg-blue-200'
                                : ''
                            }`}
                            onClick={() => {
                              onService({ id: serviceItem.id, index });
                              setLastClicked({ serviceId: serviceItem.id, index });
                            }}
                          >
                            {item.name || 'Без названия'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default RightSidebarServices;
