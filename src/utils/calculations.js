// src/utils/calculations.js

// Calculate weight metrics
export const calculateWeightMetrics = (data) => {
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
  
  // Calculate entry streak
  export const calculateEntryStreak = (data) => {
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
  export const calculateNutritionAverages = (data) => {
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
  
  // Get nutrition encouragement message
  export const getNutritionEncouragement = (nutritionAvgs) => {
    if (!nutritionAvgs) return "Ready to start tracking nutrition? Even logging a few days helps spot patterns! 🌟";
    if (nutritionAvgs.sevenDay.entryCount >= 5) return "Fantastic nutrition tracking! You're building awesome habits! 💪";
    if (nutritionAvgs.sevenDay.entryCount >= 3) return "Great job staying consistent with nutrition! Keep it up! 🎯";
    return "Nice start on nutrition tracking! Every entry helps you understand your patterns better! 📊";
  };
  
  // Create nutrition chart data
  export const createNutritionChartData = (data, selectedNutritionMetric) => {
    const metrics = {
      calories: { color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)', label: 'Calories', unit: '' },
      protein: { color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.1)', label: 'Protein', unit: 'g' },
      carbs: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'Carbs', unit: 'g' },
      fats: { color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.1)', label: 'Fats', unit: 'g' }
    };
  
    const metric = metrics[selectedNutritionMetric];
    
    return {
      labels: data.map((entry) => {
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
          label: `Daily ${metric.label} (${metric.unit})`,
          data: data.map((entry) => {
            const value = parseFloat(entry[selectedNutritionMetric] || 0);
            return value > 0 ? value : null;
          }),
          borderColor: metric.color,
          backgroundColor: metric.bgColor,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: data.map((entry) => {
            if (entry.date && entry[selectedNutritionMetric]) {
              const date = new Date(entry.date);
              const dayOfWeek = date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              return isWeekend ? '#f97316' : metric.color;
            }
            return metric.color;
          }),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: data.map((entry) => {
            if (entry.date && entry[selectedNutritionMetric]) {
              const date = new Date(entry.date);
              const dayOfWeek = date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              return isWeekend ? 8 : 6;
            }
            return 0;
          }),
          pointHoverRadius: 10,
          spanGaps: false,
        },
        {
          label: `7-Day Average ${metric.label} (${metric.unit})`,
          data: data.map((entry, index) => {
            const value = parseFloat(entry[selectedNutritionMetric] || 0);
            if (!value || value <= 0) {
              return null;
            }
            
            const startIndex = Math.max(0, index - 6);
            const relevantData = data.slice(startIndex, index + 1);
            const validValues = relevantData.filter(dataEntry => {
              const val = parseFloat(dataEntry[selectedNutritionMetric] || 0);
              return val > 0;
            });
            
            if (validValues.length === 0) return null;
            
            const sum = validValues.reduce((acc, dataEntry) => {
              return acc + parseFloat(dataEntry[selectedNutritionMetric] || 0);
            }, 0);
            return sum / validValues.length;
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
          spanGaps: false,
        },
        {
          label: `30-Day Average ${metric.label} (${metric.unit})`,
          data: data.map((entry, index) => {
            const value = parseFloat(entry[selectedNutritionMetric] || 0);
            if (!value || value <= 0) {
              return null;
            }
            
            const startIndex = Math.max(0, index - 29);
            const relevantData = data.slice(startIndex, index + 1);
            const validValues = relevantData.filter(dataEntry => {
              const val = parseFloat(dataEntry[selectedNutritionMetric] || 0);
              return val > 0;
            });
            
            if (validValues.length === 0) return null;
            
            const sum = validValues.reduce((acc, dataEntry) => {
              return acc + parseFloat(dataEntry[selectedNutritionMetric] || 0);
            }, 0);
            return sum / validValues.length;
          }),
          borderColor: 'rgba(139, 69, 19, 0.7)',
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: 'rgba(139, 69, 19, 0.8)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          spanGaps: false,
        },
        {
          label: 'Weekends',
          data: [],
          backgroundColor: '#f97316',
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointStyle: 'circle',
          showLine: false,
        },
      ],
    };
  };