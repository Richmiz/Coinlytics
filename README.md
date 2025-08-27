# Coinlytics 📊

A modern, user-friendly financial tracking mobile application built with React Native and Expo. Track your expenses, analyze spending patterns, and manage your finances effortlessly.

## Features ✨

- **User Authentication**: Secure sign-in and sign-up functionality
- **Transaction Management**: Add, view, and manage your financial transactions
- **Analytics Dashboard**: Visualize your spending patterns with interactive charts
- **Transaction History**: Keep track of all your past transactions
- **Profile Management**: Edit and manage your user profile
- **Real-time Data**: Powered by Firebase for seamless data synchronization
- **Cross-Platform**: Works on iOS, Android, and Web

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: Tailwind CSS with NativeWind
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Charts**: Shopify React Native Skia
- **State Management**: React Hooks
- **Icons**: Expo Vector Icons

## Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/Richmiz/Coinlytics.git
   cd Coinlytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase config to `.env` file

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Usage 📱

- **Sign Up/Sign In**: Create an account or log in to access your financial data
- **Add Transactions**: Record your income and expenses with categories
- **View Analytics**: Analyze your spending habits with visual charts
- **Browse History**: Review your transaction history
- **Edit Profile**: Update your personal information

## Project Structure 📁

```
Coinlytics/
├── app/                    # Main application code
│   ├── (auth)/            # Authentication screens
│   ├── (screens)/         # Additional screens
│   └── (tabs)/            # Tab-based navigation
├── components/            # Reusable UI components
├── constants/             # App constants and icons
├── assets/                # Images and fonts
└── firebase/              # Firebase configuration
```

## Scripts 📜

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint for code quality

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Contact 📧

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using React Native and Expo
