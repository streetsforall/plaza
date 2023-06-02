import React, { Component }  from 'react';
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import CTA from './mailto/mailer';



const Home = () => {
  return (
  <div class="home">
  <div id="welcome">
    <h1>Welcome to the Streets for All Plaza</h1>
    <a href="https://www.streetsforall.org/">Streetsforall.org</a>
    <p>this is a public square where all our small projects and tools hang out</p>
 

 <div>
  <Link to="/cta">Call to Action Builder</Link>
 </div>
 
  </div>
</div>
  )
}
const App = () => {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" exact element={<Home />} >
        </Route>
        <Route path="/cta" element={<CTA />} />
        <Route path="/cta/:hash" element={<CTA />} />
        <Route path="/*" element={"not found"} />
      </Routes>
    </HashRouter >


  );
}

export default App;
