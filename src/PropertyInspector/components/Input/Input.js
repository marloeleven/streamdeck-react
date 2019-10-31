import React, { useState, useCallback, forwardRef } from 'react';
import cx from 'classnames';
import Item from 'components/Item';
import Wrapper from 'components/Wrapper';

const PATTERN = {
  IP_ADDRESS: 'd{1,3}.d{1,3}.d{1,3}.d{1,3}',
  EMAIL:
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
  NUMBER: '[0-9]*',
};

const BaseInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

const Label = ({ children, label, ...props }) => (
  <label {...props} className="sdpi-item-label">
    <span></span>
    {children}
  </label>
);

export const Text = forwardRef((props, ref) => (
  <BaseInput type="text" ref={ref} {...props} />
));
export const Number = forwardRef((props, ref) => (
  <Number
    pattern={PATTERN.NUBMER}
    inputmode="numeric"
    type="number"
    ref={ref}
    {...props}
  />
));
export const Password = forwardRef((props, ref) => (
  <BaseInput type="password" ref={ref} {...props} />
));
export const Checkbox = forwardRef((props, ref) => (
  <BaseInput type="checbox" ref={ref} {...props} />
));
export const Radio = forwardRef((props, ref) => (
  <BaseInput type="radio" onChange={console.warn} ref={ref} {...props} />
));

export const RadioWrapper = ({ children, label, ...props }) => (
  <Wrapper.Input type="radio" label={label} {...props}>
    <Item.Value>{children}</Item.Value>
  </Wrapper.Input>
);

// SPECIAL
export const IPAddress = forwardRef((props, ref) => (
  <Text pattern={PATTERN.IP_ADDRESS} ref={ref} {...props} />
));

export const Email = forwardRef((props, ref) => (
  <Text pattern={PATTERN.EMAIL} ref={ref} {...props} />
));

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea className={cx(className, 'textarea')} ref={ref} {...props} />
));

export default {
  Text: forwardRef(({ label, ...props }, ref) => (
    <Wrapper.Input label={label}>
      <Text ref={ref} className="sdpi-item-value" {...props} />
    </Wrapper.Input>
  )),
  Password: forwardRef(({ label, ...props }, ref) => (
    <Wrapper.Input label={label}>
      <Password ref={ref} className="sdpi-item-value" {...props} />
    </Wrapper.Input>
  )),
  Checkbox: forwardRef(({ label, ...props }, ref) => (
    <Wrapper.Input label={label}>
      <Checkbox ref={ref} className="sdpi-item-value" {...props} />
    </Wrapper.Input>
  )),
  Radio: forwardRef(({ label, defaultValue = false, ...props }, ref) => {
    const [checked, setChecked] = useState(defaultValue);

    const onClickHandler = useCallback(() => {
      setChecked(checked => !checked);
    }, []);

    return (
      <Item.Child>
        <Radio ref={ref} checked={checked} {...props} />
        <Label onClick={onClickHandler}>{label}</Label>
      </Item.Child>
    );
  }),
  IPAddress: forwardRef(({ label, ...props }, ref) => (
    <Wrapper.Input label={label}>
      <IPAddress ref={ref} className="sdpi-item-value" {...props} />
    </Wrapper.Input>
  )),
  Email: forwardRef(({ label, ...props }, ref) => (
    <Wrapper.Input label={label}>
      <Email ref={ref} className="sdpi-item-value" {...props} />
    </Wrapper.Input>
  )),
};
