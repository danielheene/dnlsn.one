import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { config } from '../../utils/config';

export const SEO = (): ReactElement => (
  <Helmet
    htmlAttributes={{
      lang: 'en',
    }}
    title={config.title}
    meta={[
      {
        name: 'description',
        content: config.description,
      },
      {
        property: 'og:title',
        content: config.title,
      },
      {
        property: 'og:description',
        content: config.description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
    ]}
  />
);
