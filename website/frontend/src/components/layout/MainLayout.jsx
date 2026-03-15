import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-12 gap-0 overflow-x-hidden">
      <div className="col-span-full grid grid-cols-12">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
