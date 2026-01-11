@echo off
REM Copyright © 2025-2026 Quadux IT GmbH
REM    ____                  __              __________   ______          __    __  __
REM   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
REM  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
REM / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
REM \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
REM License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
REM Author: Walter Hoffmann

echo === Building SigLIP Embeddings Container ===
echo Model will be downloaded during Docker build (~800MB)
echo.

REM Build container (includes model download)
docker build -t quaduxit/siglip2-embeddings build

docker rm -f siglip2-embeddings 2>nul

echo === Starting Container ===

REM Check for --cpu flag
set "GPU_FLAG=--gpus all"
set "MODE=GPU (CUDA)"
if "%1"=="--cpu" (
    set "GPU_FLAG="
    set "MODE=CPU only"
)

echo Mode: %MODE%
docker run -d ^
    --name siglip2-embeddings ^
    %GPU_FLAG% ^
    -p 8091:8091 ^
    --restart unless-stopped ^
    quaduxit/siglip2-embeddings

echo.
echo Container started on port 8091
echo Health check: http://localhost:8091/health
echo.
echo Usage: start.bat [--cpu]
echo   --cpu  Run without GPU (slower, but works everywhere)
