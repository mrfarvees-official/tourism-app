export type TourismItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: "active" | "draft" | "pending" | "confirmed" | "paid" | "completed";
  amount?: string;
  image?: string;
  fields?: Record<string, unknown>;
};
