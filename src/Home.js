export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 text-gray-900">
      {/* Navbar */}
      <header className="bg-white/70 backdrop-blur-md shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-800 text-shadow-md">
            My Dormitory
          </h1>
          <nav className="flex gap-6 text-sky-900 font-medium">
            <a href="#" className="hover:text-sky-600">
              Home
            </a>
            <a href="#" className="hover:text-sky-600">
              Promotions
            </a>
            <a href="#" className="hover:text-sky-600">
              Gallery
            </a>
            <a href="#" className="hover:text-sky-600">
              Contact
            </a>
            <a
              href="#"
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-sky-900 text-shadow-lg mb-4">
          Welcome to Your Dream Dormitory
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto wrap-anywhere">
          Experience comfort, convenience, and style with our modern dormitory
          rooms and top-notch facilities. Enjoy daily promotions, quick
          maintenance, and friendly service — all in one place.
        </p>
        <div className="mt-8">
          <button className="px-6 py-3 bg-sky-600 text-white text-lg rounded-lg hover:bg-sky-500">
            View Promotions
          </button>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="bg-white/80 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-sky-800 mb-10">
            Today's Promotions
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-2xl shadow-lg mask-image[radial-gradient(ellipse_at_center,white,transparent)]">
              <h4 className="text-xl font-semibold text-sky-700 mb-2 text-shadow-sm">
                Free WiFi Upgrade
              </h4>
              <p className="text-gray-600">
                Get unlimited high-speed WiFi for your entire stay at no extra
                cost.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-6 bg-white rounded-2xl shadow-lg mask-image[radial-gradient(ellipse_at_center,white,transparent)]">
              <h4 className="text-xl font-semibold text-sky-700 mb-2 text-shadow-sm">
                20% Off Laundry
              </h4>
              <p className="text-gray-600">
                Enjoy clean clothes at a discounted price every weekend.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-6 bg-white rounded-2xl shadow-lg mask-image[radial-gradient(ellipse_at_center,white,transparent)]">
              <h4 className="text-xl font-semibold text-sky-700 mb-2 text-shadow-sm">
                Free Gym Access
              </h4>
              <p className="text-gray-600">
                Stay fit with unlimited access to our fully-equipped gym.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-6 mt-12 text-center">
        <p className="text-sm">
          &copy; 2025 My Dormitory. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
