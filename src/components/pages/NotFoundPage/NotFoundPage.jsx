import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import s from './NotFoundPage.module.scss';

const NotFoundPage = ({ className }) => {
  return (
    <div className={cx(s.root, className)}>
    NotFound
    </div>
  );
};

NotFoundPage.propTypes = {
  className: PropTypes.string,
};

export default NotFoundPage;
