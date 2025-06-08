// src/components/WeightChart.jsx
import { Line } from 'react-chartjs-2';

function WeightChart({ weightChartData, chartOptions }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-sage-600 mb-6 flex items-center">
        📈 Your Progress Story
      </h2>
      <div className="bg-gradient-to-br from-sage-50 to-sage-25 p-6 rounded-xl w-full">
        <div className="mb-3">
          <p className="text-xs text-sage-500 text-center">
            💡 <strong>Tip:</strong> Click on legend items to hide/show lines
          </p>
        </div>
        <div className="w-full h-96">
          <Line 
            data={weightChartData} 
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default WeightChart;