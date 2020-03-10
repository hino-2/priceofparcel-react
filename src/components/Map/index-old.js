import React, { Component } from 'react'
import { YMaps, Map, ObjectManager } from 'react-yandex-maps' 
import { useSelector } from "react-redux";

export default class YMap extends Component{
    myMap = {}
    ecomPVZ = []
    state = {
        ecomPVZshown: false,
        ecomPVZ:  [],
        mapState: { 
            center: [56.8519, 60.6122], 
            zoom: 4,
            controls: ['zoomControl', 'fullscreenControl', 'searchControl'], },
            
    }

    getSafe = fn => {
        try {
            if (fn() !== undefined) {
                return fn();
            } else {
                return "";
            }
            // return fn();
        } catch (e) {
            return "";
        }
    }

    getWorkTime = (val) => {
        let worktime = val["work-time"] ? val["work-time"] : [
            "пн, открыто: " + this.getSafe(() => val["working-hours"][0]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][0]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][0]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][0]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][0]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "вт, открыто: " + this.getSafe(() => val["working-hours"][1]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][1]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][1]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][1]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][1]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "ср, открыто: " + this.getSafe(() => val["working-hours"][2]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][2]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][2]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][2]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][2]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "чт, открыто: " + this.getSafe(() => val["working-hours"][3]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][3]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][3]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][3]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][3]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "пт, открыто: " + this.getSafe(() => val["working-hours"][4]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][4]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][4]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][4]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][4]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "сб, открыто: " + this.getSafe(() => val["working-hours"][5]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][5]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][5]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][5]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][5]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                ),
            "вс, открыто: " + this.getSafe(() => val["working-hours"][6]['begin-worktime']).substring(0, 5) + " - "
                            + this.getSafe(() => val["working-hours"][6]['end-worktime']).substring(0, 5) +
                                (
                                    this.getSafe(() => val["working-hours"][6]['lunches']).length > 0 ? ",  перерыв: "
                                        + this.getSafe(() => val["working-hours"][6]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                        + this.getSafe(() => val["working-hours"][6]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                                )]
        worktime.forEach((line, key) => {
            if(line.indexOf('открыто:  -') > 0) {
                worktime[key] = '<font color="#ff5e52">' + line.split(',')[0] + ', выходной</font>';
            }
        })
        return worktime
    }

    getAddress = (val) => {
        return val['address-source'] ?
        val['region'] + ", " + val['settlement'] + ", " + val['address-source']
        : (val["address"]["region"] === val["address"]["place"] ?
            val["address"]["place"] + ", " + this.getSafe(() => val["address"]["street"]) + ", " + this.getSafe(() => val["address"]["house"])
            : val["address"]["region"] + ", " + val["address"]["place"] + ", " + this.getSafe(() => val["address"]["street"]) + ", " + this.getSafe(() => val["address"]["house"]))
    }

    logoAndIcon = (brand) => {
        let logo, icon
        switch(brand.toUpperCase()) {
            case "ГЕРМЕС":
                logo = 'ecom/hermes1.png';
                icon = 'ecom/hermes_icon1.png';
                break;
            case "ХАЛВА":
                logo = 'ecom/halva1.png';
                icon = 'ecom/halva_icon1.png';
                break;
            case "ТЕЛЕПОРТ":
                logo = 'ecom/teleport1.png';
                icon = 'ecom/teleport_icon1.png';
                break;
            case "ОБУВЬ РОССИИ":
                logo = 'ecom/obuvrus1.png';
                icon = 'ecom/obuvrus_icon.png';
                break;
            default:
                logo = 'ecom/pochta.png';
                icon = 'ecom/rp_icon.png';
                break;
        }
        return [logo, icon]
    }

    getBalloonContentFooter = (worktime, index, address) => {
        return ('<font size="3"><div>' + worktime[0] + '<br>' + worktime[1] + '<br>' + worktime[2] + '<br>' + worktime[3] + '<br>' + worktime[4] + '<br>' + worktime[5] + '<br>' + worktime[6] + '<br></div></font> \
                    <div style="width: 100%; text-align: center;"> \
                    <button class="slide" onclick="setDirection(\'#from\', \'' + index + '\', \'' + address + '\'); return false;" style="--color: #2a53d3; --hover: #2a53d3; margin: 5px 15px 1px 0;line-height: 1.5;"> \
                        отсюда \
                    </button> \
                    <button class="slide2" onclick="setDirection(\'#to\', \'' + index + '\', \'' + address + '\'); return false;" style="--color: #2a53d3; --hover: #2a53d3; margin: 5px 0 1px 15px; line-height: 1.5;"> \
                        &nbsp;&nbsp;сюда&nbsp;&nbsp; \
                    </button></div>')
        // return (
        //     <div>
        //         <font size="3">
        //             <div> {worktime[0]} <br/> {worktime[1]} <br/> {worktime[2]} <br/> {worktime[3]} <br/> {worktime[4]} <br/> {worktime[5]} <br/> {worktime[6]} <br/></div>
        //         </font> 
        //         <div style={{"width": "100%", "text-align": "center"}}> 
        //             <button className="slide" onClick="setDirection(\'#from\', \'' + index + '\', \'' + address + '\'); return false;" style={{"--color": "#2a53d3", "--hover": "#2a53d3", "margin": "5px 15px 1px 0", "line-height": "1.5"}}> 
        //                 отсюда 
        //             </button> 
        //             <button className="slide2" onClick="setDirection(\'#to\', \'' + index + '\', \'' + address + '\'); return false;" style={{"--color": "#2a53d3", "--hover": "#2a53d3", "margin": "5px 0 1px 15px", "line-height": "1.5"}}> 
        //                 &nbsp;&nbsp;сюда&nbsp;&nbsp; 
        //             </button>
        //         </div>
        //     </div>)
    }

    getBalloonContentHeader = (logo, index, brand) => {
        return ('<div id="logo" class="logo"><img src="' + logo + '" style="max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;"/><div><font size="4"><b>&nbsp;' + index + '<br/>&nbsp;' + brand + '</b></font></div></div>')
    }

    getBalloonContentBody = (address, desc) => {
        return ('<font size="3"><div style="margin:10px 0px 10px 0px;">' + address + '</font><font size="2">' + desc + '</div></font>')
    }

    getHintContent = (logo, index, brand, address) => {
        return ("<div id='logo' class='logo'><img src='" + logo + "' style='max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;'/><div><font size='3'>&nbsp;" + index + " " + brand + "<br/>&nbsp;" + address + "</div></font></div>")
    }

    async addEcomPVZ() {
        let ecomCollection = {
            type: "FeatureCollection",
            features: []
        }
        let pvz = await fetch('/ecom/pvz.json')
        await pvz.json()
        .then(data => { 
            data.forEach(val => {
                // console.log(val);
                
                let index = val["postal-code"] ? val["postal-code"] : val["address"]["index"],
                    latitude = parseFloat(val["latitude"]),
                    longitude = parseFloat(val["longitude"]),
                    logo, icon,
                    brand = val["brand-name"] ? val["brand-name"] : "Почта России",
                    desc = val["getto"] ? "<br/>" + val["getto"] : "",
                    address = this.getAddress(val),
                    worktime = this.getWorkTime(val)
                
                let a = this.logoAndIcon(brand)
                logo = a[0]
                icon = a[1]

                let balloonContentHeader = this.getBalloonContentHeader(logo, index, brand),
                    balloonContentBody = this.getBalloonContentBody(address, desc),
                    balloonContentFooter = this.getBalloonContentFooter(worktime, index, address),
                    hintContent = this.getHintContent(logo, index, brand, address)
                
                balloonContentFooter = val['is-temporary-closed'] ? 
                    balloonContentFooter + '<br/><font size="3">Временно закрыто</font>' : balloonContentFooter

                let yaObject = {
                    type: "Feature",
                    id: index,
                    geometry: {
                        type: "Point",
                        coordinates: [latitude, longitude]
                    },
                    properties: {
                        index: index,
                        balloonContentHeader: balloonContentHeader,
                        balloonContentBody: balloonContentBody,
                        balloonContentFooter: balloonContentFooter,
                        hintContent: hintContent
                    },
                    options: {
                        hintPane: 'hint',
                        iconLayout: 'default#image',
                        iconImageHref: icon,
                        iconImageSize: [32, 32],
                        iconImageOffset: [-16, -16]
                    }
                }
                ecomCollection.features.push(yaObject)
            })
            
            // this.setState({ ecomPVZ: ecomCollection.features })
            this.ecomPVZ = ecomCollection.features
        })
        .catch(() => console.log('no ECOM pvz file found'))
    }
    
    init = (ymaps) => {
        this.myMap = ymaps
        this.myMap.container.fitToViewport()
    }
    
    onMapClick = (e) => {
        console.log(e.get('coords'))
        // if($('#usluga').attr('cat') != 4) {					// если международная
        // cityByCoords(e.get('coords'));
    }
    
    componentWillMount () {
        this.setState ({ isEcomShown: useSelector(state => state.isEcomShown) })
        this.addEcomPVZ()
    }

    componentDidMount () {
    }
    
    componentWillReceiveProps () {
        this.state.ecomPVZshown ? this.setState({ ecomPVZ: this.ecomPVZ }) : this.setState({ ecomPVZ: [] })
    }

    render() {
        return (
            <YMaps onLoad={ymaps => this.init(ymaps)}
                query={{
                    ns: 'use-load-option',
                    load: 'Map,Placemark,ObjectManager,Clusterer,control.SearchControl,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
                    apikey: 'bdfba964-3a7d-481c-bef0-29c68a58f464',
                    lang: 'ru_RU'
                }}>
                <Map state={this.state.mapState}
                    options={{
                        autoFitToViewport: 'always',
                        searchControlProvider: 'yandex#search'
                    }}
                    style={{'width': '100%', 'height': '100%'}}
                    onClick={this.onMapClick}>
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
                        features={this.state.ecomPVZ}
                    />
                </Map>
            </YMaps>
        )
    }        
}