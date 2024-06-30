import './Welcome.css';
// import Navigation from "../components/Navigation";
// import Footer from "../components/Footer";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import React from 'react';
import card1 from "../../public/card1.jpeg";
import card2 from "../../public/card2.jpeg";
// import bannerImage1 from "../../public/banner2.jpeg";

import Slideshow from '../components/SlideShow';
import slides from '../components/SlideShow'

export default function Welcome() {

  return(
    <div>
      <div>
        <Slideshow slides={slides} />
      </div>



      <div className='card'>
        <div className="cardLeft">
          <div class="text-container">
            <p className='text'>Business Intelligence (BI) offers a wide range of benefits to organizations, making it an indispensable tool for decision-making and strategic planning. Firstly, BI empowers businesses to make data-driven decisions. By collecting, analyzing, and visualizing data from various sources, BI tools provide valuable insights into past performance, current trends, and future possibilities. This data-driven approach allows organizations to identify opportunities, address challenges, and optimize their operations. It also enhances overall decision-making by reducing guesswork and reliance on intuition.</p>
          </div>
          <div className='image-container'>
            <img className='custom-opacity' src={card1} alt="Open BI" width={"100%"}></img>
          </div>
        </div>

        <div className="cardRight">
          <div className='image-container'>
            <img className='custom-opacity' src={card2} alt="Open BI" width={"100%"}></img>

          </div>
          <div className="text-container">
            <p className='text'>BI promotes improved operational efficiency. It streamlines data processes, making it easier to access and understand critical information. With BI, organizations can monitor key performance indicators in real-time, enabling timely interventions and adjustments when necessary. This results in better resource allocation, cost savings, and more effective use of time and personnel. Additionally, BI tools can assist in identifying bottlenecks and inefficiencies in processes, which can be rectified to enhance productivity and profitability. In summary, Business Intelligence is an invaluable asset for organizations looking to harness the power of data to drive better decision-making, enhance efficiency, and stay competitive in a data-driven world.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
