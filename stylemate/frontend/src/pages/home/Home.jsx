export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center">
      

      {/* Main Content */}
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-gray-800">Your Personal AI Stylist</h2>
        <p className="text-gray-600 mt-2">Get personalized outfit recommendations based on your wardrobe</p>
      </div>

      {/* Outfit Generator */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mt-8 w-96">
        <h3 className="text-lg font-semibold text-purple-600 text-center">Generate Your Outfit</h3>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            placeholder="What's the occasion?"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Generate</button>
        </div>

        {/* Weather Display */}
        <div className="mt-6 bg-gradient-to-r from-green-400 to-purple-500 p-4 rounded-lg text-white">
          <h4 className="text-lg font-semibold">San Francisco</h4>
          <p className="text-sm">Partly Cloudy</p>
          <p className="text-3xl font-bold">72°F</p>
          <p className="text-xs">Feels like 70°F</p>
        </div>
      </div>
    </div>
  );
}
