"use server";
import { WhopApi, makeUserTokenVerifier } from "@whop/api";

export const whopApi = WhopApi({
  appApiKey: process.env.WHOP_API_KEY ?? "",
});

export const verifyUserToken = makeUserTokenVerifier({
  appId: process.env.WHOP_APP_ID ?? "",
  dontThrow: true,
});
