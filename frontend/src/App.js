import React, { Component }  from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CTA from './cta/mailer';



const Home = () => {
  return (
  <div class="home">
  <div id="welcome">
    <h1>Welcome to the Streets for All Plaza</h1>
    <a href="https://www.streetsforall.org/">Streetsforall.org</a>
    <p>this is a public square where all our small projects and tools hang out</p>
  </div>
</div>
  )
}
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} >
        </Route>
        <Route path="/cta" exact element={<CTA />} />
        <Route path="/*" element={"not found"} />
      </Routes>
    </BrowserRouter >


  );
}

export default App;
