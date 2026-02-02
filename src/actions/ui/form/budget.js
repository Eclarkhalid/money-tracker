import { createAction } from 'redux-actions';

export const openBudgetForm = createAction('OPEN_BUDGET_FORM');
export const closeBudgetForm = createAction('CLOSE_BUDGET_FORM');
export const changeBudgetForm = createAction('CHANGE_BUDGET_FORM');
export const submitBudgetForm = createAction('SUBMIT_BUDGET_FORM');
export const resetBudgetForm = createAction('RESET_BUDGET_FORM');
