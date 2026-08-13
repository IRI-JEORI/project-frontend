const INVITE_CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const createInviteCode = (length = 6) => {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * INVITE_CODE_CHARACTERS.length);
    return INVITE_CODE_CHARACTERS[index];
  }).join('');
};
