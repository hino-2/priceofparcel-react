import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './style.scss'
import { printParamsRP, printServicesRP } from "../../utils/printParamsAndServicesRP";
import { showECOM, hideECOM } from '../../actions'
import { getSafe } from "../../utils/basic";

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
    }

    const handleNiceBorderEffect = (e) => {
        const objParams = document.querySelector('#objParamsAndServices')
        const x = e.pageX - objParams.offsetLeft
        const y = e.pageY - objParams.offsetTop;
        objParams.style.setProperty('--x', `${ x }px`)
        objParams.style.setProperty('--y', `${ y }px`)
    }

    const handleServiceChange = (id, services) => {
        console.log(id);
        
        // console.log(document.querySelector(`#s${id}`).checked);
    //     if(document.querySelector('#s' + id).checked) {			// serviceoff
    //         $.each(services.find(x => x.id === id).serviceoff, function(key, val) {
    //             $('#s' + val)[0].checked = false;
    //       });
    //   }
    //     if(!document.querySelector('#s' + id).checked) {			// serviceon
    //         $.each(services.find(x => x.id === id).serviceon, function(key, val) {
    //             document.querySelector('#s' + id).checked = true;
    //       });
    //   }

        // calculateRP();
        // console.log('calc', canCalculate);
    }

    const generateParamsJSX = (data) => {
        const params = data.object[0].params.filter(item => !['from', 'to', 'service', 'country'].includes(item['id']))
        
		if(data['id'] === 53030) {							// кнопка для ЕКОМа
			params.push({
				id : 'btnPVZ',
				name : 'Показать/скрыть пункты выдачи',
				datatype : 99,
				param : 'btnPVZ'
			});
        }
        
        if(!params) return

        // let paramsInJSX = params.reduce((html, item) => html += printParamsRP(item), '') 
        let paramsInJSX = params.map((item) => printParamsRP(item))
        if(params.length % 2 !== 0) paramsInJSX.push(<div key="parSym">&nbsp;</div>)

        setParamsJSX(paramsInJSX)
    }

    const generateServicesJSX = (data) => {
        const services = data.object[0].service

        if(!services) return
        
        let servicesInJSX = services.map((item) => printServicesRP(item, handleServiceChange, services))
        if(services.length % 2 !== 0) servicesInJSX.push(<div key="servSym">&nbsp;</div>)

        setServicesJSX(servicesInJSX)
        services.forEach((item) => {
            console.log(`#s${item['id']}`)
            
            // document.querySelector(`#s${item['id']}`).addEventListener('click', handleServiceChange(item, services))
        })
    }

    useEffect(() => {
        const getParamsAndServicesFromAPI = async (company, usluga) => {
            switch (company) {
                case "0":
                    const responce = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&object=${usluga}`)
                    const data = await responce.json()
                    console.log(data) 
                    if(getSafe(() => data.object[0])) {
                        generateParamsJSX(data)
                        generateServicesJSX(data)
                        // if(data.object[0].id === 53030) 
                        //     document.querySelector('#btnPVZ').addEventListener('click', toggleEcomPvz)
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

        // return document.querySelectorAll('.service').forEach((item) => 
        //     document.querySelector(`#s${item['id']}`).removeEventListener('click', handleServiceChange(item, services)))
        // return setTimeout(() => {
        //     document.querySelector('#btnPVZ').removeEventListener('click', toggleEcomPvz)
        // }, 2000) 
    }, [usluga, company])

    useEffect(() => {
        document.querySelector('#objParamsAndServices').addEventListener('mousemove', handleNiceBorderEffect)
        return document.querySelector('#objParamsAndServices').removeEventListener('mousemove', handleNiceBorderEffect)
    })

    // const h = () => alert(1)
    // let serv_jsx = <input onClick={h} type="checkbox" id={`s`} className="service switch_1" /> 
    // let serv = [React.createElement(
    //     'input',
    //     {
    //         'type': 'checkbox',
    //         'id': 's22',
    //         'className': 'service switch_1',
    //         'defaultChecked': true,
    //         'onClick': () => alert(1)
    //     },
    //     null
    // )]
    // serv.push(React.createElement(
    //     'input',
    //     {
    //         'type': 'checkbox',
    //         'id': 's22',
    //         'className': 'service switch_1',
    //         'defaultChecked': (1 === 2 ? true : false),
    //         'onClick': () => alert(1)
    //     },
    //     null
    // ))

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