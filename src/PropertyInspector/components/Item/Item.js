import React from 'react';

const Item = ({ children, label, ...props }) => (
  <div className="sdpi-item" {...props}>
    <div className="sdpi-item-label">{label}</div>
    {children}
  </div>
);

const Child = ({ children, ...props }) => (
  <div className="sdpi-item-child" {...props}>
    {children}
  </div>
);

const Value = ({ children, ...props }) => (
  <div className="sdpi-item-value" {...props}>
    {children}
  </div>
);

const Combo = ({ children, ...props }) => {};

export default Object.assign(Item, { Child, Combo, Value });
