import React from 'react';
import Item from 'components/Item';

const Input = ({ label, children, ...props }) => (
  <Item label={label} {...props}>
    {children}
  </Item>
);

const Radio = ({ children, label, ...props }) => (
  <Input type="radio" label={label} {...props}>
    <Item.Value>{children}</Item.Value>
  </Input>
);

export default {
  Radio,
  Input,
};
