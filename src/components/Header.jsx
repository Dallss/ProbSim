import React, { useState, useEffect } from 'react';

const Header = (props) => {

  return (
   <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
      ProbSim
      </h1>
      <p className="text-lg text-gray-600">
      Probabilistic Sampling Methods Simulator
      </p>
   </div>
  );
};

export default Header;
