import { combineReducers } from 'redux';
import accounts from './accounts';
import tags from './tags';
import transactions from './transactions';
import budgets from './budgets';

export default combineReducers({ accounts, tags, transactions, budgets });
