import React, { useState } from 'react'
import { YMaps, Map, ObjectManager } from 'react-yandex-maps' 
import { useSelector } from "react-redux";
import './style.scss'

function YMap () {
    const showEcom   = useSelector(state => state.showEcom)
    const ecomPvz    = useSelector(state => state.ecomPvz)
    let   placemarks = useSelector(state => state.placemarks)
    let   PVZ        = []

    PVZ = showEcom ? [...placemarks, ...ecomPvz] : placemarks
    // console.log(PVZ)
    

    const [mapState, setMapState] = useState({ 
        center: [56.8519, 60.6122], 
        zoom: 4,
        controls: ['zoomControl', 'fullscreenControl', 'searchControl']
    })

    //setMapState(newMapState)              // TODO: detect city
    
    const init = (ymaps) => {
        ymaps.container.fitToViewport()
    }
    const onMapClick = (e) => {
        console.log(e.get('coords'))
        // if($('#usluga').attr('cat') != 4) {					// если международная
        // cityByCoords(e.get('coords'));
    }

    return (
        <YMaps onLoad={ymaps => init(ymaps)}
            query={{
                ns: 'use-load-option',
                // load: 'Map,Placemark,ObjectManager,objectManager.Balloon,Clusterer,control.SearchControl,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
                load: 'package.full',
                apikey: 'bdfba964-3a7d-481c-bef0-29c68a58f464',
                lang: 'ru_RU'
            }}>
            <Map state={ mapState }
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