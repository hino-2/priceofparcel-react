import React, { useEffect, useState }     from "react";
import { useSelector, useDispatch }       from "react-redux";
import { printParamsRP, printServicesRP } from "./printParamsAndServicesRP";
import { showECOM, hideECOM }             from '../../actions'
import { getSafe, format }                from "../../utils/basic";
import './style.scss'

const Params = () => {
    const company  = useSelector(state => state.company)
    const usluga   = useSelector(state => state.usluga.object)
    let   isShown  = useSelector(state => state.showEcom)
    const isMobile = useSelector(state => state.isMobile)
    const dispatch = useDispatch()
    const [paramsJSX, setParamsJSX]     = useState("")
    const [servicesJSX, setServicesJSX] = useState("")
    
    const toggleEcomPvz = () => {
        if(isShown) {
            dispatch(hideECOM())
            isShown = false
        } else {
            dispatch(showECOM())
            isShown = true
        }
        document.querySelector('#btnPVZ').blur()
    }

    const handleNiceBorderEffect = (e) => {
        const objParams = document.querySelector('.objParamsAndServices')
        const x = e.pageX - objParams.offsetLeft
        const y = e.pageY - objParams.offsetTop
        objParams.style.setProperty('--x', `${ x }px`)
        objParams.style.setProperty('--y', `${ y }px`)
    }

    const handleParamsChange = (e) => {
        e.target.value = format(e.target.value)
    }

    const handleServiceChange = (id, services) => {
        if(document.querySelector('#s' + id).checked) {			    
            const sOff = services.find(x => x.id === id).serviceoff
            if(sOff) sOff.forEach((id) => document.querySelector(`#s${id}`).checked = false)
        }
        
        if(!document.querySelector('#s' + id).checked) { 			
            const sOn = services.find(x => x.id === id).serviceon
            if(sOn) sOn.forEach((id) => document.querySelector(`#s${id}`).checked = true)
        }

    }

    const generateRPParamsJSX = (data) => {
        const params = data.object[0].params.filter(item => !['from', 'to', 'service', 'country'].includes(item.id))
        
        if(!params) return
        
		if(!isMobile && data.id === 53030) {				// кнопка для ЕКОМа
			params.push({
				id : 'btnPVZ',
				name : 'Пункты выдачи',
				datatype : 99,
				param : 'btnPVZ'
			})
        }

        let paramsInJSX = params.map((item) => printParamsRP(item, toggleEcomPvz, handleParamsChange))
        if(params.length % 2 !== 0) paramsInJSX.push(<div key="parSym">&nbsp;</div>)

        setParamsJSX(paramsInJSX)
    }

    const generateRPServicesJSX = (data) => {
        const services = data.object[0].service

        if(!services) return
        
        let servicesInJSX = services.map((item) => printServicesRP(item, handleServiceChange, services))
        if(services.length % 2 !== 0) servicesInJSX.push(<div key="servSym">&nbsp;</div>)

        setServicesJSX(servicesInJSX)
    }

    const generateCDEKForm = () => {
        setParamsJSX(<div>CDEK PARAMS PLACEHOLDER</div>)
        setServicesJSX(<div>CDEK SERVICES PLACEHOLDER</div>)
    }

    const addSelectInteractions = (id) => {
        const input     = document.querySelector(`#${id}`)
        const list 	    = document.querySelector(`#${id}List`)
        const title	    = document.querySelector(`#${id}Title`)
        const dropdown  = document.querySelector(`#${id}Dropdown`)
        const listItems = document.querySelectorAll(`#${id}Dropdown .dropdown-menu li`)
    
        title.innerHTML = list.children[0].innerHTML
        input.setAttribute('value', list.children[0].value)
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
             .forEach((item) => item.addEventListener('click', (e) => {		// клик на пункт списка
                title.innerHTML = e.target.innerHTML
                input.setAttribute('value', e.target.value)
        }))        
    }

    useEffect(() => {
        const getParamsAndServicesFromAPI = async (company, usluga) => {
            switch (company) {
                case "0":
                    const responce = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&object=${usluga}`)
                    const data = await responce.json()
                    if(getSafe(() => data.object[0])) {
                        generateRPParamsJSX(data)
                        generateRPServicesJSX(data)
                    }
                    break
                case "1":
                    generateCDEKForm()
                    break
                default:
                    break
            }
        }
        getParamsAndServicesFromAPI(company, usluga)
    }, [usluga, company])

    useEffect(() => {
        document.querySelector('.objParamsAndServices').addEventListener('mousemove', handleNiceBorderEffect)
        return () => document.querySelector('.objParamsAndServices').removeEventListener('mousemove', handleNiceBorderEffect)
    })

    useEffect(() => {
        document.querySelectorAll('.objParamsAndServices input[type=hidden]')
                .forEach((item) => addSelectInteractions(item.id))
    }, [paramsJSX])

    return (
        <div id="objParamsAndServices" className="objParamsAndServices niceborder">
            { paramsJSX }
            <div className="objServices">
                { servicesJSX }
            </div>
        </div>
    )
}

export default Params