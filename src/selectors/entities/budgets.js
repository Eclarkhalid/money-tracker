import { createSelector } from 'reselect';
import EntityMap from '../../entities/EntityMap';

export const getBudgetsMap = state => state.entities.budgets;

export const getBudgetsList = createSelector(
  [getBudgetsMap],
  budgets => budgets.keys.map(key => budgets.byKey[key])
);

export const getActiveBudgets = createSelector(
  [getBudgetsList],
  budgets => budgets.filter(b => b.isActive)
);

export const getBudgetById = (state, id) => EntityMap.get(state.entities.budgets, id);
