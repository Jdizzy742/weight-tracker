// src/components/MetricsCards.jsx
function MetricsCards({ weightMetrics, data, entryStreak }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sage-200 transition-colors">
            <span className="text-sage-600 text-xl">⚖️</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">Current Weight</h3>
          <p className="text-2xl font-bold text-sage-700">
            {weightMetrics.current !== 'N/A' ? `${weightMetrics.current} lbs` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-warmBlue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-warmBlue-200 transition-colors">
            <span className="text-warmBlue-600 text-xl">📊</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">7-Day Average</h3>
          <p className="text-2xl font-bold text-warmBlue-600">{weightMetrics.sevenDayAvg !== 'N/A' ? `${weightMetrics.sevenDayAvg} lbs` : 'N/A'}</p>
        </div>
  
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
            <span className="text-indigo-600 text-xl">📈</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">30-Day Average</h3>
          <p className="text-2xl font-bold text-indigo-600">{weightMetrics.thirtyDayAvg !== 'N/A' ? `${weightMetrics.thirtyDayAvg} lbs` : 'N/A'}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-success-200 transition-colors">
            <span className="text-success-600 text-xl">📈</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">Weight Change</h3>
          <p className="text-2xl font-bold text-success-500">
            {weightMetrics.change !== '0.0' ? `${weightMetrics.change} lbs` : '0.0 lbs'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-earth-200 transition-colors">
            <span className="text-earth-600 text-xl">📅</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">Total Entries</h3>
          <p className="text-2xl font-bold text-earth-600">{data.length}</p>
        </div>
  
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
            <span className="text-orange-600 text-xl">🔥</span>
          </div>
          <h3 className="text-sm font-medium text-sage-600 mb-2">Entry Streak</h3>
          <p className="text-2xl font-bold text-orange-600">{entryStreak} {entryStreak === 1 ? 'day' : 'days'}</p>
        </div>
      </div>
    );
  }
  
  export default MetricsCards;