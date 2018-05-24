import React from 'react';
import classNames from 'classnames';
import './index.less';

export default ({ title, children, last, block, grid, ...rest }) => {
  const cls = classNames('standardFormRow', {
    'standardFormRowBlock': block,
    'standardFormRowLast': last,
    'standardFormRowGrid': grid,
  });

  return (
    <div className={cls} {...rest}>
      {
        title && (
          <div className='label'>
            <span>{title}</span>
          </div>
        )
      }
      <div className='content'>
        {children}
      </div>
    </div>
  );
};
