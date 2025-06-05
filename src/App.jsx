import { useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => setData(result.data),
    });
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Data</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="border p-2 rounded" />
        </div>
        {data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>
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