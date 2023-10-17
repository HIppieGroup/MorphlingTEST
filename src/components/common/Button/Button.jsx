import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import modsClasses from 'utils/modsClasses';
import Link from 'next/link';

import s from './Button.module.scss';

const Button = memo(
  ({
    className,
    children,
    href,
    underline,
    stylized,
    disabled,
    inline,
    transition,
    type = 'button',
    ...otherProps
  }) => {
    const classes = modsClasses(s, {
      transition,
    });

    const classNames = cx(s.root, className, classes, {
      [s.underline]: underline,
      [s.stylized]: stylized,
      [s.disabled]: disabled,
      [s.inline]: inline,
    });

    if (href) {
      return (
        <Link
          className={classNames}
          href={href}
          {...otherProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type={type}
        className={classNames}
        {...otherProps}
      >
        {children}
      </button>
    );
  }
);

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  href: PropTypes.string,
  underline: PropTypes.bool,
  stylized: PropTypes.bool,
  disabled: PropTypes.bool,
  transition: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
