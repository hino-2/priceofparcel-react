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
                <div key={uniqid()}><font>{item.name}</font></div>
                <div key={uniqid()}><font>{item.value}</font></div>
                <div key={uniqid()}>&nbsp;</div>
                <div key={uniqid()}>&nbsp;</div>
            </React.Fragment>
        ))
        paymentDetailsElem.style["display"] = 'grid'
        paymentDetailsElem.style["grid-template-columns"] = '2fr 1fr'

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
                <table border="0" height="100%" width="100%" style={{"borderSpacing": "0px"}} className="contacts">
                    <tbody>
                        <tr height="50%">
                            <td align="center" valign="middle">
                                <div id="paymentDetails" style={{"width": "100%", "height": "100%"}}>
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
                            <td align="left" valign="middle" style={{"padding": "10px"}}>
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