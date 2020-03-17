const loadUslugaReducer = (state = "0", action) => {
    switch (action.type) {
        case "LOAD_USLUGA":
            return action.data
        default:
            return state
    }
}

export default loadUslugaReducer;