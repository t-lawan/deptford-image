import { OPEN_MODAL, CLOSE_MODAL, HAS_LOADED } from "./action";

const initalState = {
  modal_open: false,
  modal_component: null,
  has_loaded: false
};

export const reducer = (state = initalState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal_open: true
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modal_open: false
      };
    case HAS_LOADED:
      return {
        ...state,
        has_loaded: true
      };
    default:
      return state;
  }
};
