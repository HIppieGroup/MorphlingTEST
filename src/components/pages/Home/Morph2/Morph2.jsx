import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import s from './Morph2.module.scss';
import Core from 'pages/Home/Morph2/Morph/Core';
import { figures } from 'pages/Home/Morph/figures';

import { gsap } from 'gsap';
import { getPoints } from 'pages/Home/Morph2/utils';

const path =
  'M237.828 1.23054C311.341 -10.4055 366.487 63.0212 420.391 114.305C476.351 167.546 552.219 219.613 548.421 296.729C544.673 372.845 468.031 421.797 403.267 462.042C353.906 492.714 295.391 497.806 237.828 489.732C189.013 482.884 151.383 452.397 113.121 421.342C67.8399 384.59 1.82993 354.993 0.0341616 296.729C-1.7714 238.148 68.4398 209.871 105.195 164.197C150.842 107.472 165.882 12.6187 237.828 1.23054Z';
const points = getPoints(path);

const Morph2 = ({ className }) => {
  const ref = useRef();
  const refImg = useRef();
  const morph = useRef();

  useEffect(() => {
    morph.current = new Core({ canvas: ref.current, blob: points });

    const render = () => {
      morph.current.render();
      refImg.current.style.clipPath = `path("${morph.current.path}")`;
    };

    gsap.ticker.add(render);

    return () => {
      morph.current.destroy();
      gsap.ticker.remove(render);
    };
  }, []);

  return (
    <>
      <div className={s.btns}>
        <button
          onClick={() => {
            morph.current?.setFormFullscreen(10);
          }}
        >
          open
        </button>
        <button
          onClick={() => {
            morph.current?.restoreTheOriginalForm(10);
          }}
        >
          close
        </button>
      </div>
      <canvas
        ref={ref}
        className={cx(s.root, className)}
      />
      <img
        ref={refImg}
        className={s.testImg}
        src="https://i.ytimg.com/vi/CXxHga6LIts/maxresdefault.jpg"
        alt=""
      />
    </>
  );
};

Morph2.propTypes = {
  className: PropTypes.string,
};

export default Morph2;
