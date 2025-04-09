import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../scripts/axiosInstance';
import { useNavigate } from 'react-router-dom';
import RightSidebarServices from './RightSideBarServices';

function RightSidebar({ isOpen, onSelectMenu, selectedService }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');


  const onSelectedService = (service) => {
	console.log("service: ", service)
	selectedService(service);
  }

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const selectedCompanyObj = useMemo(
    () => companies.find((company) => company.id === selectedCompany),
    [companies, selectedCompany]
  );

  const handleLogout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("user");
	localStorage.removeItem("id");
	localStorage.removeItem("companies");
	localStorage.removeItem("userData");
	navigate("/");
};


  useEffect(() => {
    const fetchCompanies = async () => {
      if (!token) {
        setError('Токен авторизации отсутствует. Пожалуйста, войдите в систему.');
        navigate('/LoginUser');
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };
        const response = await axiosInstance.get('/business/admin', config);
        const businesses = response.data;
        if (!businesses || businesses.length === 0) {
          setCompanies([]);
        } else {
          const mappedBusinesses = businesses.map((business) => ({
            id: business.id,
            name: business.name,
            description: business.description,
            businessType: business.type,
            theme: business.theme?.color || '',
            calendar: business.calendar || 'false',
            analytics: business.analytics || 'false',
            telegram: business.telegram || 'false',
            aiText: business.aiText || 'true',
            socials: business.socials || 'false',
            delivery: business.delivery || 'false',
            image: business.image || '/compLogo.png',
          }));
          localStorage.setItem('businesses', JSON.stringify(mappedBusinesses));
          setCompanies(mappedBusinesses);
		  console.log("1")
		  console.log("start")
          if (mappedBusinesses.length > 0 && !selectedCompany) {
            setSelectedCompany(mappedBusinesses[0].id);
          }
        }
      } catch (err) {
        const status = err.response?.status;
        const errorMessage =
          status === 401
            ? 'Недействительный токен. Пожалуйста, войдите снова.'
            : err.response?.data?.message || 'Не удалось загрузить бизнес.';
        setError(errorMessage);
        const savedBusinesses = JSON.parse(localStorage.getItem('businesses'));
        if (savedBusinesses && savedBusinesses.length > 0) {
          setCompanies(savedBusinesses);
          if (!selectedCompany) {
            setSelectedCompany(savedBusinesses[0].id);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <aside
      className={`fixed top-0 right-0 w-64 h-[calc(100vh-136px)] rounded-bl-2xl bg-white z-20 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:top-0 flex flex-col`}
      aria-label="Боковая панель"
    >	
      <div className="flex-1 overflow-y-auto p-4">
        <img src="/logoMain.png" alt="" className="mb-5" />
        {isLoading ? (
          <p className="text-gray-600">Загрузка компаний...</p>
        ) : error ? (
          <p className="text-red-600 mb-4">{error}</p>
        ) : companies.length === 0 ? (
          <p className="text-gray-600">Компании не найдены.</p>
        ) : (
          <div className="mb-6 flex items-center justify-start p-2">
            <img
              className="w-10 h-10"
              src={selectedCompanyObj.image}
              alt={selectedCompanyObj.name || 'Фото компании'}
            />
            <select
              id="companySelect"
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                onSelectMenu('Business', { companyId: e.target.value });
              }}
              className="w-full p-2 text-gray-500 text-xl font-semibold rounded-lg border-0 focus:outline-none"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || 'Без названия'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Компонент для услуг выбранной компании */}
        <RightSidebarServices 
          baseUrl={import.meta.env.VITE_API_BASE_URL} 
          companyId={selectedCompany} 
		  service={onSelectedService}
        />
      </div>

      <div className="p-4 border-t border-gray-200 shrink-0 pt-0">
        <div className="mt-6 mb-6">
		<div onClick={() => onSelectMenu('LoryAI')} className="flex items-center p-2 gap-4 mb-3 rounded-lg w-full text-left select-none ">
            <img src="/ico/astronomy.svg" alt="Уведомления" className="w-5 h-5" />
            <span className="text-lg pb-[2px] font-semibold text-gray-500">LoryAI</span>
          </div>
          <div className="flex items-center p-2 gap-4 rounded-lg w-full text-left select-none items-center
">
            <img src="/ico/bell.svg" alt="Уведомления" className="w-5 h-5" />
            <span className="text-lg font-semibold pb-[2px] text-gray-500">Уведомления</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={localStorage.getItem('photo')}
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {localStorage.getItem('name')}
            </p>
            <p className="text-xs text-gray-500">Администратор</p>
          </div>
		  <button
							onClick={handleLogout}
							className="flex items-center p-2 gap-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left text-red-600"
						>
							Выйти
						</button>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
