const directionIndexReducerTo = (state = "620085", action) => {
    switch (action.type) {
        case "SET_DIRECTION_INDEX_TO":
            return action.data
        default:
            return state
    }
}

export default directionIndexReducerTo