import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import TransitionGroupNormal from './TransitionGroupNormal';

import { timeoutsShape, classNamesShape } from './utils/propTypes';
import isVisible from './utils/isVisible';

const ReactTransitionGroupNormal = ({
  transitionKey,
  classNames,
  timeout,
  children,
  onEnter,
  onExit,
  onExited,
  onEntered,
  disableProps,
  addEndListener,
}) => {
  return (
    <TransitionGroupNormal component={null}>
      <Transition
        key={transitionKey}
        classNames={classNames}
        timeout={timeout}
        addEndListener={addEndListener}
        onEnter={onEnter}
        onExit={onExit}
        onExited={onExited}
        onEntered={onEntered}
      >
        {status => {
          if (typeof children === 'function') {
            return children({
              transitionStatus: status,
              isVisible: isVisible(status),
            });
          }

          if (disableProps) {
            return children;
          }

          return React.cloneElement(children, {
            transitionStatus: status,
            isVisible: isVisible(status),
          });
        }}
      </Transition>
    </TransitionGroupNormal>
  );
};

ReactTransitionGroupNormal.propTypes = {
  transitionKey: PropTypes.any,
  timeout: timeoutsShape,
  classNames: classNamesShape,
  onExit: PropTypes.func,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  onEntered: PropTypes.func,
  addEndListener: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  disableProps: PropTypes.bool,
};

ReactTransitionGroupNormal.defaultProps = {
  classNames: 'reactTransitionGroup',
};

export default ReactTransitionGroupNormal;
