import { headers } from "next/headers";
import { verifyUserToken, whopApi } from "./lib/whop-api";
import Survey from "./Survey";

export default async function Page() {
  const requestHeaders = await headers();
  const userTokenData = await verifyUserToken(requestHeaders);

  let whopUserId = null;
  let whopUsername = null;
  let whopEmail = null;

  if (userTokenData?.userId) {
    whopUserId = userTokenData.userId;

    try {
      const user = await whopApi.GET("/app/users/{id}", {
        params: { path: { id: userTokenData.userId } },
      });
      if (user?.data) {
        whopUsername = user.data.username || null;
        whopEmail = user.data.email || null;
      }
    } catch (err) {
      console.error("Failed to fetch Whop user details:", err);
    }
  }

  return (
    <Survey
      whopUserId={whopUserId}
      whopUsername={whopUsername}
      whopEmail={whopEmail}
    />
  );
}
