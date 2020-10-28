import portraitImage from './image.jpg';
import React, { ReactElement } from 'react';
import { imageStyles } from './Image.styles';

export const Image = (): ReactElement => (
  <img css={imageStyles} src={portraitImage} alt="" aria-hidden />
);
