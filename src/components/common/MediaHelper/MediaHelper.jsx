import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { DESKTOP, TABLET, MOBILE } from './constants';
import { onCheckCursor, onCheckViewport } from './utils/viewport';

// for change value font size you need change value in fontSizeHelperInline.js

export const MediaHelperContext = React.createContext(null);

const MediaHelper = ({ children }) => {
  const [viewport, setViewport] = useState(MOBILE);
  const [isTouchDevise, setIsTouchDevise] = useState(false);

  const prevViewport = useRef(viewport);

  useEffect(() => {
    const debounceResize = debounce(
      (newViewport, isCursorExist) => {
        prevViewport.current = newViewport;
        setViewport(newViewport);
        setIsTouchDevise(!isCursorExist);
      },
      50,
      {
        leading: false,
      }
    );

    const resize = () => {
      const newViewport = onCheckViewport();
      const isCursorExist = onCheckCursor();

      if (newViewport !== prevViewport.current) {
        debounceResize(newViewport, isCursorExist);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const value = useMemo(
    () => ({
      viewport,
      isTouchDevise,
      isMobile: viewport === MOBILE,
      isTablet: viewport === TABLET,
      isDesktop: viewport === DESKTOP,
    }),
    [viewport, isTouchDevise]
  );

  return (
    <MediaHelperContext.Provider value={value}>
      {children}
    </MediaHelperContext.Provider>
  );
};

MediaHelper.propTypes = {
  children: PropTypes.any,
};

export default React.memo(MediaHelper);
