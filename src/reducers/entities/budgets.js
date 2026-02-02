import { handleActions } from 'redux-actions';
import {
  loadBudgetsSuccess,
  saveBudgetSuccess,
  removeBudgetSuccess
} from '../../actions/entities/budgets';
import EntityMap from '../../entities/EntityMap';

const defaultState = { byKey: {}, keys: [] };

export default handleActions(
  {
    [loadBudgetsSuccess]: (state, { payload }) => {
      return EntityMap.fromArray(payload);
    },
    [saveBudgetSuccess]: (state, { payload }) => {
      return EntityMap.set(state, payload);
    },
    [removeBudgetSuccess]: (state, { payload }) => {
      return EntityMap.remove(state, payload);
    }
  },
  defaultState
);
