import { DashboardStats } from "@/components/DashboardStats";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { Wallet } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-xl tracking-tight">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            FinTrack
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white ring-2 ring-primary/10" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Top Section: Stats & Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here's your financial overview.</p>
          </div>
          <TransactionForm />
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Transactions List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
            </div>
            <TransactionList />
          </div>

          {/* Charts (Right 1 col) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Spending Analysis</h2>
            <div className="h-[420px]">
              <ExpensesChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
