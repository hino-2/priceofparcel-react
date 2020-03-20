import React from 'react';
import { useDispatch } from "react-redux"
import { layoutMobile, layoutDesktop, getEcomPvzFromFileAction } from '../actions'
import './App.scss';
import YMap from '../components/Map'
import Title from '../components/Title'
import CompanyList from '../components/CompanyList'
import Usluga from "../components/Usluga"
import Params from "../components/Params"
import Calculate from "../components/Calculate";
import getEcomPvzFromFile from './getEcomPvzFromFile'
import Direction from '../components/Direction';
import DirectionIndex from "../components/DirectionIndex";

function App() {
  const dispatch = useDispatch()
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
  if(isMobile) {
    // document.write("<style>.map { visibility: hidden; }</style>");
    // document.write("<style>.main_wrapper { grid-template-columns: 1fr; }</style>");
    // document.write("<style>.footer { width: 100vw; }</style>");
    dispatch(layoutMobile())
  } else { dispatch(layoutDesktop()) }

  // const testPlacemark = {"type":"Feature","id":"942739","geometry":{"type":"Point","coordinates":[53.5262,49.2786]},"properties":{"index":"942739","balloonContentHeader":"<div id=\"logo\" class=\"logo\"><img src=\"ecom/hermes1.png\" style=\"max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;\"/><div><font size=\"4\"><b>&nbsp;942739<br/>&nbsp;Гермес</b></font></div></div>","balloonContentBody":"<font size=\"3\"><div style=\"margin:10px 0px 10px 0px;\">обл. Самарская, г. Тольятти, ул. Юбилейная, 6</font><font size=\"2\"><br/>Ост. \"Ателье мод\". Транспорт: автобусы 9т, 19, 24, 62к, троллейбусы № 14, 18,  маршрутное такси: 20, 95, 96, 99, 137, 305, 314, 328. От остановки идти прямо в сторону ул. Юбилейная до дома № 6 (гостиница Амакс), отдельный вход со стороны ул. Революционная.</div></font>","balloonContentFooter":"<font size=\"3\"><div>пн, открыто: 09:00 - 21:00<br>вт, открыто: 09:00 - 21:00<br>ср, открыто: 09:00 - 21:00<br>чт, открыто: 09:00 - 21:00<br>пт, открыто: 09:00 - 21:00<br>сб, открыто: 09:00 - 21:00<br>вс, открыто: 09:00 - 21:00<br></div></font>                     <div style=\"width: 100%; text-align: center;\">                     <button class=\"slide\" onclick=\"setDirection('#from', '942739', 'обл. Самарская, г. Тольятти, ул. Юбилейная, 6'); return false;\" style=\"--color: #2a53d3; --hover: #2a53d3; margin: 5px 15px 1px 0;line-height: 1.5;\">                         отсюда                     </button>                     <button class=\"slide2\" onclick=\"setDirection('#to', '942739', 'обл. Самарская, г. Тольятти, ул. Юбилейная, 6'); return false;\" style=\"--color: #2a53d3; --hover: #2a53d3; margin: 5px 0 1px 15px; line-height: 1.5;\">                         &nbsp;&nbsp;сюда&nbsp;&nbsp;                     </button></div>","hintContent":"<div id='logo' class='logo'><img src='ecom/hermes1.png' style='max-height: 80px; max-width: 80px; height: auto; width: auto; vertical-align: middle;'/><div><font size='3'>&nbsp;942739 Гермес<br/>&nbsp;обл. Самарская, г. Тольятти, ул. Юбилейная, 6</div></font></div>"},"options":{"hintPane":"hint","iconLayout":"default#image","iconImageHref":"ecom/hermes_icon1.png","iconImageSize":[32,32],"iconImageOffset":[-16,-16]}}
  getEcomPvzFromFile('/ecom/pvz.json').then(data => dispatch(getEcomPvzFromFileAction(data)))

  return (
    <div className="app">
      <div className="left-panel">
        <Title />
        <div className="usluga">
          <CompanyList />
          <Usluga />
          <img id="help_main" src="img/question-circle-o.svg" style={{"cursor": "pointer"}} alt="Помощь"/>
        </div>
        <Params />
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <Direction type="from" />
        <DirectionIndex type="from" />
        <Direction type="to" />
        <DirectionIndex type="to" />
        <div>&nbsp;</div>
        <Calculate />
      </div>
      <div className="map">
        <YMap />
      </div>
    </div>
  )
}

export default App;
