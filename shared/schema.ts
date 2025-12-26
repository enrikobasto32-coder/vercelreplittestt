import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // Storing as decimal string
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Food", "Rent", "Salary"
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// === BASE SCHEMAS ===
// numeric comes back as string from driver, so we need to handle it
export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true })
  .extend({
    amount: z.coerce.number().positive(),
    date: z.coerce.date(),
  });

// === EXPLICIT API CONTRACT TYPES ===
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Request types
export type CreateTransactionRequest = InsertTransaction;

// Response types
export type TransactionResponse = Transaction;
export type TransactionListResponse = Transaction[];

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<string, number>;
}
