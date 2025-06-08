// src/components/NutritionChart.jsx
import { Line } from 'react-chartjs-2';

function NutritionChart({ 
  selectedNutritionMetric, 
  setSelectedNutritionMetric, 
  createNutritionChartData, 
  nutritionChartOptions 
}) {
  return (
    <div className="bg-sage-25 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-sage-700 flex items-center">
          📊 Nutrition Trends
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-sage-600 font-medium">Show:</span>
          <select
            value={selectedNutritionMetric}
            onChange={(e) => setSelectedNutritionMetric(e.target.value)}
            className="bg-white border border-sage-200 rounded-lg px-3 py-2 text-sm font-medium text-sage-700 focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
          >
            <option value="calories">🔥 Calories</option>
            <option value="protein">💪 Protein</option>
            <option value="carbs">⚡ Carbs</option>
            <option value="fats">🥑 Fats</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4">
        <div className="mb-3">
          <p className="text-xs text-sage-500 text-center">
            💡 <strong>Tip:</strong> Click on legend items to hide/show lines
          </p>
        </div>
        <div className="w-full h-80">
          <Line 
            data={createNutritionChartData()} 
            options={nutritionChartOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default NutritionChart;