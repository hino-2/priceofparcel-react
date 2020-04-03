import React           from "react"
import { useSelector } from "react-redux"
import uniqid          from "uniqid"
import './style.scss'

const DirectionIndex = ({ type, YMapObjectManager }) => {
    const index = useSelector(state => state[`${type}`])
    // const [indexColor, setIndexColor] = useState('#2a53d3')
    const indexColor = '#2a53d3'
    
    const handleClick = () => {
        // if (index === "не выбрано") {
        //     setIndexColor('red')
        //     return 
        // }
        if (!isNaN(index)) 
            YMapObjectManager.objects.balloon.open(index)
    }

    return (
        <div className="directions index" key={uniqid()}>
            <font id={`${type}_ind`} 
                    style={{"color": indexColor}} 
                    onClick={handleClick}
                    key={uniqid()}>
                        {index}
            </font>
        </div>
    )
}

export default DirectionIndex