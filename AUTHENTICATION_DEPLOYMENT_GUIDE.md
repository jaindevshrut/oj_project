# Authentication Deployment Guide

## Issues Fixed for Production Deployment

### 1. **Cookie Configuration**
- **Problem**: Fixed cookie settings were causing issues in production
- **Solution**: Made cookie settings environment-dependent:
  - `secure: true` only in production (HTTPS required)
  - `sameSite: 'none'` in production for cross-origin requests
  - `sameSite: 'lax'` in development for same-origin requests

### 2. **CORS Configuration**
- **Problem**: Hard-coded CORS origin and inflexible configuration
- **Solution**: Enhanced CORS to support multiple origins and better error handling
- **Note**: Update `CORS_ORIGIN` in production to your frontend domain

### 3. **Environment Variables**
- **Frontend**: Make sure `VITE_BACKEND_URL` points to your production backend
- **Backend**: Update `CORS_ORIGIN` to your production frontend domain

### 4. **Removed localStorage Dependency**
- **Problem**: Mixed use of localStorage and cookies for authentication
- **Solution**: Completely rely on httpOnly cookies for security
- **Benefit**: Prevents XSS attacks and simplifies auth state management

## Production Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.com
# ... other variables
```

### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.com/api/v1
# ... other variables
```

## How Authentication Works

### 1. **Login Flow**
```
Frontend → POST /users/login → Backend
Backend → Sets httpOnly cookies → Frontend
Frontend → Redirects to dashboard
```

### 2. **Authentication Check**
```
Frontend → GET /users/me (with cookies) → Backend
Backend → Verifies JWT from cookies → Returns user data
Frontend → Updates auth state → Allows/Denies access
```

### 3. **Protected Routes**
```
User accesses protected route → PrivateRoute component checks auth state
If not authenticated → Redirect to /auth
If authenticated → Allow access
```

### 4. **Logout Flow**
```
Frontend → POST /users/logout → Backend
Backend → Clears cookies → Frontend
Frontend → Updates auth state → Redirects to auth
```

## Deployment Checklist

### Backend Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Ensure HTTPS is enabled (required for secure cookies)
- [ ] Verify JWT secrets are secure and different from development

### Frontend Deployment
- [ ] Update `VITE_BACKEND_URL` to production backend URL
- [ ] Ensure the domain supports HTTPS
- [ ] Test cross-origin cookie functionality

### Testing Authentication
1. Login and verify cookies are set
2. Refresh page and check if user stays logged in
3. Access protected routes without login
4. Test logout functionality
5. Test on different browsers/devices

## Security Features

1. **httpOnly Cookies**: Prevents XSS attacks on auth tokens
2. **Secure Cookies**: Only sent over HTTPS in production
3. **SameSite Policy**: Prevents CSRF attacks
4. **JWT Verification**: Tokens are verified on every request
5. **No Client-side Token Storage**: Eliminates XSS token theft risk

## Common Issues & Solutions

### Issue: Cookies not being sent
- **Solution**: Ensure `credentials: 'include'` in fetch requests
- **Check**: CORS is properly configured with `credentials: true`

### Issue: Authentication fails after deployment
- **Solution**: Verify environment variables are correctly set
- **Check**: Frontend URL in backend CORS_ORIGIN matches exactly

### Issue: Infinite redirects
- **Solution**: Check that /users/me endpoint is working correctly
- **Debug**: Add console logs to track authentication state changes
