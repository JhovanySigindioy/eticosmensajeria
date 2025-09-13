// src/interfaces/apiResponse.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    error: string | null;
}