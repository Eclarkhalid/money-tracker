import { createAction } from 'redux-actions';

export const loadBudgets = createAction('LOAD_BUDGETS');
export const loadBudgetsSuccess = createAction('LOAD_BUDGETS_SUCCESS');
export const loadBudgetsFailure = createAction('LOAD_BUDGETS_FAILURE');

export const saveBudget = createAction('SAVE_BUDGET');
export const saveBudgetSuccess = createAction('SAVE_BUDGET_SUCCESS');
export const saveBudgetFailure = createAction('SAVE_BUDGET_FAILURE');

export const removeBudget = createAction('REMOVE_BUDGET');
export const removeBudgetSuccess = createAction('REMOVE_BUDGET_SUCCESS');
export const removeBudgetFailure = createAction('REMOVE_BUDGET_FAILURE');

export const calculateBudgetSpending = createAction('CALCULATE_BUDGET_SPENDING');
export const calculateBudgetSpendingSuccess = createAction('CALCULATE_BUDGET_SPENDING_SUCCESS');
