#!/bin/bash

# Detect if npm or bun should be used
if command -v bun &> /dev/null; then
  PACKAGE_MANAGER="bun"
else
  PACKAGE_MANAGER="npm"
fi

echo "Using $PACKAGE_MANAGER for build and deployment..."

# Build the Next.js application
echo "Building Next.js application..."
$PACKAGE_MANAGER run build

# Create .nojekyll file to bypass Jekyll processing
echo "Creating .nojekyll file..."
touch out/.nojekyll

# Initialize git if not already initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit"
fi

# Check if gh-pages branch exists
if ! git show-ref --quiet refs/heads/gh-pages; then
  echo "Creating gh-pages branch..."
  git checkout -b gh-pages
  git checkout -
else
  echo "gh-pages branch already exists"
fi

# Add the out directory to git
echo "Adding build files to git..."
git add -f out/

# Commit the changes
echo "Committing changes..."
git commit -m "Deploy to GitHub Pages"

# Push the out directory to the gh-pages branch
echo "Pushing to gh-pages branch..."
git subtree push --prefix out origin gh-pages

echo "Deployment complete! Your site should be available at https://yourusername.github.io/reportu"
