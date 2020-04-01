import React, { useEffect, useState } from 'react'
import './style.scss'

const Help = () => {
    const [help, setHelp] = useState('')

    const toggleHelp = (e) => {
        let help = document.querySelector('#helpMainDiv')

        if(e.code === 'Escape')  {
            help.classList.remove('unfade')
            return
        }
        if(e.target.id !== 'help_main') { 
            help.classList.remove('unfade')
            return
        }

        let isVisible = window.getComputedStyle(help).opacity === "0" ? false : true
        if(isVisible) {
            help.classList.remove('unfade')
            return
        }
        else {
            let imgQuestionCoords = document.querySelector('#help_main').getBoundingClientRect()
            
            help.style.left = `${imgQuestionCoords.x + e.offsetX + 22}px`
            help.style.top =  `${imgQuestionCoords.y + e.offsetY}px`
            help.classList.add('unfade')
        }
    
        // TODO: low width/mobile help
        // if(low_width) {
        //     $("#" + helpID).css('left', 0);
        //     $("#" + helpID).css('top',  0);
        //     $("#" + helpID).css('max-width',  ($(window).width() - 2) + 'px');
        //     $("#" + helpID).css('height',  '-webkit-fill-available');
        // } else {
    }

    const fetchHelpFromFile = async () => {
        const responce = await fetch('/db/help.txt')
        const data = await responce.text()
        setHelp(data)
    }
    
    useEffect(() => {
        fetchHelpFromFile()
    }, [])

    useEffect(() => {
        ['click', 'keydown'].forEach((event) => document.querySelector('body').addEventListener(event, toggleHelp))
        return () => { 
            ['click', 'keydown'].forEach((event) => document.querySelector('body').removeEventListener(event, toggleHelp))
        }
    })

    return (
        <>
            <div>
                <img id="help_main" 
                    src="img/question-circle-o.svg" 
                    style={{"cursor": "pointer"}} 
                    alt="Помощь" />
            </div>
            <div id="helpMainDiv" className="mainhelp">
                <div style={{"display": "inline"}}>
                    <font style={{"fontSize": "12px", "color": "#c6c6c6"}}>кликните в любое место, чтобы закрыть</font>
                </div>
                <br />
                <div dangerouslySetInnerHTML={{__html: help}} />
            </div>
        </>
    )
}

export default Help