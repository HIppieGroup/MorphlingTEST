import 'styles/reset.scss';
import 'styles/fonts.scss';
import 'styles/root.scss';
import 'styles/globals.scss';

import MediaHelper from 'components/MediaHelper';

const MyApp = ({ Component, pageProps }) => {
  return (
    <MediaHelper>
      <Component {...pageProps} />
    </MediaHelper>
  );
};

export default MyApp;
