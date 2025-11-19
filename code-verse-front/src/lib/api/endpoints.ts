
    // Authentication
export const LOGIN = () => '/auth/login';
export const LOGOUT = () => '/auth/logout';
// User
// export const GET_USER = '/api/v1/production';
// Repos
export const GET_REPOS = () => '/api/v1/production/repos';
// CommitReviews
export const GET_COMMIT_REVIEWS_ALL = () => '/api/v1/production/commitreviews';
export const GET_COMMIT_REVIEWS = (sha: string) => `/api/v1/production/commitreviews/${sha}`;
export const POST_COMMIT_REVIEW = () => '/api/v1/production/commitreviews';

