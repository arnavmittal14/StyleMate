export default function FavoriteItem({ image, name, occasion, temperature }) {
    return (
      <div className="bg-white shadow-md rounded-2xl overflow-hidden w-72">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-80 object-cover" />
          <button className="absolute top-3 right-3 text-red-500 text-xl">❤️</button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Perfect for: {occasion}</p>
          <div className="mt-2 flex justify-between items-center text-purple-600 text-sm">
            <span>🌡 {temperature}</span>
            <button className="text-green-500 text-lg">🔗</button>
          </div>
        </div>
      </div>
    );
  }
  