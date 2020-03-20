const paramsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_PARAMS': 
            return action.data
        default:
            return state
    }
}

export default paramsReducer
