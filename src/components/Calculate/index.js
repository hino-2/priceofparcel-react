import React, { useState } from "react"
import uniqid from "uniqid";
import './style.scss'
import { useSelector } from "react-redux";
import { replaceAll } from "../../utils/basic";

const Calculate = () => {
    const [tariff,   setTariff]   = useState('')
    const [delivery, setDelivery] = useState('')
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
        return [...document.querySelectorAll('.service')].reduce((query, item) => {
            return query += item.checked ? item.id.replace('s', '') + ',' : ''
        }, '')
    }

    const fetchTariff = async () => {
        let tariffQuery = `https://tariff.pochta.ru/tariff/v1/calculate?jsontext&object=${usluga}&from=${from}&to=${to}` 
                            + generateQueryStringFromParams() 
                            + generateQueryStringFromServices()
        let responce = await fetch(tariffQuery)
        let data = await responce.json()
        console.log('tariff', data)
        
        let price = parseInt(data.paynds) / 100
        if (isNaN(price)) {
            price = data.error['0'];
            setTariff('<div><font color="red">' + price + '</font></div>')
            // TODO: tariff error highlights
            // $('#objParams').find('label').each(function() {
            //     if(price.search($(this)[0].htmlFor) > 0)
            //         $('#' + $(this)[0].htmlFor).css('border', '1px solid red');
            // });
        } else {
            setTariff([<React.Fragment key={uniqid()}>
                        <font id="actualPrice" color="#2a53d3" size="5" key={uniqid()}>{price} ₽ с НДС</font>
                        <img id="help_price" 
                             src="img/question-circle-o.svg" 
                             style={{"marginLeft": "5px", "cursor": "pointer"}} 
                             alt="Детали тарификации" 
                             key={uniqid()} />
                       </React.Fragment>])
            // TODO: check mobile version                       
            // setTimeout(() => {		                    		     		          // без этого на мобилках по какой то причине аттрибут font.size
            //     document.querySelector('#actualPrice').innerHTML(price + ' ₽ с НДС') // не всегда усваивался браузером, и текст был size=1
            // }, 10)
            // TODO: pricing detais
            // var htmlPrice = '';
            // $.each(data.tariff, function(key, val) {
            //     var valnds;
            //     $.each(val, function(key1, val1) {
            //         valnds = getSafe(() => val1['valnds']);
            //     });
            //     htmlPrice += parseInt(valnds) > 0 ? '<div class="price"><div style="background-color: white;">' + val['name'] + '</div><div style="background-color: white; display: grid; justify-items: end;"><font color=' + indexColorChoosed + '>' + valnds / 100 + ' ₽</font></div></div>' : '';
            // });
            // $('#helpPriceDiv').html(htmlPrice);
            // $('#help_price').on('click', function(e){
            //     helpShow('help_price','helpPriceDiv', true, e);
            // });
        }
    }

    const fetchDelivery = async () => {
        let deliveryQuery = `https://delivery.pochta.ru/delivery/v1/calculate?jsontext&object=${usluga}&from=${from}&to=${to}`
        let responce = await fetch(deliveryQuery)
        let data = await responce.json()
        console.log('delivery', data)
        
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
        </>
    )
}

export default Calculate