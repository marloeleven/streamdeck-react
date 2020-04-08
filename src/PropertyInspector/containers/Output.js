import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const getOutput = (outputs, id) => {
  const output = outputs.find((output) => output.id === id);

  return output || outputs[0];
};

export default ({ model: { state, setOutput, setList } }) => {
  const onChange = useCallback(
    async ({ target }) => {
      const scene = getOutput(state.list, target.value);

      await setOutput(scene);
    },
    [state.list, setOutput],
  );

  useEffect(() => {
    handler.on(EVENTS.GET.ALL_OUTPUTS, async ({ outputs }) => {
      const output = getOutput(outputs, state.id);
      await setList(outputs);
      await setOutput(output);
    });
  }, [state, setList, setOutput]);

  useEffect(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.OUTPUT);

    handler.getSettings().then(async ({ settings: { id } }) => {
      const { outputs } = await handler.getAllOutputs();

      const output = getOutput(outputs, id);

      await setList(outputs);
      await setOutput(output);
    });
  }, []);

  return (
    <Select value={state.id} onChange={onChange} label="Scene">
      {state.list.map(({ id, name }) => (
        <Select.Option key={id} value={id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
};
