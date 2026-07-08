import crypto from 'crypto';

import db from '@/lib/db';

export const AUTH_SESSION_COOKIE = 'app_session';
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: number;
  name: string | null;
  email: string;
};

function hashSessionToken(rawToken: string) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function createRawSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: AUTH_SESSION_MAX_AGE,
  };
}

export async function createSession(userId: number) {
  const rawToken = createRawSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + AUTH_SESSION_MAX_AGE * 1000);

  await db.session.deleteMany({
    where: {
      userId,
    },
  });

  await db.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    rawToken,
    expiresAt,
  };
}

export async function getUserBySessionToken(rawToken: string | undefined) {
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  const session = await db.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await db.session.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
}

export async function deleteSessionByToken(rawToken: string | undefined) {
  if (!rawToken) {
    return;
  }

  const tokenHash = hashSessionToken(rawToken);

  await db.session.deleteMany({
    where: {
      tokenHash,
    },
  });
}