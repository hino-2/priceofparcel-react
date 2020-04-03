import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDirectionIndexFrom, 
         setDirectionIndexTo,
         addPlacemark }             from '../../actions'
import Message                      from '../Message'
import uniqid                       from 'uniqid'
// import DadataSuggestions            from "react-dadata-suggestions"
import $                            from 'jquery'
import {  }              from 'suggestions-jquery'
import generatePlacemarkFromOPSInfo from './generatePlacemarkFromOPSInfo'
import { getSafe }                  from '../../utils/basic'
import './style.scss'

const Direction = ({ type, YMapObjectManager }) => {
    const [message, setMessage] = useState([])
    const dispatch      = useDispatch()
    const placemarks    = useSelector(state => state.placemarks)

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
            if(YMapObjectManager !== undefined)
                YMapObjectManager.objects.balloon.open(index)
        }, 500)
        type === 'from' ? dispatch(setDirectionIndexFrom(index)) : dispatch(setDirectionIndexTo(index))
    }

    const handleTextInput = async () => {
        const inputField = document.querySelector(`#${type}`)

        if(!isNaN(inputField.value) && inputField.value.length === 6) 
            showOPSonMap(inputField.value)
    }

    useEffect(() => {
        $(`#${type}`).suggestions({
            token: "40af0779db25462e591cdad7f7cf999562213b1f",
            type: "ADDRESS",
            onSelect: (suggestion) => {
                handleSuggestionPick(suggestion)
            }
        })
    })

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
                {/* <DadataSuggestions token="40af0779db25462e591cdad7f7cf999562213b1f" /> */}
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