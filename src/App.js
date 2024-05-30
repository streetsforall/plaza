import React, { Component }  from 'react';
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import CTA from './pages/mailto/mailto';
import Geocoder from './pages/mailto/components/geocoder';
import Feed from './pages/mailto/feed'



const Home = () => {
  return (
  <div class="home">
  <div id="welcome">
    <h1>Welcome to the <a href="https://www.streetsforall.org/">Streets for All</a> Plaza</h1>
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
