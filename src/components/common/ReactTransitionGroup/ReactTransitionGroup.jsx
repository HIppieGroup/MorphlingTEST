import React from 'react';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';

import isVisible from './utils/isVisible';
import { timeoutsShape, classNamesShape } from './utils/propTypes';

const ReactTransitionGroup = ({
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
  isVisible: parentIsVisible,
}) => {
  return (
    <TransitionGroup component={null}>
      <Transition
        key={transitionKey}
        classNames={classNames}
        timeout={timeout}
        onEnter={onEnter}
        onExit={onExit}
        onExited={onExited}
        onEntered={onEntered}
        addEndListener={addEndListener}
      >
        {status => {
          if (typeof children === 'function') {
            return children({
              transitionStatus: status,
              isVisible:
                parentIsVisible !== undefined
                  ? isVisible(status) && parentIsVisible
                  : isVisible(status),
            });
          }

          if (disableProps) {
            return children;
          }

          return React.cloneElement(children, {
            transitionStatus: status,
            isVisible:
              parentIsVisible !== undefined
                ? isVisible(status) && parentIsVisible
                : isVisible(status),
          });
        }}
      </Transition>
    </TransitionGroup>
  );
};

ReactTransitionGroup.propTypes = {
  transitionKey: PropTypes.any,
  timeout: timeoutsShape,
  classNames: classNamesShape,
  onExit: PropTypes.func,
  addEndListener: PropTypes.func,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  onEntered: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  disableProps: PropTypes.bool,
  isVisible: PropTypes.bool,
};

ReactTransitionGroup.defaultProps = {
  classNames: 'reactTransitionGroup',
};

export default ReactTransitionGroup;
