export interface ApiResponse<T> {
    message: string | object;
    statusCode: number;
    data?: T;
    error?: string;
}