import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema } from "@shared/schema";
import { useCreateTransaction } from "@/hooks/use-transactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";

const CATEGORIES = [
  "Food",
  "Housing",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Salary",
  "Freelance",
  "Other",
];

const formSchema = insertTransactionSchema.extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  // Date is handled by the schema as z.coerce.date(), usually we pass a string from input type="date"
});

type FormValues = z.infer<typeof formSchema>;

export function TransactionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "Other",
      type: "expense",
      date: new Date(),
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      await createTransaction.mutateAsync(data);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="rounded-xl px-6 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 font-semibold text-base bg-gradient-to-r from-primary to-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display">New Transaction</DialogTitle>
          <DialogDescription>
            Add a new income or expense to track your finances.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-12 bg-muted/50 border-transparent hover:bg-muted/80 transition-colors">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="pl-7 rounded-xl h-12 bg-muted/50 border-transparent focus:bg-background transition-all"
                          placeholder="0.00"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="rounded-xl h-12 bg-muted/50 border-transparent focus:bg-background transition-all"
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-12 bg-muted/50 border-transparent hover:bg-muted/80 transition-colors">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      className="rounded-xl h-12 bg-muted/50 border-transparent focus:bg-background transition-all"
                      placeholder="e.g. Grocery shopping" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20"
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
