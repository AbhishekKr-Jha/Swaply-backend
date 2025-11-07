// Global environment configuration types
import { EnvConfig } from '../src/common/config/build_env.js';

declare global {
  // Optional: Make Env available globally
  namespace NodeJS {
    interface Global {
      Env: EnvConfig;
    }
  }
}

// Re-export for convenience
export type { EnvConfig };
