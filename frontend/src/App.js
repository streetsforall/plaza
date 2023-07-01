import React, { Component }  from 'react';
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import CTA from './mailto/mailto';
import Geocoder from './mailto/components/geocoder';
import Feed from './mailto/feed'



const Home = () => {
  return (
  <div class="home">
  <div id="welcome">
    <h1>Welcome to the Streets for All Plaza</h1>
    <a href="https://www.streetsforall.org/">Streetsforall.org</a>
    <p>this is a public square where all our small projects and tools hang out</p>
 

 <div>
  <Link to="/mailto">Call to Action Builder</Link>
 </div>
 
  </div>
</div>
  )
}



const CTA_bounce = () => {
  return (
  <div>
    <p>Mailto tool has mooooved 🐄</p>
    <p>/cta    ------>  /mailto</p>
    <Link to="/mailto">Call to Action Builder</Link>
  </div>
  )
}




const App = () => {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/geocoder" element={<Geocoder />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/cta" element={<CTA_bounce />} />
        <Route path="/mailto" element={<CTA />} />
        <Route path="/mailto/:hash" element={<CTA />} />
        <Route path="/*" element={"not found"} />
      </Routes>
    </HashRouter >


  );
}

export default App;
