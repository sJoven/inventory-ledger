import { beforeAll } from "vitest";

beforeAll(() => {
  const dbUrl = process.env.DATABASE_URL || "";

  if (
    dbUrl.includes("ep-little-flower-aog0fenl") ||
    !dbUrl.includes("ep-withered-band-aohzslu5")
  ) {
    throw new Error(
      `❌ CRITICAL SAFETY HALT: Vitest is pointed to a non-test database branch! \nURL detected: ${dbUrl}\nExecution safely aborted.`,
    );
  }
});
