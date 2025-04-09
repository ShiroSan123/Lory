import { useState, useEffect } from 'react';
import axios from 'axios';

function RightSidebarServices({ baseUrl, companyId, service }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [lastClicked, setLastClicked] = useState({ serviceId: null, index: null });

  const onService = (params) => {
    service(params);
  };

  useEffect(() => {
    if (!companyId) return;

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
    setExpandedServiceId(null);
  }, [baseUrl, companyId]);

  const toggleService = (serviceId) => {
    setExpandedServiceId(prevServiceId =>
      prevServiceId === serviceId ? null : serviceId
    );
  };

  const saveCustomService = async () => {
    if (customInput.trim() === '') return;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      const payload = {
        moduleType: "MENU",
        customParameters: {
          displayType: "list",
          name: customInput,
          items: []
        }
      };
      const response = await axios.post(`${baseUrl}/services/${companyId}`, payload, config);
      setServices(prevServices => [...prevServices, response.data]);
      setCustomInput('');
      setShowCustomInput(false);
    } catch (err) {
      console.error(err);
      setError('Ошибка при создании новой услуги');
    }
  };

  return (
    <div className="mt-4">
      {loading && (
        <p className="text-gray-600">Загрузка услуг...</p>
      )}
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {services.length > 0 ? (
        services.map((serviceItem) => {
          // Если в customParameters.moduleType указано "MENU", используем префикс "menuItems",
          // иначе (например, для бронирования) используем "bookingItems". Это позволит формировать уникальный ключ.
          const moduleType = serviceItem.customParameters?.moduleType;
          const keyPrefix = moduleType === "MENU" ? "menuItems" : "bookingItems";
          console.log("test228");
          
          console.log(serviceItem)
          const localStorageKey = `menuItems_${serviceItem.id}`;

          // Пытаемся получить сохранённые айтемы для данного сервиса из localStorage
          let itemsFromLocal = [];
          try {
            const stored = localStorage.getItem(localStorageKey);
            if (stored) {
              itemsFromLocal = JSON.parse(stored);
            }
          } catch (error) {
            console.error("Ошибка чтения localStorage для ключа", localStorageKey, error);
          }
          const items = (itemsFromLocal && itemsFromLocal.length > 0)
            ? itemsFromLocal
            : (serviceItem.customParameters?.items || []);

          return (
            <div key={serviceItem.id} className="mb-4 rounded-lg">
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
        })
      ) : (
        <p className="text-gray-600">Услуги не найдены.</p>
      )}

      {/* Блок создания новой услуги всегда отображается */}
      <div className="mb-4 rounded-lg">
        <button
          className={`flex text-gray-500 text-lg items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded-lg border-0 bg-blue-200 focus:outline-none ${
            lastClicked.serviceId === 'custom' ? 'bg-blue-200' : ''
          }`}
          onClick={() => {
            setShowCustomInput((prev) => !prev);
            setLastClicked({ serviceId: 'custom', index: null });
          }}
        >
          <span className="font-medium">+ Создать услугу</span>
        </button>
        {showCustomInput && (
          <div className="pl-4 mt-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Введите название услуги"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={saveCustomService}
              className="ml-2 text-blue-500 hover:underline"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RightSidebarServices;
