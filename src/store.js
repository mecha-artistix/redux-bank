import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";
// import { applyMiddleware, combineReducers, createStore } from "redux";
// import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
// configure store automatically will combine all reducers, add thunk middleware, setup developertools

// const rootReducer = combineReducers({
//   account: accountReducer,
//   customer: customerReducer,
// });
// const store = createStore(rootReducer, applyMiddleware(thunk));

const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
  },
});

export default store;
