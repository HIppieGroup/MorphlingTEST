// import fontSizeHelper from "./fontSizeHelper";
import {
  DESKTOP,
  MOBILE,
  MOBILE_MEDIA_QUERY,
  TABLET,
  TABLET_MEDIA_QUERY,
} from '../constants';

export const getViewport = (mediaMobile, mediaTablet) => {
  if (mediaMobile.matches) {
    return MOBILE;
  }

  if (mediaTablet?.matches) {
    return TABLET;
  }

  return DESKTOP;
};

export const onCheckViewport = () => {
  const mediaQueryMobile = window.matchMedia(MOBILE_MEDIA_QUERY);
  const mediaQueryTablet = window.matchMedia(TABLET_MEDIA_QUERY);

  return getViewport(mediaQueryMobile, mediaQueryTablet);
};

export const onCheckCursor = () =>
  !window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// export const setFontSize = (currentViewport, isScreenSize = true) => {
//   const [currentFontSize, fzScale] = fontSizeHelper(
//     currentViewport,
//     isScreenSize
//   );
//   document.documentElement.style.setProperty(
//     "font-size",
//     `${currentFontSize}px`
//   );
//   window.__FONT_SIZE = currentFontSize;
//   window.__FONT_SIZE_SCALE = fzScale;
// };
