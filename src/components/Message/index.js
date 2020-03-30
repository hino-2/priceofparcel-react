import React, { useEffect } from 'react'
import './style.scss'

const Message = ({text, level}) => {
    /*
        levels:
            0: not very important, but message
            1: important warning
            2: error
    */

   useEffect(() => {
        const message = document.querySelector('#message')
        
        setTimeout(() => {
            message.classList.add('unfade')
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('unfade')
        }, 4100)
    })

    return (
        <div className={`message level-${level}`} id="message">
            {text}
        </div>
    )
}

export default Message