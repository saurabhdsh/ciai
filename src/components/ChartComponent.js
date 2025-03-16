import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Modern chart theme
const chartTheme = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#e2e8f0',
    textColor: '#334155',
    gridColor: '#f1f5f9',
    tooltipBackgroundColor: 'rgba(255, 255, 255, 0.95)',
    tooltipBorderColor: '#e2e8f0',
    tooltipTextColor: '#334155',
  },
  dark: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderColor: '#334155',
    textColor: '#e2e8f0',
    gridColor: '#1e293b',
    tooltipBackgroundColor: 'rgba(30, 41, 59, 0.95)',
    tooltipBorderColor: '#475569',
    tooltipTextColor: '#f1f5f9',
  }
};

function ChartComponent({ 
  type, 
  data, 
  height = 300, 
  options = {}, 
  title = '',
  isDarkMode = false,
  allowDownload = true,
  allowZoom = true
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const theme = isDarkMode ? chartTheme.dark : chartTheme.light;

  // Enhanced default options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif",
            size: 12,
          },
          color: theme.textColor,
        }
      },
      tooltip: {
        backgroundColor: theme.tooltipBackgroundColor,
        titleColor: theme.tooltipTextColor,
        bodyColor: theme.tooltipTextColor,
        borderColor: theme.tooltipBorderColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', 'Helvetica', 'Arial', sans-serif",
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Inter', 'Helvetica', 'Arial', sans-serif",
          size: 12,
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.gridColor,
          borderColor: theme.borderColor,
          tickColor: theme.borderColor,
        },
        ticks: {
          color: theme.textColor,
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif",
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        }
      },
      y: {
        grid: {
          color: theme.gridColor,
          borderColor: theme.borderColor,
          tickColor: theme.borderColor,
        },
        ticks: {
          color: theme.textColor,
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif",
            size: 11,
          },
          padding: 8,
        },
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    layout: {
      padding: {
        top: 5,
        right: 15,
        bottom: 5,
        left: 10
      }
    }
  };

  // Handle chart download
  const handleDownload = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'chart'}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = chartRef.current.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  // Handle zoom in/out
  const handleZoom = (zoomIn) => {
    if (zoomIn) {
      setZoomLevel(prev => Math.min(prev + 0.2, 2));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
    }
  };

  useEffect(() => {
    // Check if data is valid
    if (!data || !data.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
      console.warn('Invalid chart data provided:', data);
      return;
    }

    // Check if labels are valid
    if (!data.labels || !Array.isArray(data.labels)) {
      console.warn('Invalid chart labels provided:', data);
      return;
    }

    // Create chart
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Create a deep copy of the data to avoid modifying the original
      const chartData = {
        labels: [...data.labels],
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          // Add default styling for line charts
          ...(type === 'line' && {
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.4,
          }),
          // Add default styling for bar charts
          ...(type === 'bar' && {
            borderWidth: 0,
            borderRadius: 4,
          }),
          // Add default styling for pie/doughnut charts
          ...((type === 'pie' || type === 'doughnut') && {
            borderWidth: 1,
            borderColor: theme.backgroundColor,
          })
        }))
      };
      
      // Merge default options with provided options
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        plugins: {
          ...defaultOptions.plugins,
          ...(options.plugins || {})
        },
        scales: type !== 'pie' && type !== 'doughnut' ? {
          ...defaultOptions.scales,
          ...(options.scales || {})
        } : undefined
      };
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type,
        data: chartData,
        options: mergedOptions
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, options, isDarkMode, zoomLevel]);

  return (
    <div className="relative">
      {(allowDownload || allowZoom) && (
        <div className="absolute top-0 right-0 flex space-x-1 z-10 p-1">
          {allowZoom && (
            <>
              <button 
                onClick={() => handleZoom(true)}
                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                onClick={() => handleZoom(false)}
                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </>
          )}
          {allowDownload && (
            <button 
              onClick={handleDownload}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Download chart"
            >
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      )}
      <div style={{ height: `${height * zoomLevel}px`, width: '100%', transition: 'height 0.3s ease' }}>
        {(!data || !data.datasets || !data.labels) ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No data available for chart</p>
          </div>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>
    </div>
  );
}

export default ChartComponent; 