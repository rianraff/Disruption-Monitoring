import axios from 'axios';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../css/components/AnalyticsCharts.css';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "http://localhost:5001/api/analytics";

// Array warna untuk 28 warna berbeda
const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#66FF66', '#FF6666', '#6666FF', '#FFB266', '#B266FF', '#66B2FF',
  '#FF66B2', '#B2FF66', '#66FFB2', '#B26666', '#66B266', '#B2B2FF',
  '#FF66FF', '#B2FFB2', '#FFB2B2', '#B2FF66', '#B2B266', '#FFB266',
  '#6666B2', '#66FF66', '#B2FF66', '#FFB2FF'
];

const AnalyticsCharts = () => {
  const [disruptionTypeTotals, setDisruptionTypeTotals] = useState([]);
  const [weeklyDisruptionCounts, setWeeklyDisruptionCounts] = useState([]);
  const [severityLevelCounts, setSeverityLevelCounts] = useState([]);
  const [totalSeverityCounts, setTotalSeverityCounts] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [disruptionTotalsRes, weeklyCountsRes, severityCountsRes, totalSeverityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/disruption-type-totals`),
          axios.get(`${API_BASE_URL}/weekly-disruption-type-counts`),
          axios.get(`${API_BASE_URL}/severity-level-counts`),
          axios.get(`${API_BASE_URL}/total-severity-counts`)
        ]);

        setDisruptionTypeTotals(disruptionTotalsRes.data);
        setWeeklyDisruptionCounts(weeklyCountsRes.data);
        setSeverityLevelCounts(severityCountsRes.data);
        setTotalSeverityCounts(totalSeverityRes.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  // Donut Chart for Disruption Type Totals
  const donutChartConfig = {
    datasets: [{
      data: disruptionTypeTotals.map(item => parseInt(item.total, 10)),
      backgroundColor: COLORS.slice(0, disruptionTypeTotals.length),
    }],
    labels: disruptionTypeTotals.map(item => item.disruptiontype),
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  };

  // Bar Chart for Weekly Disruption Counts
  const barChartConfig = {
    datasets: Array.from(
      new Set(weeklyDisruptionCounts.map(item => item.disruptiontype))
    ).map((disruptionType, index) => ({
      label: disruptionType,
      data: weeklyDisruptionCounts
        .filter(item => item.disruptiontype === disruptionType)
        .map(item => parseInt(item.total, 10)),
      backgroundColor: COLORS[index % COLORS.length],
    })),
    labels: [...new Set(weeklyDisruptionCounts.map(item => new Date(item.week_start).toLocaleDateString()))],
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  };

  // Aggregated line chart data for Severity Level Counts Over Time
  const aggregatedData = severityLevelCounts.reduce((acc, item) => {
    const date = new Date(item.publisheddate).toLocaleDateString();
    const severity = item.severity;

    if (!acc[date]) {
      acc[date] = { High: 0, Medium: 0, Low: 0 };
    }
    acc[date][severity] += parseInt(item.total, 10);

    return acc;
  }, {});

  const labels = Object.keys(aggregatedData);
  const highData = labels.map(date => aggregatedData[date].High || 0);
  const mediumData = labels.map(date => aggregatedData[date].Medium || 0);
  const lowData = labels.map(date => aggregatedData[date].Low || 0);

  const lineChartConfig = {
    labels,
    datasets: [
      {
        label: 'High',
        data: highData,
        borderColor: '#FF6384',
        fill: false,
      },
      {
        label: 'Medium',
        data: mediumData,
        borderColor: '#36A2EB',
        fill: false,
      },
      {
        label: 'Low',
        data: lowData,
        borderColor: '#FFCE56',
        fill: false,
      }
    ],
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  };

  const totalSeverityData = {
    datasets: [{
      data: totalSeverityCounts.map(item => parseInt(item.total, 10)),
      backgroundColor: ['#ff0000', '#ff9500', '#00b69b'],
    }],
    labels: totalSeverityCounts.map(item => item.severity),
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  };

  return (
    <div className="analytics-charts-container">
      <Row>
        <Col md={6} className="mb-2">
          <Card className="vertical-chart-card">
            <Card.Body>
              <h5 className="card-title centered-title">Disruption Type Totals</h5>
              {disruptionTypeTotals.length > 0 && <Doughnut data={donutChartConfig} />}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-2">
          <Card className="vertical-chart-card">
            <Card.Body>
              <h5 className="card-title centered-title">Total Severity Counts</h5>
              {totalSeverityCounts.length > 0 && <Doughnut data={totalSeverityData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mb-2">
          <Card className="horizontal-chart-card">
            <Card.Body>
              <h5 className="card-title centered-title">Weekly Disruption Counts</h5>
              {weeklyDisruptionCounts.length > 0 && <Bar data={barChartConfig} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mb-0">
          <Card className="horizontal-chart-card">
            <Card.Body>
              <h5 className="card-title centered-title">Severity Level Counts Over Time</h5>
              {severityLevelCounts.length > 0 && <Line data={lineChartConfig} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsCharts;
