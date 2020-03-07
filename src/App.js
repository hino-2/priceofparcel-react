import React from 'react';
import './App.scss';
import YMap from './components/Map'
import { useSelector, useDispatch } from "react-redux";
import { layoutMobile, layoutDesktop } from './actions'

function App() {
  const isMobile = useSelector(state => state.isMobile)
  const dispatch = useDispatch()

  return (
    <div className="app">
      <div className="left-panel">
        hello, {isMobile ? 'i am mobile' : 'i am desktop'}
        <button onClick={() => dispatch(layoutMobile())}>MOBILE</button>
        <button onClick={() => dispatch(layoutDesktop())}>DESKTOP</button>
      </div>
      <div className="map">
        <YMap />
      </div>

    </div>
  );
}

export default App;
