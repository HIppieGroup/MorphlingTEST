const MouseInteractive = Class =>
  class extends Class {
    #onMouseMove = ({ clientX, clientY }) => {
      const pX = clientX - this.bound.x;
      const pY = clientY - this.bound.y;

      this.mousePosition = [
        pX,
        pY,
        this.mousePosition[0] - pX,
        this.mousePosition[1] - pY,
      ];
    };

    constructor(props) {
      super(props);
      this.mousePosition = [0, 0, 0, 0];

      this.canvas.addEventListener('mousemove', this.#onMouseMove);
    }

    destroy() {
      super.destroy?.();
      this.canvas.removeEventListener('mousemove', this.#onMouseMove);
    }
  };

export default MouseInteractive;
