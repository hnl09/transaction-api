export const ENV_SERVICE = Symbol('ENV_SERVICE');

export interface IEnvService {
    api: {
        env: string;
        port: number;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
}