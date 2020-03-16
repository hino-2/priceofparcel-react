import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'
import { loadService } from '../../actions'
import Parser from 'html-react-parser'
import './style.scss'

export const Usluga = () => {
    const [ulsugaListHtml, setUslugaListHtml] = useState("")
    const dispatch = useDispatch()
    let company = useSelector(state => state.company)
    const handleChange = () => dispatch(loadService(document.querySelector('#uslugaDropdown').value))
    
    useEffect(() => {
        const fetchData = async () => {
            const responce = await fetch('/db/services.json')
            const data = await responce.json()
            const res = data.filter(item => item.company_id === company)
                            .sort  ((a, b) => a.cat_id - b.cat_id)
                            .reduce((html, item) => html += `<option value="${item.object}">${item.name}</option>`, '')
            setUslugaListHtml(res)
        }
        fetchData();
        
        document.querySelector('#uslugaDropdown').addEventListener("change", handleChange)

        return () => document.querySelector('#uslugaDropdown').removeEventListener("change", handleChange)
    }, [company])

//     <div class="usluga">
//     <div class="container" style="width: 100%;">   
//         <div class="dropdown" id="uslugaDropdown">
//             <div class="select" style="display: table; width: 95%;">
//                 <span id="uslugaTitle">Выберите тип отправления...</span>
//                 <div style="display: table-cell; vertical-align: middle; text-align: end;">
//                     <i class="fa fa-chevron-left"></i>
//                 </div>
//             </div>
//             <input id="usluga" type="hidden" />
//             <ul class="dropdown-menu" id="uslugaList">
//             </ul>
//         </div>
//     </div>   																				
// </div>
    return (
        <div className="container">   
            <select id="uslugaDropdown">
                { Parser(ulsugaListHtml) }
            </select>
        </div>
    )
}