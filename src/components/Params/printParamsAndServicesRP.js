import React from "react"
import { format, formatDate, getSafe, replaceAll } from "../../utils/basic"
import uniqid from "uniqid"

const datatype = {
    1 : 'text',
    2 : 'text',
    3 : 'text',
    4 : 'date',
    5 : 'checkbox',
    13 : 'text',
    17 : 'text',
    29 : 'text',
    33 : 'text',
    41 : 'select',
    99 : 'button'
}

export const printParamsRP = (param, toggleEcomPvz, handleParamsChange) => {
    param['name'] = replaceAll(param['name'], '-', '/');
    switch(param['datatype']) {
        case 1: case 2:	case 3:	case 13: case 17: case 29: case 33:
            let unit = '', auxClass = '', auxPadding = '25', defVal = getSafe(() => param['def']);
            if (getSafe(() => param['unit'])[0] === 'грамм') {
                unit = '(грамм)';
                defVal = format(defVal);
                auxClass = 'weight';
                auxPadding = '25';
            }
            if (getSafe(() => param['unit'])[0] === 'руб.')  {
                unit = '';
                auxClass = 'currency';
                auxPadding = '25';
                defVal = format(defVal / 100);
            }
            defVal = param['param'] === 'dogovor' ? "0" : defVal
            return (<div style={{"paddingRight": "4px"}} key={uniqid()}>
                        <label htmlFor={param['param']} className="objLabel" key={uniqid()}>{param['name']} {unit}</label>
                        <div className="col-3" style={{"margin": "0px", "width": "100%"}} key={uniqid()}> 
                            <input type={datatype[param['datatype']]} 
                                   key={uniqid()}
                                   className={`effect-1 param ${auxClass}`} 
                                   id={param['param']} 
                                   name={`${param['param']}`}
                                   defaultValue={defVal} 
                                   onChange={handleParamsChange}
                                   style={{"width": "calc(100% - 25px)", "margin": "3px 0 3px", "padding": `6px 0 5px ${auxPadding}px`}} /> 
                            <span className="focus-border" key={uniqid()}></span>
                        </div> 
                    </div>)
        case 4:			// date
            return (<div style={{"paddingRight": "4px"}} key={uniqid()}> 
                        <label htmlFor={param['param']} className="objLabel" key={uniqid()}>{param['name']}</label>
                        <div className="col-3" style={{"margin": "0px", "width": "100%"}} key={uniqid()}>
                            <input type="date" 
                                   className="effect-1 param" 
                                   id={param['param']} 
                                   name={`${param['param']}`}
                                   key={uniqid()}
                                   defaultValue={formatDate(new Date())} 
                                   onChange={handleParamsChange}
                                   style={{"width": "calc(100% - 25px)", "margin": "3px 0 3px", "padding": "3px 0 3px 25px"}}/>
                            <span className="focus-border" key={uniqid()}></span>
                        </div>
                    </div>)
        case 5:			// checkbox
            return (<div key={uniqid()}>
                        <div className="switch_box box_1" 
                             style={{"display": "table-cell", "verticalAlign": "middle"}} 
                             key={uniqid()}> 
                            <input type={datatype[param['datatype']]} 
                                   className="param switch_1" 
                                   id={param['param']}
                                   name={`${param['param']}`}
                                   key={uniqid()}
                                   defaultChecked
                                   onChange={handleParamsChange} /> 
                        </div> 
                        <div style={{"display": "table-cell", "textAlign": "right"}} key={uniqid()}> 
                            <label htmlFor={param['param']}
                                   key={uniqid()} 
                                   className="objLabel">
                                    {param['name']} {(param['unit'] ? '(' + param['unit'][0] + ')' : '')}
                            </label>
                        </div> 
                    </div>)
        case 41:		// select
            return (<div key={uniqid()}>
                        <label htmlFor={param['param']} 
                               className="objLabel"
                               key={uniqid()}>
                            {param['name']}
                        </label>
                        <div className="container" key={uniqid()} style={{"marginBottom": "5px"}}> 
                            <select id={`${param['param']}Dropdown`} 
                                    name={`${param['param']}`}
                                    className="param"
                                    key={uniqid()}
                                    onChange={handleParamsChange}>
                                {param['list'].map((item) => (<option value={item.id} key={uniqid()}>{item.name}</option>))}
                            </select>
                        </div>
                    </div>)
                    // TODO: select
            //                     <div class="dropdown" id="' + param['param'] + 'Dropdown" style="border-radius: 0px; margin-top: 3px;"> \
            //                         <div class="select" style="padding: 5px 0px 5px 10px; margin: 0;"> \
            //                             <span id="' + param['param'] + 'Title">' + param['name'] + '</span> \
            //                             <i class="fa fa-chevron-left"></i> \
            //                         </div> \
            //                         <input id="' + param['param'] + '" type="hidden" class="param"> \
            //                         <ul class="dropdown-menu" id="' + param['param'] + 'List">';
            // $.each(list, function(key, item) {
            //     htmlParams += '<li value="' + item['id'] + '">' + item['name'] + '</li>';
            // });
            // htmlParams +=  '		</ul> \
            //                         </div> \
            
            // selectInteractions.push(param['param']);
        case 99:		// ecom button
            // if(!isMobile) 
                return (<div style={{"paddingRight": "4px"}} key={uniqid()}>
                            <button className="up" 
                                    id={param['param']} 
                                    name={`${param['param']}`}
                                    key={uniqid()}
                                    style={{"width": "100%", 
                                            "height": "53%", 
                                            "margin": "22px 0px 0px 0px", 
                                            "padding": "4px 6px 3px 6px",
                                            "--color": "#2a53d3", 
                                            "--hover": "#2a53d3"}}
                                    onClick={() => toggleEcomPvz()}>
                                {param['name']}
                            </button>
                        </div>)
        default:
            return (<div key={uniqid()}>тип {param['datatype']} неопределен</div>)
    }
}

export const printServicesRP = (service, handleServiceChange, services) => {
    return (<React.Fragment key={uniqid()}>
                <div key={uniqid()}> 
                    <div key={uniqid()} className="switch_box box_1"> 
                        <input onClick={() => handleServiceChange(service['id'], services)} 
                               type="checkbox" id={`s${service['id']}`} 
                               className="service switch_1" 
                               defaultChecked={service['default'] ? true : false}
                               key={uniqid()} />
                    </div> 
                </div>
                <div key={uniqid()}>
                    <label htmlFor={`s${service['id']}`} key={uniqid()}>{service['name']}</label>
                </div>
            </React.Fragment>)
}
