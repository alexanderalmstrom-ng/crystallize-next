import { cookies } from "next/headers";
import z from "zod";
import { env } from "@/env";
import { AUTH_TOKEN_EXPIRATION_TIME, decrypt, encrypt } from "@/utils/auth";
import { getBaseURL } from "@/utils/common";

export const getAuthToken = async () => {
  const coookieToken = z
    .string()
    .min(1)
    .safeParse((await cookies()).get("token")?.value);

  // If the cookie does not exist as a cookie, create a new token and set it in a new cookie
  if (!coookieToken.success) {
    const response = await refreshAuthToken();

    return {
      token: response.token,
      decryptedToken: response.decryptedToken,
    };
  }

  // Check if the token is valid and has not expired, if not, refresh the token
  try {
    await decrypt(coookieToken.data);
    const decryptedToken = z
      .string()
      .safeParse((await decrypt(coookieToken.data))?.token);

    return {
      token: coookieToken.data,
      decryptedToken: decryptedToken.data,
    };
  } catch {
    const refreshTokenResponse = await refreshAuthToken();

    return {
      token: refreshTokenResponse.token,
      decryptedToken: refreshTokenResponse.decryptedToken,
    };
  }
};

export const refreshAuthToken = async () => {
  const response = await fetch(`${getBaseURL()}/api/auth-token`, {
    method: "POST",
    body: JSON.stringify({
      secret: env.AUTH_TOKEN_API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch auth token");
  }

  const authTokenResponse = await z
    .object({ token: z.string() })
    .parse(await response.json());

  const encryptedToken = await encrypt({
    token: authTokenResponse.token,
  });
  const decryptedToken = z
    .string()
    .safeParse((await decrypt(encryptedToken))?.token);

  (await cookies()).set("token", encryptedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  });

  return {
    token: encryptedToken,
    decryptedToken: decryptedToken.data,
  };
};
