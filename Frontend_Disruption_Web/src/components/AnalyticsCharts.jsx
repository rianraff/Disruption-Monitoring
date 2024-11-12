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

  const donutChartConfig = {
    labels: disruptionTypeTotals.map(item => item.disruptiontype),
    datasets: [{
      data: disruptionTypeTotals.map(item => parseInt(item.total, 10)),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };

  const barChartConfig = {
    labels: [...new Set(weeklyDisruptionCounts.map(item => new Date(item.week_start).toLocaleDateString()))],
    datasets: Array.from(
      new Set(weeklyDisruptionCounts.map(item => item.disruptiontype))
    ).map((disruptionType, index) => ({
      label: disruptionType,
      data: weeklyDisruptionCounts
        .filter(item => item.disruptiontype === disruptionType)
        .map(item => parseInt(item.total, 10)),
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#9966FF'][index % 4],
    })),
  };

  const lineChartConfig = {
    labels: [...new Set(severityLevelCounts.map(item => new Date(item.publisheddate).toLocaleDateString()))],
    datasets: Array.from(
      new Set(severityLevelCounts.map(item => item.severity))
    ).map((severity, index) => ({
      label: severity,
      data: severityLevelCounts
        .filter(item => item.severity === severity)
        .map(item => parseInt(item.total, 10)),
      borderColor: ['#FF6384', '#36A2EB', '#FFCE56'][index % 3],
      fill: false,
    })),
  };

  const totalSeverityData = {
    labels: totalSeverityCounts.map(item => item.severity),
    datasets: [{
      data: totalSeverityCounts.map(item => parseInt(item.total, 10)),
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
    }],
  };

  return (
    <div className="analytics-charts-container">
      <Row>
        {/* Left Donut Chart for Disruption Type Totals */}
        <Col md={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Disruption Type Totals</h5>
              {disruptionTypeTotals.length > 0 && <Doughnut data={donutChartConfig} />}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Donut Chart for Total Severity Counts */}
        <Col md={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">Total Severity Counts</h5>
              {totalSeverityCounts.length > 0 && <Doughnut data={totalSeverityData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Full-width Bar Chart for Weekly Disruption Counts */}
        <Col md={12} className="mb-4">
          <Card className="horizontal-chart-card">
            <Card.Body>
              <h5 className="card-title">Weekly Disruption Counts</h5>
              {weeklyDisruptionCounts.length > 0 && <Bar data={barChartConfig} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Full-width Line Chart for Severity Level Counts Over Time */}
        <Col md={12} className="mb-4">
          <Card className="horizontal-chart-card">
            <Card.Body>
              <h5 className="card-title">Severity Level Counts Over Time</h5>
              {severityLevelCounts.length > 0 && <Line data={lineChartConfig} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsCharts;
