import React from 'react';

import Plugin from './Plugin';
import PropertyInspector from './PropertyInspector';

export default () => {
  return window.isPlugin ? <Plugin /> : <PropertyInspector />;
};
