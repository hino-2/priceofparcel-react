import isMobileReducer from './isMobile'
import isEcomShownReducer from './isEcomShown'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer from './placemarkReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    isEcomShown: isEcomShownReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
})

export default allReducers