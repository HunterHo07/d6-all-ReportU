# ReportU Demo (NextJS)
Visit: https://hunterho07.github.io/d6-fe-ReportU/

This is the demo implementation of the ReportU platform using NextJS, showcasing stunning UI and animations.

## Features

- Modern, responsive UI with advanced animations
- Interactive reporting flow demonstration
- Cross-border reporting visualization
- Status tracking simulation

## Tech Stack

- **Framework**: Next.js
- **Styling**: TailwindCSS
- **Animations**:
  - GSAP for smooth transitions and complex animations
  - Lottie for lightweight, illustrative animations
  - Three.js for 3D elements and backgrounds

## Getting Started

### Prerequisites

- Bun 1.0 or later (recommended)
- Node.js 18.0 or later (alternative)

### Installation

1. Clone the repository
2. Navigate to the demo directory:
   ```bash
   cd demo
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
   or with npm:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
bun run dev
```
or with npm:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

```bash
bun run build
```
or with npm:
```bash
npm run build
```

### Running Production Build

```bash
bun run start
```
or with npm:
```bash
npm run start
```

### Deploying to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Create a GitHub repository for your project
2. Push your code to the repository
3. Deploy using the GitHub Actions workflow:
   ```bash
   git push
   ```

You can deploy manually using one of these methods:

```bash
# Using the Node.js script (recommended)
bun run deploy

# Using the shell script directly
bun run deploy:manual
```

If you encounter issues with .gitignore preventing deployment:
```bash
# Force add the out directory
git add -f out/
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

The site will be available at `https://yourusername.github.io/reportu`

## Project Structure

```
demo/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions and hooks
│   └── styles/         # Global styles
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Animation Guidelines

- Use GSAP for complex animations and transitions
- Use Lottie for lightweight, illustrative animations
- Use Three.js for 3D elements and backgrounds
- Ensure animations are performant and accessible

## Design Principles

- No standard templates
- UI must feel new and delightful
- Unique animations/transitions
- Surprising layouts encouraged
- Every component should look unique

## Troubleshooting

### Common Issues

#### Build Errors
- Ensure all dependencies are installed: `bun install`
- Clear Next.js cache: `rm -rf .next`
- Check for TypeScript errors: `bun run lint`

#### Animation Performance
- Reduce animation complexity on mobile devices
- Use `will-change` CSS property sparingly
- Implement throttling for scroll-based animations

#### Three.js Issues
- Check WebGL compatibility with `THREE.WEBGL.isWebGLAvailable()`
- Reduce polygon count for 3D models
- Implement progressive loading for complex scenes

## Creator

- HunterHo
