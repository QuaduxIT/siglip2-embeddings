#!/bin/bash
# Copyright © 2025-2026 Quadux IT GmbH
#    ____                  __              __________   ______          __    __  __
#   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
#  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
# / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
# \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
# License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
# Author: Walter Hoffmann

echo "=== Building SigLIP Embeddings Container ==="
echo "Model will be downloaded during Docker build (~800MB)"
echo

# Build container (includes model download)
docker build -t quaduxit/siglip2-embeddings build

docker rm -f siglip2-embeddings 2>/dev/null

echo "=== Starting Container ==="

# Check for --cpu flag
GPU_FLAG="--gpus all"
MODE="GPU (CUDA)"
if [ "$1" == "--cpu" ]; then
    GPU_FLAG=""
    MODE="CPU only"
fi

echo "Mode: $MODE"
docker run -d \
    --name siglip2-embeddings \
    $GPU_FLAG \
    -p 8091:8091 \
    --restart unless-stopped \
    quaduxit/siglip2-embeddings

echo
echo "Container started on port 8091"
echo "Health check: http://localhost:8091/health"
echo
echo "Usage: ./start.sh [--cpu]"
echo "  --cpu  Run without GPU (slower, but works everywhere)"
