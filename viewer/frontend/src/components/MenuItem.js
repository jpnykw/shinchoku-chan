import React from 'react';
import { default as MaterialMenuItem } from '@material-ui/core/MenuItem';

const MenuItem = React.forwardRef((props, ref) => {
  return (
    <MaterialMenuItem {...props} ref={ref} />
  );
});

export default MenuItem;