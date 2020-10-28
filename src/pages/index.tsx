import React from 'react';

import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { Image } from '../components/Image';
import { SocialButtons } from '../components/SocialButtons';

const IndexPage = (): React.ReactElement => (
  <Layout>
    <Image />
    <SocialButtons />
  </Layout>
);

export default IndexPage;
