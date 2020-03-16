import React from 'react'
import Parser from 'html-react-parser';
import './style.scss'

const Title = () => {
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

    const deliveriesHtml = deliveriesList.reduce((html, item) => {
        return html += `<a href="${item.href}" target="_blank" rel="noopener noreferrer"><img src="${item.logo}" class="imglogo" alt="${item.name}" /></a>`
    }, '')

    return (
        <div className="title_wrapper">
            <div className="title">
                &nbsp;
                <a href="https://ценапосылки.рф"><img src="/img/logo_cp.png" className="imglogo" alt="Удобный калькулятор стоимости посылки"/></a>
                <div><a href="https://ценапосылки.рф" style={{"textDecoration": "none"}}><h1>Цена Посылки</h1></a></div>
            </div>
            <div className="title" style={{"justifySelf": "end"}}>
                { Parser(deliveriesHtml) }
            </div>
            <div className="loading" id="loading"></div>
      </div>
    )
}

export default Title