import { useContext } from 'react';
import { MediaHelperContext } from '../MediaHelper';

const useViewport = () => {
  return useContext(MediaHelperContext);
};

export default useViewport;
