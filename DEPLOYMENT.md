# Firebase Hosting Deployment Setup

This project is configured for automatic deployment to Firebase Hosting using GitHub Actions.

## Setup Instructions

### 1. Firebase Service Account Setup

To enable automatic deployment, you need to create a Firebase service account:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nfl-replay`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. In your GitHub repository, go to Settings → Secrets and Variables → Actions
7. Create a new secret named `FIREBASE_SERVICE_ACCOUNT_NFL_REPLAY`
8. Paste the entire contents of the downloaded JSON file as the secret value

### 2. Deployment

Once the service account is set up, the deployment will happen automatically when you push to the `master` branch.

### 3. Manual Deployment (Optional)

You can also deploy manually using:

```bash
npm run build
firebase deploy
```

## Configuration Files

- `firebase.json` - Firebase Hosting configuration
- `.firebaserc` - Firebase project configuration
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment
- `svelte.config.js` - Updated to use static adapter for Firebase Hosting

## Build Output

The build process creates a `build` directory with static files that Firebase Hosting serves.

Your site will be available at: https://nfl-replay.web.app
