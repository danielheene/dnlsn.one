import React, { FC, ReactElement } from 'react';

interface ButtonProps {
  target?: string;
}

export const Button: FC<ButtonProps> = ({
                                          target = '_blank',
                                          children,
                                        }): ReactElement => (
  <a target={target}>
    {children}
  </a>
);
