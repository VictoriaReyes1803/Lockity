import { parseISO, format, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";

export function groupChartData(data: any[], groupBy: "day" | "week" | "month" | "year") {
  const grouped: Record<string, number> = {};

  data.forEach((item) => {
    const date = parseISO(item.date);
    let key: string;

    switch (groupBy) {
      case "week":
        key = format(startOfWeek(date), "yyyy-MM-dd") + " - " + format(endOfWeek(date), "MM-dd");
        break;
      case "month":
        key = format(date, "yyyy-MM");
        break;
      case "year":
        key = format(date, "yyyy");
        break;
      default:
        key = format(date, "yyyy-MM-dd");
    }

    grouped[key] = (grouped[key] || 0) + item.count;
  });

  return Object.entries(grouped).map(([key, value]) => ({
    name: key,
    value,
  }));
}
