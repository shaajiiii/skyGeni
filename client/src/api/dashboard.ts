import axios from "./axiosConfig";
import type { QueryKey } from "../constants/dashboardCards";

export const fetchDashboardData = async (query_key: QueryKey | null) => {
  if (!query_key) return;
  const response = await axios.get("/dashboard", {
    params: { query_key },
  });
  return response.data;
};
