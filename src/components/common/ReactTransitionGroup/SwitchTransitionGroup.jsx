import React from 'react';
import PropTypes from 'prop-types';
import { Transition, SwitchTransition } from 'react-transition-group';

import isVisible from './utils/isVisible';

const SwitchTransitionGroup = ({
  transitionKey,
  children,
  isVisible: parentIsVisible,
  ...other
}) => (
  <SwitchTransition component={null}>
    <Transition
      key={transitionKey}
      {...other}
    >
      {status => {
        if (typeof children === 'function') {
          return children({
            isVisible:
              parentIsVisible !== undefined
                ? isVisible(status) && parentIsVisible
                : isVisible(status),
          });
        }

        return React.cloneElement(children, {
          isVisible:
            parentIsVisible !== undefined
              ? isVisible(status) && parentIsVisible
              : isVisible(status),
        });
      }}
    </Transition>
  </SwitchTransition>
);

SwitchTransitionGroup.propTypes = {
  isVisible: PropTypes.bool,
  transitionKey: PropTypes.any,
  timeout: PropTypes.number,
  classNames: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

export default React.memo(SwitchTransitionGroup);
