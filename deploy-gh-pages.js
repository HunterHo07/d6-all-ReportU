// Simple script to deploy to GitHub Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands and log output
function runCommand(command, errorMessage, showCommand = true) {
  try {
    if (showCommand) {
      console.log(`${colors.cyan}> ${command}${colors.reset}`);
    }
    execSync(command, { stdio: showCommand ? 'inherit' : 'pipe' });
    return true;
  } catch (error) {
    if (errorMessage) {
      console.error(`${colors.red}${colors.bright}Error: ${errorMessage}${colors.reset}`);
      console.error(`${colors.red}${error.message}${colors.reset}`);
    }
    return false;
  }
}

// Main deployment function
async function deploy() {
  console.log(`\n${colors.bright}${colors.cyan}=== Deploying to GitHub Pages ===${colors.reset}\n`);

  // Step 1: Build the project
  console.log(`${colors.yellow}${colors.bright}Step 1: Building the project...${colors.reset}`);
  // Detect if we're using npm or bun
  const useNpm = process.env.USE_NPM === 'true' || !runCommand('which bun', '', false);
  const buildCmd = useNpm ? 'npm run build' : 'next build';
  console.log(`${colors.cyan}Using ${useNpm ? 'npm' : 'bun'} for build${colors.reset}`);

  if (!runCommand(buildCmd, 'Failed to build the project.')) {
    return;
  }

  // Step 2: Create .nojekyll file to bypass Jekyll processing
  console.log(`\n${colors.yellow}${colors.bright}Step 2: Creating .nojekyll file...${colors.reset}`);
  const outDir = path.join(process.cwd(), 'out');
  const nojekyllPath = path.join(outDir, '.nojekyll');

  try {
    fs.writeFileSync(nojekyllPath, '');
    console.log(`${colors.green}Created .nojekyll file${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Failed to create .nojekyll file: ${error.message}${colors.reset}`);
    return;
  }

  // Step 3: Add the out directory to git (force add to override .gitignore)
  console.log(`\n${colors.yellow}${colors.bright}Step 3: Adding build files to git...${colors.reset}`);
  if (!runCommand('git add -f out/', 'Failed to add build files to git.')) {
    return;
  }

  // Step 4: Commit the changes
  console.log(`\n${colors.yellow}${colors.bright}Step 4: Committing changes...${colors.reset}`);
  if (!runCommand('git commit -m "Deploy to GitHub Pages"', 'Failed to commit changes.')) {
    // If commit fails, it might be because there are no changes
    console.log(`${colors.yellow}No changes to commit or commit failed. Continuing...${colors.reset}`);
  }

  // Step 5: Push to gh-pages branch
  console.log(`\n${colors.yellow}${colors.bright}Step 5: Pushing to gh-pages branch...${colors.reset}`);

  // Check if gh-pages branch exists
  try {
    execSync('git show-ref --verify --quiet refs/heads/gh-pages');
    console.log(`${colors.green}gh-pages branch exists${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}gh-pages branch doesn't exist. Creating it...${colors.reset}`);
    if (!runCommand('git branch gh-pages', 'Failed to create gh-pages branch.')) {
      return;
    }
  }

  // Push using subtree
  if (!runCommand('git push origin `git subtree split --prefix out master`:gh-pages --force',
                 'Failed to push to gh-pages branch.')) {
    console.log(`${colors.yellow}Trying alternative push method...${colors.reset}`);
    if (!runCommand('git subtree push --prefix out origin gh-pages',
                   'Failed to push to gh-pages branch using subtree.')) {
      return;
    }
  }

  console.log(`\n${colors.green}${colors.bright}✓ Deployment complete!${colors.reset}`);
  console.log(`${colors.green}Your site should be available at https://yourusername.github.io/reportu${colors.reset}\n`);
}

// Run the deployment
deploy().catch(error => {
  console.error(`${colors.red}${colors.bright}Deployment failed:${colors.reset}`, error);
  process.exit(1);
});
