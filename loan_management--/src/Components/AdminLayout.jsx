import React, { useEffect, useState } from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
