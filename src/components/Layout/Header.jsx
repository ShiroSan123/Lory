// Header.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ 
  onToggleLeftSidebar, 
  selectedMenu, 
  selectedEmployee, 
  selectedItem, 
  onUpdateItem 
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Локальное состояние для редактируемых полей выбранного элемента
  const [editedItem, setEditedItem] = useState(selectedItem || {});

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUserData(storedToken);
    } else {
      setError("No user data found. Please log in again.");
    }
    setIsLoading(false);
  }, []);

  // Обновление локального состояния при изменении selectedItem
  useEffect(() => {
    if (selectedItem) {
      setEditedItem(selectedItem);
    }
  }, [selectedItem]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdateItem(editedItem);
  };

  return (
    <header className="fixed bottom-0 left-0 right-0 h-30 flex md:gap-4 items-center justify-between bg-white">
      <div className="flex items-center space-x-4 md:pl-4">
        <button className="p-2 rounded-full hover:bg-gray-200" aria-label="Settings">
          <span>{selectedMenu}</span>
        </button>
        {selectedMenu === "Сотрудники" && selectedEmployee && (
          <div className="flex flex-col text-sm">
            <span>Сотрудник: {selectedEmployee.name}</span>
            <span>Телефон: {selectedEmployee.phone}</span>
          </div>
        )}
      </div>
      {selectedItem && (
        <div className="flex flex-col p-2 bg-gray-50 border rounded">
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={editedItem.name || ''}
              onChange={handleChange}
              className="ml-2 border rounded p-1"
            />
          </label>
          <label>
            Описание:
            <input
              type="text"
              name="description"
              value={editedItem.description || ''}
              onChange={handleChange}
              className="ml-2 border rounded p-1"
            />
          </label>
          <button onClick={handleSave} className="mt-2 p-1 bg-blue-500 text-white rounded">
            Сохранить
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
