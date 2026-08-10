import React from 'react';
import { SvgXml } from 'react-native-svg';
import { nunLogoSvg } from '../../../assets/icons/nunLogo';

const LOGO_WIDTH = 126;
const LOGO_HEIGHT = 101;

const Logo = () => {
  return <SvgXml xml={nunLogoSvg} width={LOGO_WIDTH} height={LOGO_HEIGHT} />;
};

export default Logo;
