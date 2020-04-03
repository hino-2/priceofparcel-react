import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDirectionIndexFrom, 
         setDirectionIndexTo,
         addPlacemark }             from '../../actions'
import Message                      from '../Message'
import uniqid                       from 'uniqid'
// import DadataSuggestions            from "react-dadata-suggestions"
import $                            from 'jquery'
import {  }                         from 'suggestions-jquery'
import generatePlacemarkFromOPSInfo from './generatePlacemarkFromOPSInfo'
import { getSafe }                  from '../../utils/basic'
import './style.scss'

const Direction = ({ type, YMapObjectManager }) => {
    const [message, setMessage]             = useState([])
    const [pupJSX, setPupJSX]               = useState([])
    const [countriesJSX, setCountriesJSX]   = useState([])
    const dispatch     = useDispatch()
    const placemarks   = useSelector(state => state.placemarks)
    const pickUpPoints = useSelector(state => state.pickUpPoints)
    const countries    = useSelector(state => state.countries)

    type === 'from' ? dispatch(setDirectionIndexFrom('не выбрано')) : dispatch(setDirectionIndexTo('не выбрано'))

    const params = {
        title: type === 'from' ? 'Откуда' : 'Куда',
        placeholder: type === 'from' ? 'Адрес или индекс. Например, Санкт-Петербург.' : 'Адрес или индекс. Например, 623731.'
    }

    const handleSuggestionPick = async (sugg) => {
        showOPSonMap(sugg.data.postal_code)
    }

    const getOPSInfo = async (index) => {
        const response = await fetch(`/getOPSInfo?index=${index}`)
        const info = await response.json()
        return info
    }

    const showOPSonMap = async (index) => {
        if(YMapObjectManager !== undefined) {
            const info = await getOPSInfo(index)
            setMessage([])
            if(getSafe(() => info.code) === '1004') {
                setMessage(<Message text={`Информацию об ОПС ${index} получить не удалось. Попробуйте еще разок`} level="2"/>)
                return
            }

            const placemark = generatePlacemarkFromOPSInfo(info)
            
            if(!placemarks.find((item) => item.id === index))
                dispatch(addPlacemark(placemark))

            setTimeout(() => {
                YMapObjectManager.objects.balloon.open(index)
            }, 500)
        }
        type === 'from' ? dispatch(setDirectionIndexFrom(index)) : dispatch(setDirectionIndexTo(index))
    }

    const handleTextInput = async () => {
        const inputField = document.querySelector(`#${type}`)

        if(!isNaN(inputField.value) && inputField.value.length === 6) 
            showOPSonMap(inputField.value)
    }

    const addSelectInteractions = (type) => {
        const input     = document.querySelector(`#pup${type}`)
        const list 	    = document.querySelector(`#pup${type}List`)
        const title	    = document.querySelector(`#pup${type}Title`)
        const dropdown  = document.querySelector(`#pup${type}Dropdown`)
        const listItems = document.querySelectorAll(`#pup${type}Dropdown .dropdown-menu-pup li`)
    
        // title.innerHTML = list.children[0].innerHTML
        // input.setAttribute('value', list.children[0].value)
        dropdown.setAttribute('tabindex', 1)
    
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('active')
            list.classList.toggle('slided-pup')
        })

        dropdown.addEventListener('focusout', (e) => {
            dropdown.classList.remove('active')
            list.classList.remove('slided-pup')
        })
        
        Array.from(listItems)
             .forEach((item) => item.addEventListener('click', (e) => {		// клик на пункт списка
                title.innerHTML = e.target.innerHTML
                input.setAttribute('value', e.target.value)
                showOPSonMap(e.target.value)
        }))        
    }

    useEffect(() => {
        if(type === 'from' && pickUpPoints) {
            setPupJSX(pickUpPoints.map((item) => <li value={item.id} key={uniqid()}>{item.name}</li>))
            setTimeout(() => {
                addSelectInteractions(type)
            }, 300)

            return
        } 

        if(type === 'to' && countries) {

            return
        }

        setTimeout(() => {
            // TODO: подсказки подключаются не всегда. ПОЧЕМУ!!!!!!!!!
            console.log('asd', type);
            $(`#${type}`).suggestions({
                token: "40af0779db25462e591cdad7f7cf999562213b1f",
                type: "ADDRESS",
                onSelect: (suggestion) => {
                    handleSuggestionPick(suggestion)
                }
            })
        }, 2000)
    }, [pickUpPoints])

    if(type === 'from' && pickUpPoints) 
        return (
            <div className="dropdown-container-pup" style={{"width": "100%"}}>   
                <div className="dropdown-pup" id={`pup${type}Dropdown`}>
                    <div className="select-pup" style={{"display": "table", "width": "95%"}}>
                        <span id={`pup${type}Title`}>{type === 'from' ? 'Откуда...' : 'Куда...'}</span>
                        <div style={{"display": "table-cell", "verticalAlign": "middle", "textAlign": "end"}}>
                            <i className="fa fa-chevron-left"></i>
                        </div>
                    </div>
                    <input id={`pup${type}`} type="hidden" />
                    <ul className="dropdown-menu-pup" id={`pup${type}List`}>
                        { pupJSX }
                    </ul>
                </div>
                { message }
            </div>  
        )

    if(type === 'to' && countries) 
        return (
            <div>countries</div>
        )

    return (
        <div className="directions" key={uniqid()}>
            <label className="field a-field a-field_a1" style={{"width": "100%"}} key={uniqid()}> 
                <input type="text" 
                    autoComplete="off"
                    className="field__input a-field__input" 
                    name={type} 
                    id={type} 
                    placeholder={params.placeholder}
                    key={uniqid()} 
                    onChange={handleTextInput}/> 
                <span className="a-field__label-wrap" key={uniqid()}> 
                    <span className="a-field__label" key={uniqid()}>
                        <font style={{"color": "#2a53d3", "fontWeight": "bold"}} key={uniqid()}>{params.title}</font>
                    </span> 
                </span> 
            </label> 
            { message }
        </div>
    )
}

export default Direction