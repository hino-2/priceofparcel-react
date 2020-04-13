import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDirectionIndexFrom, 
         setDirectionIndexTo,
         addPlacemark }             from '../../actions'
import Message                      from '../Message'
import uniqid                       from 'uniqid'
import $                            from 'jquery'
import {  }                         from 'suggestions-jquery'
import generatePlacemarkFromOPSInfo from './generatePlacemarkFromOPSInfo'
import { getSafe }                  from '../../utils/basic'
import './style.scss'

const Direction = ({ type, YMapObjectManager }) => {
    let pupJSX                 = []
    let countriesJSX           = []
    let handleDropdownClick    = null
    let handleDropdownFocusout = null
    let handleListItemClick    = null
    const placemarks   = useSelector(state => state.placemarks)
    const pickUpPoints = useSelector(state => state.pickUpPoints)
    const countries    = useSelector(state => state.countries)
    const usluga       = useSelector(state => state.usluga)
    const dispatch     = useDispatch()
    const [message, setMessage] = useState([])
    

    const params = {
        title: type === 'from' ? 'Откуда' : 'Куда',
        placeholder: type === 'from' ? 'Адрес или индекс. Например, Санкт-Петербург.' 
                                     : 'Адрес или индекс. Например, 623731.'
    }

    const handleSuggestionPick = (sugg) => {
        type === 'from' ? dispatch(setDirectionIndexFrom(sugg.data.postal_code)) 
                        : dispatch(setDirectionIndexTo(sugg.data.postal_code))
        showOPSonMap(sugg.data.postal_code)
    }

    const getOPSInfo = async (index) => {
        const response = await fetch(`/getOPSInfo?index=${index}`)
        const info = await response.json()
        return info
    }

    const showOPSonMap = async (index) => {
        // console.log(YMapObjectManager, index.toString().length)
        if(YMapObjectManager === undefined) 
            return
        
        if(index.toString().length === 6) {
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
            }, 200)
        }
        type === 'from' ? dispatch(setDirectionIndexFrom(index)) 
                        : dispatch(setDirectionIndexTo  (index))
    }

    const handleTextInput = async () => {
        const inputField = document.querySelector(`#${type}`)

        if(isNaN(inputField.value))
            return
        if(inputField.value.length !== 6)
            return

        showOPSonMap(inputField.value)
    }

    const addSelectInteractions = (type) => {
        const input     = document.querySelector(`#pup${type}`)
        const list 	    = document.querySelector(`#pup${type}List`)
        const title	    = document.querySelector(`#pup${type}Title`)
        const dropdown  = document.querySelector(`#pup${type}Dropdown`)
        const listItems = document.querySelectorAll(`#pup${type}Dropdown .dropdown-menu-pup li`)

        handleDropdownClick = (e) => {
            dropdown.classList.toggle('active')
            list.classList.toggle('slided-pup')
        }
        handleDropdownFocusout = (e) => {
            dropdown.classList.remove('active')
            list.classList.remove('slided-pup')
        }
        handleListItemClick = (e) => {	
            title.innerHTML = e.target.innerHTML
            input.setAttribute('value', e.target.value)
            showOPSonMap(e.target.value)
        }
    
        // title.innerHTML = list.children[0].innerHTML
        // title.innerHTML = 'Выберите  место сдачи...'
        // input.setAttribute('value', list.children[0].value)
        dropdown.setAttribute('tabindex', 1)
    
        dropdown.addEventListener('click', handleDropdownClick)
        dropdown.addEventListener('focusout', handleDropdownFocusout)
        Array.from(listItems).forEach((item) => item.addEventListener('click', handleListItemClick))
    }

    const removeSelectInteractions = (type) => {
        const dropdown  = document.querySelector(`#pup${type}Dropdown`)
        const listItems = document.querySelectorAll(`#pup${type}Dropdown .dropdown-menu-pup li`)
    
        if(dropdown) {
            dropdown.removeEventListener('click', handleDropdownClick)
            dropdown.removeEventListener('focusout', handleDropdownFocusout)
        }
        
        if(listItems)
            Array.from(listItems)
                 .forEach((item) => item.removeEventListener('click', handleListItemClick))
    }    

    if(type === 'from' && pickUpPoints) {
        dispatch(setDirectionIndexFrom('не выбрано'))
        pupJSX = pickUpPoints.map((item) => 
            <li value={item.id} key={uniqid()}>{item.name}</li>
        )
    } 

    useEffect(() => {
        if(type === 'from' && pickUpPoints) 
            addSelectInteractions('from')

        return () => { 
            if(type === 'from' && pickUpPoints) 
                removeSelectInteractions('from')
        }
    })

    if(type === 'to' && countries) {
        dispatch(setDirectionIndexTo('не выбрано'))
        countriesJSX = countries.map((item) => 
            <li value={item.id} key={uniqid()}>{item.name}</li>
        )
    }

    useEffect(() => {
        if(type === 'to' && countries) 
            addSelectInteractions('to')

        return () => {
            if(type === 'to' && countries) {
                removeSelectInteractions('to')
            }
        }
    })

    useEffect(() => {
        type === 'from' ? dispatch(setDirectionIndexFrom('не выбрано')) 
                        : dispatch(setDirectionIndexTo('не выбрано'))
    }, [usluga])
    
    useEffect(() => {
        $(`#${type}`).suggestions({
            token: "40af0779db25462e591cdad7f7cf999562213b1f",
            type: "ADDRESS",
            onSelect: (suggestion) => {
                handleSuggestionPick(suggestion)
            }
        })
    })

    if(type === 'from' && pickUpPoints) 
        return (
            <div className="dropdown-container-pup" style={{"width": "100%"}}>   
                <div className="dropdown-pup" id={`pup${type}Dropdown`}>
                    <div className="select-pup" style={{"display": "table", "width": "95%"}}>
                        <span id={`pup${type}Title`}>Выберите место сдачи...</span>
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
            <div className="dropdown-container-pup" style={{"width": "100%"}}>   
                <div className="dropdown-pup" id={`pup${type}Dropdown`}>
                    <div className="select-pup" style={{"display": "table", "width": "95%"}}>
                        <span id={`pup${type}Title`}>Выберите страну...</span>
                        <div style={{"display": "table-cell", "verticalAlign": "middle", "textAlign": "end"}}>
                            <i className="fa fa-chevron-left"></i>
                        </div>
                    </div>
                    <input id={`pup${type}`} type="hidden" />
                    <ul className="dropdown-menu-pup" id={`pup${type}List`}>
                        { countriesJSX }
                    </ul>
                </div>
                { message }
            </div>  
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