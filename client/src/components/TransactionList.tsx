import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { Trash2, TrendingUp, TrendingDown, ShoppingBag, Home, Car, Film, Zap, Briefcase, DollarSign, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CategoryIcon = ({ category }: { category: string }) => {
  const props = { className: "w-5 h-5" };
  switch (category) {
    case "Food": return <ShoppingBag {...props} className="w-5 h-5 text-orange-500" />;
    case "Housing": return <Home {...props} className="w-5 h-5 text-blue-500" />;
    case "Transportation": return <Car {...props} className="w-5 h-5 text-indigo-500" />;
    case "Entertainment": return <Film {...props} className="w-5 h-5 text-pink-500" />;
    case "Utilities": return <Zap {...props} className="w-5 h-5 text-yellow-500" />;
    case "Salary": return <Briefcase {...props} className="w-5 h-5 text-green-500" />;
    case "Freelance": return <DollarSign {...props} className="w-5 h-5 text-emerald-500" />;
    default: return <HelpCircle {...props} className="w-5 h-5 text-gray-500" />;
  }
};

export function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/50" />
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-muted-foreground/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <DollarSign className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No transactions found</h3>
        <p className="text-muted-foreground">Start by adding a new transaction above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-transparent hover:border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${transaction.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}
            `}>
              <CategoryIcon category={transaction.category} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`text-right font-bold ${
              transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-xl"
                  disabled={deleteTransaction.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this transaction? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    onClick={() => deleteTransaction.mutate(transaction.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
