import React from "react"
import { useDispatch } from "react-redux"
import { setDirectionIndexFrom, setDirectionIndexTo } from "../../actions";
import uniqid from "uniqid"
import './style.scss'
// import { ReactDadata } from "react-dadata"

const Direction = ({ type }) => {
    const dispatch = useDispatch()

    const params = {
        title: type === 'from' ? 'Откуда' : 'Куда',
        placeholder: type === 'from' ? 'Адрес или индекс. Например, Санкт-Петербург.' : 'Адрес или индекс. Например, 623731.'
    }

    const handleSuggestionPick = (sugg) => {
        console.log(sugg)
        // TODO: dadata suggestions
    }

    const handleIndexInput = () => {
        const inputField = document.querySelector(`#${type}`)

        if(isNaN(inputField.value)) return
        if(inputField.value.length !== 6) return

        type === 'from' ? dispatch(setDirectionIndexFrom(inputField.value)) : dispatch(setDirectionIndexTo(inputField.value))
        // TODO: getOPS($('#from_ind').html(), '#from_ind')
    }

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
                    onChange={handleIndexInput}/> 
                <span className="a-field__label-wrap" key={uniqid()}> 
                    <span className="a-field__label" key={uniqid()}>
                        <font style={{"color": "#2a53d3", "fontWeight": "bold"}} key={uniqid()}>{params.title}</font>
                    </span> 
                </span> 
            </label> 
        </div>
    )
}

export default Direction