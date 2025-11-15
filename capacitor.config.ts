// capacitor.config.ts
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.readot.cat",
  appName: "readot-cat",
  webDir: "out",      // ✅ 여기!!
};

export default config;
