

import _ from "lodash";

// Optional color maps
const CUSTOMER_TYPE_COLORS = {
  "Existing Customer": "#4A90E2",
  "New Customer": "#F5A623",
};

function getColor(label, queryKey) {
  if (queryKey === "customer_type")
    return CUSTOMER_TYPE_COLORS[label] || "#ccc";
  return "#4A90E2"; // default
}

export function getDonutData(data, labelKey, queryKey) {
  const grouped = _.groupBy(data, labelKey);

  return Object.entries(grouped).map(([label, items]) => ({
    label,
    value: Math.round(_.sumBy(items, (item) => Number(item.acv) || 0)),
    color: getColor(label, queryKey),
  }));
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
    barData: getBarData(data, labelKey),
    // rawTableData: data, 
  };
}
