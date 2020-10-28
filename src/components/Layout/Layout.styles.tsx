import { css } from '@emotion/core';
import { config } from '../../utils/config';

export const globalStyles = css`
  html {
    box-sizing: border-box;
    overflow-y: scroll;
    font-family:
      'Staatliches',
      -apple-system,
      BlinkMacSystemFont,
      Segoe UI,
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      Fira Sans,
      Droid Sans,
      Helvetica Neue,
      sans-serif;
    font-size: 62.5%;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 2.5rem;
    margin: 0;
    font-weight: normal;
    color: ${config.colors.primary};
    word-wrap: break-word;
    user-select: none;
    background-color: ${config.colors.secondary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-kerning: normal;
    font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  }

  * {
    box-sizing: border-box;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
  }

  audio,
  canvas,
  progress,
  video {
    display: inline-block;
  }

  audio:not([controls]) {
    display: none;
    height: 0;
  }
`;

export const containerStyles = css`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-row-gap: 6rem;
`;
