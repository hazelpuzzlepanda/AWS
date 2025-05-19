interface IConfig {
    PORT: any;
    NODE_ENV: string;
    MONGO_URL: string;
    PRIVATE_KEY: string;
    TWILIO_WHATSAPP_NUMBER: string;
    STRIPE_SECRET_KEY: string;
    WEB_HOOK_SECRET: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    SALT_ROUND: string;
    FE_URL: string;
    CONCURRENCY_LIMIT: number;
}

export default IConfig;