'use client';

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

defineElement(lottie.loadAnimation);

export type LordIcontrigger =
  | 'hover'
  | 'click'
  | 'loop'
  | 'loop-on-hover'
  | 'morph'
  | 'morph-two-way'
  | 'intro';

export type LordIconColors = {
  primary?: string;
  secondary?: string;
};

export type LordIconProps = {
  src?: string;
  trigger?: LordIcontrigger;
  colors?: LordIconColors;
  delay?: number;
  size?: number;
  target?: string;
};

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  trigger,
  colors,
  delay,
  size,
  target,
}) => {
  return (
    <lord-icon
      colors={`primary:${colors?.primary},secondary:${colors?.secondary}`}
      src={src}
      trigger={trigger}
      delay={delay}
      target={target}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
