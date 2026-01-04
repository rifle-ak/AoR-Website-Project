# Deployment Guide

This guide covers deploying the Art of Rust website with proper security headers and configurations.

## Security Headers

The application includes security headers in the Vite dev server. For production, these headers should be configured on your web server or hosting platform.

### Required Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Platform-Specific Configuration

### Nginx

Add to your server block in `/etc/nginx/sites-available/your-site`:

```nginx
server {
    listen 443 ssl http2;
    server_name artofrust.com;

    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Serve static files
    root /var/www/artofrust/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # SSL Configuration (recommended)
    ssl_certificate /etc/letsencrypt/live/artofrust.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/artofrust.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name artofrust.com;
    return 301 https://$server_name$request_uri;
}
```

### Apache

Add to your `.htaccess` or virtual host configuration:

```apache
<IfModule mod_headers.c>
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Vercel

Create `vercel.json` in the project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify

Create `netlify.toml` in the project root:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages

Create `_headers` file in the `public` directory:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Create `_redirects` file in the `public` directory:

```
/*    /index.html   200
```

## Build and Deploy

### 1. Install Dependencies

```bash
npm ci
```

### 2. Build for Production

```bash
npm run build
```

This will:
- Create an optimized production build in `dist/`
- Remove console logs and debugger statements
- Minify all code with Terser
- Exclude source maps for security

### 3. Test Production Build Locally

```bash
npm run preview
```

### 4. Deploy

Upload the contents of the `dist/` directory to your hosting provider.

## Environment Variables

Create a `.env.production` file with production values:

```env
VITE_SERVER_ADDRESS=your-production-server.com:port
VITE_API_URL=https://api.artofrust.com
VITE_DISCORD_INVITE=https://discord.gg/artofrust
VITE_ENABLE_ANALYTICS=true
```

## SSL/TLS Configuration

Always use HTTPS in production. Obtain certificates from:
- [Let's Encrypt](https://letsencrypt.org/) (Free)
- Your hosting provider
- Commercial CA

## Performance Optimization

1. **Enable Caching**: Configure browser caching for static assets
2. **Enable Compression**: Use gzip or brotli compression
3. **CDN**: Consider using a CDN for static assets
4. **Image Optimization**: Optimize images before deployment
5. **Bundle Analysis**: Run `npm run build` and check bundle sizes

## Monitoring

Consider setting up:
- Error monitoring (Sentry, LogRocket)
- Performance monitoring (Lighthouse CI)
- Uptime monitoring
- Analytics (Google Analytics, Plausible)

## Security Checklist

- [ ] All environment variables configured
- [ ] Security headers configured on web server
- [ ] HTTPS/SSL certificate installed
- [ ] Content Security Policy tested
- [ ] No sensitive data in client-side code
- [ ] Source maps disabled in production
- [ ] Console logs removed in production
- [ ] Dependencies up to date
- [ ] Regular security audits (`npm audit`)

## Troubleshooting

### CSP Blocking Resources

If Content Security Policy blocks legitimate resources:
1. Check browser console for CSP violations
2. Update CSP directives to allow the resource
3. Verify the resource is from a trusted source

### Routing Issues

If direct URL access fails (404 errors):
- Ensure SPA routing is configured (see platform configs above)
- Check that fallback to `index.html` is working

### Build Errors

If build fails:
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## Additional Resources

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Checker](https://securityheaders.com/)
