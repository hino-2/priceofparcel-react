import React, { useState, useEffect } from "react"
import { useSelector, useDispatch }   from "react-redux"
import { replaceAll, getSafe }        from "../../utils/basic"
import { isLoading }                  from "../../actions"
import uniqid                         from "uniqid"
import './style.scss'

const Calculate = () => {
    const [pricingDetails, setPricingDetails] = useState('')
    const [tariff,   setTariff]               = useState('')
    const [delivery, setDelivery]             = useState('')
    const isMobile = useSelector(state => state.isMobile)
    const company  = useSelector(state => state.company)
    const usluga   = useSelector(state => state.usluga.object)
    const from     = useSelector(state => state.from)
    const to       = useSelector(state => state.to)
    const dispatch = useDispatch()

    const generateQueryStringFromParams = () => {
        return [...document.querySelectorAll('.param')].reduce((query, item) => {
            let res = item.value
            
            if (item.name === 'date')   res = replaceAll(item.value, '-', '')
            if (item.name === 'weight') res = replaceAll(item.value, ' ', '')
            if (item.getAttribute('type') === 'checkbox') res = item.checked ? '1' : '0'
            if (item.getAttribute('type') === 'select')   res = item.options[item.selectedIndex].value
            if (item.className.search('currency') >= 0) res = parseInt(replaceAll(replaceAll(item.value,' ', ''), '.', '')) * 100

            return query += `&${item.name}=${res}`
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
        if(e.code === 'Escape')  {
            details.classList.remove('unfade-pricing-details')
            return
        }
        if(e.target.id !== 'help_price') { 
            details.classList.remove('unfade-pricing-details')
            return
        }

        let isVisible = window.getComputedStyle(details).opacity === "0" ? false : true
        if(isVisible) {
            details.classList.remove('unfade-pricing-details')
            return
        }
        else {
            let imgQuestionCoords = document.querySelector('#help_price').getBoundingClientRect()
            
            details.style.width = isMobile ? 'calc(100% - 26px)' : 'auto'
            details.style.left  = isMobile ? 0 : `${imgQuestionCoords.x + e.offsetX + 22}px`
            details.style.top   = isMobile ? '65%' : `${imgQuestionCoords.y + e.offsetY - details.offsetHeight}px`
            details.classList.add('unfade-pricing-details')
        }
    }

    const fetchTariff = async () => {
        [...document.querySelectorAll('#objParamsAndServices label.objLabel')].forEach((item) => 
            document.querySelector(`#${item.htmlFor}`).style.border = ''
        )        
        let tariffQuery = `https://tariff.pochta.ru/tariff/v1/calculate?jsontext&object=${usluga}&from=${from}&${to.toString().length === 6 ? 'to' : 'country'}=${to}` 
                            + generateQueryStringFromParams() 
                            + generateQueryStringFromServices()
        let responce = await fetch(tariffQuery)
        let data = await responce.json()
        
        let price = parseInt(data.paynds) / 100
        if (isNaN(price)) {
            setTariff([<div key={uniqid()}><font color="red" key={uniqid()}>{data.error['0']}</font></div>]);
            [...document.querySelectorAll('#objParamsAndServices label.objLabel')].forEach((item) => {
                if(data.error['0']
                    .replace('стоимость вложен', 'sumin')
                    .replace('дату', 'date')
                    .search(item.htmlFor) > 0)
                        document.querySelector(`#${item.htmlFor}`).style.border = '1px solid red'
            })
        } else {
            setTariff([<React.Fragment key={uniqid()}>
                        <font id="actualPrice" 
                              color="#2a53d3" 
                              size="5" 
                              key={uniqid()}>
                            {price} ₽ с НДС
                        </font>
                        <img id="help_price" 
                             src="img/question-circle-o.svg" 
                             style={{"marginLeft": "5px", "cursor": "pointer"}} 
                             alt="Детали тарификации" 
                             key={uniqid()} />
                       </React.Fragment>])

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
        if(to.toString().length !== 6) {
            setDelivery(
                <font color="#2a53d3" size="5">Примерный срок 14 дней</font>
            )
        } else {
            const deliveryQuery = `https://delivery.pochta.ru/delivery/v1/calculate?jsontext&object=${usluga}&from=${from}&to=${to}`
            const responce = await fetch(deliveryQuery)
            const data = await responce.json()
            
            if (typeof data.delivery !== 'undefined') {
                const deliveryMin = parseInt(data.delivery.min)
                const deliveryMax = parseInt(data.delivery.max)
                setDelivery(
                    <font id="actualDelivery" color="#2a53d3" size="5" key={uniqid()}>
                        {`от ${deliveryMin} до ${deliveryMax} дней`}
                    </font>
                )
            } else {
                setDelivery(
                    <div key={uniqid()}>
                        <font color="red" key={uniqid()}>{data.error['0']}</font>
                    </div>
                )
            }
        }
    }

    const mainButtonClick = () => {
        if(company === "0") {
            if(from === 'не выбрано' || to === 'не выбрано') return
            dispatch(isLoading(true))
            fetchTariff()
            fetchDelivery()
            dispatch(isLoading(false))
        }
        if(company === "1") {
            // TODO: CDEK CALCULATE
        }
    }

    useEffect(() => {
        ['click', 'keydown'].forEach((event) => document.querySelector('body').addEventListener(event, togglePricingDetails))
        return () => { 
            ['click', 'keydown'].forEach((event) => document.querySelector('body').removeEventListener(event, togglePricingDetails))
        }
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
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
        </>
    )
}

export default Calculate