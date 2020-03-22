const directionIndexReducerFrom = (state = "620085", action) => {
    switch (action.type) {
        case "SET_DIRECTION_INDEX_FROM":
            return action.data
        default:
            return state
    }
}

export default directionIndexReducerFrom