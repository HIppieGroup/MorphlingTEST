import Dot, { clamp, subtraction } from './Dot';
import ShapeRender from 'pages/Home/Morph2/Morph/ShapeRender';
import Base from 'pages/Home/Morph2/Morph/Base';
import MouseInteractive from 'pages/Home/Morph2/Morph/MouseInteractive';
import { gsap } from 'gsap';
import sortBy from 'lodash.sortby';
import SimplexNoise from 'simplex-noise';

// this.dots.forEach(dot => dot.render(this.time));

export const inPoly = ([x, y], matrix) => {
  const npol = matrix.length;
  let j = npol - 1;
  let c = 0;
  for (let i = 0; i < npol; i += 1) {
    // eslint-disable-next-line
    if (
      ((matrix[i][1] <= y && y < matrix[j][1]) ||
        (matrix[j][1] <= y && y < matrix[i][1])) &&
      x >
        ((matrix[j][0] - matrix[i][0]) * (y - matrix[i][1])) /
          (matrix[j][1] - matrix[i][1]) +
          matrix[i][0]
    ) {
      c = !c;
    }
    j = i;
  }
  return c;
};

export default class Core extends ShapeRender(MouseInteractive(Base)) {
  constructor(props) {
    super(props);

    console.log(this);
  }

  setFormFullscreen = () => {
    const { innerHeight, innerWidth } = window;

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    gsap.to(this.dots, {
      ease: 'power3.out',
      duration: 3,
      animationProgress: 1,
      y: i => {
        const dot = this.dots[i];

        const angl1 = Math.atan2(dot.x - centerX, dot.y - centerY);
        const bottom = innerHeight - dot.y;
        const right = innerWidth - dot.x;

        let y = dot.y;
        if (bottom < dot.y) y = bottom;

        let x = dot.x;
        if (right < dot.x) x = right;

        return clamp(
          dot.y + Math.cos(angl1) * Math.sqrt(x ** 2 + y ** 2),
          0,
          innerHeight
        );
      },
      x: i => {
        const dot = this.dots[i];

        const angl1 = Math.atan2(dot.x - centerX, dot.y - centerY);
        const bottom = innerHeight - dot.y;
        const right = innerWidth - dot.x;

        let y = dot.y;
        if (bottom < dot.y) y = bottom;

        let x = dot.x;
        if (right < dot.x) x = right;

        return clamp(
          dot.x + Math.sin(angl1) * Math.sqrt(x ** 2 + y ** 2),
          0,
          innerWidth
        );
      },
    });

    // this.dots.forEach((dot, i) => {
    //   const distToTop = dot.y;
    //   const distToBottom = innerHeight - dot.y;
    //
    //   if (distToTop < distToBottom) {
    //     dot.y = 0;
    //   } else {
    //     dot.y = innerHeight;
    //   }
    // });
  };

  restoreTheOriginalForm = () => {};

  render() {
    let distX = 0;
    let distY = 0;

    const matrix = this.dots.map(p => [p.x, p.y]);
    const inShape = Boolean(inPoly(this.mousePosition, matrix));

    this.dots.forEach(dot => {
      const [dX, dY] = subtraction([dot.x, dot.y], dot.position);

      if (Math.abs(dX) > Math.abs(distX)) {
        distX = dX;
      }

      if (Math.abs(dY) > Math.abs(distY)) {
        distY = dY;
      }

      dot.changePosition(this.mousePosition, inShape);
      dot.render(this.time);
    });

    // this.dots.forEach(dot => {
    //   dot.shiftDot(distX * 3, distY * 3);
    // });

    super.render?.();
  }
}
