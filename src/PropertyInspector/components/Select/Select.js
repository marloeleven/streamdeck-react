import React from 'react';
import Item from 'components/Item';

const Select = ({ label, children, ...props }) => {
  return (
    <Item label={label}>
      <select
        className="sdpi-item-value select"
        {...props}
        style={{
          maxWidth: '229px',
          paddingRight: '20px',
        }}
      >
        {children}
      </select>
    </Item>
  );
};

const Option = ({ children, ...props }) => <option {...props}>{children}</option>;

const Group = ({ children, ...props }) => <optgroup {...props}>{children}</optgroup>;

export default Object.assign(Select, { Option, Group });
