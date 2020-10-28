import { config } from '../../utils/config';
import { Button } from '../Button';
import React, { ReactElement } from 'react';
import { socialButtonsStyles } from './SocialButtons.styles';

export const SocialButtons = (): ReactElement => {
  return (
    <ul css={socialButtonsStyles.list}>
      {config.socialLinks.map(({ name, url }, index) => {
        const key = name.replace(/\s\s+/g, '').toLowerCase() + index;

        return (
          <li key={key} css={socialButtonsStyles.item}>
            <Button href={url}>{name}</Button>
          </li>
        );
      })}
    </ul>
  );
};
