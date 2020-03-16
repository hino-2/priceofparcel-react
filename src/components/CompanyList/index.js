import React, { useEffect, useState } from 'react'
import { useDispatch, } from 'react-redux'
import { loadCompany } from '../../actions'
import Parser from 'html-react-parser'
import './style.scss'

const CompanyList = () => {
    const [companyListHtml, setCompanyList] = useState("")
    const dispatch = useDispatch()
    const handleChange = () => dispatch(loadCompany(document.querySelector('#companyDropdown').value))

    useEffect(() => {
        async function fetchData() {
            const responce = await fetch('/db/company.json')
            const data = await responce.json()
            const res = data.reduce((html, item) => 
                // html += `<li value="${item.company_id}" style="padding-left: 20px;">${item.company_name}</li>`
                html += `<option value="${item.company_id}">${item.company_name}</option>`
            , '')
            setCompanyList(res)
        }
        fetchData()
        
        document.querySelector('#companyDropdown').addEventListener("change", handleChange)

        return () => document.querySelector('#companyDropdown').removeEventListener("change", handleChange)
    })


    // <div className="dropdown" id="companyDropdown">
    //                 <div className="select" style={{"display": "table", "width": "85%"}}>
    //                     <span id="companyTitle">Доставка</span>
    //                     <div style={{"display": "table-cell", "verticalAlign": "middle", "textAlign": "end"}}>
    //                         <i className="fa fa-chevron-left"></i>
    //                     </div>
    //                 </div>
    //                 <input id="company" type="hidden" />
    //                 <ul className="dropdown-menu" id="companyList">
    //                     { Parser(companyListHtml) }
    //                 </ul>
    //             </div>
    return (
            <div className="container">		
                <select id="companyDropdown">
                    { Parser(companyListHtml) }
                </select>
            </div>    	
    )
}

export default CompanyList