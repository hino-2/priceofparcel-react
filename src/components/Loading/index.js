import React           from 'react'
import { useSelector } from 'react-redux'
import './style.scss'

const Loading = () => {
    const isLoading = useSelector(state => state.isLoading)

    return (
        <>
            { isLoading  ? <img src="/img/loadingGif.gif" 
                                alt="Загрузка"
                                style={{"width": "30px", "height": "30px"}} /> 
                         : '' }
        </>
    )
}

export default Loading
