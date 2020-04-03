import React, { useState, useEffect }from 'react'
import { useSelector, useDispatch }  from 'react-redux'
import { YMaps, Map, ObjectManager } from 'react-yandex-maps' 
import Message                       from '../Message'
import { getSafe }                   from '../../utils/basic'
import { addPlacemark, 
         setDirectionIndexTo,
         setDirectionIndexFrom,
         setObjectManager }          from '../../actions'
import generatePlacemarkFromOPSInfo  from './generatePlacemarkFromOPSInfo'
import './style.scss'

const YMap = (onLoad) => {
    const [objManager, setObjManager]    = useState()
    const [ymaps, setYmaps]              = useState()
    const [message, setMessage]          = useState()
    const showEcom   = useSelector(state => state.showEcom)
    const ecomPvz    = useSelector(state => state.ecomPvz)
    const placemarks = useSelector(state => state.placemarks)
    const dispatch   = useDispatch() 
    const controls   = ['zoomControl', 'fullscreenControl', 'searchControl']
    let   PVZ        = []

    PVZ = showEcom ? [...placemarks, ...ecomPvz] : placemarks

    const [mapState, setMapState] = useState({ 
        center: [59.5594, 150.8128], 
        zoom: 4,
        controls: controls
    })

    useEffect(() => {
        if ("geolocation" in navigator) {
            // check if geolocation is supported/enabled on current browser
            navigator.geolocation.getCurrentPosition(
                function success(position) {
                    // for when getting location is a success
                    setMapState({
                        center: [position.coords.latitude, position.coords.longitude],
                        zoom: 4,
                        controls: controls
                    })
                },
                function error(error_message) {
                    // for when getting location results in an error
                    console.error('An error has occured while retrieving location', error_message)
                })
        } else {
            // geolocation is not supported
            // get your location some other way
            console.log('geolocation is not enabled on this browser')
        }
    }, [])
    
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

    window.setDirection = (type, index, address) => {
        if(type === 'from') { 
            dispatch(setDirectionIndexFrom(index))
            document.querySelector('#from').value = address
        } else {
            dispatch(setDirectionIndexTo(index))
            document.querySelector('#to').value = address
        }
    }
    
    const onMapClick = async (e) => {
        const [latitude, longitude] = e.get('coords')
        setMessage([])

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
            setMessage(<Message text={`Информацию об ОПС ${index} получить не удалось. Попробуйте еще разок`} level="2"/>)
            return
        }

        const placemark = generatePlacemarkFromOPSInfo(info)
        
        if(!placemarks.find((item) => item.id === index))
            dispatch(addPlacemark(placemark))

        setTimeout(() => {
            // setMapState({ 
            //     center: [latitude, longitude], 
            //     zoom: 15,
            //     controls: controls
            // })
            objManager.objects.balloon.open(index)
        }, 100)
    }

    useEffect(() => {
        setTimeout(() => {
            if(objManager !== undefined) {
                onLoad.onLoad(objManager)
            }
        }, 200)
    }, [objManager])

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
                    instanceRef={om => setObjManager(om)}
                />
            </Map>
            { message }
        </YMaps>
    )
}

export default YMap