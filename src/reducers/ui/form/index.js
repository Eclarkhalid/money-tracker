import { combineReducers } from 'redux';
import account from './account';
import transaction from './transaction';
import budget from './budget';

export default combineReducers({ account, transaction, budget });
