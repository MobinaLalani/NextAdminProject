import React from "react";

function Table() {
  const data = [
    { id: 1, name: "علی رضایی", email: "ali@example.com", role: "مدیر" },
    { id: 2, name: "مریم احمدی", email: "maryam@example.com", role: "کاربر" },
    { id: 3, name: "حسین کاظمی", email: "hossein@example.com", role: "کاربر" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">لیست کاربران</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-right border-b">شناسه</th>
              <th className="px-4 py-2 text-right border-b">نام</th>
              <th className="px-4 py-2 text-right border-b">ایمیل</th>
              <th className="px-4 py-2 text-right border-b">نقش</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors border-b last:border-none"
              >
                <td className="px-4 py-2 text-right">{user.id}</td>
                <td className="px-4 py-2 text-right font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
