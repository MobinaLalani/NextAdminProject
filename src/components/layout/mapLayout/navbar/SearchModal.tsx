"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { MapStore } from "@/store/mapStore";

interface SearchModalProps {
  children: React.ReactNode;
}

export default function SearchModal({ children }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"coords" | "address">("coords");

  // state برای تب مختصات
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // state برای تب آدرس
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const setSearchCoords = MapStore((state) => state.setSearchCoords);

  // تابع جستجوی آدرس با API نِشان
  const handleAddressSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://api.neshan.org/v1/search?term=${encodeURIComponent(
          query
        )}&lat=35.6892&lng=51.3890`,
        {
          headers: {
            "Api-Key": "web.28982402f11941ea986940075f138ff1", // همون کلید شما
          },
        }
      );

      const data = await res.json();
      if (data?.items?.length) {
        setResults(data.items);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Neshan API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* دکمه باز کردن مودال */}
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4 p-4 min-w-[350px]">
          <h2 className="text-lg font-bold mb-2 text-center">🔍 جستجوی نقشه</h2>

          {/* تب‌ها */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${
                activeTab === "coords"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("coords")}
            >
              بر اساس مختصات
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "address"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("address")}
            >
              بر اساس آدرس
            </button>
          </div>

          {/* محتوای تب مختصات */}
          {activeTab === "coords" && (
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-sm">Latitude</label>
              <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="مثلاً: 35.6892"
                className="border rounded px-3 py-2"
              />

              <label className="text-sm">Longitude</label>
              <input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="مثلاً: 51.3890"
                className="border rounded px-3 py-2"
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setSearchCoords({
                      lat: parseFloat(lat),
                      lng: parseFloat(lng),
                    });
                    setIsOpen(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  جستجو
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  لغو
                </button>
              </div>
            </div>
          )}

          {/* محتوای تب آدرس */}
          {activeTab === "address" && (
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-sm">آدرس</label>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثلاً: میدان آزادی"
                  className="border rounded px-3 py-2 flex-1"
                />
                <button
                  onClick={handleAddressSearch}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "در حال جستجو..." : "جستجو"}
                </button>
              </div>

              {/* نتایج جستجو */}
              <div className="border rounded max-h-64 overflow-auto mt-2">
                {loading && (
                  <div className="text-center py-4 text-gray-500">
                    در حال دریافت نتایج...
                  </div>
                )}
                {!loading && results.length === 0 && query && (
                  <div className="text-center py-4 text-gray-400">
                    نتیجه‌ای یافت نشد
                  </div>
                )}
                {!loading &&
                  results.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchCoords({
                          lat: item.location.y,
                          lng: item.location.x,
                        });
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        {item.address}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
