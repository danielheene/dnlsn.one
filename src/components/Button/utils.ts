import { Fragment, ReactNode } from 'react';
import {
  SiInstagram,
  SiSnapchat,
  SiSoundcloud,
  SiBeatport,
  SiSpotify,
  SiYoutube,
  SiApplemusic,
} from 'react-icons/si';

export const getIconComponent = (url: string): ReactNode => {
  if (url.includes('instagram')) return SiInstagram;
  if (url.includes('soundcloud')) return SiSoundcloud;
  if (url.includes('spotify')) return SiSpotify;
  if (url.includes('youtube')) return SiYoutube;
  if (url.includes('snapchat')) return SiSnapchat;
  if (url.includes('beatport')) return SiBeatport;
  if (url.includes('music.apple')) return SiApplemusic;

  return Fragment;
};
