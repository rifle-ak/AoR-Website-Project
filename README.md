# Art of Rust Website

Official website for the Art of Rust gaming community - a premium Rust gaming experience with dedicated servers and an amazing community...

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **UI Components:** Radix UI
- **Animations:** Framer Motion

## Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AoR-Website-Project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx   # Navigation bar with responsive menu
│   └── Footer.tsx   # Site footer with links
├── pages/           # Route pages
│   ├── Home.tsx     # Homepage with server status
│   ├── Commands.tsx # Server commands list
│   ├── Gallery.tsx  # Community screenshots gallery
│   └── Login.tsx    # Login/signup page
├── App.tsx          # Main app component with routing
├── main.tsx         # Application entry point
└── index.css        # Global styles and Tailwind directives
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Current Features

- **Customizable Themes** - 5 built-in themes with localStorage persistence
  - Rust (default) - Official game-inspired theme
  - Dark - Clean modern dark theme
  - Light - Bright and accessible
  - Forest - Nature-inspired green
  - Ocean - Deep blue ocean theme
- Responsive navigation with mobile menu
- Server status display (currently mock data)
- Commands list with search and copy functionality
- Community gallery with category filtering
- Login/signup interface with comprehensive validation
- Error boundaries for graceful error handling
- Clipboard utilities with fallback support

### Planned Features

- Real-time server status integration
- User authentication and profiles
- Admin panel for content management
- Gallery image upload
- Analytics integration
- Performance optimizations
- SEO enhancements
- Custom theme creator

## Theming System

The application includes a powerful theming system with multiple pre-built themes and full customization support.

### Available Themes

1. **Rust** (Default) - Post-apocalyptic theme inspired by the game
   - Orange/rust primary colors
   - Dark, gritty atmosphere
   - Perfect for the gaming aesthetic

2. **Dark** - Clean modern dark theme
   - Sky blue accents
   - True black backgrounds
   - Minimal and sleek

3. **Light** - Bright and accessible
   - High contrast for readability
   - Professional appearance
   - Great for daytime use

4. **Forest** - Nature-inspired green theme
   - Earthy green tones
   - Calming atmosphere
   - Unique alternative style

5. **Ocean** - Deep blue ocean theme
   - Cyan/teal accents
   - Underwater vibes
   - Cool and refreshing

### Using Themes

**In the UI:**
- Click the theme picker button in the navigation bar (palette icon)
- Select your preferred theme from the dropdown
- Theme preference is automatically saved to localStorage

**In Code:**

```tsx
import { useTheme } from './contexts/ThemeContext'

function MyComponent() {
  const { theme, themeId, setTheme, availableThemes } = useTheme()

  // Access current theme
  console.log(theme.name) // "Rust"

  // Change theme
  setTheme('dark')

  // Access theme colors
  const primaryColor = theme.colors.primary[500]
}
```

### Creating Custom Themes

Add new themes in `src/config/themes.ts`:

```typescript
export const myCustomTheme: Theme = {
  id: 'custom',
  name: 'Custom Theme',
  description: 'My custom theme',
  colors: {
    primary: { /* ... */ },
    background: { /* ... */ },
    surface: { /* ... */ },
    text: { /* ... */ },
    status: { /* ... */ },
  },
  effects: {
    shadow: '0 4px 6px rgba(0,0,0,0.3)',
    borderRadius: '0.5rem',
    glowColor: 'rgba(255,0,0,0.2)', // Optional
  }
}

// Add to themes object
export const themes = {
  // ...existing themes
  custom: myCustomTheme,
}
```

### Theme CSS Variables

Themes automatically apply CSS variables that can be used in Tailwind classes:

- `primary-{50-900}` - Primary brand colors
- `bg-main`, `bg-secondary`, `bg-tertiary` - Background colors
- `surface-main`, `surface-secondary`, `surface-hover`, `surface-border` - Surface/card colors
- `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled` - Text colors
- `success`, `warning`, `error`, `info` - Status colors

**Example usage:**

```tsx
<div className="bg-surface-main border border-surface-border">
  <h1 className="text-text-primary">Title</h1>
  <p className="text-text-secondary">Description</p>
  <button className="bg-primary-500 text-white">Click me</button>
</div>
```

## Configuration

### Environment Variables

See `.env.example` for all available environment variables:

- `VITE_SERVER_ADDRESS` - Game server connection address
- `VITE_API_URL` - Backend API URL (when implemented)
- `VITE_DISCORD_INVITE` - Discord server invite link
- Social media URLs
- Feature flags

### Tailwind Configuration

Custom color schemes and theme settings are in `tailwind.config.js`:
- `rust` - Orange/rust gaming theme colors
- `dark` - Dark mode color palette

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design for all screen sizes
- Keep components small and focused
- Write meaningful commit messages
- Test across different browsers

## Known Issues

See [PROJECT_REVIEW.md](./PROJECT_REVIEW.md) for a comprehensive list of issues and improvement areas.

### Current Limitations

- Server status is mock data (not connected to real server)
- Login functionality is UI only (no backend integration)
- Gallery images are placeholder content
- No error boundaries implemented
- No testing infrastructure

## Deployment

### Recommended Platforms

- **Vercel** - Automatic deployments from Git
- **Netlify** - Simple hosting with CI/CD
- **CloudFlare Pages** - Fast global CDN

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

## License

Copyright © 2025 Art Of Rust - All Rights Reserved.

Rust and associated Rust images are copyright of Facepunch Studios LTD.

## Contact

- **Email:** ArtofRustMedia@gmail.com
- **Discord:** https://discord.gg/artofrust
- **Twitter:** https://x.com/ArtofRust
- **YouTube:** https://youtube.com/@ArtofRust
- **Instagram:** https://www.instagram.com/ArtofRust

## Support

For support, join our Discord server or email ArtofRustMedia@gmail.com.

## Acknowledgments

- Facepunch Studios for Rust
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The Art of Rust community
