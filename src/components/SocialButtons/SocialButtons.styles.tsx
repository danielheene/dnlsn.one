import { css } from '@emotion/core';

export const socialButtonsStyles = {
  list: css`
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
`,
  item: css`
    padding: 0;
    margin: 0 0 1rem 0;
    list-style-type: none;

    &:last-of-type {
      margin-bottom: 0;
    }
`,
};
