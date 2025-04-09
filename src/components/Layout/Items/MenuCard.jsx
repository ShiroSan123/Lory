import { useState } from 'react';

const MenuCard = ({ service, onItemClick }) => {
  const {customParameters }  = service;
  // Формируем уникальный ключ, используя идентификатор сервиса. 
  // Если customParameters.id отсутствует, можно использовать другое уникальное свойство, например customParameters.name.
  const localStorageKey = `menuItems_${service.id}`;
  console.log(customParameters)
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(`menuItems_${service.id}`);
    return saved ? JSON.parse(saved) : customParameters.items;
  });
  
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const updatedItems = [...items, newProduct]; // добавляем новый элемент в конец массива
    setItems(updatedItems);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
    setNewProduct({ name: '', description: '', price: '', image: '' });
    setShowAddProduct(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold my-4">{customParameters.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-md cursor-pointer"
            onClick={() => onItemClick(index)}
          >
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
        {/* Элемент с плюсом для добавления нового товара */}
        <div
          className="border rounded-lg p-4 shadow-md flex items-center justify-center cursor-pointer"
          onClick={() => setShowAddProduct(true)}
        >
          <span className="text-3xl font-bold">+</span>
        </div>
      </div>

      {/* Форма для добавления нового товара */}
      {showAddProduct && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Добавить новый товар</h3>
          <div className="mb-2">
            <label className="block mb-1">Название:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Описание:</label>
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Цена:</label>
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">URL изображения:</label>
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Добавить
            </button>
            <button
              onClick={() => setShowAddProduct(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCard;
