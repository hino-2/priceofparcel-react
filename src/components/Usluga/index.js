import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, }  from 'react-redux'
import { loadUsluga }                 from '../../actions'
import uniqid                         from 'uniqid'
import './style.scss'

const Usluga = () => {
    const [ulsugaListHtml, setUslugaListHtml] = useState("")
    // const [usluga, setUsluga] = useState(0)
    const dispatch = useDispatch()
    let   company  = useSelector(state => state.company)
    
    const addSelectInteractions = (id, services) => {
        const input     = document.querySelector(`#${id}`)
        const title	    = document.querySelector(`#${id}Title`)
        const dropdown  = document.querySelector(`#${id}Dropdown`)
        const list 	    = document.querySelector(`#${id}List`)
        const listItems = document.querySelectorAll(`#${id}Dropdown .dropdown-menu li`)
    
        title.innerHTML = list.children[1].innerHTML
        input.setAttribute('value', list.children[1].value)
        dropdown.setAttribute('tabindex', 1)
    
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('active')
            list.classList.toggle('slided')
        })

        dropdown.addEventListener('focusout', (e) => {
            dropdown.classList.remove('active')
            list.classList.remove('slided')
        })
        
        Array.from(listItems)
             .filter ((item) => item.id.search('cat') < 0)
             .forEach((item) => item.addEventListener('click', (e) => {		// клик на пункт списка
                title.innerHTML = e.target.innerHTML
                input.setAttribute('value', e.target.value)
                dispatch(loadUsluga(services.find(({object}) => object === e.target.value + '')))
        }))
    }

    useEffect(() => {
        let   services = []
        const dropdown = document.querySelector('#usluga')
        
        const fetchData = async () => {
            const responce = await fetch('/db/services.json')
            services = await responce.json()
            services = services.sort((a, b) => { 
                if(a.cat_id === b.cat_id) {
                    if(a.name < b.name) { return -1 }
                    if(a.name > b.name) { return 1 }
                } else {
                    return a.cat_id - b.cat_id
                }
                return 0
            })
            const res = services.filter((item) => item.company_id === company)
                                .map   ((item, i, arr) => { 
                                    if(i === 0 || arr[i-1].cat_id !== arr[i].cat_id)
                                        return (
                                            <React.Fragment key={uniqid()}>
                                                <li id={`cat${item.cat_id}`} 
                                                    style={{"fontWeight": "bold"}} 
                                                    key={uniqid()}>
                                                        {item.cat_name}
                                                </li>
                                                <li value={item.object} 
                                                    style={{"paddingLeft": "30px"}} 
                                                    cat={item.cat_id} 
                                                    key={uniqid()}>
                                                        {item.name}
                                                </li>
                                            </React.Fragment>
                                        )
                                    return  <li value={item.object} 
                                                style={{"paddingLeft": "30px"}} 
                                                cat={item.cat_id} 
                                                key={uniqid()}>
                                                    {item.name}
                                            </li>
                                })
            setUslugaListHtml(res)
            // TODO: set defaultValue of input[id="usluga"] as first usluga.object
            // setUsluga(services[0].object)
            dispatch(loadUsluga(services.find(({object}) => object === dropdown.value)))

            addSelectInteractions('usluga', services)
        }
        fetchData()

        // return () => dropdown.removeEventListener("change", () => handleChange(services))
    }, [company])

    return (
        <div className="dropdown-container" style={{"width": "100%"}}>   
            <div className="dropdown" id="uslugaDropdown">
                <div className="select" style={{"display": "table", "width": "95%"}}>
                    <span id="uslugaTitle">Тип отправления...</span>
                    <div style={{"display": "table-cell", "verticalAlign": "middle", "textAlign": "end"}}>
                        <i className="fa fa-chevron-left"></i>
                    </div>
                </div>
                <input id="usluga" type="hidden" defaultValue="53030" />
                <ul className="dropdown-menu" id="uslugaList">
                    { ulsugaListHtml }
                </ul>
            </div>
        </div>   																				
    )
}

export default Usluga