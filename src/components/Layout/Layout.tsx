import React, { FC } from 'react';
import { Global } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { containerStyles, globalStyles } from './Layout.styles';
import { SEO } from '../SEO';

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <SEO />
      <Global styles={globalStyles} />
      <main css={containerStyles}>{children}</main>
    </>
  );
};
