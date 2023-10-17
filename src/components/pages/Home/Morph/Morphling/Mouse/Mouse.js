import { inPoly } from '../lib/common';

export default class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.scale = {
      x: 1,
      y: 1,
    };
    this.oldX = 0;
    this.oldY = 0;
    window.onmousemove = this.handleMove;
    window.ontouchmove = this.handleMove;
  }

  handleMove = (e) => {
    this.oldX = this.x;
    this.oldY = this.y;
    this.x = ((e.clientX || e.pageX) - this.dx) / this.scale.x;
    this.y = ((e.clientY || e.pageY) - this.dy) / this.scale.y;
  };

  setOffset(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  setScale(scale) {
    this.scale.x = scale.x;
    this.scale.y = scale.y;
  }

  isInto(balls) {
    const matrix = balls.map(p => [p.x, p.y]);
    return Boolean(inPoly(this.x, this.y, matrix));
  }

  isIntoArr(points) {
    const matrix = points.map(p => [p[0], p[1]]);
    return Boolean(inPoly(this.x, this.y, matrix));
  }
}
