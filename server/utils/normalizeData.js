import _ from "lodash";

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

function getColor(label, queryKey) {
  if (queryKey === "customer_type")
    return CUSTOMER_TYPE_COLORS[label] || "#ccc";
  if (queryKey === "industry") return INDUSTRY_COLORS[label] || "#ccc";
  if (queryKey === "team") return TEAM_COLORS[label] || "#ccc";
  if (queryKey === "acv_range") return ACV_RANGE_COLORS[label] || "#ccc";
  return "#4A90E2"; // default
}

function getLegends(queryKey) {
  if (queryKey === "customer_type") return CUSTOMER_TYPE_COLORS;
  if (queryKey === "industry") return INDUSTRY_COLORS;
  if (queryKey === "team") return TEAM_COLORS;
  if (queryKey === "acv_range") return ACV_RANGE_COLORS;
}

export function getDonutData(data, labelKey, queryKey) {
  const grouped = _.groupBy(data, labelKey);

  const totalAcv = _.sumBy(data, (item) => Number(item.acv) || 0);

  return Object.entries(grouped).map(([label, items]) => {
    const acv = _.sumBy(items, (item) => Number(item.acv) || 0);
    const percent = ((acv / totalAcv) * 100).toFixed(1); // 1 decimal place
    const acvInK = Math.round(acv / 1000); // format to K

    return {
      label: `$${acvInK}K (${percent}%)`,
      value: Math.round(acv),
      color: getColor(label, queryKey),
    };
  });
}

// export function getBarData(data, labelKey) {
//   const groupedByQuarter = _.groupBy(data, "closed_fiscal_quarter");

//   return Object.entries(groupedByQuarter).map(([quarter, items]) => {
//     const acc = { quarter };

//     items.forEach((item) => {
//       const label = item[labelKey];
//       const acv = Number(item.acv || 0);
//       acc[label] = (acc[label] || 0) + Math.round(acv / 1000);
//     });

//     return acc;
//   });
// }

export default function normalizeData(queryKey, data, labelKey) {
  return {
    donutData: getDonutData(data, labelKey, queryKey),
    // barData: getBarData(data, labelKey),
    // rawTableData: data,
    // pass the color obj for legends
    legends: getLegends(queryKey),
  };
}
