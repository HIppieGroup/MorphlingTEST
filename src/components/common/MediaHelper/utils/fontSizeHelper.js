/*
import { DESKTOP, TABLET, MOBILE } from "../constants";

const props = {
  bp: {
    [MOBILE]: {
      width: 375,
      height: 752,
      fontSize: 31,
    },
    [TABLET]: {
      width: 834,
      height: 1073,
      fontSize: 31,
    },
    [DESKTOP]: {
      width: 1920,
      height: 1080,
      fontSize: 31,
    },
  },
};

// prettier-ignore
const update = (bp = DESKTOP, isScreenSize) => {
  const desktop = props.bp[bp];

  const viewportHeight = isScreenSize ? window.screen.height : window.innerHeight;

  const viewportWidth = window.innerWidth;
  const contentBoxWidth = props.bp[bp].width;
  const contentBoxHeight = props.bp[bp].height;
  const baseFontSize = props.bp[bp].fontSize;
  const differentHeight = viewportHeight - contentBoxHeight;
  const differentWidth = viewportWidth - contentBoxWidth;
  let scale;

  if (viewportWidth > contentBoxWidth && viewportHeight > contentBoxHeight) {
    if (viewportWidth / viewportHeight <= contentBoxWidth / contentBoxHeight) {
      scale = viewportWidth / contentBoxWidth;
    } else {
      scale = viewportHeight / contentBoxHeight;
    }
  } else {
    if (differentHeight < 0) {
      scale = (contentBoxHeight - Math.abs(differentHeight)) / contentBoxHeight;
      if (scale < 0.3) {
        scale = 0.3;
      }
    } else {
      scale = 1;
    }
    if (differentWidth < 0) {
      const scallWidth = (contentBoxWidth - Math.abs(differentWidth)) / contentBoxWidth;

      if (scallWidth < scale) {
        scale = scallWidth;
      }
      if (scale < 0.3) {
        scale = 0.3;
      }
    }
  }

  let fontSize = Math.floor(scale * baseFontSize);

  if (viewportWidth < desktop.width || viewportHeight < desktop.height) {
    fontSize = fontSize > baseFontSize ? baseFontSize : fontSize;
  }

  return [fontSize, scale];
};

export default update;
*/
