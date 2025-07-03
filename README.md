# LWFS App - Loveworld Foundation School

A comprehensive React Native/Expo mobile application for Loveworld Foundation School, featuring live TV streaming, e-commerce store, user authentication, and profile management.

## 🚀 Features

### 📺 Live TV & Chat
- **Live Video Streaming**: Watch live worship programs and events
- **Real-time Chat**: Interactive live chat with colorful user avatars
- **Viewer Count**: Real-time viewer statistics
- **Fullscreen Mode**: Immersive viewing experience
- **Auto-scroll Chat**: Smooth chat scrolling with user initials

### 🛍️ E-commerce Store
- **Product Browsing**: Browse school uniforms, supplies, and merchandise
- **Smart Search**: Real-time product search with filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Secure Checkout**: Integrated payment processing
- **Promotion Carousel**: Auto-scrolling promotional banners
- **Product Categories**: Filter by Pastors, Principals, Teachers, Students

### 👤 User Management
- **Authentication**: Secure sign-in/sign-up with email verification
- **Profile Management**: Update personal information and preferences
- **Order History**: Track past purchases and order status
- **Password Reset**: Secure password recovery system

### 🎓 Educational Integration
- **Online Classes**: Direct access to online learning platform
- **Quick Actions**: Easy navigation to educational resources
- **School Information**: Access to school updates and announcements

### 🎨 Modern UI/UX
- **Dark Mode Support**: Beautiful dark and light themes
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Engaging user interactions
- **Tab Navigation**: Intuitive bottom tab navigation
- **Sidebar Menu**: Quick access to all features

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Expo Vector Icons (Feather)
- **HTTP Client**: Axios
- **Video Player**: Expo AV
- **Payment**: Custom payment integration
- **Authentication**: Custom auth system with JWT

## 📱 Screenshots

The app includes:
- **Home Screen**: Welcome with LWFS logo and quick actions
- **Live TV**: Video player with live chat
- **Store**: Product browsing with search and cart
- **Profile**: User account management
- **Authentication**: Sign-in/sign-up flows

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lwfs_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   API_URL=your_api_endpoint
   APP_NAME=LWFS App
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## 📁 Project Structure

```
lwfs_app/
├── app/                    # Main app screens (Expo Router)
│   ├── (app)/             # Protected app routes
│   │   ├── (tabs)/        # Tab navigation
│   │   └── index.tsx      # Home screen
│   └── (auth)/            # Authentication screens
├── components/             # Reusable components
│   ├── cart/              # Shopping cart components
│   ├── store/             # Store-related components
│   ├── shared/            # Common UI components
│   └── videoplayer.tsx    # Video player component
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── LiveTvContext.tsx  # Live TV state
│   ├── UserCartContext.tsx # Shopping cart state
│   └── UserContext.tsx    # User profile state
├── utils/                 # Utility functions
│   ├── env.ts            # Environment configuration
│   └── country.js        # Country data
├── assets/               # Static assets
│   ├── images/           # App images and logos
│   └── fonts/            # Custom fonts
└── web-preview/          # HTML preview for web
```

## 🔧 Configuration

### API Configuration
The app connects to a backend API for:
- User authentication
- Product data
- Live TV streams
- Shopping cart management
- Payment processing

### Environment Variables
- `API_URL`: Backend API endpoint
- `APP_NAME`: Application name

## 🎯 Key Features Explained

### Live TV System
- Real-time video streaming with HLS support
- Live chat with user avatars and timestamps
- Viewer count tracking
- Fullscreen video player
- App state management for background/foreground

### E-commerce Store
- Product catalog with categories
- Real-time search functionality
- Shopping cart with quantity management
- Secure checkout process
- Order history tracking

### User Authentication
- Email-based registration
- Email verification system
- Password reset functionality
- Persistent login state
- Profile management

## 🚀 Deployment

### Building for Production
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Publishing Updates
```bash
# Publish to Expo
expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Loveworld Foundation School.

## 📞 Support

For technical support or questions about the LWFS app, please contact the development team.

---

**Built with ❤️ for Loveworld Foundation School**
