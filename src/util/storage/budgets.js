import { budgetsDB, remoteBudgetsDB, destroyBudgetsDB } from './pouchdb';
import { storageToState, stateToStorage } from '../../entities/Budget';

export default {
  sync,
  loadAll,
  load,
  save,
  remove,
  destroy
};

async function sync(readOnly = false) {
  if (!remoteBudgetsDB()) return;

  await budgetsDB().replicate.from(remoteBudgetsDB());

  if (!readOnly) {
    await budgetsDB().replicate.to(remoteBudgetsDB());
  }
}

function loadAll() {
  return budgetsDB()
    .allDocs({
      include_docs: true,
      conflicts: true,
      startkey: 'B',
      endkey: 'B\uffff'
    })
    .then(response => response.rows.map(row => row.doc))
    .then(docs => docs.map(storageToState));
}

function load(id) {
  return budgetsDB()
    .get(id)
    .then(storageToState)
    .catch(error => {
      if (error.status !== 404) throw error;
    });
}

function save(budget) {
  return budgetsDB()
    .get(budget.id)
    .then(doc => budgetsDB().put({ ...doc, ...stateToStorage(budget) }))
    .catch(err => {
      if (err.status !== 404) throw err;
      return budgetsDB().put({
        _id: budget.id,
        ...stateToStorage(budget)
      });
    });
}

function remove(budgetId) {
  return budgetsDB()
    .get(budgetId)
    .then(doc => budgetsDB().put({ ...doc, _deleted: true }))
    .catch(err => {
      if (err.status !== 404) throw err;
      return true;
    });
}

function destroy() {
  return destroyBudgetsDB();
}
