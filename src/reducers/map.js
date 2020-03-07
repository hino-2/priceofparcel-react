const mapReducer = (state = true, action) => {
    switch (action.type) {
        case "SHOW_MAP":
            return true
        case "HIDE_MAP":
            return false
        default:
            return state
    }
}

export default mapReducer;