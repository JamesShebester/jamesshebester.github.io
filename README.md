# jamesshebester.github.io

This repository contains a simple HTML site designed for:

1. **Client-side Optimizely SDK Testing**: Experiment with Optimizely's client-side SDK for feature flagging and A/B testing.
2. **WebX Testing**: Perform WebX-related experiments and configurations.
3. **Netlify Edge Worker**: Utilize Netlify Edge Functions for server-side logic, including cookie management, dynamic content injection, and integration with Optimizely.

---

## Features

- **Netlify Edge Functions**: Includes an `inject-message.js` Edge Function for injecting dynamic content based on Optimizely decisions.
- **Serverless Functions**: A `datafile.js` serverless function to fetch and cache the Optimizely datafile.
- **Optimizely Integration**: Demonstrates how to use the Optimizely SDK for feature flagging and decision-making.
- **Dynamic Content Injection**: Injects personalized content into the HTML response based on Optimizely decisions.

---

## Why Use a Serverless Function for Caching the Datafile?

Netlify Edge Functions are designed for lightweight, low-latency operations and do not support persistent in-memory caching across requests. This limitation makes it unsuitable for caching the Optimizely datafile, which is required to reduce API calls and improve performance.

Instead, caching is implemented in a **serverless function** (`datafile.js`) because:

1. **Persistent In-Memory Cache**:
   - Serverless functions can maintain in-memory variables (e.g., `cachedDatafile` and `cacheTimestamp`) during their lifecycle, allowing for efficient caching of the datafile.

2. **TTL (Time-to-Live) Logic**:
   - The `datafile.js` function includes TTL logic to ensure the datafile is refreshed periodically while minimizing API calls to Optimizely.

3. **Edge Function Limitations**:
   - Edge Functions do not support persistent memory or long-lived variables, so caching the datafile in an Edge Function is not feasible.

By delegating the datafile fetching and caching to a serverless function, the Edge Function (`inject-message.js`) can focus on its primary task: injecting dynamic content into the response.

---

## Netlify Configuration (`netlify.toml`)

The `netlify.toml` file is used to configure the build settings, serverless functions, and edge functions for your project. Below is the required configuration:

```toml
[build]
  publish = "."                # Specifies the directory to publish (root directory in this case)
  functions = "netlify/functions"  # Directory for serverless functions
  edge_functions = "netlify/edge-functions"  # Directory for edge functions

[[edge_functions]]
  path = "/"                   # Path to trigger the edge function
  function = "inject-message"  # Name of the edge function
---

## Project Setup

### Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (version 18 or later is recommended).
2. **Netlify CLI**: Install the Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

---

## Connecting Netlify to GitHub for Automatic Deployments

To enable automatic deployments whenever you push changes to your GitHub repository, follow these steps:

### Step 1: Link Your GitHub Repository to Netlify

1. **Login to Netlify**:
   - Go to [Netlify](https://www.netlify.com/) and log in to your account.

2. **Create a New Site**:
   - Click on **"Add new site"** and select **"Import an existing project"**.

3. **Connect to GitHub**:
   - Select **GitHub** as your Git provider.
   - Authorize Netlify to access your GitHub account if prompted.

4. **Select Your Repository**:
   - Choose the repository for this project (`jamesshebester.github.io`) from the list of available repositories.

5. **Configure Build Settings**:
   - Set the **Base directory** to `.` (root directory).
   - Set the **Build command** to:
     ```bash
     npm run build
     ```
     (If you don’t have a build command, leave it blank.)
   - Set the **Publish directory** to:
     ```plaintext
     .
     ```
     (This is the root directory where your [index.html](http://_vscodecontentref_/1) file is located.)

6. **Deploy Your Site**:
   - Click **Deploy site** to start the first deployment.

---

### Step 2: Enable Continuous Deployment

Once your site is linked to GitHub, Netlify will automatically deploy your changes whenever you push to the `main` branch (or the branch you configured).

1. **Push Changes to GitHub**:
   - Make changes to your project locally and commit them:
     ```bash
     git add .
     git commit -m "Update project"
     git push origin main
     ```

2. **Netlify Auto-Deploy**:
   - Netlify will detect the changes and automatically build and deploy your site.
   - You can monitor the deployment progress in the Netlify dashboard under the **Deploys** tab.

---

### Step 3: Verify Deployment

1. Once the deployment is complete, your site will be live at:

2. Test the following:
- The main site is accessible.
- Serverless functions are working (e.g., `https://<your-site-name>.netlify.app/.netlify/functions/datafile`).
- Edge functions are triggered as expected.

---

### Troubleshooting

- **Build Errors**:
  - Check the build logs in the Netlify dashboard under the **Deploys** tab.
  - Ensure all dependencies are installed and the [netlify.toml](http://_vscodecontentref_/2) file is correctly configured.

- **GitHub Repository Not Found**:
  - Ensure the repository is public or that Netlify has access to your private repositories.

- **Changes Not Deploying**:
  - Verify that you are pushing changes to the correct branch (e.g., `main`).
  - Check the **Deploys** tab in Netlify to see if the build was triggered.

---

By connecting Netlify to GitHub, you can streamline your deployment process and ensure your site is always up-to-date with the latest changes.
