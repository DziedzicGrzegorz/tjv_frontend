// AuthenticationRequest represents the data needed to authenticate a user.
export interface AuthenticationRequest {
    username: string; // minLength: 7, maxLength: 50
    password: string; // minLength: 8, maxLength: 2147483647
}

// AuthenticationResponse represents the tokens returned upon successful authentication.
export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
}

// TokenRefreshRequest represents the data needed to refresh an access token.
export interface TokenRefreshRequest {
    refreshToken: string; // minLength: 20, maxLength: 512
}

// UserCreateRequest represents the data needed to register a new user.
export interface UserCreateRequest {
    username: string; // minLength: 7, maxLength: 50
    email: string;
    password: string; // minLength: 8, maxLength: 100
}