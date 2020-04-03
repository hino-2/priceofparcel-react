const pickUpPointReducer = (state = null, action) => {
    switch (action.type) {
        case "PICK_UP_POINTS":
            return action.data
        default:
            return state
    }
}

export default pickUpPointReducer