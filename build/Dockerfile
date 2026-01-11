# Copyright © 2025-2026 Quadux IT GmbH
#    ____                  __              __________   ______          __    __  __
#   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
#  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
# / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
# \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
# License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
# Author: Walter Hoffmann


# PyTorch 2.9.1 with CUDA 13.0 for RTX 5090 (Blackwell, sm_120)
FROM pytorch/pytorch:2.9.1-cuda13.0-cudnn9-runtime

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV MODEL_CACHE=/app/models
ENV HF_HOME=/app/models

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create model cache directory
RUN mkdir -p /app/models

# Download model during build (baked into image)
COPY download_model.py .
RUN python download_model.py

# Note: HF_HUB_OFFLINE disabled due to transformers bug with tokenizer loading
# ENV HF_HUB_OFFLINE=1
# ENV TRANSFORMERS_OFFLINE=1

COPY LICENSE ./LICENSE
COPY NOTICE ./NOTICE
# Copy application
COPY app.py .

# Expose port
EXPOSE 8091

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8091/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8091"]
