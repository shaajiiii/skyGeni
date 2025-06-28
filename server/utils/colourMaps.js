// Color mapping definitions for different dashboard data types
export const CUSTOMER_TYPE_COLORS = {
  "Existing Customer": "#4A90E2",
  "New Customer": "#F5A623",
};

export const INDUSTRY_COLORS = {
  Manufacturing: "#4A90E2",
  Transportation: "#F5A623",
  Wholesalers: "#50E3C2",
  "Tecnology Svcs": "#B8E986",
  Retail: "#BD10E0",
  "Financial Svcs": "#F8E71C",
  Education: "#D0021B",
  Others: "#7ED321",
};

export const TEAM_COLORS = {
  "Asia Pac": "#4A90E2",
  Enterprise: "#F5A623",
  Europe: "#50E3C2",
  "Latin America": "#9013FE",
  "North America": "#D0021B",
};

export const ACV_RANGE_COLORS = {
  "$100K - 200K": "#4A90E2",
  "$20K - 50K": "#F5A623",
  "$50K - 100K": "#50E3C2",
  "<$20K": "#B8E986",
  ">=$200K": "#D0021B",
};

export function getColor(label, queryKey) {
  const maps = {
    customer_type: CUSTOMER_TYPE_COLORS,
    industry: INDUSTRY_COLORS,
    team: TEAM_COLORS,
    acv_range: ACV_RANGE_COLORS,
  };
  return maps[queryKey]?.[label] || "#4A90E2";
}

export function getLegends(queryKey) {
  return {
    customer_type: CUSTOMER_TYPE_COLORS,
    industry: INDUSTRY_COLORS,
    team: TEAM_COLORS,
    acv_range: ACV_RANGE_COLORS,
  }[queryKey];
}
