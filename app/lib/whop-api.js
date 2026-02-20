import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";

export const whopApi = WhopServerSdk({
  appId: process.env.WHOP_APP_ID ?? "",
  appApiKey: process.env.WHOP_API_KEY ?? "",
});

export const verifyUserToken = makeUserTokenVerifier({
  appId: process.env.WHOP_APP_ID ?? "",
  dontThrow: true,
});
