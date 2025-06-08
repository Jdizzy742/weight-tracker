// src/components/EntryForm.jsx
function EntryForm({ 
    handleFileUpload, 
    handleSubmit, 
    handleInputChange, 
    formData, 
    data, 
    setActiveTab 
  }) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-semibold text-sage-600 mb-4">Upload Data</h2>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white transition-all duration-200 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sage-500 file:text-white file:hover:bg-sage-600"
          />
        </div>
  
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
  
        {data.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-sage-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">🎉</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">Great work!</h3>
                <p className="text-green-600">
                  You've logged {data.length} {data.length === 1 ? 'entry' : 'entries'}. 
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="ml-2 text-green-700 font-medium hover:underline"
                  >
                    View your progress →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default EntryForm;