import { combineReducers } from "redux";
import stableReducer from "./stableReducer";
import listReducer from "./liste.reducer";
export default combineReducers({
  stableReducer,
  listReducer,
});
