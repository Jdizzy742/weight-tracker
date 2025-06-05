import { useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    weight: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => setData(result.data),
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.date && formData.weight) {
      setData([...data, formData]);
      setFormData({
        date: '',
        weight: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    }
  };

  const weightChartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: data.map((entry) => parseFloat(entry.weight)),
        borderColor: '#10B981',
        tension: 0.4,
      },
    ],
  };

  const sevenDayAvgWeight = data.length
    ? (data.slice(-7).reduce((sum, entry) => sum + parseFloat(entry.weight), 0) / Math.min(data.length, 7)).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-bold text-gray-800">Weight Tracker</h1>
      </header>
      <main className="max-w-4xl mx-auto">
        {/* CSV Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Data</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="border p-2 rounded" />
        </div>

        {/* Manual Entry Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
              <input
                type="number"
                name="fats"
                value={formData.fats}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Entry
              </button>
            </div>
          </form>
        </div>

        {/* Dashboard */}
        {/* Enhanced Dashboard with Nutrition KPIs */}
        {data.length > 0 && (
          <>
            {/* Weight KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-600">Current Weight</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {data[data.length - 1].weight} lbs
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-600">7-Day Avg Weight</h3>
                <p className="text-2xl font-bold text-gray-800">{sevenDayAvgWeight} lbs</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-600">Weight Change</h3>
                <p className="text-2xl font-bold text-green-600">
                  {data.length > 1 
                    ? (parseFloat(data[data.length - 1].weight) - parseFloat(data[0].weight)).toFixed(1)
                    : '0.0'
                  } lbs
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-600">Total Entries</h3>
                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
              </div>
            </div>

            {/* Nutrition Summary Table */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nutrition Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Period</th>
                      <th className="py-3 px-4 text-sm font-semibold text-orange-600">Calories</th>
                      <th className="py-3 px-4 text-sm font-semibold text-red-600">Protein (g)</th>
                      <th className="py-3 px-4 text-sm font-semibold text-yellow-600">Carbs (g)</th>
                      <th className="py-3 px-4 text-sm font-semibold text-purple-600">Fats (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 30-Day Averages */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-700">30-Day Avg</td>
                      <td className="py-4 px-4 text-lg font-bold text-orange-600">
                        {data.length > 0 && data.some(entry => entry.calories)
                          ? Math.round(data.slice(-30).filter(entry => entry.calories).reduce((sum, entry) => sum + parseFloat(entry.calories || 0), 0) / Math.min(data.slice(-30).filter(entry => entry.calories).length, 30))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-red-600">
                        {data.length > 0 && data.some(entry => entry.protein)
                          ? Math.round(data.slice(-30).filter(entry => entry.protein).reduce((sum, entry) => sum + parseFloat(entry.protein || 0), 0) / Math.min(data.slice(-30).filter(entry => entry.protein).length, 30))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-yellow-600">
                        {data.length > 0 && data.some(entry => entry.carbs)
                          ? Math.round(data.slice(-30).filter(entry => entry.carbs).reduce((sum, entry) => sum + parseFloat(entry.carbs || 0), 0) / Math.min(data.slice(-30).filter(entry => entry.carbs).length, 30))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-purple-600">
                        {data.length > 0 && data.some(entry => entry.fats)
                          ? Math.round(data.slice(-30).filter(entry => entry.fats).reduce((sum, entry) => sum + parseFloat(entry.fats || 0), 0) / Math.min(data.slice(-30).filter(entry => entry.fats).length, 30))
                          : 'N/A'
                        }
                      </td>
                    </tr>
                    {/* 7-Day Averages */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-700">7-Day Avg</td>
                      <td className="py-4 px-4 text-lg font-bold text-orange-600">
                        {data.length > 0 && data.some(entry => entry.calories)
                          ? Math.round(data.slice(-7).filter(entry => entry.calories).reduce((sum, entry) => sum + parseFloat(entry.calories || 0), 0) / Math.min(data.slice(-7).filter(entry => entry.calories).length, 7))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-red-600">
                        {data.length > 0 && data.some(entry => entry.protein)
                          ? Math.round(data.slice(-7).filter(entry => entry.protein).reduce((sum, entry) => sum + parseFloat(entry.protein || 0), 0) / Math.min(data.slice(-7).filter(entry => entry.protein).length, 7))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-yellow-600">
                        {data.length > 0 && data.some(entry => entry.carbs)
                          ? Math.round(data.slice(-7).filter(entry => entry.carbs).reduce((sum, entry) => sum + parseFloat(entry.carbs || 0), 0) / Math.min(data.slice(-7).filter(entry => entry.carbs).length, 7))
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-4 text-lg font-bold text-purple-600">
                        {data.length > 0 && data.some(entry => entry.fats)
                          ? Math.round(data.slice(-7).filter(entry => entry.fats).reduce((sum, entry) => sum + parseFloat(entry.fats || 0), 0) / Math.min(data.slice(-7).filter(entry => entry.fats).length, 7))
                          : 'N/A'
                        }
                      </td>
                    </tr>
                    {/* Today's Nutrition */}
                    <tr>
                      <td className="py-4 px-4 font-medium text-gray-700">Today</td>
                      <td className="py-4 px-4 text-xl font-bold text-orange-600">
                        {data[data.length - 1]?.calories || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-red-600">
                        {data[data.length - 1]?.protein || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-yellow-600">
                        {data[data.length - 1]?.carbs || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-purple-600">
                        {data[data.length - 1]?.fats || 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weight Trend</h2>
              <Line data={weightChartData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;