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

export const mix = (x, y, a) => {
  return x * (1 - a) + y * a;
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
    this.intensiveNoise = 1.2;
    this.friction = 0.94;
    this.springFactor = 0.1;

    this.prevDote = null;
    this.nextDote = null;
  }

  setPos = (x, y) => {
    this.x = x;
    this.y = y;
  };

  changePosition = mousePosition => {
    const [x, y, mdX, mdY] = mousePosition;

    // if (inShape) {
    const [dX, dY] = subtraction([this.x, this.y], mousePosition);

    let dist = Math.sqrt(dX * dX + dY * dY);

    const powerLine = 0.32;
    // interaction
    let power = mix(0.01, 0.35, 1 - clamp(dist / 100, 0, 1));
    power += mix(0, 0.05, 1 - clamp(dist / 50, 0, 1));
    power += mix(0, 0.1, 1 - clamp(dist / 200, 0, 1));
    power += mix(0, 0.1, 1 - clamp(dist / 300, 0, 1));

    // console.log(power);

    //
    // this.vx += tx - this.x;
    // this.vy += ty - this.y;
    //
    // this.vx *= power ** 4;
    // this.vy *= power ** 4;

    // }

    // this.setPos(this.x - this.vx, this.y - this.vy);

    const [nextOriginalDX, nextOriginalDY] = subtraction(
      this.originalPosition,
      this.nextDote.originalPosition
    );

    const [prevOriginalDX, prevOriginalDY] = subtraction(
      this.originalPosition,
      this.prevDote.originalPosition
    );

    const [prevDX, prevDY] = subtraction(
      [this.x, this.y],
      [this.prevDote.x, this.prevDote.y]
    );

    const orDistPrev = Math.sqrt(prevOriginalDX ** 2 + prevOriginalDY ** 2);
    const curDistPrev = Math.sqrt(prevDX ** 2 + prevDY ** 2);

    let powerPrev = (curDistPrev - orDistPrev) / orDistPrev;

    this.x +=
      (this.prevDote.x - this.x) *
      clamp(powerPrev * powerLine, 0, 0.8) *
      (1 - power);
    this.y +=
      (this.prevDote.y - this.y) *
      clamp(powerPrev * powerLine, 0, 0.8) *
      (1 - power);

    const [nextDX, nextDY] = subtraction(
      [this.x, this.y],
      [this.nextDote.x, this.nextDote.y]
    );

    const orDistNext = Math.sqrt(nextOriginalDX ** 2 + nextOriginalDY ** 2);
    const curDistNext = Math.sqrt(nextDX ** 2 + nextDY ** 2);

    let powerNext = (curDistNext - orDistNext) / orDistNext;

    const angleNext = Math.atan2(nextDX, nextDY);
    const anglePrev = Math.atan2(prevDX, prevDY);

    const blend1 = 0.05;

    // посчитать пересечение по линии

    const nextPosition = [
      this.originalPosition[0] + x,
      this.originalPosition[1] + y,
    ];

    this.position = nextPosition;

    // this.y += Math.sin(angleNext) * difDistNext * 0.2;

    const n =
      this.intensiveNoise *
      this.simplex.noise2D(
        this.position[0] / 300 + this.time * 0.01,
        this.position[1] / 300 + this.time * 0.01
      );

    // this.x -= (prevDX - prevOriginalDX) * 0.001;
    // this.y -= (prevDY - prevOriginalDY) * 0.001;

    // this.x += (nextDX - nextOriginalDX) * 0.001;
    // this.y += (nextDY - nextOriginalDY) * 0.001;

    this.x +=
      (this.nextDote.x - this.x) *
      clamp(powerNext * powerLine, 0, 0.5) *
      (1 - power);
    this.y +=
      (this.nextDote.y - this.y) *
      clamp(powerNext * powerLine, 0, 0.5) *
      (1 - power);
    //

    const distOriginX = this.position[0] - this.x;
    const distOriginY = this.position[1] - this.y;

    this.x += distOriginX * power;
    this.y += distOriginY * power;

    this.x += n;
    this.y += n;
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
    this.time = time;
    // this.calcFriction();
  };
}
