const loadCompanyReducer = (state = "0", action) => {
    switch (action.type) {
        case "LOAD_COMPANY":
            return action.data
        default:
            return state
    }
}

export default loadCompanyReducer;