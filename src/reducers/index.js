import isMobileReducer from './isMobile'
import showEcomReducer from './showEcom'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer from './placemarkReducer'
import loadCompanyReducer from './loadCompanyReducer'
import loadUslugaReducer from './loadUslugaReducer'
import directionIndexReducerFrom from "./directrionIndexReducerFrom"
import directionIndexReducerTo from "./directrionIndexReducerTo"
import paramsReducer from "./paramsReducer"
import servicesReducer from "./servicesReducer"
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    showEcom: showEcomReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
    company: loadCompanyReducer,
    usluga: loadUslugaReducer, 
    params: paramsReducer,
    services: servicesReducer,
    from: directionIndexReducerFrom,
    to: directionIndexReducerTo
})

export default allReducers