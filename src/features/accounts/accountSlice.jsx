import { createSlice } from "@reduxjs/toolkit";
//createSlice automaticaly creates actioncreators from reducers. it makes writing reducers alot easier as we no longer need a switch statemnt as default is automatically handled. This uses a library behind the scenes called imr which will convert all logic back to immutable logic. since redux require that logic to be able to work
//init state

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state, action) {
      state.isLoading = true;
    },
  },
});

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  // If currency is different then we make the api call for conversion
  // we do not return the action immidiately but instead we will return a function
  // if we return a function then redux knows that this is async behavior and needs to be completed before dispatching action to store
  // redux call this func internally and gets access to dispatch func and current state
  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });
    //API CALL
    const host = "api.frankfurter.app";
    const res = await fetch(
      `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;
    dispatch({ type: "account/convertingCurrency" });

    // RETURN ACTION
    dispatch({ type: "account/deposit", payload: converted });
  };
}

console.log(accountSlice);
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export default accountSlice.reducer;
// reducer

// export default function accountReducer(state = initialStateAccount, action) {
//   switch (action.type) {
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };

//     case "account/withdraw":
//       return { ...state, balance: state.balance - action.payload };

//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//         balance: state.balance + action.payload.amount,
//       };

//     case "account/payLoan":
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };

//     case "account/convertingCurrency":
//       return { ...state, isLoading: true };

//     default:
//       return state;
//   }
// }
// //actions creators

// export function deposit(amount, currency) {
//   if (currency === "USD") return { type: "account/deposit", payload: amount };
//   // If currency is different then we make the api call for conversion
//   // we do not return the action immidiately but instead we will return a function
//   // if we return a function then redux knows that this is async behavior and needs to be completed before dispatching action to store
//   // redux call this func internally and gets access to dispatch func and current state
//   return async function (dispatch, getState) {
//     dispatch({ type: "account/convertingCurrency" });
//     //API CALL
//     const host = "api.frankfurter.app";
//     const res = await fetch(
//       `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
//     );
//     const data = await res.json();
//     const converted = data.rates.USD;
//     dispatch({ type: "account/convertingCurrency" });

//     // RETURN ACTION
//     dispatch({ type: "account/deposit", payload: converted });
//   };
// }
// export function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }
// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: { amount: amount, purpose: purpose },
//   };
// }
// export function payLoan(amount) {
//   return { type: "account/payLoan", payload: amount };
// }
