export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const HAS_LOADED = 'HAS_LOADED';
export const SHOW_INSTRUCTIONS = 'SHOW_INSTRUCTIONS';
export const HIDE_INSTRUCTIONS = 'HIDE_INSTRUCTIONS';
export const SET_EXHIBITION_ITEMS = 'SET_EXHIBITION_ITEMS';
export const LOADING = 'LOADING';

export const openModal = (item) => {
    return {
        type: OPEN_MODAL,
        modal_item: item
    }
}

export const closeModal = () => {
    return {
        type: CLOSE_MODAL
    }
}

export const hasLoaded = () => {
    return {
        type: HAS_LOADED
    }
}

export const loading = (loaded, total) => {
    return  {
        type: LOADING,
        loaded: loaded,
        total: total

    }
}

export const showInstructions = () => {
    return {
        type: SHOW_INSTRUCTIONS
    }
}

export const hideInstructions = () => {
    return {
        type: HIDE_INSTRUCTIONS
    }
}


export const setExhibitionItems = (exhibitionItems) => {
    return {
        type: SET_EXHIBITION_ITEMS,
        exhibition_items: exhibitionItems
    }
}