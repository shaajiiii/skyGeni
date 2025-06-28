import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface GroupStats {
  count: number;
  acv: number;
  percent: number;
}

interface QuarterRow {
  quarter: string;
  groups: {
    [label: string]: GroupStats;
  };
}

interface Props {
  data: QuarterRow[];
  filterByType?: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const RevenueBreakdownTable: React.FC<Props> = ({ data, filterByType }) => {
  if (!data || data.length === 0) return null;

  const groupLabels = Object.keys(data[0].groups || {});

  return (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 4 }}>
      <Table
        sx={{
          "& .MuiTableCell-root": {
            border: "1px solid #e0e0e0",
            whiteSpace: "nowrap",
          },
        }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              Closed Financial Quarter
            </TableCell>
            {data.map((d, idx) => {
              const isEven = idx % 2 === 0;
              const bgColor =
                idx === data.length - 1
                  ? "#1565c0"
                  : isEven
                  ? "#1976d2"
                  : "#2196f3";

              return (
                <TableCell
                  key={d.quarter}
                  align="center"
                  colSpan={3}
                  sx={{
                    backgroundColor: bgColor,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {d.quarter}
                </TableCell>
              );
            })}
          </TableRow>

          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              {filterByType}
            </TableCell>
            {data.map((_, idx) => (
              <React.Fragment key={idx}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  # of Opps
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  ACV
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  % of Total
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {groupLabels.map((label) => {
            const fontWeight = label === "Total" ? "bold" : 500;
            const bgColor = label === "Total" ? "#f9f9f9" : undefined;

            return (
              <TableRow key={label} sx={{ backgroundColor: bgColor }}>
                <TableCell sx={{ fontWeight }}>{label}</TableCell>
                {data.map((row, index) => {
                  const group = row.groups[label];
                  return (
                    <React.Fragment key={index}>
                      <TableCell align="right" sx={{ fontWeight }}>
                        {group?.count ?? "-"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight }}>
                        {group ? formatCurrency(group.acv) : "-"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight }}>
                        {group?.percent ?? "-"}%
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RevenueBreakdownTable;
