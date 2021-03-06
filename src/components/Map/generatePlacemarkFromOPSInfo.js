import { getSafe } from "../../utils/basic"

const generatePlacemarkFromOPSInfo = (val) => {
    let index     = val["postal-code"] ? val["postal-code"] : val["address"]["index"],
        latitude  = parseFloat(val["latitude"]),
        longitude = parseFloat(val["longitude"]),
        brand     = val["brand-name"] ? val["brand-name"] : "Почта России",
        desc      = val["getto"] ? val["getto"] : "",
        address   = getAddress(val),
        worktime  = getWorkTime(val)
    
    let [logo, icon] = logoAndIcon(brand)

    let balloonContentHeader = getBalloonContentHeader(logo, index, brand),
        balloonContentBody   = getBalloonContentBody(address, desc),
        balloonContentFooter = getBalloonContentFooter(worktime, index, address),
        hintContent          = getHintContent(logo, index, brand, address)
    
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
            balloonContentBody:   balloonContentBody,
            balloonContentFooter: balloonContentFooter,
            hintContent:          hintContent
        },
        options: {
            hintPane: 'hint',
            iconLayout: 'default#image',
            iconImageHref: icon,
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16]
        }
    }

    return yaObject
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

const getBalloonContentHeader = (logo, index, brand) => {
    return `<div id="logo" class="logo-balloon">
                <img src="${logo}" style="max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;"/>
                <div>
                    <font size="4">
                        <b>&nbsp;${index}<br/>&nbsp;${brand}</b>
                    </font>
                </div>
            </div>`
}

const getBalloonContentBody = (address, desc) => {
    return `<div style="margin:10px 0px 10px 0px;">
                <font size="3">${address}</font>
                <br />
                <font size="2">${desc}</font>
            </div>`
}

const getBalloonContentFooter = (worktime, index, address) => {
    return `<font size="3">
                ${worktime[0]}<br/>
                ${worktime[1]}<br/>
                ${worktime[2]}<br/>
                ${worktime[3]}<br/>
                ${worktime[4]}<br/>
                ${worktime[5]}<br/>
                ${worktime[6]}<br/>
            </font>
            <div style="width: 100%; text-align: center;" class="balloon-button"> 
                <br />
                <button class="slide" onclick="setDirection('from', '${index}', '${address}'); return false;" style="--color: #2a53d3; --hover: #2a53d3; margin: 5px 15px 1px 0;line-height: 1.5;"> 
                    отсюда 
                </button> 
                <button class="slide2" onclick="setDirection('to', '${index}', '${address}'); return false;" style="--color: #2a53d3; --hover: #2a53d3; margin: 5px 0 1px 15px; line-height: 1.5;"> 
                    &nbsp;&nbsp;сюда&nbsp;&nbsp; 
                </button>
            </div>`
}

const getHintContent = (logo, index, brand, address) => {
    return `<div id="logo" class="logo-balloon">
                <img src="${logo}" style="max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;" />
                <div>
                    <font size="3">&nbsp;${index} ${brand}<br/>&nbsp;${address}</font>
                </div>
            </div>`
}

export default generatePlacemarkFromOPSInfo