import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import isVisibleFunc from './utils/isVisible';
import { timeoutsShape } from './utils/propTypes';

const ReactTransition = ({
  isVisible,
  timeout,
  unmountOnExit,
  children,
  onExited,
  disableProps,
}) => (
  <Transition
    in={isVisible}
    component={null}
    timeout={timeout}
    unmountOnExit={unmountOnExit}
    onExited={onExited}
  >
    {status => {
      if (typeof children === 'function') {
        return children({
          transitionStatus: status,
          isVisible: isVisibleFunc(status),
        });
      }

      if (disableProps) {
        return children;
      }

      return React.cloneElement(children, {
        transitionStatus: status,
        isVisible: isVisibleFunc(status),
      });
    }}
  </Transition>
);

ReactTransition.propTypes = {
  onExited: PropTypes.func,
  isVisible: PropTypes.bool,
  timeout: timeoutsShape,
  unmountOnExit: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

ReactTransition.defaultProps = {
  unmountOnExit: false,
};

export default ReactTransition;
