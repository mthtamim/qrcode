# Pressmark - QR Code Generator

A modern, beautiful QR code generator built with React, Vite, and Tailwind CSS. Create custom QR codes with colors, sizing, and error correction options. Now available as a web app and Android application.

![Pressmark Logo](public/pressmark-logo.png)

## Features

- 🎨 **Custom Colors** - Change QR code and background colors
- 📏 **Adjustable Size** - Scale your QR codes from small to large
- 🛡️ **Error Correction** - Choose error correction levels (L, M, Q, H)
- 💾 **Download** - Export as high-quality PNG images
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast & Lightweight** - Built with Vite for instant loading
- 🔒 **Privacy First** - All QR generation happens in your browser

## Technology Stack

- **Frontend**: React 19, TanStack Start/Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **QR Generation**: qrcode.js
- **Mobile**: Capacitor (Android)
- **State Management**: Zustand
- **Form Handling**: React Hook Form

## Quick Start

### Web Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:8080`

### Android Application

```bash
# Prepare for Android build
npm run android:prepare

# Build debug APK
npm run android:build

# Build release bundle
npm run android:release

# Open Android Studio
npm run android:open
```

## GitHub Actions Workflow

Automated Android builds run on every push. Download the APK from the GitHub Actions Artifacts section:

1. Go to **Actions** tab in GitHub
2. Select the latest **Android Build & Release** workflow
3. Scroll to **Artifacts** and download:
   - `pressmark-debug-apk` - Install directly on Android devices
   - `pressmark-release-bundle` - Submit to Google Play Store

## Project Structure

```
pressmark/
├── src/
│   ├── routes/           # TanStack Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and helpers
│   ├── styles.css       # Tailwind configuration
│   └── router.tsx       # Router setup
├── android/             # Capacitor Android project
├── public/              # Static assets
├── .github/workflows/   # GitHub Actions
└── capacitor.config.json # Capacitor configuration
```

## Configuration

### Capacitor Config (`capacitor.config.json`)

```json
{
  "appId": "com.pressmark.qrcode",
  "appName": "Pressmark",
  "webDir": "dist"
}
```

### Environment

The app requires no environment variables. All QR code generation is client-side.

## Development

### Building

```bash
# Web
npm run build

# Android
npm run android:build
```

### Testing

```bash
npm run typecheck
npm run lint
```

### Code Quality

```bash
npm run format    # Format code with Prettier
npm run lint      # Check with ESLint
```

## Deployment

### Web (Vercel)

```bash
vercel deploy
```

### Android (Google Play)

1. Build release bundle: `npm run android:release`
2. Sign the APK/AAB in Android Studio
3. Upload to Google Play Console

## Features Breakdown

### QR Code Generation
- Input: URL or text
- Output: PNG image
- Customizable colors and size
- Multiple error correction levels

### Download Options
- PNG format (lossless)
- Adjustable resolution
- Instant download to device

### Mobile Experience
- Touch-optimized UI
- Camera integration (coming soon)
- Share QR codes (coming soon)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Android Support

- **Minimum SDK**: Android 6.0 (API 24)
- **Target SDK**: Android 14 (API 34)
- **Architectures**: arm64-v8a, armeabi-v7a, x86, x86_64

## Performance

- **Load Time**: < 1 second
- **QR Generation**: < 100ms
- **Bundle Size**: ~500KB (web)
- **APK Size**: ~20MB (Android)

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@pressmark.app

---

**Made with ❤️ by Pressmark Team**
