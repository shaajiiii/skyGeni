export type QueryKey = "industry" | "customer_type" | "team" | "acv_range";

export const cards: {
  id: number;
  title: string;
  description: string;
  query_key: QueryKey;
}[] = [
  {
    id: 1,
    title: "Customer Type",
    description: "Breakdown by new vs existing customers.",
    query_key: "customer_type",
  },
  {
    id: 2,
    title: "Team",
    description: "View performance by sales team.",
    query_key: "team",
  },
  {
    id: 3,
    title: "Account Industry",
    description: "Analyze data across industries.",
    query_key: "industry",
  },
  {
    id: 4,
    title: "ACV Range",
    description: "Segment data by deal value ranges.",
    query_key: "acv_range",
  },
];
