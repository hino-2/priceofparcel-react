import React, { useState }           from 'react'
import { useSelector, useDispatch }  from 'react-redux'
import { YMaps, Map, ObjectManager } from 'react-yandex-maps' 
import { getSafe }                   from '../../utils/basic'
import { addPlacemark }              from '../../actions'
import generatePlacemarkFromOPSInfo  from './generatePlacemarkFromOPSInfo'
import './style.scss'

function YMap () {
    const [ymaps, setYmaps] = useState({})
    const showEcom          = useSelector(state => state.showEcom)
    const ecomPvz           = useSelector(state => state.ecomPvz)
    const placemarks        = useSelector(state => state.placemarks)
    const dispatch          = useDispatch() 
    let   PVZ               = []

    PVZ = showEcom ? [...placemarks, ...ecomPvz] : placemarks

    const [mapState, setMapState] = useState({ 
        center: [56.8519, 60.6122], 
        zoom: 4,
        controls: ['zoomControl', 'fullscreenControl', 'searchControl']
    })

    // TODO: detect city
    //setMapState(newMapState)
    
    const init = (ymaps) => {
        //ymaps.container.fitToViewport()
        setYmaps(ymaps)
    }

    const onMapClick = async (e) => {
        const [latitude, longitude] = e.get('coords')
        
        const getAddressByCoords = async ([latitude, longitude]) => {
            const myGeocoder = ymaps.geocode([latitude, longitude], { json: true, kind: 'house', results: 1 })
            return myGeocoder.then((res) => getSafe(() => res.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text))
        }
        const address = await getAddressByCoords([latitude, longitude])
        console.log(address);

        const getOPSbyAddress = async (address) => {
            const response = await fetch(`/getOPSByAddress?address=${address}`)
            const data = await response.json()
            return data.postoffices[0]
        }
        const index = await getOPSbyAddress(address)
        console.log(index) 

        const getOPSInfo = async (index) => {
            const response = await fetch(`/getOPSInfo?index=${index}`)
            const info = await response.json()
            return info
        }
        const info = await getOPSInfo(index)
        console.log(info)
        
        const placemark = generatePlacemarkFromOPSInfo(info)
        console.log(placemark);
        
        dispatch(addPlacemark(placemark))

        // TODO: open balloon & handle when no OPS or no house found 

    }

    return (
        <YMaps query={{
                ns: 'use-load-option',
                // load: 'Map,Placemark,ObjectManager,objectManager.Balloon,Clusterer,control.SearchControl,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
                load: 'package.full',
                apikey: 'bdfba964-3a7d-481c-bef0-29c68a58f464',
                lang: 'ru_RU'
            }}>
            <Map onLoad={ymaps => init(ymaps)}
                state={ mapState }
                options={{
                    autoFitToViewport: 'always',
                    searchControlProvider: 'yandex#search'
                }}
                style={{'width': '100%', 'height': '100%'}}
                onClick={ onMapClick }>
                <ObjectManager
                    options={{
                        clusterize: true,
                    }}
                    objects={{
                        preset: 'islands#blueDotIcon',
                    }}
                    clusters={{
                        preset: 'islands#blueClusterIcons',
                    }}
                    features={ PVZ }
                />
            </Map>
        </YMaps>
    )
}

export default YMap;