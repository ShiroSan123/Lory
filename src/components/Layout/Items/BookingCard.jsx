// BookingCard.jsx
const BookingCard = ({ service, onItemClick }) => {
    const { customParameters } = service;
    return (
      <div>
        <h2 className="text-xl font-bold my-4">{customParameters.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customParameters.items.map((table, index) => (
            <div
              key={index}
              onClick={() => onItemClick(index)}
              className={`border rounded-lg p-4 shadow-md flex items-center cursor-pointer ${
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
  
  export default BookingCard;
  