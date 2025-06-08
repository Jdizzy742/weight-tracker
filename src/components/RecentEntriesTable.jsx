// src/components/RecentEntriesTable.jsx
function RecentEntriesTable({ 
    data, 
    recentEntriesCount, 
    setRecentEntriesCount, 
    nutritionAvgs 
  }) {
    return (
      <div className="bg-sage-25 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-sage-700 flex items-center">
            📋 Recent Entries
          </h3>
          <div className="flex items-center space-x-3">
            {nutritionAvgs && (
              <span className="text-sm text-sage-500 bg-sage-50 px-3 py-1 rounded-full">
                Showing last {recentEntriesCount} {recentEntriesCount === 1 ? 'day' : 'days'}
              </span>
            )}
            <div className="flex items-center bg-sage-50 rounded-lg p-1 border border-sage-200">
              <button
                onClick={() => setRecentEntriesCount(7)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  recentEntriesCount === 7
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'text-sage-600 hover:bg-sage-100'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setRecentEntriesCount(14)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  recentEntriesCount === 14
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'text-sage-600 hover:bg-sage-100'
                }`}
              >
                14 days
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-200">
                <th className="text-left py-3 px-2 font-medium text-sage-600">Date</th>
                <th className="text-center py-3 px-2 font-medium text-orange-600">🔥 Calories</th>
                <th className="text-center py-3 px-2 font-medium text-green-600">💪 Protein</th>
                <th className="text-center py-3 px-2 font-medium text-blue-600">⚡ Carbs</th>
                <th className="text-center py-3 px-2 font-medium text-purple-600">🥑 Fats</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-recentEntriesCount).reverse().map((entry, index) => {
                const hasNutrition = entry.calories || entry.protein || entry.carbs || entry.fats;
                return (
                  <tr key={index} className={`border-b border-sage-100 ${hasNutrition ? 'bg-white' : 'bg-sage-50'} hover:bg-sage-50 transition-colors`}>
                    <td className="py-3 px-2 font-medium text-sage-700">
                      {entry.date ? new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Invalid Date'}
                    </td>
                    <td className="py-3 px-2 text-center text-orange-600 font-medium">
                      {entry.calories || <span className="text-sage-300">-</span>}
                    </td>
                    <td className="py-3 px-2 text-center text-green-600 font-medium">
                      {entry.protein ? `${entry.protein}g` : <span className="text-sage-300">-</span>}
                    </td>
                    <td className="py-3 px-2 text-center text-blue-600 font-medium">
                      {entry.carbs ? `${entry.carbs}g` : <span className="text-sage-300">-</span>}
                    </td>
                    <td className="py-3 px-2 text-center text-purple-600 font-medium">
                      {entry.fats ? `${entry.fats}g` : <span className="text-sage-300">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default RecentEntriesTable;