const placemarkReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD":
            return [...state, action.data]
        case "REM":
            return state.filter(x => !action.data.includes(x))
        default:
            return state
    }
}

export default placemarkReducer