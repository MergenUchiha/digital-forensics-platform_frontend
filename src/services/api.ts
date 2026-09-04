// src/services/api.ts
import axios, { AxiosError } from "axios";

// Get API URL from environment variable
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - add token to each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // The body was logged here in development, which put the password
        // from the login form into the browser console on every sign-in.
        if (import.meta.env.DEV) {
            console.debug(
                `→ ${config.method?.toUpperCase()} ${config.url ?? ""}`,
            );
        }

        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    },
);

/**
 * Every rejection carries an `ApiError`, so callers can branch on `.status`.
 * The interceptor used to reject with a plain `Error`, which is why the pages
 * reading `err.response.data.message` never saw a server message — by then
 * there was no `.response` to read.
 */
export class ApiError extends Error {
    readonly status: number;
    readonly data: unknown;

    constructor(status: number, message: string, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

interface ErrorBody {
    message?: string;
    errors?: Array<{ field?: string; message?: string }>;
}

function notify(title: string, message: string) {
    window.showNotification?.({ type: "error", title, message });
}

// Response interceptor - one error shape for the whole application
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.debug(`← ${response.status} ${response.config.url ?? ""}`);
        }
        return response;
    },
    (error: AxiosError<ErrorBody>) => {
        const { response } = error;

        // No response at all: the server is unreachable.
        if (!response) {
            notify(
                "Network error",
                "Unable to reach the server. Check your connection.",
            );
            return Promise.reject(
                new ApiError(0, "Network error: unable to reach the server"),
            );
        }

        const { status } = response;
        const data = response.data;

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            return Promise.reject(
                new ApiError(status, "Session expired. Please sign in again."),
            );
        }

        if (status === 403) {
            notify(
                "Access denied",
                data?.message ??
                    "You do not have permission to perform this action.",
            );
            return Promise.reject(
                new ApiError(status, data?.message ?? "Access denied", data),
            );
        }

        if (status === 400 || status === 422) {
            const fields = data?.errors ?? [];
            const message =
                fields.length > 0
                    ? fields
                          .map((e) =>
                              e.field ? `${e.field}: ${e.message}` : e.message,
                          )
                          .join(", ")
                    : (data?.message ?? "Validation error");
            return Promise.reject(new ApiError(status, message, data));
        }

        if (status >= 500) {
            notify(
                "Server error",
                "Something went wrong on the server. Please try again.",
            );
            return Promise.reject(
                new ApiError(status, data?.message ?? "Server error", data),
            );
        }

        return Promise.reject(
            new ApiError(
                status,
                data?.message ?? "An unexpected error occurred",
                data,
            ),
        );
    },
);

/** Turns any thrown value into something worth showing a user. */
export const handleApiError = (error: unknown, context?: string): string => {
    const prefix = context ? `${context}: ` : "";

    if (error instanceof ApiError) return prefix + error.message;
    if (error instanceof Error) return prefix + error.message;

    return prefix + "An unexpected error occurred";
};
