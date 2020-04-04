const countriesReducer = (state = null, action) => {
    switch (action.type) {
        case "COUNTRIES":
            return action.data
        default:
            return state
    }
}

export default countriesReducer