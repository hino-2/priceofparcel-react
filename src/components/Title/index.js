import React, { useState, useEffect } from 'react'
import uniqid                         from 'uniqid'
import './style.scss'

const Title = () => {
    const [deliveriesJSX, setDeliveriesJSX] = useState([])

    const deliveriesList = [
        {
            id: 1,
            name: "Почта России",
            href: "https://pochta.ru",
            logo: "/img/pochta_sq.png"
        },
        {
            id: 2,
            name: "CDEK",
            href: "https://cdek.ru",
            logo: "/img/CDEK_logo.png"
        }
    ]

    const deliveries = deliveriesList.map((item) => 
        <a href={item.href} 
           target="_blank" 
           rel="noopener noreferrer"
           key={uniqid()}>
            <img src={item.logo} 
                 className="imglogo" 
                 alt={item.name}
                 key={uniqid()} />
        </a>
    )

    useEffect(() => {
        setDeliveriesJSX(deliveries)
    }, [])

    return (
        <div className="title_wrapper">
            <div className="title">
                &nbsp;
                <a href="https://ценапосылки.рф">
                    <img src="/img/logo_cp.png" className="imglogo" alt="Удобный калькулятор стоимости посылки"/>
                </a>
                <div>
                    <a href="https://ценапосылки.рф" style={{"textDecoration": "none"}}>
                        <h1>Цена Посылки</h1>
                    </a>
                </div>
            </div>
            <div className="title" style={{"justifySelf": "end"}}>
                { deliveriesJSX }
            </div>
      </div>
    )
}

export default Title