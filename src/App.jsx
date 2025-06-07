import { useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

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

  // Calculate weight metrics with better error handling
  const calculateWeightMetrics = () => {
    if (data.length === 0) return { current: 'N/A', sevenDayAvg: 'N/A', thirtyDayAvg: 'N/A', change: '0.0' };
    
    // Current weight - find the most recent entry that actually has a weight value
    const currentWeightEntry = data.slice().reverse().find(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const current = currentWeightEntry 
      ? parseFloat(currentWeightEntry.weight).toFixed(1) 
      : 'N/A';
    
    // 7-day average - only count entries with weight values
    const last7Days = data.slice(-7);
    const weightEntries7 = last7Days.filter(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const sevenDayAvg = weightEntries7.length > 0 
      ? (weightEntries7.reduce((sum, entry) => sum + parseFloat(entry.weight), 0) / weightEntries7.length).toFixed(1)
      : 'N/A';
    
    // 30-day average - only count entries with weight values
    const last30Days = data.slice(-30);
    const weightEntries30 = last30Days.filter(entry => 
      entry.weight && entry.weight !== '' && !isNaN(parseFloat(entry.weight))
    );
    const thirtyDayAvg = weightEntries30.length > 0 
      ? (weightEntries30.reduce((sum, entry) => sum + parseFloat(entry.weight), 0) / weightEntries30.length).toFixed(1)
      : 'N/A';
    
    // Weight change - compare first and last entries with valid weights
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

  // Calculate streak of consecutive days with entries
  const calculateEntryStreak = () => {
    if (data.length === 0) return 0;
    
    try {
      // Get all unique dates with entries (excluding empty entries)
      const datesWithEntries = [...new Set(
        data
          .filter(entry => entry && entry.date && entry.date !== '')
          .map(entry => entry.date)
          .sort()
      )];
      
      if (datesWithEntries.length === 0) return 0;
      
      // Simple streak calculation - count consecutive recent days
      let streak = 1; // At least 1 if we have any entries
      
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

    // 7-day averages
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

    // 30-day averages
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
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: 'Daily Weight (lbs)',
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
      {
        label: '7-Day Average (lbs)',
        data: data.map((entry, index) => {
          // Only calculate average if this entry has valid weight data
          if (!entry.weight || entry.weight === '' || isNaN(parseFloat(entry.weight))) {
            return null;
          }
          
          // Calculate 7-day rolling average for each point with weight data
          const startIndex = Math.max(0, index - 6);
          const relevantData = data.slice(startIndex, index + 1);
          const validWeights = relevantData.filter(dataEntry => 
            dataEntry.weight && dataEntry.weight !== '' && !isNaN(parseFloat(dataEntry.weight))
          );
          
          if (validWeights.length === 0) return null;
          
          const sum = validWeights.reduce((acc, dataEntry) => acc + parseFloat(dataEntry.weight), 0);
          return (sum / validWeights.length);
        }),
        borderColor: 'rgba(59, 130, 246, 0.7)', // blue-500 with opacity
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const hasNutritionData = data.some(entry => entry.calories || entry.protein || entry.carbs || entry.fats);

  // Get encouraging message for nutrition
  const getNutritionEncouragement = () => {
    if (!nutritionAvgs) return "Ready to start tracking nutrition? Even logging a few days helps spot patterns! 🌟";
    if (nutritionAvgs.sevenDay.entryCount >= 5) return "Fantastic nutrition tracking! You're building awesome habits! 💪";
    if (nutritionAvgs.sevenDay.entryCount >= 3) return "Great job staying consistent with nutrition! Keep it up! 🎯";
    return "Nice start on nutrition tracking! Every entry helps you understand your patterns better! 📊";
  };

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
                🌱 <strong>Great job!</strong> You've logged <strong>{data.length}</strong> {data.length === 1 ? 'entry' : 'entries'} and <strong>{entryStreak}</strong> {entryStreak === 1 ? 'day' : 'days'} in a row. 
                Consistency is the key to reaching your goals!
              </p>
            </div>

            {/* Weight KPIs */}
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

            {/* Nutrition Analytics Section */}
            {hasNutritionData && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-sage-600 flex items-center">
                    🍎 Your Nutrition Journey
                  </h2>
                  {nutritionAvgs && (
                    <span className="text-sm text-sage-500 bg-sage-50 px-3 py-1 rounded-full">
                      Based on last {nutritionAvgs.sevenDay.entryCount} {nutritionAvgs.sevenDay.entryCount === 1 ? 'entry' : 'entries'}
                    </span>
                  )}
                </div>

                {/* Nutrition Encouragement */}
                <div className="bg-gradient-to-r from-warmBlue-50 to-sage-50 rounded-xl p-4 mb-6 border border-warmBlue-100">
                  <p className="text-warmBlue-700 font-medium">
                    {getNutritionEncouragement()}
                  </p>
                </div>

                {/* 7-Day Nutrition Averages Cards */}
                {nutritionAvgs && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                        {data.slice(-7).reverse().map((entry, index) => {
                          const hasNutrition = entry.calories || entry.protein || entry.carbs || entry.fats;
                          return (
                            <tr key={index} className={`border-b border-sage-100 ${hasNutrition ? 'bg-white' : 'bg-sage-50'} hover:bg-sage-50 transition-colors`}>
                              <td className="py-3 px-2 font-medium text-sage-700">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
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

            {/* Weight Chart */}
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
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 12,
                            boxHeight: 12
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