import { svgPathProperties } from 'svg-path-properties';

const getCenter = points => {
  let count = 0;
  let allx = 0;
  let ally = 0;
  for (let i = 0; i < points.length; i += 1) {
    allx += points[i][0];
    ally += points[i][1];
    count += 1;
  }
  return {
    x: allx / count,
    y: ally / count,
  };
};

const setOffsetFigure = (points, center) => {
  const newPoints = points.map(point => [
    point[0] - center.x,
    point[1] - center.y,
  ]);
  return newPoints;
};

export const getPoints = pathString => {
  const path = new svgPathProperties(pathString);
  const points = [];

  for (let i = 0; i < 100; i += 1) {
    const point = path.getPointAtLength((i / 100) * path.getTotalLength());
    points.push([point.x, point.y]);
  }
  const center = getCenter(points);
  const shiftedPoints = setOffsetFigure(points, center);
  return shiftedPoints;
};
