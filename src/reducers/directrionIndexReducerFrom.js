const directionIndexReducerFrom = (state = "не выбрано", action) => {
    switch (action.type) {
        case "SET_DIRECTION_INDEX_FROM":
            return action.data
        default:
            return state
    }
}

export default directionIndexReducerFrom