import isMobileReducer from './isMobile'
import showEcomReducer from './showEcom'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer from './placemarkReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    showEcom: showEcomReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
})

export default allReducers