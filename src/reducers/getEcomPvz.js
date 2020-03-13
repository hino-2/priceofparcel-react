const getEcomPvzFromFileReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_ECOM_FROM_FILE': 
            return action.data
        default:
            return state
    }
}

export default getEcomPvzFromFileReducer
