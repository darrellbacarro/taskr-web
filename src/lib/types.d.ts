import React from 'react';

type LordIconTrigger =
  | 'hover'
  | 'click'
  | 'loop'
  | 'loop-on-hover'
  | 'morph'
  | 'morph-two-way'
  | 'intro';

type LordIconProps = {
  src?: string;
  trigger?: LordIconTrigger;
  colors: string;
  delay?: string | number;
  target?: string;
};

type LordElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & LordIconProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': LordElement;
    }
  }
}
