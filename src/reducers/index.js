import mobileReducer from './isMobile'
import ecomReducer from './map'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: mobileReducer,
    isEcomShown: ecomReducer
})

export default allReducers