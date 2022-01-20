import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
};

export default PublicLayout;
