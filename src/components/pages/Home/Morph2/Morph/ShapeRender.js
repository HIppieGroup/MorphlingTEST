import Dot from 'pages/Home/Morph2/Morph/Dot';
import SimplexNoise from 'simplex-noise';
import { pathRound } from 'd3-path';

const simplex = new SimplexNoise();

export const calcInfinityPosition = (elPosition, whole, offset) => {
  if (whole === offset) {
    return elPosition;
  }

  return (((elPosition % whole) + whole + offset) % whole) - offset;
};

const ShapeRender = Class =>
  class extends Class {
    constructor(props) {
      super(props);

      const { blob } = props;
      this.path = '';
      this.blob = blob;
      this.dots = this.blob.map(
        pointPosition => new Dot(pointPosition, simplex)
      );

      this.dots.forEach((dot, i) => {
        const prevDot = calcInfinityPosition(i - 1, this.dots.length, 0);
        const nextDote = calcInfinityPosition(i + 1, this.dots.length, 0);

        dot.prevDote = this.dots[prevDot];
        dot.nextDote = this.dots[nextDote];
      });
    }

    render() {
      super.render?.();

      this.ctx.save();

      for (let i = 0; i < this.dots.length; i++) {
        const dot = this.dots[i];

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ff6600';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
      }

      // this.ctx.beginPath();
      // for (let i = 1, jlen = this.dots.length; i <= jlen; ++i) {
      //   const nextPoint = i + 1;
      //   const { x: x0, y: y0 } = this.dots[i >= jlen ? i - jlen : i];
      //   const p1 = this.dots[nextPoint >= jlen ? nextPoint - jlen : nextPoint];
      //   this.ctx.quadraticCurveTo(x0, y0, (x0 + p1.x) * 0.5, (y0 + p1.y) * 0.5);
      // }
      // this.ctx.closePath();

      const path = pathRound(3);
      path.moveTo(this.dots[0].x, this.dots[0].y);

      for (let i = 1, jlen = this.dots.length; i <= jlen; ++i) {
        const nextPoint = i + 1;

        const p0 = this.dots[i >= jlen ? i - jlen : i];
        const p1 = this.dots[nextPoint >= jlen ? nextPoint - jlen : nextPoint];

        path.quadraticCurveTo(
          p0.x,
          p0.y,
          (p0.x + p1.x) * 0.5,
          (p0.y + p1.y) * 0.5
        );
      }

      path.closePath();

      this.path = path.toString();
      this.ctx.stroke();
      this.ctx.restore();
    }
  };

export default ShapeRender;
