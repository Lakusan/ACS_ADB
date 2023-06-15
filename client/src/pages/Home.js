import React from 'react';
import image from '../resources/pexels-andrea-piacquadio-837129.jpg'
//https://www.pexels.com/photo/man-in-brown-robe-carrying-bag-smiling-837129/
import '../App.css';



export function Home() {
  return (
    <>
      <h1 class="centered-h1"> Flight Information System </h1>
      <div class="image-container">
        <img src={image} alt="title image source: https://www.pexels.com/photo/man-in-brown-robe-carrying-bag-smiling-837129/" className="centered-image"/>
      </div>
    </>
  );
}