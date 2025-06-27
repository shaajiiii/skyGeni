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

interface CustomerStats {
  count: number;
  acv: number;
  percent: number;
}

interface QuarterRow {
  quarter: string;
  existingCustomer: CustomerStats;
  newCustomer: CustomerStats;
  total: CustomerStats;
}

interface Props {
  data: QuarterRow[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const RevenueBreakdownTable: React.FC<Props> = ({ data }) => {
  return (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 4 }}>
      <Table
        sx={{
          //   width: 600,
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
              rowSpan={1}
              align="center"
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              Closed Fiscal Quarter
            </TableCell>
            {data.map((d, idx) => {
              const isEven = idx % 2 === 0;
              const bgColor =
                idx === data.length - 1
                  ? "#1565c0" // darker blue for total column
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.quarter}
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              rowSpan={1}
              align="center"
              sx={{
                fontWeight: "bold",

                whiteSpace: "nowrap",
              }}
            >
              Cust Type
            </TableCell>
            {data.map((_, idx) => (
              <React.Fragment key={idx}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    // color: "#fff",
                    backgroundColor: "inherit",
                  }}
                >
                  # of Opps
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    // color: "#fff",
                    backgroundColor: "inherit",
                  }}
                >
                  ACV
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    // color: "#fff",
                    backgroundColor: "inherit",
                  }}
                >
                  % of Total
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {["Existing Customer", "New Customer", "Total"].map(
            (rowType, rowIdx) => {
              const fontWeight = rowType === "Total" ? "bold" : 500;

              return (
                <TableRow
                  key={rowType}
                  sx={{
                    backgroundColor:
                      rowType === "Total" ? "#f9f9f9" : undefined,
                  }}
                >
                  <TableCell sx={{ fontWeight }}>{rowType}</TableCell>
                  {data.map((d) => {
                    const rowData =
                      rowType === "Existing Customer"
                        ? d.existingCustomer
                        : rowType === "New Customer"
                        ? d.newCustomer
                        : d.total;

                    return (
                      <React.Fragment key={rowType + rowIdx}>
                        <TableCell sx={{ fontWeight }} align="center">
                          {rowData.count}
                        </TableCell>
                        <TableCell sx={{ fontWeight }} align="center">
                          {formatCurrency(rowData.acv)}
                        </TableCell>
                        <TableCell sx={{ fontWeight }} align="center">
                          {rowData.percent}%
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RevenueBreakdownTable;
