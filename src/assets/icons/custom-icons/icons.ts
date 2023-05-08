export type IconsId =
  | 'mandalorian';

export type IconsKey =
  | 'Mandalorian';

export enum Icons {
  Mandalorian = 'mandalorian',
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Mandalorian]: '61697',
};
