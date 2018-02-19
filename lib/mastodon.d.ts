import StreamListener from './streamlistener';
import Scope from './scope';
import OAuth from './oauth';
import ApiResponse from './entities/apiResponse';
export default class Mastodon {
    static Scope: typeof Scope;
    static NO_REDIRECT: string;
    private accessToken;
    private baseUrl;
    private apiUrl;
    private streamingApiUrl;
    constructor(accessToken: string, baseUrl?: string);
    static get(path: string, params?: {}, baseUrl?: string): Promise<object>;
    static registerApp(client_name: string, options?: Partial<{
        scopes: Scope[];
        redirect_uris: string;
        website: string;
    }>, baseUrl?: string): Promise<OAuth.AppData>;
    static fetchAccessToken(client_id: string, client_secret: string, code: string, redirect_uri?: string, baseUrl?: string): Promise<OAuth.TokenData>;
    static generateAuthUrl(client_id: string, options?: Partial<{
        redirect_uri: string;
        scope: Scope[];
    }>, baseUrl?: string): string;
    static createApp(client_name: string, options?: Partial<{
        redirect_uris: string;
        scopes: Scope[];
        website: string;
    }>, baseUrl?: string): Promise<OAuth.AppData>;
    private static _post(path, params?, baseUrl?);
    get<T>(path: string, params?: {}): Promise<T>;
    getx(path: string, params?: {}): Promise<ApiResponse>;
    patch<T>(path: string, params?: {}): Promise<T>;
    post<T>(path: string, params?: {}): Promise<T>;
    del(path: string): Promise<{}>;
    stream(path: string, reconnectInterval?: number): StreamListener;
}
