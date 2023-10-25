export default class Base {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bound = { x: 0, y: 0, width: 0, height: 0 };
    this.time = 0;
    this.resize();
  }

  resize() {
    const resolution = Math.min(window.devicePixelRatio || 1, 2);

    this.bound = this.canvas.getBoundingClientRect();
    this.canvas.width = this.bound.width * resolution;
    this.canvas.height = this.bound.height * resolution;
    this.ctx.scale(resolution, resolution);
  }

  render() {
    this.time += 0.5;
    this.ctx.clearRect(0, 0, this.bound.width, this.bound.height);
  }
}
