import {
  OPEN_MODAL,
  CLOSE_MODAL,
  HAS_LOADED,
  SET_EXHIBITION_ITEMS,
  LOADING,
  SHOW_INSTRUCTIONS,
  HIDE_INSTRUCTIONS,
  SET_PAGES,
  SET_MEDIA_ASSETS,
  HAS_AGREED_TO_TERMS
} from "./action";
import { ModelTypes } from "../Utility/ObjectExhibitionMap";

const initalState = {
  modal_open: false,
  modal_item: null,
  modal_type: ModelTypes.EXHIBIITION_ITEM,
  has_loaded: false,
  loaded: 0.1,
  total: 1,
  exhibition_items: [],
  media_assets: [],
  pages: [],
  show_instructions: true,
  has_agreed_to_terms: false
};

export const reducer = (state = initalState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal_open: true,
        modal_item: action.modal_item,
        modal_type: action.modal_type
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modal_open: false,
        modal_item: null
      };
    case HAS_LOADED:
      return {
        ...state,
        has_loaded: true
      };
    case HAS_AGREED_TO_TERMS:
      return {
        ...state,
        has_agreed_to_terms: true
      };
    case SET_EXHIBITION_ITEMS:
      return {
        ...state,
        exhibition_items: action.exhibition_items
      };
    case SET_PAGES:
      return {
        ...state,
        pages: action.pages
      };
    case SET_MEDIA_ASSETS:
      return {
        ...state,
        media_assets: action.media_assets
      };
    case LOADING:
      return {
        ...state,
        loaded: action.loaded,
        total: action.total
      };
    case SHOW_INSTRUCTIONS:
      return {
        ...state,
        show_instructions: true
      };
    case HIDE_INSTRUCTIONS:
      return {
        ...state,
        show_instructions: false
      };
    default:
      return state;
  }
};
