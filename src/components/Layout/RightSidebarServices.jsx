import { useState, useEffect } from 'react';
import axiosInstance from '../../scripts/axiosInstance';

function RightSidebarServices({ baseUrl, companyId, service: onSelectedService }) {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Флаг для показа формы создания нового сервиса
  const [isCreatingService, setIsCreatingService] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`${baseUrl}/services?companyId=${companyId}`);
        // Если сервисов нет, response.data может быть пустым массивом
        setServices(response.data || []);
      } catch (err) {
        setError('Ошибка загрузки сервисов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [baseUrl, companyId]);

  // Обработчик для начала создания нового сервиса
  const handleCreateService = () => {
    setIsCreatingService(true);
  };

  // Функция для обработки завершения создания сервиса
  // (например, можно добавить новый сервис в список)
  const handleServiceCreated = (newService) => {
    setServices(prev => [newService, ...prev]);
    setIsCreatingService(false);
    // Можно также вызывать onSelectedService(newService), если нужно сразу выбрать новый сервис
    onSelectedService(newService);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Сервисы</h3>

      {isLoading && <p>Загрузка сервисов...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Отображаем существующие сервисы, если они есть */}
      {services.length > 0 ? (
        services.map(service => (
          <div key={service.id} className="p-2 border-b flex justify-between items-center">
            <span>{service.name}</span>
            <button 
              onClick={() => onSelectedService(service)} 
              className="text-blue-600 hover:underline"
            >
              Выбрать
            </button>
          </div>
        ))
      ) : (
        // Сообщение, если сервисов нет
        <p>Сервисы не найдены.</p>
      )}

      {/* Кнопка для создания нового сервиса доступна всегда */}
      <button 
        onClick={handleCreateService} 
        className="mt-4 p-2 rounded-lg bg-green-600 text-white w-full hover:bg-green-700"
      >
        Создать новый сервис
      </button>

      {/* Здесь можно отобразить форму создания сервиса,
          если isCreatingService === true */}
      {isCreatingService && (
        <div className="mt-4 p-4 border rounded-lg">
          <h4 className="text-lg font-medium mb-2">Новый сервис</h4>
          {/* Пример формы. Логика отправки может быть вашей */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // Заглушка – создаём фиктивный сервис
              const newService = {
                id: Date.now(),
                name: e.target.elements.name.value,
              };
              handleServiceCreated(newService);
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Название сервиса"
              className="p-2 border rounded w-full mb-2"
              required
            />
            <button type="submit" className="p-2 rounded bg-blue-600 text-white w-full hover:bg-blue-700">
              Сохранить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RightSidebarServices;
