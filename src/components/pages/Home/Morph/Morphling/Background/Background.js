import { drawImageProp, getNextItemIndex } from '../lib/common';
import { gsap } from 'gsap';

export default class Background {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.images = [];
    this.imageIndexes = [0, 1];
    this.currentImg = null; // eslint-disable-line
    this.currentColor = null; // eslint-disable-line
    this.images = [];
    this.colors = [];
    // content types  - 'images', 'colors'
    this.mode = 'colors';
    this.colorIndexes = [0, 1];
    this.isImageFading = false;
    this.isFirstClick = true;
    this.ga = { globalAlpha: 1 };
    this.imageTimeline = new gsap.timeline();
    this.content = [];
    this.curentFill = null;
    this.nextFill = null;
  }

  setSize = (width, height) => {
    this.width = width || this.width;
    this.height = height || this.height;
  }

  setPosition = (x, y) => {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  nextImg = () => {
    if (this.isImageFading) return;
    this.isImageFading = true;
    if (!this.isFirstClick) {
      if (this.mode === 'colors') {
        this.colorIndexes[0] = this.colorIndexes[1]; // eslint-disable-line
        this.colorIndexes[1] = getNextItemIndex(this.colorIndexes[0], this.colors);
      }
      if (this.mode === 'images') {
        this.imageIndexes[0] = this.imageIndexes[1]; // eslint-disable-line
        this.imageIndexes[1] = getNextItemIndex(this.imageIndexes[0], this.images);
      }
    }
    this.isFirstClick = false;
    this.changeImage(this.handleCompleteImageAnimation);
  }

  changeTo = (id, duration) => {
    if (this.isImageFading) return;
    this.isImageFading = true;
    if (!this.isFirstClick) {
      if (this.mode === 'colors') {
        this.colorIndexes[0] = this.colorIndexes[1]; // eslint-disable-line
        this.colorIndexes[1] = id;
      }
      if (this.mode === 'images') {
        this.imageIndexes[0] = this.imageIndexes[1]; // eslint-disable-line
        this.imageIndexes[1] = id;
      }
    }
    this.isFirstClick = false;
    this.changeImage(this.handleCompleteImageAnimation, duration);
  }

  changeImage = (calback, duration = 0.3) => {
    this.imageTimeline.fromTo(
      this.ga,
      duration,
      { globalAlpha: 1, ease: 'power1.inOut'  },
      { globalAlpha: 0, ease: 'power1.inOut'  },
    )
      .eventCallback('onComplete', calback);
  }

  setContent = (content) => {
    this.content = content;
  }

  setInitFill = (fill) => {
    this.curentFill = fill;
  }

  handleCompleteImageAnimation = () => {
    this.isImageFading = false;
  }

  drawCoveredImage = (ctx, fill) => {
    drawImageProp(
      ctx,
      fill,
      0,
      0,
      this.width,
      this.height,
    );
  }

  change = (next, duration) => {
    this.nextFill = next;
    this.changeImage(() => {
      this.curentFill = next;
      this.nextFill = null;
    },
    duration);
  }

  draw = (ctx) => {
    if (this.nextFill) {
      const fill = this.content.filter(item => (this.nextFill === item.aliase));
      if (fill.length !== 0) {
        if (fill[0].type === 'color') {
          ctx.fillStyle = fill[0].fill;
          ctx.fillRect(0, 0, this.width, this.height);
        }
        if (fill[0].type === 'image') {
          this.drawCoveredImage(ctx, fill[0].fill);
        }
      }
      ctx.globalAlpha = this.ga.globalAlpha;
    }
    if (this.curentFill) {
      const fill = this.content.filter(item => (this.curentFill === item.aliase));
      if (fill.length !== 0) {
        if (fill[0].type === 'color') {
          ctx.fillStyle = fill[0].fill;
          ctx.fillRect(0, 0, this.width, this.height);
        }
        if (fill[0].type === 'image') {
          this.drawCoveredImage(ctx, fill[0].fill);
        }
        ctx.globalAlpha = 1;
      }
    }
  }
}
