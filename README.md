# GarageHub – Garage Storage Marketplace (Expo/React Native)

A mobile-first marketplace for renting out unused garage space. Built with Expo + React Native and Expo Router.

## Prerequisites
- Node.js 18+ and npm 9+
- Git
- Optional: Expo Go app on your iOS/Android device for instant testing

## Quick Start

1. Clone the repository
```bash
git clone https://github.com/rotiminicol/Garage-hub-mobile-app.git
cd Garage-hub-mobile-app
```
2. Install dependencies
```bash
npm install
```
3. Start the dev server
```bash
# Either
npm run dev
# or
npx expo start
```
4. Open the app
- Native: scan the QR code with Expo Go (Android) or Camera (iOS)
- Web: press `w` in the Expo CLI to open in your browser

If the browser doesn’t open automatically, the native dev server (Metro) is typically at `http://localhost:8081`. For web, the CLI prints the exact URL after pressing `w`.

## Project Structure
- `app/` – screens and routing via Expo Router
- `services/` – API clients and auth helpers (Xano, secure storage)
- `assets/` – images and icons
- `components/` – shared UI components
- `hooks/` – custom hooks (e.g., framework readiness)

## Scripts
- `npm run dev` – start Expo development server
- `npm run build:web` – export a static web build
- `npm run lint` – run linter

## Environment
No local environment variables are required. Demo API endpoints are configured in `services/xano.ts`.

## Troubleshooting
- Clear cache: `npx expo start -c`
- iOS simulator (macOS): press `i` in the CLI
- Android emulator: press `a` in the CLI
- If ports are busy, stop other dev servers or change ports per Expo CLI prompt

## License
For hiring review and demo purposes only.
