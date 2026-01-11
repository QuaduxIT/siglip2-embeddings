# Copyright © 2025-2026 Quadux IT GmbH
#    ____                  __              __________   ______          __    __  __
#   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
#  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
# / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
# \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
# License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
# Author: Walter Hoffmann

"""
SigLIP2 Embeddings API Server
Cross-Modal Text-Image Embeddings that actually work!

Model: google/siglip2-base-patch16-224 (default)
- Apache 2.0 License
- Text and image embeddings in the same vector space

Available models (via MODEL_NAME env var):

  Base (0.4B params, 768 dim):
  - google/siglip2-base-patch16-224      224px, ~800MB, fastest, good baseline
  - google/siglip2-base-patch16-naflex   flexible resolution, better for varied image sizes

  Large (0.9B params, 1024 dim):
  - google/siglip2-large-patch16-256     256px, better quality than base
  - google/siglip2-large-patch16-384     384px, higher resolution details

  So400m (1B params, 1152 dim):
  - google/siglip2-so400m-patch14-384    384px, best fixed-resolution quality
  - google/siglip2-so400m-patch16-naflex flexible resolution, most popular

  Giant (2B params, 1536 dim):
  - google/siglip2-giant-opt-patch16-384 384px, highest quality, ~4GB, slowest

Recommendations:
  - Production/Speed: base-patch16-224 (default)
  - Quality/Speed balance: so400m-patch14-384
  - Maximum quality: giant-opt-patch16-384
  - Variable image sizes: *-naflex variants
"""


import os
from transformers import AutoProcessor, AutoModel

MODEL_NAME = "google/siglip2-base-patch16-naflex"

CACHE_DIR = os.getenv("MODEL_CACHE", "./models")

print(f"Downloading {MODEL_NAME} to {CACHE_DIR}...")

# Download processor
print("Downloading processor...")
processor = AutoProcessor.from_pretrained(MODEL_NAME, cache_dir=CACHE_DIR)

# Download model
print("Downloading model...")
model = AutoModel.from_pretrained(MODEL_NAME, cache_dir=CACHE_DIR)

print(f"\n✅ Model downloaded successfully!")
print(f"   Text dim: {model.config.text_config.hidden_size}")
print(f"   Vision dim: {model.config.vision_config.hidden_size}")
image_size = getattr(model.config.vision_config, "image_size", "flexible (naflex)")
print(f"   Image size: {image_size}")
