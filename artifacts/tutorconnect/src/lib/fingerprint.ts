import fpPromise from "@fingerprintjs/fingerprintjs";

// Initialize the agent at application startup.
// We lazily load it so it doesn't block the main thread unnecessarily.
let fpInstance: any = null;

export const loadFingerprint = async () => {
  if (fpInstance) return fpInstance;
  fpInstance = await fpPromise.load();
  return fpInstance;
};

export const getDeviceId = async (): Promise<string> => {
  try {
    const fp = await loadFingerprint();
    const result = await fp.get();
    return result.visitorId;
  } catch (err) {
    console.error("Could not obtain fingerprint:", err);
    // Fallback if blocked by extensions
    return "anonymous-fingerprint-blocked";
  }
};
