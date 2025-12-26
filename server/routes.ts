import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    try {
      // Coerce amount to number and date to Date object
      const input = api.transactions.create.input.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.transactions.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await storage.deleteTransaction(id);
    res.status(204).send();
  });

  app.get(api.transactions.stats.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const balance = totalIncome - totalExpenses;
    
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const amount = Number(t.amount);
        acc[t.category] = (acc[t.category] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory
    });
  });

  // Seed data if empty
  const existing = await storage.getTransactions();
  if (existing.length === 0) {
    await storage.createTransaction({
      amount: 5000,
      description: "Monthly Salary",
      category: "Salary",
      type: "income",
      date: new Date(),
    });
    await storage.createTransaction({
      amount: 1200,
      description: "Rent Payment",
      category: "Housing",
      type: "expense",
      date: new Date(),
    });
    await storage.createTransaction({
      amount: 150,
      description: "Grocery Shopping",
      category: "Food",
      type: "expense",
      date: new Date(),
    });
    await storage.createTransaction({
      amount: 60,
      description: "Internet Bill",
      category: "Utilities",
      type: "expense",
      date: new Date(),
    });
  }

  return httpServer;
}
