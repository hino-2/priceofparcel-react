const loadServicesReducer = (state = "0", action) => {
    switch (action.type) {
        case "LOAD_SERVICE":
            return action.data
        default:
            return state
    }
}

export default loadServicesReducer;