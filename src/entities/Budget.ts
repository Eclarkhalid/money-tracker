export enum BudgetPeriodT {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Yearly = 'yearly'
}

export enum BudgetTypeT {
  Category = 'category',
  Total = 'total'
}

interface BudgetBaseT {
  name: string;
  amount: number;
  currency: string;
  period: BudgetPeriodT;
  type: BudgetTypeT;
  tags?: string[];
  accountIds?: string[];
  startDate: number;
  endDate?: number;
  isActive: boolean;
}

export interface BudgetStateT extends BudgetBaseT {
  id: string;
}

export interface BudgetStorageT extends BudgetBaseT {
  _id: string;
  _rev?: string;
  _conflicts?: string[];
}

export interface BudgetFormT {
  id?: string;
  name: string;
  amount: string;
  currency: string;
  period: BudgetPeriodT;
  type: BudgetTypeT;
  tags: string[];
  accountIds: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface BudgetSpendingT {
  budgetId: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export const defaultPeriod = BudgetPeriodT.Monthly;
export const defaultType = BudgetTypeT.Category;

export function getPeriodOptions() {
  return [
    { key: BudgetPeriodT.Weekly, value: BudgetPeriodT.Weekly, text: 'Weekly' },
    { key: BudgetPeriodT.Monthly, value: BudgetPeriodT.Monthly, text: 'Monthly' },
    { key: BudgetPeriodT.Quarterly, value: BudgetPeriodT.Quarterly, text: 'Quarterly' },
    { key: BudgetPeriodT.Yearly, value: BudgetPeriodT.Yearly, text: 'Yearly' }
  ];
}

export function getTypeOptions() {
  return [
    { key: BudgetTypeT.Category, value: BudgetTypeT.Category, text: 'Category Budget', description: 'Budget for specific tags/categories' },
    { key: BudgetTypeT.Total, value: BudgetTypeT.Total, text: 'Total Budget', description: 'Overall spending budget' }
  ];
}

export function formToState(form: BudgetFormT): BudgetStateT {
  return {
    id: form.id || `B${Date.now()}`,
    name: form.name,
    amount: parseFloat(form.amount) * 100,
    currency: form.currency,
    period: form.period,
    type: form.type,
    tags: form.tags && form.tags.length > 0 ? form.tags : undefined,
    accountIds: form.accountIds && form.accountIds.length > 0 ? form.accountIds : undefined,
    startDate: new Date(form.startDate).getTime(),
    endDate: form.endDate ? new Date(form.endDate).getTime() : undefined,
    isActive: form.isActive
  };
}

export function stateToForm(state: BudgetStateT): BudgetFormT {
  return {
    id: state.id,
    name: state.name,
    amount: (state.amount / 100).toString(),
    currency: state.currency,
    period: state.period,
    type: state.type,
    tags: state.tags || [],
    accountIds: state.accountIds || [],
    startDate: new Date(state.startDate).toISOString().split('T')[0],
    endDate: state.endDate ? new Date(state.endDate).toISOString().split('T')[0] : undefined,
    isActive: state.isActive
  };
}

export function storageToState({
  _id,
  name,
  amount,
  currency,
  period,
  type,
  tags,
  accountIds,
  startDate,
  endDate,
  isActive
}: BudgetStorageT): BudgetStateT {
  return {
    id: _id,
    name,
    amount,
    currency,
    period,
    type,
    tags,
    accountIds,
    startDate,
    endDate,
    isActive
  };
}

export function stateToStorage({
  name,
  amount,
  currency,
  period,
  type,
  tags,
  accountIds,
  startDate,
  endDate,
  isActive
}: BudgetStateT): Partial<BudgetStorageT> {
  return {
    name,
    amount,
    currency,
    period,
    type,
    tags,
    accountIds,
    startDate,
    endDate,
    isActive
  };
}

export function getPeriodDates(period: BudgetPeriodT, startDate: number): { start: number; end: number } {
  const start = new Date(startDate);
  const end = new Date(start);

  switch (period) {
    case BudgetPeriodT.Weekly:
      end.setDate(end.getDate() + 7);
      break;
    case BudgetPeriodT.Monthly:
      end.setMonth(end.getMonth() + 1);
      break;
    case BudgetPeriodT.Quarterly:
      end.setMonth(end.getMonth() + 3);
      break;
    case BudgetPeriodT.Yearly:
      end.setFullYear(end.getFullYear() + 1);
      break;
  }

  return {
    start: start.getTime(),
    end: end.getTime()
  };
}

export function isCurrentPeriod(budget: BudgetStateT): boolean {
  const now = Date.now();
  const { start, end } = getPeriodDates(budget.period, budget.startDate);
  
  if (budget.endDate && now > budget.endDate) {
    return false;
  }
  
  return now >= start && now <= end;
}
