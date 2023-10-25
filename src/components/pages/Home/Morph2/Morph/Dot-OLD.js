const calcArray = (arr1, arr2, fun) =>
  arr1.map((el, i) => fun(el, Array.isArray(arr2) ? arr2[i] : arr2));

export const addition = (p1, p2) => calcArray(p1, p2, (a, b) => a + b);
export const division = (p1, p2) =>
  calcArray(p1, p2, (a, b) => (Number.isFinite(a / b) ? a / b : 0));
export const multiplication = (p1, p2) => calcArray(p1, p2, (a, b) => a * b);
export const subtraction = (p1, p2) => calcArray(p1, p2, (a, b) => a - b);

export const clamp = (x, minVal, maxVal) => {
  return Math.min(Math.max(x, minVal), maxVal);
};

export default class Dot {
  constructor(position, simplex) {
    this.animationProgress = 0;
    this.originalPosition = [position[0], position[1]];
    this.position = [...this.originalPosition];
    this.simplex = simplex;

    const [x, y] = this.position;

    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;
    this.intensiveNoise = 0.4;
    this.friction = 0.94;
    this.springFactor = 0.1;

    this.prevDote = null;
    this.nextDote = null;
  }

  setPos = (x, y) => {
    this.x = x;
    this.y = y;
  };

  shiftDot = (dX, dY) => {
    this.position = addition(this.position, [dX * 0.01, dY * 0.01]);
  };

  changePosition = (mousePosition, inShape) => {
    const [x, y, mdX, mdY] = mousePosition;

    // if (inShape) {
    const [dX, dY] = subtraction([this.x, this.y], mousePosition);

    let dist = Math.sqrt(dX * dX + dY * dY);
    // interaction
    const power = 1 - clamp(dist / 100, 0, 1);

    // console.log(power);
    const angle = Math.atan2(dY, dX);
    // let tx = x + Math.cos(angle) * 30;
    // let ty = y + Math.sin(angle) * 30;
    //
    // this.vx += tx - this.x;
    // this.vy += ty - this.y;
    //
    // this.vx *= power ** 4;
    // this.vy *= power ** 4;

    this.position = [
      this.originalPosition[0] + x,
      this.originalPosition[1] + y,
    ];
    // }

    // this.setPos(this.x - this.vx, this.y - this.vy);

    const [nextDX, nextDY] = subtraction(
      [this.x, this.y],
      [this.nextDote.x, this.nextDote.y]
    );

    const [prevDX, prevDY] = subtraction(
      [this.x, this.y],
      [this.prevDote.x, this.prevDote.y]
    );

    const [nextOriginalDX, nextOriginalDY] = subtraction(
      this.originalPosition,
      this.nextDote.originalPosition
    );

    const [prevOriginalDX, prevOriginalDY] = subtraction(
      this.originalPosition,
      this.prevDote.originalPosition
    );

    const orDistPrev = Math.sqrt(
      prevOriginalDX * prevOriginalDX + prevOriginalDY * prevOriginalDY
    );
    const orDistNext = Math.sqrt(
      nextOriginalDX * nextOriginalDX + nextOriginalDY * nextOriginalDY
    );

    const curDistPrev = Math.sqrt(prevDX * prevDX + prevDY * prevDY);
    const curDistNext = Math.sqrt(nextDX * nextDX + nextDY * nextDY);

    const distPrev = clamp((curDistPrev - orDistPrev) / orDistPrev, 0, 1);
    const distNext = clamp((curDistNext - orDistNext) / orDistNext, 0, 1);

    const blend1 = 0.4;

    // посчитать пересечение по линии

    this.x += (this.nextDote.x - this.x) * blend1 * distNext;
    this.y += (this.nextDote.y - this.y) * blend1 * distNext;

    this.x += (this.prevDote.x - this.x) * blend1 * distPrev;
    this.y += (this.prevDote.y - this.y) * blend1 * distPrev;

    const distOriginX = this.position[0] - this.x;
    const distOriginY = this.position[1] - this.y;

    const percent = distNext * distPrev;
    //
    this.x += distOriginX * 0.1 * (1 - percent);
    this.y += distOriginY * 0.1 * (1 - percent);
  };

  calcNoise = time => {
    const n =
      this.intensiveNoise *
      this.simplex.noise2D(
        this.originalPosition[0] / 300 + time * 0.01,
        this.originalPosition[1] / 300 + time * 0.01
      );

    this.setPos(this.x + n, this.y + n);
  };

  render = time => {
    this.calcNoise(time);
    // this.calcFriction();
  };
}
