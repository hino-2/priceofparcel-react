const isEcomShownReducer = (state = false, action) => {
    switch (action.type) {
        case "SHOW_ECOM":
            return true
        case "HIDE_ECOM":
            return false
        default:
            return state
    }
}

export default isEcomShownReducer