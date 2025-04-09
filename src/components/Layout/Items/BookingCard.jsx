import { useState } from 'react';

const BookingCard = ({ service, onItemClick }) => {
  const { customParameters } = service;
  const localStorageKey = 'bookingItems';

  // Инициализация данных из localStorage или исходных параметров
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? JSON.parse(saved) : customParameters.items;
  });

  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newTable, setNewTable] = useState({
    name: '',
    seats: '',
    nearWindow: false,
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTable((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddBooking = () => {
    const updatedItems = [...items, newTable];
    setItems(updatedItems);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
    setNewTable({ name: '', seats: '', nearWindow: false, image: '' });
    setShowAddBooking(false);
  };

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-xl font-bold my-4 text-white">{customParameters.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((table, index) => (
          <div
            key={index}
            onClick={() => onItemClick(index)}
            className={`border border-gray-700 rounded-lg p-4 shadow-md flex items-center cursor-pointer ${
              table.occupied ? 'bg-red-700' : 'bg-green-700'
            }`}
          >
            <img
              src={table.image}
              alt={table.name}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{table.name}</h3>
              <p className="text-white">Мест: {table.seats}</p>
              <p className="text-white">{table.nearWindow ? 'У окна' : 'Не у окна'}</p>
            </div>
          </div>
        ))}
        {/* Элемент с плюсом для добавления нового стола */}
        <div
          className="border border-gray-700 rounded-lg p-4 shadow-md flex items-center justify-center cursor-pointer bg-gray-800"
          onClick={() => setShowAddBooking(true)}
        >
          <span className="text-3xl font-bold text-white">+</span>
        </div>
      </div>

      {/* Форма для добавления нового стола */}
      {showAddBooking && (
        <div className="mt-4 p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800">
          <h3 className="text-xl font-bold mb-4 text-white">Добавить новый стол</h3>
          <div className="mb-2">
            <label className="block mb-1 text-white">Название:</label>
            <input
              type="text"
              name="name"
              value={newTable.name}
              onChange={handleInputChange}
              className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 text-white">Количество мест:</label>
            <input
              type="number"
              name="seats"
              value={newTable.seats}
              onChange={handleInputChange}
              className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              name="nearWindow"
              checked={newTable.nearWindow}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-white">У окна</label>
          </div>
          <div className="mb-2">
            <label className="block mb-1 text-white">URL изображения:</label>
            <input
              type="text"
              name="image"
              value={newTable.image}
              onChange={handleInputChange}
              className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddBooking}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Добавить
            </button>
            <button
              onClick={() => setShowAddBooking(false)}
              className="ml-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
