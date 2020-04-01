const directionIndexReducerTo = (state = "не выбрано", action) => {
    switch (action.type) {
        case "SET_DIRECTION_INDEX_TO":
            return action.data
        default:
            return state
    }
}

export default directionIndexReducerTo