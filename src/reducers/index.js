import isMobileReducer           from './isMobile'
import showEcomReducer           from './showEcom'
import getEcomPvzFromFileReducer from './getEcomPvz'
import placemarkReducer          from './placemarkReducer'
import loadCompanyReducer        from './loadCompanyReducer'
import loadUslugaReducer         from './loadUslugaReducer'
import directionIndexReducerFrom from './directrionIndexReducerFrom'
import directionIndexReducerTo   from './directrionIndexReducerTo'
import pickUpPointReducer        from './pickUpPointsReducer'
import countriesReducer          from './countriesReducer'
import isLoadingReducer          from './isLoadingReducer'
import { combineReducers }       from 'redux'

const allReducers = combineReducers({
    isMobile: isMobileReducer,
    showEcom: showEcomReducer,
    ecomPvz: getEcomPvzFromFileReducer,
    placemarks: placemarkReducer,
    company: loadCompanyReducer,
    usluga: loadUslugaReducer, 
    from: directionIndexReducerFrom,
    to: directionIndexReducerTo,
    pickUpPoints: pickUpPointReducer,
    countries: countriesReducer,
    isLoading: isLoadingReducer
})

export default allReducers