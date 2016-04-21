import { SUCCESS, FAILED, PENDING, INTERRUPTED } from './modules/transactions/constants/statuses';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

var windowRef = typeof window == "undefined" ? {} : window,
	middleWare,
	hydrated;

// console log middleware
const consoleLog = store => next => action => {
	if (typeof action !== 'function') {
		console.log(action);
	}
	return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => action => {
	var state = store.getState();
	next(action);
	windowRef.localStorage && windowRef.localStorage.setItem && windowRef.localStorage.setItem('state', JSON.stringify({
		favorites: state.favorites,
		transactions: state.transactions,
		accountTrades: state.accountTrades
	}));
};

// middleware
if (process.env.NODE_ENV !== 'production') {
	middleWare = applyMiddleware(consoleLog, thunk, localStorageMiddleware);
}
else {
	middleWare = applyMiddleware(thunk, localStorageMiddleware);
}

// hydrated state
hydrated = windowRef.localStorage && windowRef.localStorage.getItem && JSON.parse(windowRef.localStorage.getItem('state'));
if (hydrated && hydrated.transactions) {
	Object.keys(hydrated.transactions).forEach(key => {
		if ([SUCCESS, FAILED, PENDING, INTERRUPTED].indexOf(hydrated.transactions[key].status) < 0) {
			hydrated.transactions[key].status = INTERRUPTED;
		}
	});
}
export default createStore(
	combineReducers(reducers),
	hydrated || {},
	middleWare);
