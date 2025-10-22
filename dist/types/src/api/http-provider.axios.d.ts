import { HttpProvider, Headers } from './types';
export declare class AxiosHttpProvider implements HttpProvider {
    get<T>(url: string, headers: Headers): Promise<T>;
    post<T>(url: string, data: unknown, headers: Headers): Promise<T>;
}
