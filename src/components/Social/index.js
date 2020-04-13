import React  from 'react'
import uniqid from 'uniqid'
import './style.scss'

const Social = ({ type, actions }) => (
    <div className="social_button">
        <ul className="menu">
            <li className={`share top`}>
                <i className={`fa fa-${type}`}></i>
                <ul className="submenu">
                    {
                        actions.map((item) => 
                            <li key={uniqid()}>
                                <a href={item.href} className={item.class} data-action={item.data_action ? item.data_action : ''}>
                                    <i className={`fa fa-${item.icon}`} />
                                </a>
                            </li>
                        )
                    }
                </ul>
            </li>
        </ul>
    </div>
)

export default Social