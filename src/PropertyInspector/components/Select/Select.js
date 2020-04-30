import React from 'react';
import cx from 'classnames';
import Item from 'components/Item';

import css from './Select.module.css';

const Select = ({ label, children, ...props }) => {
  return (
    <Item label={label}>
      <select
        className={cx(css.select, 'sdpi-item-value select')}
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
