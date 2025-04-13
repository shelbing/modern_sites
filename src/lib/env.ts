function validateEnv() {
  const requiredEnvVars = [
    "PUBLIC_STRIPE_KEY",
    "STRIPE_SECRET_KEY",
    "APALEO_API_URL",
    "APALEO_CLIENT_ID",
    "APALEO_CLIENT_SECRET",
  ];

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

const stripeConfig = {
  publicKey: import.meta.env.PUBLIC_STRIPE_KEY,
  secretKey: import.meta.env.STRIPE_SECRET_KEY,
  apiVersion: "2024-09-30.acacia" as const,
};

const apaleoConfig = {
  apiUrl: import.meta.env.APALEO_API_URL,
  clientId: import.meta.env.APALEO_CLIENT_ID,
  clientSecret: import.meta.env.APALEO_CLIENT_SECRET,
};

export function getStripeConfig() {
  validateEnv();
  return stripeConfig;
}

export function getApaleoConfig() {
  validateEnv();
  return apaleoConfig;
}
