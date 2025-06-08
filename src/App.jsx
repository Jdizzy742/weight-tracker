import { useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import Header from './components/Header'
import TabNavigation from './components/TabNavigation';
import EntryForm from './components/EntryForm';
import Dashboard from './components/Dashboard';

import { 
  calculateWeightMetrics, 
  calculateEntryStreak, 
  calculateNutritionAverages, 
  getNutritionEncouragement, 
  createNutritionChartData 
} from './utils/calculations';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInsights, setShowInsights] = useState(false);
  const [recentEntriesCount, setRecentEntriesCount] = useState(7);
  const [selectedNutritionMetric, setSelectedNutritionMetric] = useState('calories');
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

  // Calculate metrics using utility functions
  const weightMetrics = calculateWeightMetrics(data);
  const entryStreak = calculateEntryStreak(data);
  const nutritionAvgs = calculateNutritionAverages(data);

  // Weight chart data
  const weightChartData = {
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
        label: 'Daily Weight (lbs)',
        data: data.map((entry) => parseFloat(entry.weight)),
        borderColor: '#5a7f5a',
        backgroundColor: 'rgba(90, 127, 90, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: data.map((entry) => {
          if (entry.date) {
            const date = new Date(entry.date);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return isWeekend ? '#f97316' : '#5a7f5a';
          }
          return '#5a7f5a';
        }),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: data.map((entry) => {
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
        label: '30-Day Average (lbs)',
        data: data.map((entry, index) => {
          if (!entry.weight || entry.weight === '' || isNaN(parseFloat(entry.weight))) {
            return null;
          }
          
          const startIndex = Math.max(0, index - 29);
          const relevantData = data.slice(startIndex, index + 1);
          const validWeights = relevantData.filter(dataEntry => 
            dataEntry.weight && dataEntry.weight !== '' && !isNaN(parseFloat(dataEntry.weight))
          );
          
          if (validWeights.length === 0) return null;
          
          const sum = validWeights.reduce((acc, dataEntry) => acc + parseFloat(dataEntry.weight), 0);
          return (sum / validWeights.length);
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

  const hasNutritionData = data.some(entry => entry.calories || entry.protein || entry.carbs || entry.fats);

  // Chart options for weight chart
  const chartOptions = {
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
            size: 12,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (index >= 0 && index <= 2) {
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
            } else {
              ci.show(index);
              legendItem.hidden = false;
            }
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#5a7f5a',
        bodyColor: '#374151',
        borderColor: '#5a7f5a',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 13,
          weight: '500'
        },
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const date = data[dataIndex]?.date;
            if (date) {
              const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });
              return formattedDate;
            }
            return 'Unknown Date';
          },
          label: function(context) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            
            if (datasetLabel === 'Daily Weight (lbs)') {
              return `Weight: ${value.toFixed(1)} lbs`;
            } else if (datasetLabel === '7-Day Average (lbs)') {
              return `7-Day Average: ${value.toFixed(1)} lbs`;
            } else if (datasetLabel === '30-Day Average (lbs)') {
              return `30-Day Average: ${value.toFixed(1)} lbs`;
            }
            
            return `${datasetLabel}: ${value.toFixed(1)} lbs`;
          },
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const entry = data[dataIndex];
            const datasetLabel = context[0].dataset.label;
            
            if (datasetLabel === 'Daily Weight (lbs)') {
              const nutritionInfo = [];
              if (entry?.calories) nutritionInfo.push(`🔥 ${entry.calories} calories`);
              if (entry?.protein) nutritionInfo.push(`💪 ${entry.protein}g protein`);
              if (entry?.carbs) nutritionInfo.push(`⚡ ${entry.carbs}g carbs`);
              if (entry?.fats) nutritionInfo.push(`🥑 ${entry.fats}g fats`);
              
              if (nutritionInfo.length > 0) {
                return ['', ...nutritionInfo];
              }
            }
            
            return [];
          }
        },
        filter: function(tooltipItem) {
          return tooltipItem.dataset.label !== 'Weekends';
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
    },
    interaction: {
      intersect: true,
      mode: 'point'
    },
    hover: {
      animationDuration: 200
    }
  };

  // Chart options for nutrition chart
  const nutritionChartOptions = {
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
            size: 12,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (index >= 0 && index <= 2) {
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
            } else {
              ci.show(index);
              legendItem.hidden = false;
            }
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#5a7f5a',
        bodyColor: '#374151',
        borderColor: '#5a7f5a',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 13,
          weight: '500'
        },
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const date = data[dataIndex]?.date;
            if (date) {
              const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });
              return formattedDate;
            }
            return 'Unknown Date';
          },
          label: function(context) {
            const value = context.parsed.y;
            const datasetLabel = context.dataset.label;
            
            if (datasetLabel.includes('Daily')) {
              const metrics = {
                calories: 'Calories',
                protein: 'Protein',
                carbs: 'Carbs', 
                fats: 'Fats'
              };
              const units = {
                calories: '',
                protein: 'g',
                carbs: 'g',
                fats: 'g'
              };
              return `${metrics[selectedNutritionMetric]}: ${value.toFixed(1)}${units[selectedNutritionMetric]}`;
            } else if (datasetLabel.includes('7-Day')) {
              const units = {
                calories: '',
                protein: 'g',
                carbs: 'g',
                fats: 'g'
              };
              return `7-Day Average: ${value.toFixed(1)}${units[selectedNutritionMetric]}`;
            } else if (datasetLabel.includes('30-Day')) {
              const units = {
                calories: '',
                protein: 'g',
                carbs: 'g',
                fats: 'g'
              };
              return `30-Day Average: ${value.toFixed(1)}${units[selectedNutritionMetric]}`;
            }
            
            return `${value.toFixed(1)}`;
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
    },
    interaction: {
      intersect: true,
      mode: 'point'
    },
    hover: {
      animationDuration: 200
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 p-4 font-sans">
      <Header />
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="max-w-4xl mx-auto space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            data={data}
            entryStreak={entryStreak}
            weightMetrics={weightMetrics}
            weightChartData={weightChartData}
            chartOptions={chartOptions}
            hasNutritionData={hasNutritionData}
            nutritionAvgs={nutritionAvgs}
            showInsights={showInsights}
            setShowInsights={setShowInsights}
            selectedNutritionMetric={selectedNutritionMetric}
            setSelectedNutritionMetric={setSelectedNutritionMetric}
            recentEntriesCount={recentEntriesCount}
            setRecentEntriesCount={setRecentEntriesCount}
            createNutritionChartData={() => createNutritionChartData(data, selectedNutritionMetric)}
            nutritionChartOptions={nutritionChartOptions}
            getNutritionEncouragement={() => getNutritionEncouragement(nutritionAvgs)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'entry' && (
          <EntryForm 
            handleFileUpload={handleFileUpload}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            formData={formData}
            data={data}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
}

export default App;