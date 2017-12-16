import Scope from './scope';
declare namespace OAuth {
    interface AppDataFromServer {
        id: number;
        name: string;
        website: string | null;
        redirect_uri: string;
        client_id: string;
        client_secret: string;
    }
    interface TokenDataFromServer {
        access_token: string;
        token_type: string;
        scope: string;
        created_at: number;
    }
    class AppData {
        id: number;
        name: string;
        website: string | null;
        redirect_uri: string;
        client_id: string;
        client_secret: string;
        url: string;
        constructor(id: number, name: string, website: string | null, redirect_uri: string, client_id: string, client_secret: string);
        static from(raw: AppDataFromServer): AppData;
        readonly redirectUri: string;
        readonly clientId: string;
        readonly clientSecret: string;
        generateUrl(scope?: Scope[], baseUrl?: string): void;
    }
    class TokenData {
        access_token: string;
        token_type: string;
        created_at: number;
        _scope: string;
        constructor(access_token: string, token_type: string, scope: string, created_at: number);
        static from(raw: TokenDataFromServer): TokenData;
        readonly accessToken: string;
        readonly tokenType: string;
        readonly scope: Scope[];
        readonly createdAt: number;
    }
}
export default OAuth;
