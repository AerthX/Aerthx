import React from "react";
import {Outlet} from "react-router-dom"
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer'
import ScrollToTop from "../components/Additional/ScrollToTop";

const Root = () => {

  return (
    <div>
       
      <Navbar/>
      <ScrollToTop />
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Root