export default function ClosetItem({ image, name, category, season }) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-4 w-64">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />
          <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200">
            💜
          </button>
        </div>
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-500 text-sm">{category} • {season}</p>
        </div>
      </div>
    );
  }
  