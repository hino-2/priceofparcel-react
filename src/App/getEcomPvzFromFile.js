import { getSafe } from "../utils/basic"

const getEcomPVZfromFile = async(file) => {
    let ecomCollection = {
        type: "FeatureCollection",
        features: []
    }
    let response = await fetch(file)
    let data = await response.json()
    data.forEach(val => {
        // console.log(JSON.stringify(val));
        let index = val["postal-code"] ? val["postal-code"] : val["address"]["index"],
            latitude = parseFloat(val["latitude"]),
            longitude = parseFloat(val["longitude"]),
            logo, icon,
            brand = val["brand-name"] ? val["brand-name"] : "Почта России",
            desc = val["getto"] ? "<br/>" + val["getto"] : "",
            address = getAddress(val),
            worktime = getWorkTime(val)
        
        let a = logoAndIcon(brand)
        logo = a[0]
        icon = a[1]

        let balloonContentHeader = getBalloonContentHeader(logo, index, brand),
            balloonContentBody = getBalloonContentBody(address, desc),
            balloonContentFooter = getBalloonContentFooter(worktime, index, address),
            hintContent = getHintContent(logo, index, brand, address)
        
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
        // console.log(JSON.stringify(yaObject));
    })
    return ecomCollection.features
}
const getWorkTime = (val) => {
    let worktime = val["work-time"] ? val["work-time"] : [
        "пн, открыто: " + getSafe(() => val["working-hours"][0]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][0]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][0]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][0]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][0]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "вт, открыто: " + getSafe(() => val["working-hours"][1]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][1]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][1]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][1]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][1]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "ср, открыто: " + getSafe(() => val["working-hours"][2]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][2]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][2]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][2]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][2]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "чт, открыто: " + getSafe(() => val["working-hours"][3]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][3]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][3]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][3]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][3]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "пт, открыто: " + getSafe(() => val["working-hours"][4]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][4]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][4]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][4]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][4]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "сб, открыто: " + getSafe(() => val["working-hours"][5]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][5]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][5]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][5]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][5]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            ),
        "вс, открыто: " + getSafe(() => val["working-hours"][6]['begin-worktime']).substring(0, 5) + " - "
                        + getSafe(() => val["working-hours"][6]['end-worktime']).substring(0, 5) +
                            (
                                getSafe(() => val["working-hours"][6]['lunches']).length > 0 ? ",  перерыв: "
                                    + getSafe(() => val["working-hours"][6]['lunches'][0]['begin-lunchtime']).substring(0, 5) + " - "
                                    + getSafe(() => val["working-hours"][6]['lunches'][0]['end-lunchtime']).substring(0, 5) : ""
                            )]
    worktime.forEach((line, key) => {
        if(line.indexOf('открыто:  -') > 0) {
            worktime[key] = '<font color="#ff5e52">' + line.split(',')[0] + ', выходной</font>';
        }
    })
    return worktime
}
const getAddress = (val) => {
    return val['address-source'] ?
    val['region'] + ", " + val['settlement'] + ", " + val['address-source']
    : (val["address"]["region"] === val["address"]["place"] ?
        val["address"]["place"] + ", " + getSafe(() => val["address"]["street"]) + ", " + getSafe(() => val["address"]["house"])
        : val["address"]["region"] + ", " + val["address"]["place"] + ", " + getSafe(() => val["address"]["street"]) + ", " + getSafe(() => val["address"]["house"]))
}
const logoAndIcon = (brand) => {
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
const getBalloonContentFooter = (worktime, index, address) => {
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
const getBalloonContentHeader = (logo, index, brand) => {
    return ('<div id="logo" class="logo"><img src="' + logo + '" style="max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;"/><div><font size="4"><b>&nbsp;' + index + '<br/>&nbsp;' + brand + '</b></font></div></div>')
}
const getBalloonContentBody = (address, desc) => {
    return ('<font size="3"><div style="margin:10px 0px 10px 0px;">' + address + '</font><font size="2">' + desc + '</div></font>')
}
const getHintContent = (logo, index, brand, address) => {
    return ("<div id='logo' class='logo'><img src='" + logo + "' style='max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;'/><div><font size='3'>&nbsp;" + index + " " + brand + "<br/>&nbsp;" + address + "</div></font></div>")
}

export default getEcomPVZfromFile