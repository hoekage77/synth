# Xera/Suna AI Worker Documentation Website

A modern, responsive documentation website built with Next.js that provides comprehensive documentation for the Xera/Suna AI Worker platform.

## Features

- **Modern Design**: Clean, responsive interface with dark/light mode support
- **Mermaid Diagrams**: Interactive architecture diagrams and flowcharts
- **Search & Navigation**: Easy-to-use sidebar navigation with search capabilities
- **Mobile Friendly**: Responsive design that works on all devices
- **Fast Performance**: Built with Next.js for optimal performance
- **SEO Optimized**: Proper metadata and structured content

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React icons
- **Diagrams**: Mermaid.js for architecture diagrams
- **TypeScript**: Full type safety
- **MDX Support**: Markdown with React components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
docu/
├── app/                    # Next.js app router pages
│   ├── page.tsx          # Homepage
│   ├── system-architecture/  # System architecture docs
│   ├── architecture-diagrams/ # Architecture diagrams
│   └── quick-reference/      # Quick reference guide
├── components/            # React components
│   ├── DocLayout.tsx     # Main layout wrapper
│   └── Sidebar.tsx       # Navigation sidebar
├── lib/                  # Utility functions
│   └── utils.ts         # Helper functions
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Content Organization

### 1. Homepage (`/`)
- Platform overview
- Quick navigation cards
- Getting started guide

### 2. System Architecture (`/system-architecture`)
- Comprehensive system documentation
- Code examples and explanations
- Architecture patterns and principles

### 3. Architecture Diagrams (`/architecture-diagrams`)
- Visual system representations
- Mermaid.js diagrams
- System flow charts

### 4. Quick Reference (`/quick-reference`)
- Essential information tables
- API endpoints
- Troubleshooting guides
- Quick start commands

## Customization

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Use the `DocLayout` component
4. Add navigation in `components/Sidebar.tsx`

### Styling

- **Tailwind CSS**: Use utility classes for styling
- **Custom CSS**: Add styles in `app/globals.css`
- **Components**: Create reusable components in `components/`

### Mermaid Diagrams

The website supports Mermaid.js diagrams. Add them like this:

```jsx
<div className="mermaid">
  {`graph TB
    A[Start] --> B[Process]
    B --> C[End]`}
</div>
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for all components
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent component structure

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Vercel will auto-deploy on push
3. Configure environment variables if needed

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

This documentation website is part of the Xera/Suna AI Worker project and follows the same license terms.

## Support

For questions about the documentation website:
- Check existing issues
- Create a new issue
- Review the main project documentation

---

Built with ❤️ for the Xera/Suna AI Worker community
