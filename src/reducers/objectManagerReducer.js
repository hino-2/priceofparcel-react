const objectManagerReducer = (state = {}, action) => {
    switch (action.type) {
        case "YMAPS_OBJECT_MANAGER":
            return action.data
        default:
            return state
    }
}

export default objectManagerReducer