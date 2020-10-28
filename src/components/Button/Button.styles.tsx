import { css } from '@emotion/core';
import { config } from '../../utils/config';

export const buttonStyles = {
  button: css`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 5rem;
    padding-top: 0.3%;
    font-size: 3.8rem;
    font-weight: 400;
    color: ${config.colors.primary};
    text-decoration: none;
    background-color: ${config.colors.secondary};
`,
  icon: css`
    margin-right: 1rem;
    font-size: 80%;
`,
};
