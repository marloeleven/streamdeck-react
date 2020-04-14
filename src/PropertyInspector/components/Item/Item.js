import React from 'react';
import cx from 'classnames';

const Item = ({ children, label, className, ...props }) => (
  <div className={cx('sdpi-item', className)} {...props}>
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
