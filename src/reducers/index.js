import mobileReducer from './isMobile'
import mapReducer from './map'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    isMobile: mobileReducer,
    isMapShown: mapReducer
})

export default allReducers