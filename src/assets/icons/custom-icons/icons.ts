export type IconsId =
  | 'github'
  | 'linkedin'
  | 'mandalorian';

export type IconsKey =
  | 'Github'
  | 'Linkedin'
  | 'Mandalorian';

export enum Icons {
  Github = 'github',
  Linkedin = 'linkedin',
  Mandalorian = 'mandalorian',
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Github]: '61697',
  [Icons.Linkedin]: '61698',
  [Icons.Mandalorian]: '61699',
};
