# LWFS App Web Preview

This project provides a static, interactive HTML preview of the LWFS React Native app's UI and UX. It is designed for rapid prototyping, design review, and sharing the app experience without needing a mobile device or backend.

## Purpose
- **Preview the look and feel** of the LWFS app in any web browser.
- **Demonstrate navigation flows** (tabs, product details, cart, profile, etc.) and UI patterns.
- **Share with stakeholders** for feedback or design sign-off.

## Features
- **Tab Navigation**: Home, LiveTV, Store, and Profile tabs at the bottom, styled to match the app.
- **LiveTV Tab**: Video player mockup, live chat with static comments, send message input, and related streams.
- **Store Tab**:
  - Responsive product grid with clickable cards.
  - Product details as a full-screen page, with add to cart and cart badge.
  - Cart as a full-screen page, with quantity controls and total.
  - Store search overlay with live filtering.
- **Profile Tab**:
  - User info, quick settings, and menu options.
  - Navigation to full-screen pages: Order History, Change Password, Personal Information, Help & Support, Privacy Policy.
  - **Dark Mode** toggle that instantly themes the entire app.
- **Responsive Design**: Looks great on desktop, tablet, and mobile.
- **Static Demo Data**: All products, cart items, events, and user info are hardcoded for demonstration.

## How to Use
1. Open `web-preview/app-preview.html` in your browser.
2. Click the tab bar to switch between Home, LiveTV, Store, and Profile.
3. In Store, click a product for details, or the cart icon to view the cart.
4. Use the search bar in Store to filter products.
5. In Profile, try the menu options to navigate to related pages.
6. Toggle "Dark Mode" in Profile > Quick Settings to see the dark theme.
7. All navigation and overlays work instantly—no page reloads.

## Structure
- **Tabs**: Bottom navigation, always visible except on full-screen overlays.
- **Sections**: Each tab is a `<section>`; only one is visible at a time.
- **Overlays/Pages**: Product details, cart, search, and profile-related pages are full-screen overlays.
- **Static Data**: Products, cart, user info, and events are defined in JavaScript.

## Limitations
- **No backend/API**: All data is static and resets on reload.
- **No persistent state**: Cart, dark mode, etc. are not saved.
- **No real video or authentication**: All media and user flows are mockups.
- **No mobile device features**: This is a web-only preview.

## Credits
- Based on the LWFS React Native app UI/UX.
- Icons and design inspired by Expo, Feather, and Tailwind CSS.

## How to Extend
- Add more screens or flows by editing `app-preview.html`.
- Replace static data with real API calls or localStorage for persistence.
- Connect to a backend for real authentication, products, and chat.
- Enhance animations, transitions, or accessibility as needed.

---

**Enjoy previewing and sharing your LWFS app!** 