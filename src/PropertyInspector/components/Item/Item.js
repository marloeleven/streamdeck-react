import React from 'react';

export default ({ children, label, ...props }) => {
  return (
    <div className="sdpi-item" {...props}>
      <div className="sdpi-item-label">{label}</div>
      {children}
    </div>
  );
};
