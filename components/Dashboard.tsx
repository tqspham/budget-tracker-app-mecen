'use client';

export default function Dashboard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Budget Tracker</h2>
      <p className="text-gray-600 mb-6">Welcome to your budget tracker dashboard. Start managing your finances today.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Income</h3>
          <p className="text-2xl font-bold text-blue-600">$0.00</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$0.00</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Balance</h3>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
        </div>
      </div>
    </div>
  );
}
