import React, { useState,
                useEffect } from 'react'
import { useSelector }      from 'react-redux'
import uniqid               from 'uniqid'
import './style.scss'

const About = () => {
    const isMobile = useSelector(state => state.isMobile)
    const [paymentDetailsJSX, setPaymentDetailsJSX] = useState([])
    const paymentDetails = [
        {
            name: "Перевод по номеру телефона",
            value: "+7 922 149 37 38"
        },
        {
            name: "Перевод на карту",
            value: "5321 3040 3016 0433"
        }
    ]

    const toggleAboutForm = () => {
        const aboutForm = document.querySelector('#aboutForm')

        if(aboutForm.style.display === 'none') {
            aboutForm.style.display = 'block'
        } else {
            aboutForm.style.display = 'none'
        }
    }

    const showPaymentDetails = () => {
        const paymentDetailsElem = document.querySelector('#paymentDetails')
        setPaymentDetailsJSX(paymentDetails.map((item) => 
            <React.Fragment key={uniqid()}>
                <div className="paymentName" key={uniqid()}><font>{item.name}</font></div>
                <div className="paymentValue" key={uniqid()}><font>{item.value}</font></div>
            </React.Fragment>
        ))
        paymentDetailsElem.style["display"] = 'grid'
        paymentDetailsElem.style["grid-template-columns"] = '3fr 2fr'

        document.querySelector('#btnDonate').style.display = 'none'
    }
    
    useEffect(() => {
        if(isMobile)
            document.querySelector('.donate').style.width = '100vw'
        else
            document.querySelector('.donate').style.width = '35vw'
    }, [isMobile])

    return (
        <>
            <div className="support">
                <font size="2" 
                      style={{"color": "#484848", "textDecoration": "underline", "cursor": "pointer"}} 
                      onClick={toggleAboutForm}>
                    О проекте
                </font>
            </div>
            <div id="aboutForm" className="donate" style={{"display": "none"}}>
                <table border="0" className="contacts">
                    <tbody>
                        <tr height="50%">
                            <td align="center" valign="middle">
                                <div id="paymentDetails" className="contact-details">
                                    { paymentDetailsJSX }
                                    <button id="btnDonate"
                                            className="up" 
                                            onClick={showPaymentDetails} 
                                            style={{"lineHeight": "2", "padding": "1em 1.5em"}}>
                                        Поддержать проект
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr height="45%">
                            <td align="center" valign="middle" style={{"padding": "10px"}}>
                                <font>
                                    Frontend: ReactJS/Redux/SCSS
                                    <br />
                                    <br />
                                    Backend: Express.js
                                    <br />
                                    <br />
                                    APIs: Russian Post/Yandex Maps/DaData/Geolocation
                                </font>
                            </td>
                        </tr>
                        <tr height="5%">
                            <td align="center" valign="middle" style={{"paddingTop": "10px"}}>
                                <button className="buttonclose" onClick={toggleAboutForm}>закрыть</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default About