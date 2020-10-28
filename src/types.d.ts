interface SocialLink {
  name: string;
  url: string;
}

interface Config {
  title: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
  socialLinks: SocialLink[];
}
