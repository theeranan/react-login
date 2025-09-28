import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        user={{
          avatar: "/images/avatar.jpg",
          name: "Somchai S.",
          room: "A-102",
        }}
      />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            สวัสดี, Somchai! ยินดีต้อนรับสู่หน้าหลัก
          </h2>
        </main>
      </div>

      <Footer />
    </div>
  );
}
