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
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => setData(result.data),
      });
    }
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
        borderColor: '#5a7f5a', // sage-500
        backgroundColor: 'rgba(90, 127, 90, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#5a7f5a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const sevenDayAvgWeight = data.length
    ? (data.slice(-7).reduce((sum, entry) => sum + parseFloat(entry.weight || 0), 0) / Math.min(data.length, 7)).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-sage-50 p-4 font-sans">
      {/* Header */}
      <header className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-sage-100 hover:shadow-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-sage-600 mb-2">
          Weight Tracker
        </h1>
        <p className="text-lg text-sage-500">
          Your friendly AI nutrition coach
        </p>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-6">
        {/* CSV Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-semibold text-sage-600 mb-4">Upload Data</h2>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sage-500 file:text-white file:hover:bg-sage-600"
          />
        </div>

        {/* Manual Entry Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-semibold text-sage-600 mb-6">Add New Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
                placeholder="Enter your weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Calories</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
                placeholder="Daily calories"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
                placeholder="Protein grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
                placeholder="Carb grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Fats (g)</label>
              <input
                type="number"
                name="fats"
                value={formData.fats}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
                placeholder="Fat grams"
              />
            </div>
            <div className="md:col-span-3 mt-4">
              <button
                type="submit"
                className="bg-sage-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-sage-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full md:w-auto"
              >
                ✨ Add Entry
              </button>
            </div>
          </form>
        </div>

        {/* Dashboard - Only shows when there's data */}
        {data.length > 0 && (
          <>
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-2xl p-6 border border-sage-200">
              <p className="text-sage-700 text-lg">
                🌱 <strong>Great job!</strong> You've logged <strong>{data.length}</strong> {data.length === 1 ? 'entry' : 'entries'}. 
                Consistency is the key to reaching your goals!
              </p>
            </div>

            {/* Weight KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sage-200 transition-colors">
                  <span className="text-sage-600 text-xl">⚖️</span>
                </div>
                <h3 className="text-sm font-medium text-sage-600 mb-2">Current Weight</h3>
                <p className="text-2xl font-bold text-sage-700">
                  {data[data.length - 1].weight} lbs
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-12 h-12 bg-warmBlue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-warmBlue-200 transition-colors">
                  <span className="text-warmBlue-600 text-xl">📊</span>
                </div>
                <h3 className="text-sm font-medium text-sage-600 mb-2">7-Day Average</h3>
                <p className="text-2xl font-bold text-warmBlue-600">{sevenDayAvgWeight} lbs</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-success-200 transition-colors">
                  <span className="text-success-600 text-xl">📈</span>
                </div>
                <h3 className="text-sm font-medium text-sage-600 mb-2">Weight Change</h3>
                <p className="text-2xl font-bold text-success-500">
                  {data.length > 1 
                    ? (parseFloat(data[data.length - 1].weight) - parseFloat(data[0].weight)).toFixed(1)
                    : '0.0'
                  } lbs
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-earth-200 transition-colors">
                  <span className="text-earth-600 text-xl">📅</span>
                </div>
                <h3 className="text-sm font-medium text-sage-600 mb-2">Total Entries</h3>
                <p className="text-2xl font-bold text-earth-600">{data.length}</p>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-sage-600 mb-6 flex items-center">
                📈 Your Progress Story
              </h2>
              <div className="bg-gradient-to-br from-sage-50 to-sage-25 p-6 rounded-xl">
                <Line 
                  data={weightChartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#5a7f5a',
                          font: {
                            family: 'Inter',
                            size: 14,
                            weight: '500'
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(90, 127, 90, 0.1)'
                        },
                        ticks: {
                          color: '#5a7f5a',
                          font: {
                            family: 'Inter'
                          }
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(90, 127, 90, 0.1)'
                        },
                        ticks: {
                          color: '#5a7f5a',
                          font: {
                            family: 'Inter'
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="bg-gradient-to-br from-sage-50 to-warmBlue-50 rounded-2xl p-8 text-center border border-sage-200">
            <div className="w-16 h-16 bg-sage-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-sage-600 text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-sage-700 mb-2">Start Your Journey</h3>
            <p className="text-sage-600 mb-4">
              Add your first entry above to begin tracking your progress. Every expert was once a beginner!
            </p>
            <p className="text-sm text-sage-500">
              💡 Tip: Consistency beats perfection. Even logging 3-4 times per week will show meaningful trends.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;