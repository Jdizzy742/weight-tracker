// src/components/TabNavigation.jsx
function TabNavigation({ activeTab, setActiveTab }) {  // ← These are PROPS!
    return (
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-sage-100">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === 'dashboard'
                  ? 'bg-sage-500 text-white shadow-md'
                  : 'text-sage-600 hover:bg-sage-50'
              }`}
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('entry')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === 'entry'
                  ? 'bg-sage-500 text-white shadow-md'
                  : 'text-sage-600 hover:bg-sage-50'
              }`}
            >
              <span className="text-xl">✏️</span>
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default TabNavigation;