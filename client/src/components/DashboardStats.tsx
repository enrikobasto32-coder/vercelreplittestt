import { useStats } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStats() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl border-none shadow-lg shadow-black/5 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">
            Total Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-blue-100" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">
            ${stats.balance.toFixed(2)}
          </div>
          <p className="text-xs text-blue-200 mt-1">Current net worth</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Income
          </CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            +${stats.totalIncome.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            -${stats.totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">All time spending</p>
        </CardContent>
      </Card>
    </div>
  );
}
