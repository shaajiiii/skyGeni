import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DonutChart from "./components/Donut";
import StackedBarChart from "./components/BarChart";
import RevenueBreakdownTable from "./components/RevenueTable";

const sampleData = [
  {
    quarter: "2023-Q3",
    existingCustomer: { count: 46, acv: 1322310, percent: 57 },
    newCustomer: { count: 14, acv: 983031, percent: 43 },
    total: { count: 60, acv: 2305341, percent: 100 },
  },
  {
    quarter: "2023-Q4",
    existingCustomer: { count: 45, acv: 1124857, percent: 74 },
    newCustomer: { count: 10, acv: 387300, percent: 26 },
    total: { count: 55, acv: 1512157, percent: 100 },
  },
  {
    quarter: "2024-Q1",
    existingCustomer: { count: 51, acv: 1360047, percent: 81 },
    newCustomer: { count: 6, acv: 313189, percent: 19 },
    total: { count: 57, acv: 1673236, percent: 100 },
  },
  {
    quarter: "2024-Q2",
    existingCustomer: { count: 23, acv: 647821, percent: 74 },
    newCustomer: { count: 6, acv: 224643, percent: 26 },
    total: { count: 29, acv: 872465, percent: 100 },
  },
  {
    quarter: "Total",
    existingCustomer: { count: 165, acv: 4455036, percent: 70 },
    newCustomer: { count: 36, acv: 1908164, percent: 30 },
    total: { count: 201, acv: 6363200, percent: 100 },
  },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <DonutChart />
      <StackedBarChart />
      <RevenueBreakdownTable data={sampleData} />
    </>
  );
}

export default App;
