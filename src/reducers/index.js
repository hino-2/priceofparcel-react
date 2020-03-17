import isMobileReducer from './isMobile'
import showEcomReducer from './showEcom'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer from './placemarkReducer'
import loadCompanyReducer from './loadCompanyReducer'
import loadUslugaReducer from './loadUslugaReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    showEcom: showEcomReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
    company: loadCompanyReducer,
    usluga: loadUslugaReducer
})

export default allReducers