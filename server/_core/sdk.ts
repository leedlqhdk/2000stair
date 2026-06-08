import { AXIOS_TIMEOUT_MS, COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { ForbiddenError } from "../../shared/_core/errors.js";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema.js";
import * as db from "../db.js";
import { ENV } from "./env.js";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes.js";

type RequestLike = {
  headers?: {
    cookie?: string;
  };
};

const PASSWORD_ADMIN_OPEN_ID = "admin-password:leedlqhdk@gmail.com";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const createPasswordAdminUser = (openId: string): User => {
  const now = new Date();
  return {
    id: 0,
    openId,
    name: "이천계단지기 관리자",
    email: ENV.adminEmail,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
};

export type SessionPayload = {
  openId: string;
  appId: string;
  name?: string | null;
};

type SignSessionOptions = {
  expiresInMs?: number;
};

export class Sdk {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.manusApiUrl,
      timeout: AXIOS_TIMEOUT_MS,
    });
  }

  private parseCookies(cookieHeader: string | undefined) {
    return new Map(Object.entries(cookieHeader ? parseCookieHeader(cookieHeader) : {}));
  }

  async signSession(payload: SessionPayload, options: SignSessionOptions = {}) {
    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;

    return await new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + expiresInMs))
      .sign(secret);
  }

  async verifySession(token: string | undefined): Promise<SessionPayload | null> {
    if (!isNonEmptyString(token)) return null;

    try {
      const secret = new TextEncoder().encode(ENV.cookieSecret);
      const { payload } = await jwtVerify(token, secret);

      const openId = payload.openId;
      const appId = payload.appId;
      const name = payload.name;

      if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
        return null;
      }

      return {
        openId,
        appId,
        name: typeof name === "string" ? name : null,
      };
    } catch (error) {
      return null;
    }
  }

  private deriveLoginMethod(platforms: unknown, fallback: unknown) {
    if (Array.isArray(platforms)) {
      const first = platforms.find((platform) => typeof platform === "string" && platform.length > 0);
      if (first) return first;
    }

    if (typeof fallback === "string" && fallback.length > 0) {
      return fallback;
    }

    return "unknown";
  }

  async exchangeToken(code: string): Promise<ExchangeTokenResponse> {
    const payload: ExchangeTokenRequest = {
      code,
      projectId: ENV.appId,
    };

    const { data } = await this.client.post<ExchangeTokenResponse>("/auth/exchange-token", payload);
    return data;
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const { data } = await this.client.get<GetUserInfoResponse>("/auth/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }

  async getUserInfoWithJwt(jwtToken: string): Promise<GetUserInfoWithJwtResponse> {
    const payload: GetUserInfoWithJwtRequest = {
      jwtToken,
      projectId: ENV.appId,
    };

    const { data } = await this.client.post<GetUserInfoWithJwtResponse>("/auth/userinfo-jwt", payload);
    const loginMethod = this.deriveLoginMethod(
      (data as any)?.platforms,
      (data as any)?.platform ?? data.platform ?? null
    );
    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoWithJwtResponse;
  }

  async authenticateRequest(req: RequestLike): Promise<User> {
    const cookies = this.parseCookies(req.headers?.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const signedInAt = new Date();
    let user = await db.getUserByOpenId(session.openId);

    if (!user && session.openId === PASSWORD_ADMIN_OPEN_ID) {
      return createPasswordAdminUser(session.openId);
    }

    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        user = await db.upsertUser({
          openId: session.openId,
          name: userInfo.name || session.name || null,
          email: userInfo.email || null,
          loginMethod: userInfo.loginMethod || userInfo.platform || "unknown",
          role: "user",
          lastSignedIn: signedInAt,
        });
      } catch (error) {
        throw ForbiddenError("Invalid session cookie");
      }
    } else {
      await db.updateLastSignedIn(user.id, signedInAt);
    }

    return user;
  }
}

export const sdk = new Sdk();
