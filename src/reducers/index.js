import isMobileReducer from './isMobile'
import showEcomReducer from './showEcom'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer from './placemarkReducer'
import loadCompanyReducer from './loadCompanyReducer'
import loadServiceReducer from './loadServiceReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    showEcom: showEcomReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
    company: loadCompanyReducer,
    service: loadServiceReducer
})

export default allReducers