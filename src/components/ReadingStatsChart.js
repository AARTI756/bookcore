import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const ReadingStatsChart = ({ monthlyData }) => {
  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Books Read",
        data: Object.values(monthlyData),
        backgroundColor: "#36A2EB",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Books Read Per Month",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={barData} options={barOptions} />;
};

export default ReadingStatsChart;
