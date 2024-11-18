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
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../css/pages/AnalyticsPage.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

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

// Menggunakan base URL dari .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#66FF66', '#FF6666', '#6666FF', '#FFB266', '#B266FF', '#66B2FF',
  '#FF66B2', '#B2FF66', '#66FFB2', '#B26666', '#66B266', '#B2B2FF',
  '#FF66FF', '#B2FFB2', '#FFB2B2', '#B2FF66', '#B2B266', '#FFB266',
  '#6666B2', '#66FF66', '#B2FF66', '#FFB2FF'
];

const AnalyticsPage = () => {
  const [disruptionTypeTotals, setDisruptionTypeTotals] = useState([]);
  const [weeklyDisruptionCounts, setWeeklyDisruptionCounts] = useState([]);
  const [severityLevelCounts, setSeverityLevelCounts] = useState([]);
  const [totalSeverityCounts, setTotalSeverityCounts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [disruptionTotalsRes, weeklyCountsRes, severityCountsRes, totalSeverityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/disruption-type-totals`),
          axios.get(`${API_BASE_URL}/analytics/weekly-disruption-type-counts`),
          axios.get(`${API_BASE_URL}/analytics/severity-level-counts`),
          axios.get(`${API_BASE_URL}/analytics/total-severity-counts`)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const donutChartConfig = {
    labels: disruptionTypeTotals.map(item => item.disruptiontype),
    datasets: [{
      data: disruptionTypeTotals.map(item => parseInt(item.total, 10)),
      backgroundColor: COLORS.slice(0, disruptionTypeTotals.length),
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
      backgroundColor: COLORS[index % COLORS.length],
    })),
  };

  const lineChartConfig = {
    labels: severityLevelCounts.map(item => new Date(item.publisheddate).toLocaleDateString()),
    datasets: [
      {
        label: 'High',
        data: severityLevelCounts.filter(item => item.severity === 'High').map(item => item.total),
        borderColor: '#FF6384',
        fill: false,
      },
      {
        label: 'Medium',
        data: severityLevelCounts.filter(item => item.severity === 'Medium').map(item => item.total),
        borderColor: '#36A2EB',
        fill: false,
      },
      {
        label: 'Low',
        data: severityLevelCounts.filter(item => item.severity === 'Low').map(item => item.total),
        borderColor: '#FFCE56',
        fill: false,
      }
    ],
  };

  const totalSeverityData = {
    labels: totalSeverityCounts.map(item => item.severity),
    datasets: [{
      data: totalSeverityCounts.map(item => parseInt(item.total, 10)),
      backgroundColor: ['#ff0000', '#ff9500', '#00b69b'],
    }],
  };

  return (
    <div id="db-wrapper" className={`${sidebarOpen ? '' : 'toggled'}`}>
      <div className="navbar-vertical">
        <Sidebar isCollapsed={!sidebarOpen} activePage="Analytics" />
      </div>

      <div id="page-content">
        <div className="header">
          <NavbarTop toggleSidebar={toggleSidebar} />
        </div>

        <div className="content-area">
          <main className="main-content">
          <Container fluid className="analytics-container">
            <h2 className="page-title mt-4 mb-4">Analytics Dashboard</h2>
            <Row>
                <Col md={6} className="mb-4">
                <Card className="chart-card compact-chart">
                    <Card.Body>
                    <h5 className="chart-title">Disruption Type Totals</h5>
                    <Doughnut data={donutChartConfig} />
                    </Card.Body>
                </Card>
                </Col>
                <Col md={6} className="mb-4">
                <Card className="chart-card compact-chart">
                    <Card.Body>
                    <h5 className="chart-title">Total Severity Counts</h5>
                    <Doughnut data={totalSeverityData} />
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12} className="mb-4">
                <Card className="chart-card">
                    <Card.Body>
                    <h5 className="chart-title">Weekly Disruption Counts</h5>
                    <Bar data={barChartConfig} />
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12} className="mb-4">
                <Card className="chart-card">
                    <Card.Body>
                    <h5 className="chart-title">Severity Level Counts Over Time</h5>
                    <Line data={lineChartConfig} />
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            </Container>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
