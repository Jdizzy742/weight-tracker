// src/components/Dashboard.jsx
import { Line } from 'react-chartjs-2';
import MetricsCards from './MetricsCards';
import WeightChart from './WeightChart';
import NutritionChart from './NutritionChart';
import RecentEntriesTable from './RecentEntriesTable';
import NutritionStatsCards from './NutritionStatsCards';

function Dashboard({ 
    data,                    
    entryStreak,
    weightMetrics,
    weightChartData,
    chartOptions,
    hasNutritionData,
    nutritionAvgs,
    showInsights,
    setShowInsights,
    selectedNutritionMetric,
    setSelectedNutritionMetric,
    recentEntriesCount,
    setRecentEntriesCount,
    createNutritionChartData,
    nutritionChartOptions,
    getNutritionEncouragement,
    setActiveTab 
}) {
  return (
    <div>
      {data.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-2xl p-6 border border-sage-200">
            <p className="text-sage-700 text-lg">
              🌱 <strong>Great job!</strong> You've logged <strong>{data.length}</strong> {data.length === 1 ? 'entry' : 'entries'} and <strong>{entryStreak}</strong> {entryStreak === 1 ? 'day' : 'days'} in a row. 
              Consistency is the key to reaching your goals!
            </p>
          </div>

          <MetricsCards 
            weightMetrics={weightMetrics}
            data={data}
            entryStreak={entryStreak}
          />

          <WeightChart 
            weightChartData={weightChartData}
            chartOptions={chartOptions}
          />

          {hasNutritionData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-sage-600 flex items-center">
                  🍎 Your Nutrition Journey
                </h2>
              </div>

              <div className="bg-gradient-to-r from-warmBlue-50 to-sage-50 rounded-xl p-4 mb-6 border border-warmBlue-100">
                <p className="text-warmBlue-700 font-medium">
                  {getNutritionEncouragement()}
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowInsights(!showInsights)}
                  className="bg-sage-100 hover:bg-sage-200 text-sage-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 mx-auto shadow-sm hover:shadow-md"
                >
                  <span>{showInsights ? 'Hide detailed insights' : 'See more insights'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showInsights ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {showInsights && (
                <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-300">
                  <NutritionStatsCards nutritionAvgs={nutritionAvgs} />

                  <NutritionChart 
                    selectedNutritionMetric={selectedNutritionMetric}
                    setSelectedNutritionMetric={setSelectedNutritionMetric}
                    createNutritionChartData={createNutritionChartData}
                    nutritionChartOptions={nutritionChartOptions}
                  />

                  <RecentEntriesTable 
                    data={data}
                    recentEntriesCount={recentEntriesCount}
                    setRecentEntriesCount={setRecentEntriesCount}
                    nutritionAvgs={nutritionAvgs}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-sage-50 to-warmBlue-50 rounded-2xl p-8 text-center border border-sage-200">
          <div className="w-16 h-16 bg-sage-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-sage-600 text-2xl">🌱</span>
          </div>
          <h3 className="text-xl font-semibold text-sage-700 mb-2">Start Your Journey</h3>
          <p className="text-sage-600 mb-4">
            Switch to the "Add Entry" tab to log your first entry and begin tracking your progress!
          </p>
          <button
            onClick={() => setActiveTab('entry')}
            className="bg-sage-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-sage-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            ✨ Add Your First Entry
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;