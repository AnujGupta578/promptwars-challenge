# Google Cloud Run Deployment Guide

This guide provides the exact commands to deploy the **Universal Bridge** application to Google Cloud Run for the project `promptwar-challenge`.

## Prerequisites

1.  **Google Cloud SDK**: Install the `gcloud` CLI on your machine.
    *   **MacOS (Homebrew)**: `brew install --cask google-cloud-sdk`
    *   **Zero-Install Alternative**: Use the [Google Cloud Shell](https://console.cloud.google.com/home/dashboard?cloudshell=true) in your browser.
2.  **Authentication**: Run `gcloud auth login` followed by `gcloud config set project promptwar-challenge`.
3.  **API Enablement**: Ensure the following APIs are enabled:
    ```bash
    gcloud services enable run.googleapis.com \
                           artifactregistry.googleapis.com \
                           cloudbuild.googleapis.com
    ```

## Step 1: Create Artifact Registry Repository

Before building the image, create a repository to store it:

```bash
gcloud artifacts repositories create promptwar-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for the PromptWars challenge"
```

## Step 2: Build and Push with Cloud Build

We will use Google Cloud Build to create the Docker image in the cloud. This avoids needing Docker installed locally.

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/promptwar-challenge/promptwar-repo/lifelink-app
```

## Step 3: Deploy to Cloud Run

Deploy the container image to a serverless Cloud Run service.

> [!IMPORTANT]
> Change `YOUR_GEMINI_API_KEY` below to your actual API key before running.

```bash
gcloud run deploy lifelink-service \
    --image us-central1-docker.pkg.dev/promptwar-challenge/promptwar-repo/lifelink-app \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="GEMINI_API_KEY=YOUR_GEMINI_API_KEY,NODE_ENV=production"
```

## Step 4: Verify Deployment

Once the command finishes, it will print a Service URL (e.g., `https://lifelink-service-xxxx-uc.a.run.app`).

1.  Open the URL in your browser.
2.  Test the **InputHub** with a prompt to confirm the Gemini API is correctly responding.

---

### Troubleshooting

- **Permissions**: If deployment fails, ensure your user account has the `Cloud Run Admin` and `Storage Admin` roles.
- **Port**: The application is configured to listen on port `3000`, which Cloud Run handles automatically.
- **Environment Variables**: You can update the `GEMINI_API_KEY` anytime via the [Cloud Run Console](https://console.cloud.google.com/run).
