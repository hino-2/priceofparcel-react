const mobileReducer = (state = false, action) => {
    switch (action.type) {
        case "MOBILE":
            return true
        case "DESKTOP":
            return false
        default:
            return state
    }
}

export default mobileReducer;