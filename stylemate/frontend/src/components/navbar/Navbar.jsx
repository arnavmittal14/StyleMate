export default function Navbar() {
    return (
      <nav className="w-full bg-white shadow-md flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-purple-600">StyleMate</h1>
        <div className="flex space-x-6 text-gray-600">
          <a href="#" className="font-medium hover:text-purple-600">Home</a>
          <a href="#" className="font-medium hover:text-purple-600">Closet</a>
          <a href="#" className="font-medium hover:text-purple-600">Favorites</a>
          <a href="#" className="font-medium hover:text-purple-600">Profile</a>
        </div>
      </nav>
    );
  }
  