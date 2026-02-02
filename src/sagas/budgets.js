import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  loadBudgets,
  loadBudgetsSuccess,
  loadBudgetsFailure,
  saveBudget,
  saveBudgetSuccess,
  saveBudgetFailure,
  removeBudget,
  removeBudgetSuccess,
  removeBudgetFailure,
  calculateBudgetSpending,
  calculateBudgetSpendingSuccess
} from '../actions/entities/budgets';
import { submitBudgetForm } from '../actions/ui/form/budget';
import BudgetsStorage from '../util/storage/budgets';
import TransactionsStorage from '../util/storage/transactions';
import { formToState, getPeriodDates } from '../entities/Budget';
import { TransationKindT } from '../entities/Transaction';

export function* loadBudgetsSaga() {
  try {
    const budgets = yield call(BudgetsStorage.loadAll);
    yield put(loadBudgetsSuccess(budgets));
    yield calculateBudgetSpendingSaga();
  } catch (error) {
    yield put(loadBudgetsFailure(error));
  }
}

export function* saveBudgetSaga({ payload }) {
  try {
    const budget = formToState(payload);
    yield call(BudgetsStorage.save, budget);
    yield put(saveBudgetSuccess(budget));
    yield calculateBudgetSpendingSaga();
  } catch (error) {
    yield put(saveBudgetFailure(error));
  }
}

export function* submitBudgetFormSaga() {
  const form = yield select(state => state.ui.form.budget);
  yield put(saveBudget(form));
}

export function* removeBudgetSaga({ payload }) {
  try {
    yield call(BudgetsStorage.remove, payload);
    yield put(removeBudgetSuccess(payload));
  } catch (error) {
    yield put(removeBudgetFailure(error));
  }
}

export function* calculateBudgetSpendingSaga() {
  try {
    const budgets = yield select(state => state.entities.budgets.toArray());
    const transactions = yield call(TransactionsStorage.getAll);
    
    const spendingData = budgets.map(budget => {
      const { start, end } = getPeriodDates(budget.period, budget.startDate);
      
      const relevantTransactions = transactions.filter(tx => {
        if (tx.date < start || tx.date > end) return false;
        if (tx.kind !== TransationKindT.Expense) return false;
        
        if (budget.accountIds && budget.accountIds.length > 0) {
          if (!budget.accountIds.includes(tx.accountId)) return false;
        }
        
        if (budget.type === 'category' && budget.tags && budget.tags.length > 0) {
          if (!tx.tags || !tx.tags.some(tag => budget.tags.includes(tag))) {
            return false;
          }
        }
        
        return true;
      });
      
      const spent = relevantTransactions.reduce((sum, tx) => {
        return sum + Math.abs(tx.amount);
      }, 0);
      
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        budgetId: budget.id,
        spent,
        remaining,
        percentage: Math.round(percentage * 10) / 10,
        isOverBudget: spent > budget.amount
      };
    });
    
    yield put(calculateBudgetSpendingSuccess(spendingData));
  } catch (error) {
    console.error('Error calculating budget spending:', error);
  }
}

export default [
  takeLatest(loadBudgets, loadBudgetsSaga),
  takeLatest(saveBudget, saveBudgetSaga),
  takeLatest(submitBudgetForm, submitBudgetFormSaga),
  takeLatest(removeBudget, removeBudgetSaga),
  takeLatest(calculateBudgetSpending, calculateBudgetSpendingSaga)
];
