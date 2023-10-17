(function () {
  const baseSize = 31;
  const getMath = str => window.matchMedia(str).matches;

  const getSize = () => {
    if (getMath('(max-width: 520px)')) {
      return {
        width: 357,
        height: 667,
      };
    }

    if (getMath('(max-width: 834px) and (min-width: 520px)')) {
      return {
        width: 744,
        height: 1146,
      };
    }

    return {
      width: 1920,
      height: 1080,
    };
  };

  const update = () => {
    const size = getSize();
    const vHeight = window.innerHeight;
    const vWidth = window.innerWidth;

    const differentHeight = vHeight - size.height;
    const differentWidth = vWidth - size.width;
    let scale;

    if (vWidth > size.width && vHeight > size.height) {
      if (vWidth / vHeight <= size.width / size.height) {
        scale = vWidth / size.width;
      } else {
        scale = vHeight / size.height;
      }
    } else {
      if (differentHeight < 0) {
        scale = (size.height - Math.abs(differentHeight)) / size.height;
        if (scale < 0.3) scale = 0.3;
      } else {
        scale = 1;
      }
      if (differentWidth < 0) {
        const scaleWidth = (size.width - Math.abs(differentWidth)) / size.width;

        if (scaleWidth < scale) scale = scaleWidth;
        if (scale < 0.3) scale = 0.3;
      }
    }

    let fontSize = Math.floor(scale * baseSize);
    if (vWidth < size.width || vHeight < size.height) {
      fontSize = fontSize > baseSize ? baseSize : fontSize;
    }

    document.documentElement.style.setProperty('font-size', `${fontSize}px`);
    window.__FONT_SIZE = fontSize;
    window.__FONT_SIZE_SCALE = scale;
    return [fontSize, scale];
  };

  update();
  window.__updateFontSize = update;
})();
