// MenuCard.jsx
const MenuCard = ({ service, onItemClick }) => {
    const { customParameters } = service;
    return (
      <div>
        <h2 className="text-xl font-bold my-4">{customParameters.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customParameters.items.map((item, index) => (
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
        </div>
      </div>
    );
  };
  
  export default MenuCard;
  