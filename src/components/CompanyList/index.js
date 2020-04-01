import React, { useEffect, useState } from 'react'
import { useDispatch }                from 'react-redux'
import { loadCompany }                from '../../actions'
import uniqid                         from 'uniqid'
import './style.scss'

const CompanyList = () => {
    const [companyList, setCompanyList] = useState("")
    const dispatch = useDispatch()

    const addSelectInteractions = (id, companies) => {
        const input     = document.querySelector(`#${id}`)
        const list 	    = document.querySelector(`#${id}List`)
        const title	    = document.querySelector(`#${id}Title`)
        const dropdown  = document.querySelector(`#${id}Dropdown`)
        const listItems = document.querySelectorAll(`#${id}Dropdown .dropdown-menu-${id} li`)
    
        title.innerHTML = list.children[0].innerHTML
        input.setAttribute('value', list.children[0].value)
        dropdown.setAttribute('tabindex', 1)
    
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('active')
            list.classList.toggle(`slided-${id}`)
        })

        dropdown.addEventListener('focusout', (e) => {
            dropdown.classList.remove('active')
            list.classList.remove(`slided-${id}`)
        })
        
        Array.from(listItems)
             .forEach((item) => item.addEventListener('click', (e) => {		// клик на пункт списка
                title.innerHTML = e.target.innerHTML
                input.setAttribute('value', e.target.value)
                dispatch(loadCompany(companies.find(({company_id}) => company_id === e.target.value + '')['company_id']))
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            const dropdown  = document.querySelector('#company')

            const responce  = await fetch('/db/company.json')
            const companies = await responce.json()
            const companyListJSX = companies.map((item) => 
                <li value={item.company_id} 
                    style={{"paddingLeft": "20px"}}
                    key={uniqid()}>
                        {item.company_name}
                </li>
            )
            setCompanyList(companyListJSX)
            
            dispatch(loadCompany(companies.find(({company_id}) => company_id === dropdown.value + '')['company_id']))
            addSelectInteractions('company', companies)
        }
        fetchData()
    }, [])

    return (
        <div className="dropdown-container-company">   
            <div className="dropdown-company" id="companyDropdown">
                <div className="select-company" style={{"display": "table", "width": "85%"}}>
                    <span id="companyTitle">Доставка</span>
                    <div style={{"display": "table-cell", "verticalAlign": "middle", "textAlign": "end"}}>
                        <i className="fa fa-chevron-left"></i>
                    </div>
                </div>
                <input id="company" type="hidden" defaultValue="0" />
                <ul className="dropdown-menu-company" id="companyList">
                    { companyList }
                </ul>
            </div>
        </div>
    )
}

export default CompanyList