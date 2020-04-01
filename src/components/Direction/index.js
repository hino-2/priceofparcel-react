import React, { useState }          from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDirectionIndexFrom, 
         setDirectionIndexTo,
         addPlacemark }             from '../../actions'
import Message                      from '../Message'
import uniqid                       from 'uniqid'
import generatePlacemarkFromOPSInfo from './generatePlacemarkFromOPSInfo'
import { getSafe }                  from '../../utils/basic'
import './style.scss'
// import { ReactDadata } from "react-dadata"

const Direction = ({ type }) => {
    const [message, setMessage] = useState([])
    const dispatch      = useDispatch()
    const placemarks    = useSelector(state => state.placemarks)
    // const objectManager = useSelector(state => state.ObjectManager)

    const params = {
        title: type === 'from' ? 'Откуда' : 'Куда',
        placeholder: type === 'from' ? 'Адрес или индекс. Например, Санкт-Петербург.' : 'Адрес или индекс. Например, 623731.'
    }

    const handleSuggestionPick = (sugg) => {
        console.log(sugg)
        // TODO: dadata suggestions
    }

    const getOPSInfo = async (index) => {
        const response = await fetch(`/getOPSInfo?index=${index}`)
        const info = await response.json()
        return info
    }

    const handleTextInput = async () => {
        const inputField = document.querySelector(`#${type}`)

        if(!isNaN(inputField.value) && inputField.value.length === 6) {
            const info = await getOPSInfo(inputField.value)
            setMessage([])
            if(getSafe(() => info.code) === '1004') {
                setMessage(<Message text={`Информацию об ОПС ${inputField.value} получить не удалось. Попробуйте еще разок`} level="2"/>)
                return
            }
    
            const placemark = generatePlacemarkFromOPSInfo(info)
            
            if(!placemarks.find((item) => item.id === inputField.value))
                dispatch(addPlacemark(placemark))
    
            // TODO: open balloon on index input
            // setTimeout(() => {
            //     objectManager.objects.balloon.open(inputField.value)
            // }, 100)
            type === 'from' ? dispatch(setDirectionIndexFrom(inputField.value)) : dispatch(setDirectionIndexTo(inputField.value))
        }
    }

    // TODO: DaData suggestions
// $('#from').suggestions({
//     token: "40af0779db25462e591cdad7f7cf999562213b1f",
//     type: "ADDRESS",
//     onSelect: function(suggestion) {
//     suggSelected(suggestion, this.id);
// }

    return (
        <div className="directions" key={uniqid()}>
            <label className="field a-field a-field_a1" style={{"width": "100%"}} key={uniqid()}> 
                <input type="text" 
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