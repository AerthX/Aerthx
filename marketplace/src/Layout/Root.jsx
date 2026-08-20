import React from "react";
import { Outlet } from 'react-router-dom';
import MarketplaceHeroNavbarControls from '../Components/Header/MarketplaceNavbarControls';
import Footer from '../Components/Footer/Footer';  

const Root = () => {
 
  return (
    <div>
      <MarketplaceHeroNavbarControls />
      <div className="pt-16"> 
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};  

export default Root;
