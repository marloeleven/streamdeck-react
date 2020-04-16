import React from 'react';

const TEXT = {
  1: 'Open XSplit Broadcaster to start connection...',
  2: 'Connecting to XSplit Broadcaster...',
  3: '', // connected
};

export default ({ state }) =>
  TEXT[state] ? (
    <span
      style={{
        paddingLeft: '100px',
        paddingTop: '20px',
        display: 'block',
      }}
    >
      {TEXT[state]}
    </span>
  ) : null;
