import { OPEN_MODAL, CLOSE_MODAL, HAS_LOADED, SET_EXHIBITION_ITEMS, LOADING } from "./action";

const initalState = {
  modal_open: false,
  modal_component: null,
  has_loaded: false,
  loaded: 0.1,
  total: 1,
  exhibition_items: []
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
    case SET_EXHIBITION_ITEMS:
      return {
        ...state,
        exhibition_items: action.exhibition_items
      };
    case LOADING:
      return {
        ...state,
        loaded: action.loaded,
        total: action.total
      }
    default:
      return state;
  }
};
