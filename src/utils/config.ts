import deepmerge from 'deepmerge';
import conf from '../../config.json';

const defaultConf: Config = {
  title: '',
  description: '',
  colors: {
    primary: '#000',
    secondary: '#fff',
  },
  socialLinks: [],
};

export const config: Config & {
  [key: string]: unknown;
} = deepmerge(defaultConf, conf as Partial<Config>);
