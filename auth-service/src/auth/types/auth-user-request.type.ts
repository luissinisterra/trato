import { Request } from 'express';

export type AuthUserPayload = {
  sub: number;
  email: string;
};

export type AuthUserRequest = Request & {
  user?: AuthUserPayload;
  cookies: {
    refreshToken?: string;
  };
};
