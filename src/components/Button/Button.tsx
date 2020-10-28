import React, { FC, ReactElement } from 'react';
import { SerializedStyles } from '@emotion/core';
import { buttonStyles } from './Button.styles';
import { getIconComponent } from './utils';

interface ButtonProps {
  css?: SerializedStyles;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon?: string;
}
export const Button: FC<ButtonProps> = ({
  css,
  href,
  target = '_blank',
  children,
}): ReactElement => {
  const Icon = getIconComponent(href.toLowerCase());

  return (
    <a
      css={[buttonStyles.button, css]}
      target={target}
      href={href}
      rel="noopener noreferrer"
    >
      <Icon css={buttonStyles.icon} aria-hidden />
      {children}
    </a>
  );
};
