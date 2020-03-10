import React from 'react';
import './App.scss';
import YMap from './components/Map'
import { useSelector, useDispatch } from "react-redux";
import { layoutMobile, layoutDesktop, showECOM, hideECOM } from './actions'

function App() {
  const isMobile = useSelector(state => state.isMobile)
  const dispatch = useDispatch()

  return (
    <div className="app">
      <div className="left-panel">
        {/* hello, {isMobile ? 'i am mobile' : 'i am desktop'} */}
        <button onClick={() => dispatch(layoutMobile())}>MOBILE</button>
        <button onClick={() => dispatch(layoutDesktop())}>DESKTOP</button>
        <button onClick={() => dispatch(showECOM())}>show ecom</button>
        <button onClick={() => dispatch(hideECOM())}>hide ecom</button>
      </div>
      <div className="map">
        <YMap />
      </div>

    </div>
  );
}

export default App;
