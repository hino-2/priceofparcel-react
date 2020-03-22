import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './style.scss'
import { printParamsRP, printServicesRP } from "./printParamsAndServicesRP";
import { showECOM, hideECOM } from '../../actions'
import { getSafe, format } from "../../utils/basic";

const Params = () => {
    const company  = useSelector(state => state.company)
    const usluga   = useSelector(state => state.usluga)
    let   isShown  = useSelector(state => state.showEcom)
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
        const objParams = document.querySelector('#objParamsAndServices')
        const x = e.pageX - objParams.offsetLeft
        const y = e.pageY - objParams.offsetTop;
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

    const generateParamsJSX = (data) => {
        const params = data.object[0].params.filter(item => !['from', 'to', 'service', 'country'].includes(item.id))
        
        if(!params) return
        
		if(data.id === 53030) {							// кнопка для ЕКОМа
			params.push({
				id : 'btnPVZ',
				name : 'Показать/скрыть пункты выдачи',
				datatype : 99,
				param : 'btnPVZ'
			});
        }

        let paramsInJSX = params.map((item) => printParamsRP(item, toggleEcomPvz, handleParamsChange))
        if(params.length % 2 !== 0) paramsInJSX.push(<div key="parSym">&nbsp;</div>)

        setParamsJSX(paramsInJSX)
    }

    const generateServicesJSX = (data) => {
        const services = data.object[0].service

        if(!services) return
        
        let servicesInJSX = services.map((item) => printServicesRP(item, handleServiceChange, services))
        if(services.length % 2 !== 0) servicesInJSX.push(<div key="servSym">&nbsp;</div>)

        setServicesJSX(servicesInJSX)
    }

    useEffect(() => {
        const getParamsAndServicesFromAPI = async (company, usluga) => {
            switch (company) {
                case "0":
                    const responce = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&object=${usluga}`)
                    const data = await responce.json()
                    if(getSafe(() => data.object[0])) {
                        generateParamsJSX(data)
                        generateServicesJSX(data)
                    }
                    break
                case "1":
                    /* CDEK PARAMS FORM */
                    break
                default:
                    break
            }
        }
        getParamsAndServicesFromAPI(company, usluga)
    }, [usluga, company])

    useEffect(() => {
        document.querySelector('#objParamsAndServices').addEventListener('mousemove', handleNiceBorderEffect)
        return () => document.querySelector('#objParamsAndServices').removeEventListener('mousemove', handleNiceBorderEffect)
    })

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