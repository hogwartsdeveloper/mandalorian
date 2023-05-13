export type IconsId =
  | 'github'
  | 'linkedin'
  | 'mandalorian'
  | 'sound-off'
  | 'sound';

export type IconsKey =
  | 'Github'
  | 'Linkedin'
  | 'Mandalorian'
  | 'SoundOff'
  | 'Sound';

export enum Icons {
  Github = 'github',
  Linkedin = 'linkedin',
  Mandalorian = 'mandalorian',
  SoundOff = 'sound-off',
  Sound = 'sound',
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Github]: '61697',
  [Icons.Linkedin]: '61698',
  [Icons.Mandalorian]: '61699',
  [Icons.SoundOff]: '61700',
  [Icons.Sound]: '61701',
};
