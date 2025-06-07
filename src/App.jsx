import { useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInsights, setShowInsights] = useState(false);
  const [recentEntriesCount, setRecentEntriesCount] = useState(7); // Add toggle for recent entries count
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

  // Calculate weight metrics
  const calculateWeightMetrics = () => {
    if (data.length === 0) return { current: 'N/A', sevenDayAvg: 'N/A', thirtyDayAvg: 'N/A', change: '0.0' };
    
    const currentWeightEntry = data.slice().reverse().find(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const current = currentWeightEntry 
      ? parseFloat(currentWeightEntry.weight).toFixed(1) 
      : 'N/A';
    
    const last7Days = data.slice(-7);
    const weightEntries7 = last7Days.filter(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const sevenDayAvg = weightEntries7.length > 0 
      ? (weightEntries7.reduce((sum, entry) => sum + parseFloat(entry.weight), 0) / weightEntries7.length).toFixed(1)
      : 'N/A';
    
    const last30Days = data.slice(-30);
    const weightEntries30 = last30Days.filter(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const thirtyDayAvg = weightEntries30.length > 0 
      ? (weightEntries30.reduce((sum, entry) => sum + parseFloat(entry.weight), 0) / weightEntries30.length).toFixed(1)
      : 'N/A';
    
    const firstWeight = data.find(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    )?.weight;
    const lastWeight = data.slice().reverse().find(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    )?.weight;
    
    const change = (firstWeight && lastWeight) 
      ? (parseFloat(lastWeight) - parseFloat(firstWeight)).toFixed(1)
      : '0.0';
    
    return { current, sevenDayAvg, thirtyDayAvg, change };
  };

  // Calculate streak
  const calculateEntryStreak = () => {
    if (data.length === 0) return 0;
    
    try {
      const datesWithEntries = [...new Set(
        data
          .filter(entry => entry && entry.date && entry.date !== '')
          .map(entry => entry.date)
          .sort()
      )];
      
      if (datesWithEntries.length === 0) return 0;
      
      let streak = 1;
      
      for (let i = datesWithEntries.length - 2; i >= 0; i--) {
        const currentDate = new Date(datesWithEntries[i + 1]);
        const prevDate = new Date(datesWithEntries[i]);
        const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  // Calculate nutrition averages
  const calculateNutritionAverages = () => {
    const last7Days = data.slice(-7);
    const last30Days = data.slice(-30);
    
    const nutritionEntries7 = last7Days.filter(entry => 
      entry.calories || entry.protein || entry.carbs || entry.fats
    );
    const nutritionEntries30 = last30Days.filter(entry => 
      entry.calories || entry.protein || entry.carbs || entry.fats
    );
    
    if (nutritionEntries7.length === 0 && nutritionEntries30.length === 0) return null;

    const avg7Calories = nutritionEntries7.length > 0 
      ? nutritionEntries7.reduce((sum, entry) => sum + parseFloat(entry.calories || 0), 0) / nutritionEntries7.length
      : 0;
    const avg7Protein = nutritionEntries7.length > 0
      ? nutritionEntries7.reduce((sum, entry) => sum + parseFloat(entry.protein || 0), 0) / nutritionEntries7.length
      : 0;
    const avg7Carbs = nutritionEntries7.length > 0
      ? nutritionEntries7.reduce((sum, entry) => sum + parseFloat(entry.carbs || 0), 0) / nutritionEntries7.length
      : 0;
    const avg7Fats = nutritionEntries7.length > 0
      ? nutritionEntries7.reduce((sum, entry) => sum + parseFloat(entry.fats || 0), 0) / nutritionEntries7.length
      : 0;

    const avg30Calories = nutritionEntries30.length > 0
      ? nutritionEntries30.reduce((sum, entry) => sum + parseFloat(entry.calories || 0), 0) / nutritionEntries30.length
      : 0;
    const avg30Protein = nutritionEntries30.length > 0
      ? nutritionEntries30.reduce((sum, entry) => sum + parseFloat(entry.protein || 0), 0) / nutritionEntries30.length
      : 0;
    const avg30Carbs = nutritionEntries30.length > 0
      ? nutritionEntries30.reduce((sum, entry) => sum + parseFloat(entry.carbs || 0), 0) / nutritionEntries30.length
      : 0;
    const avg30Fats = nutritionEntries30.length > 0
      ? nutritionEntries30.reduce((sum, entry) => sum + parseFloat(entry.fats || 0), 0) / nutritionEntries30.length
      : 0;

    return {
      sevenDay: {
        calories: avg7Calories.toFixed(0),
        protein: avg7Protein.toFixed(1),
        carbs: avg7Carbs.toFixed(1),
        fats: avg7Fats.toFixed(1),
        entryCount: nutritionEntries7.length
      },
      thirtyDay: {
        calories: avg30Calories.toFixed(0),
        protein: avg30Protein.toFixed(1),
        carbs: avg30Carbs.toFixed(1),
        fats: avg30Fats.toFixed(1),
        entryCount: nutritionEntries30.length
      }
    };
  };

  const weightMetrics = calculateWeightMetrics();
  const entryStreak = calculateEntryStreak();
  const nutritionAvgs = calculateNutritionAverages();

  const weightChartData = {
    labels: data.map((entry) => {
      // Format dates as "May 11, 2025" for full context
      if (entry.date) {
        const date = new Date(entry.date);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
      return entry.date;
    }),
    datasets: [
      {
        label: 'Daily Weight (lbs)',
        data: data.map((entry) => parseFloat(entry.weight)),
        borderColor: '#5a7f5a',
        backgroundColor: 'rgba(90, 127, 90, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: data.map((entry) => {
          // Different colors for weekends vs weekdays
          if (entry.date) {
            const date = new Date(entry.date);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return isWeekend ? '#f97316' : '#5a7f5a'; // Orange for weekends, sage for weekdays
          }
          return '#5a7f5a';
        }),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: data.map((entry) => {
          // Slightly larger points for weekends
          if (entry.date) {
            const date = new Date(entry.date);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return isWeekend ? 8 : 6;
          }
          return 6;
        }),
        pointHoverRadius: 10,
      },
      {
        label: '7-Day Average (lbs)',
        data: data.map((entry, index) => {
          if (!entry.weight || entry.weight === '' || isNaN(parseFloat(entry.weight))) {
            return null;
          }
          
          const startIndex = Math.max(0, index - 6);
          const relevantData = data.slice(startIndex, index + 1);
          const validWeights = relevantData.filter(dataEntry => 
            dataEntry.weight && dataEntry.weight !== '' && !isNaN(parseFloat(dataEntry.weight))
          );
          
          if (validWeights.length === 0) return null;
          
          const sum = validWeights.reduce((acc, dataEntry) => acc + parseFloat(dataEntry.weight), 0);
          return (sum / validWeights.length);
        }),
        borderColor: 'rgba(59, 130, 246, 0.7)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Weekends',
        data: [], // Empty data to prevent rendering on the chart
        backgroundColor: '#f97316',
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointStyle: 'circle',
        showLine: false, // Ensure no line is drawn
      },
    ],
  };

  const hasNutritionData = data.some(entry => entry.calories || entry.protein || entry.carbs || entry.fats);

  const getNutritionEncouragement = () => {
    if (!nutritionAvgs) return "Ready to start tracking nutrition? Even logging a few days helps spot patterns! 🌟";
    if (nutritionAvgs.sevenDay.entryCount >= 5) return "Fantastic nutrition tracking! You're building awesome habits! 💪";
    if (nutritionAvgs.sevenDay.entryCount >= 3) return "Great job staying consistent with nutrition! Keep it up! 🎯";
    return "Nice start on nutrition tracking! Every entry helps you understand your patterns better! 📊";
  };

  return (
    <div className="min-h-screen bg-sage-50 p-4 font-sans">
      <header className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-sage-100 hover:shadow-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-sage-600 mb-2">Weight Tracker</h1>
        <p className="text-lg text-sage-500">Your friendly AI nutrition coach</p>
      </header>

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
      
      <main className="max-w-4xl mx-auto space-y-6">
        {activeTab === 'dashboard' && (
          <div>
            {data.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-2xl p-6 border border-sage-200">
                  <p className="text-sage-700 text-lg">
                    🌱 <strong>Great job!</strong> You've logged <strong>{data.length}</strong> {data.length === 1 ? 'entry' : 'entries'} and <strong>{entryStreak}</strong> {entryStreak === 1 ? 'day' : 'days'} in a row. 
                    Consistency is the key to reaching your goals!
                  </p>
                </div>

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

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold text-sage-600 mb-6 flex items-center">
                    📈 Your Progress Story
                  </h2>
                  <div className="bg-gradient-to-br from-sage-50 to-sage-25 p-6 rounded-xl w-full">
                    <div className="w-full h-96">
                      <Line 
                        data={weightChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              align: 'center',
                              labels: {
                                color: '#5a7f5a',
                                font: {
                                  family: 'Inter',
                                  size: 14,
                                  weight: '500'
                                },
                                padding: 20,
                                usePointStyle: true, // Use point style for legend
                                generateLabels: function(chart) {
                                  return [
                                    {
                                      text: 'Daily Weight (lbs)',
                                      fillStyle: '#5a7f5a',
                                      strokeStyle: '#ffffff',
                                      lineWidth: 2,
                                      hidden: false,
                                      datasetIndex: 0,
                                      pointStyle: 'circle',
                                      boxWidth: 12,
                                      boxHeight: 12,
                                    },
                                    {
                                      text: '7-Day Average (lbs)',
                                      fillStyle: 'rgba(59, 130, 246, 0.7)',
                                      strokeStyle: '#ffffff',
                                      lineWidth: 2,
                                      hidden: false,
                                      datasetIndex: 1,
                                      pointStyle: 'circle',
                                      boxWidth: 12,
                                      boxHeight: 12,
                                    },
                                    {
                                      text: 'Weekends',
                                      fillStyle: '#f97316',
                                      strokeStyle: '#ffffff',
                                      lineWidth: 2,
                                      hidden: false,
                                      datasetIndex: 2,
                                      pointStyle: 'circle',
                                      boxWidth: 12,
                                      boxHeight: 12,
                                    },
                                  ];
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
                                  family: 'Inter',
                                  size: 12
                                },
                                maxRotation: 45,
                                minRotation: 0
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
                </div>

                {/* Nutrition Insights Toggle Section */}
                {hasNutritionData && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-sage-600 flex items-center">
                        🍎 Your Nutrition Journey
                      </h2>
                      <div className="flex items-center space-x-3">
                        {nutritionAvgs && (
                          <span className="text-sm text-sage-500 bg-sage-50 px-3 py-1 rounded-full">
                            Showing last {recentEntriesCount} {recentEntriesCount === 1 ? 'day' : 'days'}
                          </span>
                        )}
                        {/* 7/14 Day Toggle */}
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

                    {/* Nutrition Encouragement */}
                    <div className="bg-gradient-to-r from-warmBlue-50 to-sage-50 rounded-xl p-4 mb-6 border border-warmBlue-100">
                      <p className="text-warmBlue-700 font-medium">
                        {getNutritionEncouragement()}
                      </p>
                    </div>

                    {/* See More Insights Button */}
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

                    {/* Collapsible Insights Content */}
                    {showInsights && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-300">
                        {/* 7-Day Nutrition Averages Cards */}
                        {nutritionAvgs && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-orange-50 to-orange-25 rounded-xl p-4 border border-orange-100 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-orange-600 text-2xl">🔥</span>
                                <span className="text-xs text-orange-500 font-medium">7-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-orange-700 mb-1">Calories</h3>
                              <p className="text-xl font-bold text-orange-600">{nutritionAvgs.sevenDay.calories}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-600 text-2xl">💪</span>
                                <span className="text-xs text-green-500 font-medium">7-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-green-700 mb-1">Protein</h3>
                              <p className="text-xl font-bold text-green-600">{nutritionAvgs.sevenDay.protein}g</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-600 text-2xl">⚡</span>
                                <span className="text-xs text-blue-500 font-medium">7-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-blue-700 mb-1">Carbs</h3>
                              <p className="text-xl font-bold text-blue-600">{nutritionAvgs.sevenDay.carbs}g</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-purple-600 text-2xl">🥑</span>
                                <span className="text-xs text-purple-500 font-medium">7-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-purple-700 mb-1">Fats</h3>
                              <p className="text-xl font-bold text-purple-600">{nutritionAvgs.sevenDay.fats}g</p>
                            </div>
                          </div>
                        )}

                        {/* 30-Day Nutrition Averages Cards */}
                        {nutritionAvgs && nutritionAvgs.thirtyDay.entryCount > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-orange-700 text-2xl">🔥</span>
                                <span className="text-xs text-orange-600 font-medium">30-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-orange-800 mb-1">Calories</h3>
                              <p className="text-xl font-bold text-orange-700">{nutritionAvgs.thirtyDay.calories}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-700 text-2xl">💪</span>
                                <span className="text-xs text-green-600 font-medium">30-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-green-800 mb-1">Protein</h3>
                              <p className="text-xl font-bold text-green-700">{nutritionAvgs.thirtyDay.protein}g</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-700 text-2xl">⚡</span>
                                <span className="text-xs text-blue-600 font-medium">30-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-blue-800 mb-1">Carbs</h3>
                              <p className="text-xl font-bold text-blue-700">{nutritionAvgs.thirtyDay.carbs}g</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-purple-700 text-2xl">🥑</span>
                                <span className="text-xs text-purple-600 font-medium">30-day avg</span>
                              </div>
                              <h3 className="text-sm font-medium text-purple-800 mb-1">Fats</h3>
                              <p className="text-xl font-bold text-purple-700">{nutritionAvgs.thirtyDay.fats}g</p>
                            </div>
                          </div>
                        )}

                        {/* Recent Nutrition Entries Table */}
                        <div className="bg-sage-25 rounded-xl p-4">
                          <h3 className="text-lg font-medium text-sage-700 mb-4 flex items-center">
                            📋 Recent Entries
                          </h3>
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
        )}

        {activeTab === 'entry' && (
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
        )}
      </main>
    </div>
  );
}

export default App;