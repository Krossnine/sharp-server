import env from '@beam-australia/react-env';

interface AppConfig {
    apiBaseUrl: string,
}

export function getAppConfig(): AppConfig {
    return {
        apiBaseUrl: env('API_BASE_URL'),
    }
}

