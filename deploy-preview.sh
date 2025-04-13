#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
REMOTE_SERVER="steffen@v2202307202907233305.hotsrv.de"
REMOTE_DIR="/home/steffen/Entwicklung/sites"
DOMAIN="szs-preview.siriushms.com"

# SSH connection sharing configuration
SSH_CONTROL_PATH="/tmp/ssh-deploy"
SSH_OPTIONS="-o ControlMaster=auto -o ControlPath=${SSH_CONTROL_PATH} -o ControlPersist=10m"

# Function to run SSH commands using the shared connection
ssh_command() {
  ssh ${SSH_OPTIONS} "$REMOTE_SERVER" "$1"
  return $?
}

# Function to run SCP commands using the shared connection
scp_command() {
  scp ${SSH_OPTIONS} "$1" "$REMOTE_SERVER:$2"
  return $?
}

# Function to cleanup SSH control connection on exit
cleanup() {
  echo -e "\n${BLUE}Cleaning up SSH connection...${NC}"
  ssh -O exit -o ControlPath=${SSH_CONTROL_PATH} "$REMOTE_SERVER" 2>/dev/null
  exit $?
}

# Set up cleanup on script exit
trap cleanup EXIT

# Display deployment information
echo -e "Deploying Preview Environment to:"
echo -e "  Server: ${REMOTE_SERVER}"
echo -e "  Directory: ${REMOTE_DIR}"
echo -e "  Domain: ${DOMAIN}"
echo -e "  Docker Image: steffenhelbing/hotel_sites_preview:latest"
read -p "Continue with deployment? (y/n) " CONTINUE
if [ "$CONTINUE" != "y" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Step 1: Build and push Docker image
echo -e "\n${BLUE}Step 1: Building and pushing Docker image...${NC}"

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/docker"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE_PATH="${PROJECT_ROOT}/.env"

echo "Script directory: ${SCRIPT_DIR}"
echo "Project root: ${PROJECT_ROOT}"
echo "Env file path: ${ENV_FILE_PATH}"

# Load Docker Hub configuration
DOCKER_HUB_CONF="${SCRIPT_DIR}/docker-hub.conf"
echo "Loading Docker Hub configuration from ${DOCKER_HUB_CONF}"

if [ -f "$DOCKER_HUB_CONF" ]; then
  source "$DOCKER_HUB_CONF"
else
  echo -e "${RED}Error: Docker Hub configuration file not found at ${DOCKER_HUB_CONF}${NC}"
  exit 1
fi

# Set default values if not provided in config
DOCKER_USERNAME=${DOCKER_USERNAME:-"steffenhelbing"}
DOCKER_REPO=${DOCKER_REPO:-"hotel_sites_preview"}
DOCKER_TAG=${DOCKER_TAG:-"latest"}

# Build and push Docker image
echo "Building, tagging, and pushing image to Docker Hub..."
# Ensure we're using the preview repository
DOCKER_REPO="hotel_sites_preview"
DOCKER_IMAGE="${DOCKER_USERNAME}/${DOCKER_REPO}:${DOCKER_TAG}"

# Use the custom image name from docker-hub.conf if available
if [ -n "$CUSTOM_IMAGE_NAME" ]; then
  # Add -preview suffix to custom image name
  PREVIEW_IMAGE_NAME="${CUSTOM_IMAGE_NAME}-preview"
  echo "Using image name: ${PREVIEW_IMAGE_NAME}"
  docker build -t "${PREVIEW_IMAGE_NAME}" -f "${SCRIPT_DIR}/Dockerfile-preview" "${PROJECT_ROOT}"
  echo "Tagging image from ${PREVIEW_IMAGE_NAME} to ${DOCKER_IMAGE}"
  docker tag "${PREVIEW_IMAGE_NAME}" "${DOCKER_IMAGE}"
else
  echo "Using default image name: ${DOCKER_IMAGE}"
  # Force the correct image name by explicitly setting it
  docker build -t "${DOCKER_USERNAME}/${DOCKER_REPO}:${DOCKER_TAG}" -f "${SCRIPT_DIR}/Dockerfile-preview" "${PROJECT_ROOT}"
fi

# Push image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push "${DOCKER_IMAGE}"

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to push image to Docker Hub.${NC}"
  exit 1
fi

echo -e "${GREEN}Image successfully pushed to Docker Hub: ${DOCKER_IMAGE}${NC}"

# Step 2: Create remote directory
echo -e "\n${BLUE}Step 2: Creating remote directory...${NC}"
ssh_command "mkdir -p $REMOTE_DIR"

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to create directory on remote server.${NC}"
  exit 1
fi

# Step 3: Copy .env file to remote server
echo -e "\n${BLUE}Step 3: Copying .env file to remote server...${NC}"
scp_command "$ENV_FILE_PATH" "$REMOTE_DIR/"

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to copy .env file to remote server.${NC}"
  exit 1
fi

# Step 4: Create docker-compose.yml on remote server
echo -e "\n${BLUE}Step 4: Creating docker-compose.yml on remote server...${NC}"

# Step 6: Create docker-compose.yml with the correct network configuration
echo -e "\n${BLUE}Step 6: Creating docker-compose.yml with correct network configuration...${NC}"
ssh_command "cat > $REMOTE_DIR/docker-compose.yml << 'EOL'
version: '3.8'

services:
  hotel-stern-preview:
    image: ${DOCKER_USERNAME}/${DOCKER_REPO}:${DOCKER_TAG}
    env_file:
      - ./.env
    environment:
      - HOST=0.0.0.0
      - PORT=5000
      - NODE_ENV=development
      - SSR_MODE=true
      - PUBLIC_PREVIEW=true
    networks:
      - containers_internal
      - containers_web
    labels:
      - \"traefik.enable=true\"
      - \"traefik.docker.network=containers_web\"

      # HTTPS Route
      - \"traefik.http.routers.hotel-stern-preview.rule=Host(\`${DOMAIN}\`)\"
      - \"traefik.http.routers.hotel-stern-preview.entrypoints=websecure\"
      - \"traefik.http.routers.hotel-stern-preview.tls.certresolver=myresolver\"
      - \"traefik.http.services.hotel-stern-preview.loadbalancer.server.port=3000\"
      - \"traefik.http.middlewares.hotel-stern-preview-compress.compress=true\"
      - \"traefik.http.routers.hotel-stern-preview.middlewares=hotel-stern-preview-compress\"

      # HTTP => HTTPS Redirect
      - \"traefik.http.routers.hotel-stern-preview-insecure.rule=Host(\`${DOMAIN}\`)\"
      - \"traefik.http.routers.hotel-stern-preview-insecure.entrypoints=web\"
      - \"traefik.http.routers.hotel-stern-preview-insecure.middlewares=hotel-stern-preview-https-redirect\"
      - \"traefik.http.middlewares.hotel-stern-preview-https-redirect.redirectscheme.scheme=https\"
    restart: unless-stopped

networks:
  containers_web:
    external: true
  containers_internal:
    external: true
EOL"

# Step 7: Pull and start the container on the remote server
echo -e "\n${BLUE}Step 7: Pulling and starting the container on the remote server...${NC}"

# First check if container exists and remove it to avoid ContainerConfig error
echo -e "${YELLOW}Checking for existing container...${NC}"
ssh_command "cd $REMOTE_DIR && docker-compose down || true"

# Pull the latest image
echo -e "${YELLOW}Pulling latest image...${NC}"
ssh_command "cd $REMOTE_DIR && docker-compose pull"

# Start the container with --force-recreate to avoid volume binding issues
echo -e "${YELLOW}Starting container...${NC}"
ssh_command "cd $REMOTE_DIR && docker-compose up -d --force-recreate"

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to deploy container on remote server.${NC}"
  exit 1
fi

echo -e "\n${GREEN}Deployment successful!${NC}"
echo -e "Your Preview application is now available at: https://${DOMAIN}"
echo -e "To check the logs, run: ssh ${REMOTE_SERVER} \"cd ${REMOTE_DIR} && docker-compose logs -f\""
