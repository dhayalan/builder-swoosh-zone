# 🚀 Satellite NFT Telemetry App - Deployment Guide

## 📋 Requirements

### System Requirements
- **Node.js**: 18+ 
- **Package Manager**: pnpm (recommended)
- **Build Time**: ~5 minutes
- **Runtime Memory**: 512MB minimum

### Required Environment Variables
Before deploying, you MUST set these environment variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Firebase Configuration (Required)
FIREBASE_URL=https://smartchargerapp-3ae91-default-rtdb.firebaseio.com/
FIREBASE_SECRET=your_firebase_secret_here

# Pinata IPFS Configuration (Required)
PINATA_JWT=your_pinata_jwt_token_here

# NFT Contract Configuration (Required)
NFT_CONTRACT_ADDRESS=0x70633F90934327AFae535846e42BD470e558faAE
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended for Full-Stack)

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `pnpm build`
   - Publish directory: `dist/spa`
   - Functions directory: `netlify/functions`

3. **Add environment variables** in Netlify dashboard:
   ```
   FIREBASE_URL=https://smartchargerapp-3ae91-default-rtdb.firebaseio.com/
   FIREBASE_SECRET=zc6g5VFqarkTyQq4gMUPO5qkiGvwzRTmjoZvO2IX
   PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NFT_CONTRACT_ADDRESS=0x70633F90934327AFae535846e42BD470e558faAE
   ```

4. **Deploy**: Netlify will automatically build and deploy

### Option 2: Vercel

1. **Connect your repository** to Vercel
2. **Vercel will auto-detect** the framework
3. **Add environment variables** in Vercel dashboard
4. **Deploy**: Automatic deployment on push

### Option 3: Railway

1. **Connect your repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy**: Railway will use the `railway.toml` configuration

### Option 4: Render

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Set build command**: `pnpm build`
4. **Set start command**: `pnpm start`
5. **Add environment variables** in Render dashboard

### Option 5: Docker (Any Platform)

1. **Build the image**:
   ```bash
   docker build -t satellite-nft-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 \
     -e FIREBASE_URL="https://smartchargerapp-3ae91-default-rtdb.firebaseio.com/" \
     -e FIREBASE_SECRET="your_firebase_secret" \
     -e PINATA_JWT="your_pinata_jwt" \
     -e NFT_CONTRACT_ADDRESS="0x70633F90934327AFae535846e42BD470e558faAE" \
     satellite-nft-app
   ```

## 🔒 Security Checklist

- [ ] **Environment Variables**: All secrets are in environment variables, not hardcoded
- [ ] **HTTPS**: Enable HTTPS in production
- [ ] **CORS**: Configure CORS for your domain only
- [ ] **Rate Limiting**: Consider adding rate limiting for API endpoints
- [ ] **Firewall**: Restrict access to Firebase and Pinata to your server IP if possible

## ⚡ Performance Optimization

- [ ] **CDN**: Use a CDN for static assets (automatic with Netlify/Vercel)
- [ ] **Compression**: Enable gzip compression (automatic with most providers)
- [ ] **Monitoring**: Set up monitoring for the satellite data API
- [ ] **Error Tracking**: Consider adding Sentry for error tracking

## 🧪 Testing Production Build Locally

```bash
# Build the application
pnpm build

# Test the production build locally
pnpm start
```

Visit `http://localhost:3000` to test the production build.

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: 
   - Check Node.js version (must be 18+)
   - Ensure all dependencies are installed: `pnpm install`

2. **Environment Variables Not Working**:
   - Verify all required variables are set
   - Check for typos in variable names
   - Restart the service after adding variables

3. **NFT Generation Fails**:
   - Verify Firebase credentials and URL
   - Check Pinata JWT token validity
   - Ensure Firebase has satellite data

4. **MetaMask Connection Issues**:
   - Ensure the app is served over HTTPS in production
   - Check that the contract address is correct for Fuji testnet

## 📊 Monitoring

After deployment, monitor these endpoints:
- `GET /api/ping` - Health check
- `POST /api/satellite-nft` - NFT generation endpoint

## 🚀 Ready to Deploy!

Choose your preferred deployment option above and follow the steps. The application will be live and ready to:

1. ✅ Connect MetaMask wallets
2. ✅ Process 0.1 AVAX payments on Fuji testnet  
3. ✅ Fetch real satellite telemetry data
4. ✅ Generate QR codes and upload to IPFS
5. ✅ Display NFT contract information

---

**Need help?** Check the specific deployment platform documentation or reach out for support.
