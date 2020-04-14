import React, { useEffect } from 'react';

import handler from 'handlers/PropertyInspector';

import ACTIONS from 'const/actions';

import Input from 'components/Input';

export default ({ model: { state, setPushToTalk } }) => {
  const onTogglePushToTalk = ({ target }) => setPushToTalk(Number(target.checked));

  useEffect(() => {
    handler.setAction(ACTIONS.MICROPHONE);

    handler.getSettings().then(async ({ settings: { pushToTalk } }) => {
      await setPushToTalk(pushToTalk);
    });
  }, []);

  return (
    <>
      <Input.Checkbox
        label="Push to Talk"
        onChange={onTogglePushToTalk}
        checked={state.pushToTalk}
      ></Input.Checkbox>
    </>
  );
};
