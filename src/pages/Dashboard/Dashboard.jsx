import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "@components/Card/Card";
import SummaryCard from "@components/SummaryCard/SummaryCard";
import LoadingState from "@components/customer/LoadingState";
import ErrorState from "@components/customer/ErrorState";
import {
  TotalIcon,
  CheckedInIcon,
  WaitingIcon,
  AssignedIcon,
  CompletedIcon,
  AddCustomerIcon,
  ScanActionIcon,
  AssignBoothActionIcon,
} from "@components/icons/DashboardIcons";
import { ROUTES } from "@constants";
import { getDashboardStats } from "@services/dashboardService";
import "./Dashboard.css";

const SUMMARY_CONFIG = [
  {
    statKey: "totalCustomers",
    label: "Total Customers",
    icon: <TotalIcon />,
    accent: "#6366f1",
  },
  {
    statKey: "checkedIn",
    label: "Checked-In",
    icon: <CheckedInIcon />,
    accent: "#22c55e",
  },
  {
    statKey: "waiting",
    label: "Waiting",
    icon: <WaitingIcon />,
    accent: "#f59e0b",
  },
  {
    statKey: "assigned",
    label: "Assigned",
    icon: <AssignedIcon />,
    accent: "#0ea5e9",
  },
  {
    statKey: "completed",
    label: "Completed",
    icon: <CompletedIcon />,
    accent: "#a855f7",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStats();
      setSummary(stats.summary);
      setChartData(stats.chartData);
    } catch {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorState message={error} onRetry={loadDashboard} />
      </div>
    );
  }

  const summaryData = SUMMARY_CONFIG.map((item) => ({
    ...item,
    value: summary[item.statKey] ?? 0,
  }));

  return (
    <div className="dashboard">
      <div className="dashboard_summary-grid">
        {summaryData.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      <Card title="Check-In Analytics" className="dashboard_analytics">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 12, fill: "var(--text)" }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={56}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "var(--text)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-h)" }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Quick Actions" className="dashboard_quick-actions">
        <div className="quick-actions">
          <button
            type="button"
            className="quick-actions_button"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
          >
            <AddCustomerIcon />
            Add Customer
          </button>
          <button
            type="button"
            className="quick-actions_button"
            onClick={() => navigate(ROUTES.QR_SCANNER)}
          >
            <ScanActionIcon />
            Scan QR
          </button>
          <button
            type="button"
            className="quick-actions_button"
            onClick={() => navigate(ROUTES.BOOTH_ASSIGNMENT)}
          >
            <AssignBoothActionIcon />
            Assign Booth
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
