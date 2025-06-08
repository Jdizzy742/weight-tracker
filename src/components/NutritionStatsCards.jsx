// src/components/NutritionStatsCards.jsx
function NutritionStatsCards({ nutritionAvgs }) {
    // Data structure to avoid repeating card JSX
    const nutrients = [
      {
        key: 'calories',
        label: 'Calories',
        emoji: '🔥',
        unit: '',
        colors: {
          sevenDay: {
            bg: 'from-orange-50 to-orange-25',
            border: 'border-orange-100',
            emoji: 'text-orange-600',
            label: 'text-orange-500',
            title: 'text-orange-700',
            value: 'text-orange-600'
          },
          thirtyDay: {
            bg: 'from-orange-100 to-orange-50',
            border: 'border-orange-200',
            emoji: 'text-orange-700',
            label: 'text-orange-600',
            title: 'text-orange-800',
            value: 'text-orange-700'
          }
        }
      },
      {
        key: 'protein',
        label: 'Protein',
        emoji: '💪',
        unit: 'g',
        colors: {
          sevenDay: {
            bg: 'from-green-50 to-green-25',
            border: 'border-green-100',
            emoji: 'text-green-600',
            label: 'text-green-500',
            title: 'text-green-700',
            value: 'text-green-600'
          },
          thirtyDay: {
            bg: 'from-green-100 to-green-50',
            border: 'border-green-200',
            emoji: 'text-green-700',
            label: 'text-green-600',
            title: 'text-green-800',
            value: 'text-green-700'
          }
        }
      },
      {
        key: 'carbs',
        label: 'Carbs',
        emoji: '⚡',
        unit: 'g',
        colors: {
          sevenDay: {
            bg: 'from-blue-50 to-blue-25',
            border: 'border-blue-100',
            emoji: 'text-blue-600',
            label: 'text-blue-500',
            title: 'text-blue-700',
            value: 'text-blue-600'
          },
          thirtyDay: {
            bg: 'from-blue-100 to-blue-50',
            border: 'border-blue-200',
            emoji: 'text-blue-700',
            label: 'text-blue-600',
            title: 'text-blue-800',
            value: 'text-blue-700'
          }
        }
      },
      {
        key: 'fats',
        label: 'Fats',
        emoji: '🥑',
        unit: 'g',
        colors: {
          sevenDay: {
            bg: 'from-purple-50 to-purple-25',
            border: 'border-purple-100',
            emoji: 'text-purple-600',
            label: 'text-purple-500',
            title: 'text-purple-700',
            value: 'text-purple-600'
          },
          thirtyDay: {
            bg: 'from-purple-100 to-purple-50',
            border: 'border-purple-200',
            emoji: 'text-purple-700',
            label: 'text-purple-600',
            title: 'text-purple-800',
            value: 'text-purple-700'
          }
        }
      }
    ];
  
    const renderNutrientCard = (nutrient, period, value) => {
      const colors = nutrient.colors[period];
      return (
        <div 
          key={`${nutrient.key}-${period}`}
          className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 border ${colors.border} hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`${colors.emoji} text-2xl`}>{nutrient.emoji}</span>
            <span className={`text-xs ${colors.label} font-medium`}>
              {period === 'sevenDay' ? '7-day avg' : '30-day avg'}
            </span>
          </div>
          <h3 className={`text-sm font-medium ${colors.title} mb-1`}>{nutrient.label}</h3>
          <p className={`text-xl font-bold ${colors.value}`}>
            {value}{nutrient.unit}
          </p>
        </div>
      );
    };
  
    if (!nutritionAvgs) return null;
  
    return (
      <div className="space-y-6">
        {/* 7-day averages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {nutrients.map(nutrient => 
            renderNutrientCard(nutrient, 'sevenDay', nutritionAvgs.sevenDay[nutrient.key])
          )}
        </div>
  
        {/* 30-day averages - only show if there's data */}
        {nutritionAvgs.thirtyDay.entryCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {nutrients.map(nutrient => 
              renderNutrientCard(nutrient, 'thirtyDay', nutritionAvgs.thirtyDay[nutrient.key])
            )}
          </div>
        )}
      </div>
    );
  }
  
  export default NutritionStatsCards;