import React, { Component } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps' 

export default class YMap extends Component{
    init = (ymaps) => {

    }

    render() {
        return (
            <YMaps onLoad={ymaps => this.init(ymaps)}
                query={{
                    ns: 'use-load-option',
                    load: 'Map, Placemark, control.ZoomControl, control.FullscreenControl, geoObject.addon.balloon',
                }}>
                <Map defaultState={{ 
                        center: [56.8519, 60.6122], 
                        zoom: 4,
                        controls: ['zoomControl', 'fullscreenControl'], }}
                    defaultOptions={{
                        autoFitToViewport: 'always',
                        searchControlProvider: 'yandex#search'
                    }}>
                    <Placemark
                        defaultGeometry={[56.8519, 60.6122]}
                        properties={{
                            balloonContentBody: 'This is balloon loaded by the Yandex.Maps API module system',
                        }}
                    />
                </Map>
            </YMaps>
        )
    }        
}