import React, { useEffect } from 'react'
import { useSelector }      from 'react-redux'
import Social from '../Social'
import About  from '../About'
import './style.scss'

const Footer = () => {
    const isMobile = useSelector(state => state.isMobile)

    const actionsComment = [
        {
            href: "mailto:sinigami0@gmail.com?subject=ценапосылки.рф",
            class: "gmail",
            icon: "envelope"
        },
        {
            href: "tg://resolve?domain=hino_2",
            class: "telegram",
            icon: "telegram"
        }
    ]
    const actionsShare = [
        {
            href: "https://web.whatsapp.com/send?text=ЦенаПосылки.рф. Расчет цены любой посылки по России и за границу",
            data_action: "share/whatsapp/share",
            class: "whatsapp",
            icon: "whatsapp"
        },
        {
            href: "https://telegram.me/share/url?url=ЦенаПосылки.рф&text=Расчет цены любой посылки по России и за границу",
            class: "telegram",
            icon: "telegram"
        }
    ]

    useEffect(() => {
        if(isMobile)
            document.querySelector('.footer').style.width = '100vw'
        else
            document.querySelector('.footer').style.width = '35vw'
    }, [isMobile])

    return (
        <div className="footer">
		    <div className="white" />
            <Social type="comment" actions={actionsComment}/>
            <About />
            <Social type="share-alt" actions={actionsShare}/>
            <div className="white" />
        </div>
    )
}

export default Footer