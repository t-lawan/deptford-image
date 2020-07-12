export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const HAS_LOADED = 'HAS_LOADED';
export const HAS_AGREED_TO_TERMS = 'HAS_AGREED_TO_TERMS';
export const SHOW_INSTRUCTIONS = 'SHOW_INSTRUCTIONS';
export const HIDE_INSTRUCTIONS = 'HIDE_INSTRUCTIONS';
export const SET_EXHIBITION_ITEMS = 'SET_EXHIBITION_ITEMS';
export const LOADING = 'LOADING';
export const SET_PAGES = 'SET_PAGES';
export const SET_MEDIA_ASSETS = 'SET_MEDIA_ASSETS';

export const openModal = (item, type) => {
    return {
        type: OPEN_MODAL,
        modal_item: item,
        modal_type: type
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

export const hasAgreedToTerms = () => {
    return {
        type: HAS_AGREED_TO_TERMS
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

export const setPages = (pages) => {
    return {
        type: SET_PAGES,
        pages: pages
    }
}

export const setMediaAssets  = (mediaAssets) => {
    return {
        type: SET_MEDIA_ASSETS,
        media_assets: mediaAssets
    }
}   

export const getMediaAsset = (mediaAssets, id) =>{
    return mediaAssets.find((asset) => {
        return asset.id === id;
    })
}