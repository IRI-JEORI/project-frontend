import React from 'react';
import { SvgXml } from 'react-native-svg';
import { nunLogoSvg } from '../../assets/icons/nunLogo';
import { colors } from '../../theme/tokens';

export interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const DEFAULT_WIDTH = 126;
const DEFAULT_HEIGHT = 101;

const Logo = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = colors.cream,
}: LogoProps) => {
  return <SvgXml xml={nunLogoSvg} width={width} height={height} color={color} />;
};

export default Logo;
