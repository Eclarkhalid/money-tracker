import { handleActions } from 'redux-actions';
import {
  openBudgetForm,
  closeBudgetForm,
  changeBudgetForm,
  resetBudgetForm
} from '../../../actions/ui/form/budget';
import { saveBudgetSuccess } from '../../../actions/entities/budgets';
import { defaultPeriod, defaultType } from '../../../entities/Budget';

const defaultState = {
  isOpen: false,
  id: undefined,
  name: '',
  amount: '',
  currency: 'USD',
  period: defaultPeriod,
  type: defaultType,
  tags: [],
  accountIds: [],
  startDate: new Date().toISOString().split('T')[0],
  endDate: undefined,
  isActive: true
};

export default handleActions(
  {
    [openBudgetForm]: (state, { payload }) => ({
      ...state,
      ...payload,
      isOpen: true
    }),
    [closeBudgetForm]: state => ({
      ...state,
      isOpen: false
    }),
    [changeBudgetForm]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [resetBudgetForm]: () => defaultState,
    [saveBudgetSuccess]: () => defaultState
  },
  defaultState
);
