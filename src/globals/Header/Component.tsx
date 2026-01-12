export const dynamic = "force-dynamic";

import type { Header, SiteSetting } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import payloadConfig from "@payload-config";
import { headers as getHeadersNextJs } from "next/headers.js";
import { getPayload } from "payload";
import { HeaderClient } from "./Component.client";

export async function Header() {
  const headerData: Header = await getCachedGlobal("header", 1)();
  const siteSettingsData: SiteSetting = await getCachedGlobal(
    "siteSettings",
    1
  )();
  const headers = await getHeadersNextJs();
  const payload = await getPayload({ config: payloadConfig });
  const { user: userData } = await payload.auth({ headers });

  return (
    <HeaderClient
      headerData={headerData}
      siteSettingsData={siteSettingsData}
      userData={userData}
    />
  );
}
