/// <reference types="superagent" />
import * as superagent from 'superagent';
export default interface ApiResponse {
    data: string;
    resp: superagent.Response;
}
