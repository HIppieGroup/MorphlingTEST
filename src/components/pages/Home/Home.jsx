import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ellipse, figures } from './Morph/figures';
import isClockwise from 'is-clockwise';

import s from './Home.module.scss';
import Morphling from "pages/Home/Morph/Morphling";

const normolizeFigure = (points) => {
  let min = Math.atan2(points[0][0], points[0][1]);
  let index = 0;
  const xs = [];
  const ys = [];
  for (let i = 0; i < points.length; i += 1) {
    xs.push(points[i][0]);
    ys.push(points[i][1]);
    const angle = Math.atan2(points[i][0], points[i][1]);
    if (min > angle) {
      min = angle; // eslint-disable-line
      index = i;
    }
  }

  const result = [];
  for (let i = 0; i < points.length; i += 1) {
    result.push([xs[i], ys[i]]);
  }
  const temp = [...points];
  const newPoints = temp.splice(index - 1).concat(temp);
  if (!isClockwise(newPoints)) {
    newPoints.reverse();
  }
  return newPoints;
}

const Home = ({ className }) => {
  const ref = useRef();
  const Morph = useRef();

  useEffect(() => {
    Morph.current = new Morphling();

    // const { shapes } = this.props;

    Morph.current.init('canvas');
    Morph.current.setFigures(figures);

    Morph.current.normolizeFigure = normolizeFigure;

    Morph.current.setInitFill('blue');
    // Morph.setFormFullscreenNow();
    // Morph.setElipseFigure(normolizeFigure(ellipse));
    Morph.current.render();
    // Morph.getIsCursorIntoPoly(this.handleIsInt);

    Morph.current.restoreTheOriginalForm();
    Morph.current.moveCenter(window.innerWidth / 2, window.innerHeight / 2);

    console.log(Morph)
  }, []);

  return (
    <div className={cx(s.root, className)}>

      <div className={s.btns}>
        <button onClick={() => {
          Morph.current?.setFormFullscreen(10) }
        }>open</button>
        <button onClick={() => {
          Morph.current?.restoreTheOriginalForm(10) }
        }>close</button>
      </div>

      <canvas ref={ref} id="canvas" />
      <img className={s.testImg} src="https://images.prom.ua/1065621053_vafelnaya-kartinka-lyubov.jpg" alt=""/>
    </div>
  );
};

Home.propTypes = {
  className: PropTypes.string,
};

Home.defaultProps = {};

export default React.memo(Home);
