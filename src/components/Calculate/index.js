import React, { useState, useEffect, useCallback } from "react"
import uniqid from "uniqid";
import './style.scss'
import { useSelector } from "react-redux";
import { replaceAll, getSafe } from "../../utils/basic";

const Calculate = () => {
    const [tariff,   setTariff]   = useState('')
    const [delivery, setDelivery] = useState('')
    const [pricingDetails, setPricingDetails] = useState('')
    const company  = useSelector(state => state.company)
    const usluga   = useSelector(state => state.usluga)
    const from     = useSelector(state => state.from)
    const to       = useSelector(state => state.to)

    const generateQueryStringFromParams = () => {
        return [...document.querySelectorAll('.param')].reduce((query, item) => {
            let res = item.value
            
            if (item.name === 'date')   res = replaceAll(item.value, '-', '')
            if (item.name === 'weight') res = replaceAll(item.value, ' ', '')
            if (item.getAttribute('type') === 'checkbox') res = item.checked ? '1' : '0'
            if (item.getAttribute('type') === 'select')   res = item.options[item.selectedIndex].value
            if (item.className.search('currency') >= 0) res = parseInt(replaceAll(replaceAll(item.value,' ', ''), '.', '')) * 100

            return query += `&${item.name}=${res}`
            // TODO: internation package processing
            // if($('#usluga option:selected').attr('cat') == 4) {				// если международная
            //     params += '&country=' + (selCountry == 0 ? $('#country').val() : selCountry);
            // } else
            //     params += '&from=' + $from + '&to=' + $to;
        }, '')
    }

    const generateQueryStringFromServices = () => {
        return '&service=' + [...document.querySelectorAll('.service')].reduce((query, item) => {
            return query += item.checked ? item.id.replace('s', '') + ',' : ''
        }, '')
    }

    const togglePricingDetails = (e) => {
        if(document.querySelector('#help_price') === null) return
        
        let details = document.querySelector('#details')
        if(e.target.id !== 'help_price') { 
            details.style.display = 'none' 
            return
        }

        let isVisible = window.getComputedStyle(details).display === 'none' ? false : true
        if(isVisible) {
            details.style.display = 'none'
            return
        }
        else {
            let imgQuestionCoords = document.querySelector('#help_price').getBoundingClientRect()
            
            details.style.left = `${imgQuestionCoords.x + e.offsetX + 22}px`
            details.style.top =  `${imgQuestionCoords.y + e.offsetY - details.offsetHeight}px`
            details.style.display = 'block'
        }
    
        // TODO: low width pricing details
        // if(low_width) {
        //     $("#" + helpID).css('left', 0);
        //     $("#" + helpID).css('top',  0);
        //     $("#" + helpID).css('max-width',  ($(window).width() - 2) + 'px');
        //     $("#" + helpID).css('height',  '-webkit-fill-available');
        // } else {
    }

    const fetchTariff = async () => {
        [...document.querySelectorAll('#objParamsAndServices label.objLabel')].forEach((item) => 
            document.querySelector(`#${item.htmlFor}`).style.border = ''
        )        
        let tariffQuery = `https://tariff.pochta.ru/tariff/v1/calculate?jsontext&object=${usluga}&from=${from}&to=${to}` 
                            + generateQueryStringFromParams() 
                            + generateQueryStringFromServices()
        let responce = await fetch(tariffQuery)
        let data = await responce.json()
        
        let price = parseInt(data.paynds) / 100
        if (isNaN(price)) {
            price = data.error['0']
            
            setTariff([<div key={uniqid()}><font color="red" key={uniqid()}>{price}</font></div>]);
            // TODO: tariff error highlights
            [...document.querySelectorAll('#objParamsAndServices label.objLabel')].forEach((item) => {
                if(price.search(item.htmlFor) > 0)
                    document.querySelector(`#${item.htmlFor}`).style.border = '1px solid red'
            })
        } else {
            setTariff([<React.Fragment key={uniqid()}>
                        <font id="actualPrice" color="#2a53d3" size="5" key={uniqid()}>{price} ₽ с НДС</font>
                        <img id="help_price" 
                             src="img/question-circle-o.svg" 
                             style={{"marginLeft": "5px", "cursor": "pointer"}} 
                             alt="Детали тарификации" 
                            //  onClick={togglePricingDetails}
                             key={uniqid()} />
                       </React.Fragment>])
            // TODO: check mobile version                       
            // setTimeout(() => {		                    		     		          // без этого на мобилках по какой то причине аттрибут font.size
            //     document.querySelector('#actualPrice').innerHTML(price + ' ₽ с НДС') // не всегда усваивался браузером, и текст был size=1
            // }, 10)
            // TODO: pricing detais
            let pricingDetailsJSX = []
            
            data.tariff.forEach((item) => {
                let valnds
                [...Object.values(item)].forEach((item) => {
                    valnds = getSafe(() => item.valnds)
                })
                if(parseInt(valnds) > 0) 
                    pricingDetailsJSX.push(
                        <div className="price" key={uniqid()}>
                            <div style={{"backgroundColor": "white"}} key={uniqid()}>
                                {item.name}
                            </div>
                            <div style={{"backgroundColor": "white", "display": "grid", "justifyItems": "end"}} key={uniqid()}>
                                <font color="#2a53d3" key={uniqid()}>
                                    {valnds / 100} ₽
                                </font>
                            </div>
                        </div>
                    )
            })
            setPricingDetails(pricingDetailsJSX)
        }
    }

    const fetchDelivery = async () => {
        let deliveryQuery = `https://delivery.pochta.ru/delivery/v1/calculate?jsontext&object=${usluga}&from=${from}&to=${to}`
        let responce = await fetch(deliveryQuery)
        let data = await responce.json()
        
        if (typeof data.delivery !== 'undefined') {
            let deliveryMin = parseInt(data.delivery.min)
            let deliveryMax = parseInt(data.delivery.max)
            setDelivery([<font id="actualDelivery" color="#2a53d3" size="5" key={uniqid()}>
                            {`от ${deliveryMin} до ${deliveryMax} дней`}
                        </font>])
            // TODO: check mobile version
            // setTimeout(function () {																							// без этого на мобилках по какой то ебанутой причине аттрибут font.size
            //     $('#actualDelivery').html('от ' + deliveryMin + ' до ' + deliveryMax + ' дней'); // не всегда усваивался браузером, и текст был size=1
            // }, 10);
        } else {
            // TODO: internation package processing
            // if($('#usluga').attr('cat') == 4) {				// если международная
            //     res = '<font color=' + indexColorChoosed + ' size="5">Примерный срок 14 дней</font>';
            // }
            setDelivery([<div key={uniqid()}><font color="red" key={uniqid()}>{data.error['0']}</font></div>])
        }
    }

    const mainButtonClick = () => {
        if(company === "0") {
            fetchTariff()
            fetchDelivery()
        }
    }

    useEffect(() => {
        document.querySelector('body').addEventListener('click', togglePricingDetails)
        return () => document.querySelector('body').removeEventListener('click', togglePricingDetails)
    })

    return (
        <>
            <div className="main_button" key={uniqid()}>
                <button className="fill" 
                        id="main_button" 
                        onClick={mainButtonClick} 
                        style={{"width": "90%", "height": "75%", "marginTop": "30px"}}
                        key={uniqid()}>
					Сколько и когда?
				</button>
            </div>
            <div>&nbsp;</div>
            <div className="result" id="tariff" key={uniqid()}>
                { tariff }
            </div>
            <div className="result" id="delivery" key={uniqid()}>
                { delivery }
            </div>
            <div className="help" id="details" key={uniqid()}>
                { pricingDetails }
            </div>
        </>
    )
}

export default Calculate