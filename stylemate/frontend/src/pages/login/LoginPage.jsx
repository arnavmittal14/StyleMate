export default function LoginPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          {/* Title Section */}
          <h2 className="text-3xl font-bold text-purple-600 text-center">StyleMate</h2>
          <p className="text-gray-500 text-center mt-2">Sign in to your account</p>
  
          {/* Login Form */}
          <div className="mt-6">
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
  
            <label className="text-gray-600 text-sm mt-4 block">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
  
            <div className="flex justify-between items-center mt-2">
              <a href="#" className="text-sm text-purple-600 hover:underline">Forgot Password?</a>
            </div>
  
            {/* Login Button */}
            <button className="w-full mt-6 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Login
            </button>
  
            {/* Sign Up Link */}
            <p className="text-sm text-gray-500 text-center mt-4">
              Don't have an account? <a href="#" className="text-purple-600 hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  