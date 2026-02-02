import { handleActions } from 'redux-actions';
import { calculateBudgetSpendingSuccess } from '../../actions/entities/budgets';

const defaultState = {};

export default handleActions(
  {
    [calculateBudgetSpendingSuccess]: (state, { payload }) => {
      return payload.reduce((acc, spending) => {
        acc[spending.budgetId] = spending;
        return acc;
      }, {});
    }
  },
  defaultState
);
