import { useStats } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#64748b", // slate-500
];

export function ExpensesChart() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl bg-muted/50" />;
  }

  if (!stats) return null;

  const data = Object.entries(stats.expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-none shadow-sm bg-white h-full flex flex-col justify-center items-center p-8 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground">No expenses yet</h3>
        <p className="text-sm text-muted-foreground/80 mt-1">Add transactions to see your spending breakdown</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
