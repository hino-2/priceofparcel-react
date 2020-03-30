import React, { useState }           from 'react'
import { useSelector, useDispatch }  from 'react-redux'
import { YMaps, Map, ObjectManager } from 'react-yandex-maps' 
import Message                       from '../Message'
import { getSafe }                   from '../../utils/basic'
import { addPlacemark }              from '../../actions'
import generatePlacemarkFromOPSInfo  from './generatePlacemarkFromOPSInfo'
import './style.scss'

const YMap = () => {
    const [objectManager, setObjectManager] = useState({})
    const [ymaps, setYmaps]                 = useState({})
    const [message, setMessage]             = useState()
    const showEcom          = useSelector(state => state.showEcom)
    const ecomPvz           = useSelector(state => state.ecomPvz)
    const placemarks        = useSelector(state => state.placemarks)
    const dispatch          = useDispatch() 
    const controls          = ['zoomControl', 'fullscreenControl', 'searchControl']
    let   PVZ               = []

    PVZ = showEcom ? [...placemarks, ...ecomPvz] : placemarks

    const [mapState, setMapState] = useState({ 
        center: [56.8519, 60.6122], 
        zoom: 4,
        controls: controls
    })

    // TODO: detect city
    //setMapState(newMapState)
    
    const init = (ymaps) => {
        //ymaps.container.fitToViewport()
        setYmaps(ymaps)
    }

    const getAddressByCoords = async ([latitude, longitude]) => {
        const myGeocoder = ymaps.geocode([latitude, longitude], { json: true, kind: 'house', results: 1 })
        return myGeocoder.then((res) => getSafe(() => res.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text))
    }
    const getOPSbyAddress = async (address) => {
        const response = await fetch(`/getOPSByAddress?address=${address}`)
        const data = await response.json()
        return data.postoffices[0]
    }
    const getOPSInfo = async (index) => {
        const response = await fetch(`/getOPSInfo?index=${index}`)
        const info = await response.json()
        return info
    }
    
    const onMapClick = async (e) => {
        const [latitude, longitude] = e.get('coords')

        const address = await getAddressByCoords([latitude, longitude])
        if(address === '') {
            setMessage(<Message text="В этом месте нет дома с адресом" level="0"/>)
            return
        }

        const index = await getOPSbyAddress(address)
        if(isNaN(index)) {
            setMessage(<Message text="Этот адрес не обслуживает ни одно отделение Почты" level="1"/>)
            return
        }

        const info = await getOPSInfo(index)
        if(getSafe(() => info.code) === '1004') {
            setMessage(<Message text={`Этот дом обслуживает отделение Почты ${index}, но информацию о нем получить не удалось<br />Попробуйте еще разок`} level="2"/>)
            return
        }

        const placemark = generatePlacemarkFromOPSInfo(info)
        
        if(!placemarks.find((item) => item.id === index))
            dispatch(addPlacemark(placemark))

        setTimeout(() => {
            setMapState({ 
                center: [latitude, longitude], 
                zoom: 15,
                controls: controls
            })
            objectManager.objects.balloon.open(index)
        }, 100)
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
                    instanceRef={om => setObjectManager(om)}
                />
            </Map>
            { message }
        </YMaps>
    )
}

export default YMap;