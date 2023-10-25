import Mouse from './Mouse';
import Ball from './Ball';
import Background from './Background';
import gsap from 'gsap';
import SimplexNoise from 'simplex-noise';

export default class Morphling {
  static instance;

  constructor() {
    if (Morphling.instance) {
      return Morphling.instance;
    }

    this.isElipse = false;
    this.figures = [];
    this.pointsCount = 100;
    this.canvas = null;
    this.ctx = null;
    this.amp = 1;
    this.wavesLength = 35;
    this.waves = [];
    this.balls = [];
    this.shadow = [];
    this.scaledShape = [];
    this.isInto = false;

    this.old = {
      x: null,
      y: null,
    };

    this.offset = {
      x: 100,
      y: 100,
      originalX: 100,
      originalY: 100,
    };

    this.scale = {
      x: 1,
      y: 1,
      originalX: 1,
      originalY: 1,
    };

    this.fadingPoints = [];
    this.processing = false;
    this.Background = new Background(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    this.simplex = new SimplexNoise();
    this.mouse = null;
    this.figureIndex = 0;
    this.isStaticAnimationWork = true;
    this.imageMode = 'colors';
    this.time = 0;
    this.showShadow = true;
    this.isCursorIntoPolyCalback = () => {};
    this.isCursorIntoPoly = false;
    window.addEventListener('resize', this.handleResize);
    Morphling.instance = this;
  }

  handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.Background.setSize(this.canvas.width, this.canvas.height);
  };

  addShapeClickHandler = handleClick => {
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);
  };

  removeShapeClickHandler = handleClick => {
    window.removeEventListener('click', handleClick);
    window.removeEventListener('touchstart', handleClick);
  };

  createWaves = () => {
    this.waves.fill(1);
  };

  // INIT
  init = canvasSelector => {
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
    this.pos.setOffset(this.offset.x, this.offset.y);
    this.old.x = this.pos.x;
    this.old.y = this.pos.y;
    this.mouse = new Ball(0, 0, 50, 'rgba(0,0,0,0)');
    this.fadingPoints = this.createFadingNumbers(0, this.wavesLength);
    this.createWaves();
  };

  // //////////////////////
  // STATIC ANIMATION
  staticAnimation = (balls, time, isNegative, intensive) => {
    for (let i = 0; i < balls.length; i += 1) {
      let realIntensive =
        this.time / 20 <= intensive ? this.time / 20 : intensive;
      if (this.isElipse) {
        realIntensive = 0.05;
      }
      const n =
        realIntensive *
        this.simplex.noise2D(
          balls[i].originalX / 300 + time * 0.005,
          balls[i].originalY / 300 + time * 0.005
        );
      const align = isNegative ? -n : n;
      balls[i].setPos(balls[i].x + align, balls[i].y + align);
    }
  };

  startStaticAnimation = () => {
    this.time = 0;
    this.isStaticAnimationWork = true;
  };

  stopStaticAnimation = () => {
    this.isStaticAnimationWork = false;
    this.time = 0;
    this.changeFigureTo(this.figures[this.figureIndex], 0.1);
  };

  // //////////////////////
  // NOT STANDART SHAPES

  createEmptyFigure = () => {
    const center = this.getCenter(this.balls);
    return Array.from({ length: this.pointsCount }, () => [center.x, center.y]);
  };

  createFadingNumbers = (from, to) => {
    const count = Math.abs(to - from);
    const a = [];
    for (let i = count; i >= 0; i -= 1) {
      a.push(i / (count * 2));
    }
    return a;
  };

  createFullScreenFigure = () => {
    const center = this.getCenter(this.balls);
    const fullScreenFigure = [];
    const side = Math.max(this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.pointsCount; i += 1) {
      fullScreenFigure.push([
        Math.round(
          this.calcX(
            center.x,
            1,
            side * 2,
            i * 2 * (Math.PI / this.pointsCount) - Math.PI / 4
          ),
          1
        ),
        Math.round(
          this.calcY(
            center.y,
            1,
            side * 2,
            i * 2 * (Math.PI / this.pointsCount) - Math.PI / 4
          ),
          1
        ),
      ]);
    }
    return this.normolizeFigure(fullScreenFigure);
  };

  setFormFullscreen = duration => {
    this.changeFigureTo(this.createFullScreenFigure(), duration || 1);
  };

  setElipsoidForm = duration => {
    this.isElipse = true;
    this.changeFigureTo(this.ellipse, duration || 1, () => {
      this.startStaticAnimation();
    });
  };

  setFormFullscreenNow = () => {
    this.changeFigureTo(this.createFullScreenFigure(), 0);
  };

  setFormEmptyState = (duration, calback) => {
    this.stopStaticAnimation();
    this.showShadow = false;
    this.changeFigureTo(this.createEmptyFigure(), duration || 0, calback);
  };

  restoreTheOriginalForm = duration => {
    this.changeFigureTo(this.figures[this.figureIndex], duration || 1, () => {
      this.processing = true;
      this.startStaticAnimation();
    });
  };

  // ////////////////
  // ////////////////

  calcX = (center, radius, d, angle) => center + (radius + d) * Math.cos(angle); // eslint-disable-line

  calcY = (center, radius, d, angle) => center + (radius + d) * Math.sin(angle); // eslint-disable-line

  setElipseFigure = ellipse => {
    this.ellipse = ellipse;
  };

  setScale = (sx, sy, duration = 0) => {
    gsap.to(this.scale, {
      duration,
      x: sx,
      y: sy,
      onComplete: () => {
        this.pos.setScale(this.scale);
      },
    });
  };

  // Эти методы работают в связке
  showFromRight = (duration, offset) => {
    gsap.to(this.offset, {
      duration,
      x: this.offset.originalX - offset,
    });
  };

  showFromLeft = (duration, offset) => {
    gsap.to(this.offset, {
      duration,
      x: this.offset.originalX + offset,
    });
  };

  dropOffset = duration => {
    gsap.to(this.offset, {
      duration,
      x: this.offset.originalX,
    });
  };

  // ////////////

  closeShape = duration => {
    gsap.to(this.scale, {
      duration,
      x: 0,
      y: 0,
    });
  };

  openShape = duration => {
    gsap.to(this.scale, {
      duration,
      x: 1,
      y: 1,
    });
  };

  setContent = content => {
    this.Background.setContent(content);
  };

  setInitFill = fill => {
    this.Background.setInitFill(fill);
  };

  setFigures = figures => {
    this.figures = figures;
    this.pushBalls();
  };

  changeTo = (aliase, duration = 0.3) => {
    this.Background.change(aliase, duration);
  };

  nextImgAndFormTo = (formId, fillAliase, duration) => {
    this.Background.change(fillAliase, duration);
    this.nextFormTo(formId);
  };

  pushBalls = () => {
    for (let i = 0; i < this.pointsCount; i += 1) {
      this.scaledShape.push(
        new Ball(
          this.figures[this.figureIndex][i][0] * 1.1,
          this.figures[this.figureIndex][i][1] * 1.1
        )
      );
      this.balls.push(
        new Ball(
          this.figures[this.figureIndex][i][0],
          this.figures[this.figureIndex][i][1]
        )
      );
      this.shadow.push(
        new Ball(
          this.figures[this.figureIndex][i][0],
          this.figures[this.figureIndex][i][1]
        )
      );
    }
  };

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  };

  getIsCursorIntoPoly = calback => {
    this.isCursorIntoPolyCalback = calback;
  };

  getIsCursorIntoPolyState = () => this.isCursorIntoPoly;

  setImageMode = mode => {
    this.imageMode = mode;
  };

  getCenter = balls => {
    let count = 0;
    let allx = 0;
    let ally = 0;
    const seg = balls;
    for (let i = 0; i < seg.length; i += 1) {
      allx += seg[i].oldX;
      ally += seg[i].oldY;
      count += 1;
    }
    return {
      x: allx / count,
      y: ally / count,
    };
  };

  connectDots = (dots, ctx, fillMode) => {
    ctx.beginPath();
    for (let i = 1, jlen = dots.length; i <= jlen; ++i) {
      // eslint-disable-line
      const p0 =
        dots[
          i + 0 >= jlen
            ? i + 0 - jlen // eslint-disable-line
            : i + 0
        ];
      const p1 =
        dots[
          i + 1 >= jlen
            ? i + 1 - jlen // eslint-disable-line
            : i + 1
        ];
      ctx.quadraticCurveTo(
        p0.x,
        p0.y,
        (p0.x + p1.x) * 0.5,
        (p0.y + p1.y) * 0.5
      );
    }
    ctx.closePath();
    ctx.lineWidth = 1.5;
    if (fillMode === 'stroke') {
      ctx.stroke();
    }
    if (fillMode === 'fill') {
      ctx.save();
      ctx.fill();
      // ctx.lineWidth = 2.5;
      // ctx.strokeStyle = this.Background.getCurentColor();
      // ctx.stroke();
      ctx.restore();
    }
  };

  // //////////////////////
  // MORPHLING

  changeFigureTo = (nextFigurePath, duration, calback) => {
    this.showShadow = true;
    this.isStaticAnimationWork = false;
    this.processing = false;
    if (duration === 0) {
      for (let i = 0; i < this.pointsCount; i += 1) {
        gsap.set(this.balls[i], {
          x: nextFigurePath[i][0],
          y: nextFigurePath[i][1],
          originalX: nextFigurePath[i][0],
          originalY: nextFigurePath[i][1],
        });
        gsap.set(this.shadow[i], {
          x: nextFigurePath[i][0],
          y: nextFigurePath[i][1],
          originalX: nextFigurePath[i][0],
          originalY: nextFigurePath[i][1],
        });
        gsap.set(this.scaledShape[i], {
          x: nextFigurePath[i][0] * 1.1,
          y: nextFigurePath[i][1] * 1.1,
          originalX: nextFigurePath[i][0] * 1.1,
          originalY: nextFigurePath[i][1] * 1.1,
        });
      }
    } else {
      for (let i = 0; i < this.pointsCount; i += 1) {
        gsap.to(
          this.balls[i],

          {
            duration,
            x: nextFigurePath[i][0],
            y: nextFigurePath[i][1],
            originalX: nextFigurePath[i][0],
            originalY: nextFigurePath[i][1],
          }
        );
        gsap.to(
          this.shadow[i],

          {
            duration,
            x: nextFigurePath[i][0],
            y: nextFigurePath[i][1],
            originalX: nextFigurePath[i][0],
            originalY: nextFigurePath[i][1],
          }
        );
        gsap.to(
          this.scaledShape[i],

          {
            duration,
            x: nextFigurePath[i][0] * 1.1,
            y: nextFigurePath[i][1] * 1.1,
            originalX: nextFigurePath[i][0] * 1.1,
            originalY: nextFigurePath[i][1] * 1.1,
          }
        );
      }
    }

    setTimeout(
      () => {
        if (calback) {
          calback();
        }
      },
      duration * 1000 + 100
    );
  };

  // //////////////////////

  moveCenter = (x, y, duration = 0) => {
    gsap.to(
      this.offset,

      {
        duration,
        x,
        y,
        originalX: x,
        originalY: y,
        onComplete: () => {
          this.pos.setOffset(x, y);
        },
      }
    );
  };

  moveCenterNow = (x, y) => {
    this.offset.x = x;
    this.offset.y = y;
    this.pos.setOffset(x, y);
  };

  handleCompleteTransform = () => {};

  calcNearsetPoint = mouse => {
    let nearPointIndex = 0;
    let minDist = Number.MAX_VALUE;
    this.balls.forEach((point, i) => {
      const dx = point.x - mouse.x;
      const dy = point.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= minDist) {
        minDist = dist;
        nearPointIndex = i;
      }
    });
    return {
      nearPointIndex,
      minDist,
      mx: mouse.x,
      my: mouse.y,
    };
  };

  nextFormTo = (id, duration) => {
    this.stopStaticAnimation();
    this.isStaticAnimationWork = false;
    this.processing = false;
    this.isElipse = false;
    this.figureIndex = id;

    this.changeFigureTo(this.figures[this.figureIndex], duration || 1, () => {
      this.processing = true;
      this.startStaticAnimation();
    });
  };

  checkPointDirection = pos => {
    const center = this.getCenter(this.balls);
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return {
      dist,
      dx,
      dy,
    };
  };

  processingPoints = pos => {
    if (this.processing) {
      for (let i = 0; i < this.balls.length; i += 1) {
        this.balls[i].think(pos, 1);
        this.shadow[i].think(pos, 1);
      }
    }
  };

  drawBackground = () => {
    this.Background.draw(this.ctx);
  };

  handleIntersection = (isIntoOld, points) => {
    if (this.processing && !this.isElipse) {
      this.moveShape(isIntoOld);
      const { nearPointIndex } = this.calcNearsetPoint(this.pos);
      let dx = 0;
      let dy = 0;
      let delayL = 1;
      let delayR = 1;
      const lastPointIndexR = nearPointIndex + this.wavesLength;
      let pointIndex = 0;
      for (let i = nearPointIndex; i < lastPointIndexR; i += 1) {
        const realI = i % this.balls.length;
        let vx = 0;
        let vy = 0;
        dx = this.balls[realI].x - this.scaledShape[realI].x;
        dy = this.balls[realI].y - this.scaledShape[realI].y;
        // interaction
        const angle = Math.atan2(dy, dx);
        const tx = this.scaledShape[realI].x + Math.cos(angle);
        const ty = this.scaledShape[realI].y + Math.sin(angle);

        vx +=
          (tx - this.balls[realI].x) * this.fadingPoints[pointIndex] * this.amp;
        vy +=
          (ty - this.balls[realI].y) * this.fadingPoints[pointIndex] * this.amp;

        if (isIntoOld && !this.isInto) {
          vx *= -1;
          vy *= -1;
        }

        setTimeout(() => {
          // eslint-disable-line
          points[realI].setPos(
            // eslint-disable-line
            this.figures[this.figureIndex][realI][0] + vx, // eslint-disable-line
            this.figures[this.figureIndex][realI][1] + vy // eslint-disable-line
          );
        }, delayL);
        delayL += 20;
        pointIndex += 1;
      }
      const lastPointIndexL = nearPointIndex - this.wavesLength;
      pointIndex = 0;
      for (let j = nearPointIndex - 1; j >= lastPointIndexL; j -= 1) {
        const realI =
          j >= 0
            ? j % points.length
            : points.length - Math.abs(j % points.length);
        let vx = 0;
        let vy = 0;
        dx = this.balls[realI].x - this.scaledShape[realI].x;
        dy = this.balls[realI].y - this.scaledShape[realI].y;

        const angle = Math.atan2(dy, dx);
        const tx = this.scaledShape[realI].x + Math.cos(angle);
        const ty = this.scaledShape[realI].y + Math.sin(angle);

        vx +=
          (tx - this.balls[realI].x) * this.fadingPoints[pointIndex] * this.amp;
        vy +=
          (ty - this.balls[realI].y) * this.fadingPoints[pointIndex] * this.amp;

        if (isIntoOld && !this.isInto) {
          vx *= -1;
          vy *= -1;
        }

        setTimeout(() => {
          // eslint-disable-line
          points[realI].setPos(
            // eslint-disable-line
            this.figures[this.figureIndex][realI][0] + vx, // eslint-disable-line
            this.figures[this.figureIndex][realI][1] + vy // eslint-disable-line
          );
        }, delayR);
        delayR += 20;
        pointIndex += 1;
      }
    }
  };

  moveShape = oldIsInto => {
    const pointDirection = this.checkPointDirection(this.pos);
    let dx = 3;
    let dy = 3;
    if (pointDirection.dx > 0) {
      dx *= 1;
    }

    if (pointDirection.dx < 0) {
      dx *= -1;
    }
    if (pointDirection.dy > 0) {
      dy *= 1;
    }

    if (pointDirection.dy < 0) {
      dy *= -1;
    }
    if (!oldIsInto) {
      dx *= -1;
      dy *= -1;
    }
    gsap.to(
      this.offset,

      {
        duration: 0.2,
        x: this.offset.x + dx,
        y: this.offset.y + dy,
        onComplete: () => {
          gsap.to(this.offset, {
            duration: 0.5,
            x: this.offset.x - dx,
            y: this.offset.y - dy,
          });
        },
      }
    );
  };

  drawShape = () => {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale.x, this.scale.y);
    this.connectDots(this.balls, this.ctx, 'fill');
    this.processingPoints(this.pos);

    if (this.isStaticAnimationWork) {
      this.time += 0.5;
      this.staticAnimation(this.balls, this.time, false, 5);
      if (this.showShadow) {
        this.staticAnimation(this.shadow, this.time + 20, true, 10);
      }
    }

    const isIntoOld = this.isInto;
    this.isInto = this.pos.isInto(this.balls);
    if (
      this.isCursorIntoPoly !== this.isInto &&
      this.pos.x !== this.old.x &&
      this.pos.y !== this.old.y
    ) {
      this.old.x = this.pos.x;
      this.old.y = this.pos.y;
      this.handleIntersection(isIntoOld, this.balls, 1);
      if (this.showShadow) {
        this.handleIntersection(isIntoOld, this.shadow, 0.5);
      }
      this.isCursorIntoPoly = this.isInto;
      this.isCursorIntoPolyCalback(this.isInto, true);
    }
    this.ctx.restore();
  };

  drawClipBackground = () => {
    this.ctx.save();
    this.ctx.clip();
    this.drawBackground();
    this.ctx.restore();
  };

  drawShadow = () => {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale.x, this.scale.y);
    // if (this.showShadow) {
    //   this.connectDots(this.shadow, this.ctx, 'stroke');
    // }
    this.ctx.restore();
  };

  render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);

    this.ctx.save();
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalCompositeOperation = 'destination-out';

    this.drawShape();
    this.drawClipBackground();
    this.drawShadow();
    this.ctx.restore();

    // this.ctx.globalCompositeOperation = 'destination-over';
    //
    // this.ctx.save()
    // this.ctx.fillStyle = '#fff';
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.restore()

    window.requestAnimationFrame(this.render);
  };
}
