export type AuthUser = {
  issuer: string;
  publicAddress: string;
  email: string;
  isMfaEnabled: boolean;
  phoneNumber: null | string;
};

export type UserResponse = {
  jwt: string;
  user: AuthUser;
};
