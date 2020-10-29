declare module 'inquirer-maxlength-input-prompt';

interface SocialLink {
  name: string;
  url: string;
}

interface Config {
  title: string;
  url?: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
  socialLinks: SocialLink[];
}
