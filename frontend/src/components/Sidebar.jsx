import React, { useState } from 'react';
import { RxDashboard } from "react-icons/rx";
import { CiCalculator1, CiCreditCard1 } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
export const Sidebar = ({ onTabChange }) => {
  const [activeItem, setActiveItem] = useState('Dashboard'); // Default active item

  const sidebar = [
    { icon: <RxDashboard />, title: 'Dashboard' },
    { icon: <CiCreditCard1 />, title: 'Add Payments' },
    { icon: <CiBellOn />, title: 'Notifications' },
    { icon: <CiCalculator1 />, title: 'Calculate Income' },
  ];

  const handleItemClick = (title) => {
    setActiveItem(title);
    onTabChange(title); // Call the onTabChange function passed from App
  };

  return (
    <div className='bg-[#22282E] rounded-2xl p-4 w-full mx-4'>
      {sidebar.map((side) => (
        <div
          key={side.title}
          className={`flex items-center space-x-2 text-xl p-2 cursor-pointer rounded ${
            activeItem === side.title ? '' : 'bg-transparent'
          }`}
          onClick={() => handleItemClick(side.title)}
        >
          <p className={`text-white ${activeItem === side.title ? 'text-white' : 'text-gray-400'}`}>
            {side.icon}
          </p>
          <h2 className={`text-white ${activeItem === side.title ? 'font-semibold text-white' : 'text-gray-400'}`}>
            {side.title}
          </h2>
        </div>
      ))}
    </div>
  );
};
