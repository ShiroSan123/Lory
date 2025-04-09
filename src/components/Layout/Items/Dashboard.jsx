// Dashboard.jsx
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard = ({ item }) => {
  // Пример данных для графиков (их можно заменить или генерировать динамически)
  
  // Линейный график: тренды посещаемости за 4 недели
  const visitorTrendsData = {
    labels: ["Неделя 1", "Неделя 2", "Неделя 3", "Неделя 4"],
    datasets: [
      {
        label: "Посещения",
        data: [150, 180, 200, 220],
        fill: false,
        borderColor: "#742774",
        tension: 0.3,
      },
    ],
  };

  // Столбчатый график: месячная выручка за 6 месяцев
  const monthlyRevenueData = {
    labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
    datasets: [
      {
        label: "Выручка",
        data: [2000, 2500, 2200, 2800, 3000, 3500],
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Круговая диаграмма: распределение продаж по продуктам
  const salesDistributionData = {
    labels: ["Продукт A", "Продукт B", "Продукт C"],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Общие опции для графиков
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Аналитика" },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Дешборд аналитики</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Линейный график: тренды посещаемости */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Тренды посещаемости</h3>
          <Line
            data={visitorTrendsData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                title: {
                  display: true,
                  text: "Посещения за неделю",
                },
              },
            }}
          />
        </div>
        {/* Столбчатый график: месячная выручка */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Месячная выручка</h3>
          <Bar data={monthlyRevenueData} options={chartOptions} />
        </div>
        {/* Круговая диаграмма: распределение продаж */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-2">Распределение продаж</h3>
          <Pie
            data={salesDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: {
                  display: true,
                  text: "Продажи по категориям",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
