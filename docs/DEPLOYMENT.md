# Deployment Guide

## Production Deployment on cPanel/Apache

### Prerequisites
- cPanel account with Node.js support
- SSH access
- Git installed
- Node.js 18+ installed

### Initial Setup

1. **Clone Repository**
```bash
cd /home/artofrust/public_html
git clone <your-repo-url> .
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

4. **Build for Production**
```bash
npm run build
```

5. **Deploy to Web Root**
```bash
cp -r dist/* .
chown -R artofrust:artofrust assets/ index.html
```

### Apache Configuration

**DocumentRoot:** Should point to `/home/artofrust/public_html/dist`

Edit via cPanel or directly in `/var/cpanel/userdata/artofrust/artofrust.art`:
```yaml
documentroot: /home/artofrust/public_html/dist
```

Then rebuild Apache config:
```bash
/scripts/rebuildhttpdconf
/scripts/restartsrv_httpd
```

### Updates and Redeployment

When code changes:

```bash
cd /home/artofrust/public_html

# Pull latest changes
git pull origin main

# Clean old build
rm -rf dist/ assets/

# Rebuild
npm run build

# Deploy
cp -r dist/* .
chown -R artofrust:artofrust assets/ index.html

# Hard refresh browser: Ctrl+Shift+R
```

### Troubleshooting

**White Page / Blank Screen:**
- Check browser console for errors
- Verify assets are loading (Network tab)
- Clear browser cache (Ctrl+Shift+R)
- Check .htaccess is in dist/

**Old Styles/Colors Showing:**
- CSS is cached - force refresh: Ctrl+Shift+R
- Clear browser cache completely
- New builds generate new asset names automatically

**Build Fails:**
- Check Node.js version: `node --version` (need 18+)
- Remove node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

**Permission Errors:**
- Fix ownership: `chown -R artofrust:artofrust /home/artofrust/public_html`
- Fix permissions: `chmod -R 755 /home/artofrust/public_html`

### Performance Optimization

1. **Enable Gzip Compression**
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

2. **Browser Caching**
Already configured in `.htaccess` for assets

3. **CDN (Optional)**
For large traffic, use Cloudflare:
- Free tier available
- Automatic caching
- DDoS protection

### Monitoring

**Check Site Status:**
```bash
curl -I https://artofrust.art
# Should return: HTTP/2 200
```

**Monitor Build Size:**
```bash
du -sh dist/
# Should be under 5MB
```

**Apache Error Logs:**
```bash
tail -f /usr/local/apache/logs/error_log
```

### Backup

**Before Major Updates:**
```bash
# Backup current deployment
tar -czf backup-$(date +%Y%m%d).tar.gz dist/

# Backup database (when implemented)
pg_dump rustdb > backup-db-$(date +%Y%m%d).sql
```

### SSL/HTTPS

Should already be configured via cPanel AutoSSL or Let's Encrypt.

Verify:
```bash
curl -I https://artofrust.art | grep -i "strict-transport"
```

### Environment-Specific Builds

**Development:**
```bash
npm run dev  # Hot reload, source maps
```

**Production:**
```bash
npm run build  # Minified, optimized
```

**Preview Production Build Locally:**
```bash
npm run preview
```
