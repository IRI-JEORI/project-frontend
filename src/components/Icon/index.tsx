import React from 'react';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../theme/tokens';

export interface IconProps {
  xml: string;
  size?: number;
  color?: string;
}

const DEFAULT_SIZE = 24;

const Icon = ({ xml, size = DEFAULT_SIZE, color = colors.brownDarkest }: IconProps) => {
  return <SvgXml xml={xml} width={size} height={size} color={color} />;
};

export default Icon;
