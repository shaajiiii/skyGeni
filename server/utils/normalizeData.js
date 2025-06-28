import _ from "lodash";
import { getColor, getLegends } from "./colourMaps.js";

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

export function getBarData(data, labelKey, queryKey) {
  const colorMap = getLegends(queryKey) || {};
  const groupedByQuarter = _.groupBy(data, "closed_fiscal_quarter");

  return Object.entries(groupedByQuarter).map(([quarter, items]) => {
    const valueObj = {};

    items.forEach((item) => {
      const label = item[labelKey];
      const acv = Math.round(Number(item.acv || 0) / 1000); // to K

      if (!valueObj[label]) {
        valueObj[label] = { value: 0, color: colorMap[label] || "#ccc" };
      }

      valueObj[label].value += acv;
    });

    return {
      quarter,
      values: valueObj,
    };
  });
}

export function getTableData(data, labelKey) {
  const groupedByQuarter = _.groupBy(data, "closed_fiscal_quarter");

  return Object.entries(groupedByQuarter).map(([quarter, items]) => {
    const groupMap = _.groupBy(items, (item) => item[labelKey]);

    const groups = {};

    // Building data for each label (e.g., "Asia Pac", "Enterprise", etc.)
    for (const [label, labelItems] of Object.entries(groupMap)) {
      const count = _.sumBy(labelItems, (i) => Number(i.count) || 0);
      const acv = _.sumBy(labelItems, (i) => Number(i.acv) || 0);

      groups[label] = { count, acv };
    }

    // Calculate total
    const totalCount = _.sumBy(Object.values(groups), (g) => g.count);
    const totalAcv = _.sumBy(Object.values(groups), (g) => g.acv);

    // Add percentages
    for (const [label, g] of Object.entries(groups)) {
      groups[label].percent = totalAcv
        ? Math.round((g.acv / totalAcv) * 100)
        : 0;
    }

    // Add total row
    groups["Total"] = {
      count: totalCount,
      acv: totalAcv,
      percent: 100,
    };

    return {
      quarter,
      groups,
    };
  });
}

// Normalizes raw data into a structured format expected by the dashboard components.
// Each key in the returned object directly maps to a specific reusable component in the frontend.
export default function normalizeData(queryKey, data, labelKey) {
  return {
    donutData: getDonutData(data, labelKey, queryKey),
    barData: getBarData(data, labelKey, queryKey),
    tableData: getTableData(data, labelKey),
    legends: getLegends(queryKey),
  };
}
