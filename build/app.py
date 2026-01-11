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
import io
import base64
import logging
from contextlib import asynccontextmanager
from typing import List, Optional

import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import AutoProcessor, AutoModel

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = os.getenv("MODEL_NAME", "google/siglip2-base-patch16-naflex")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_CACHE = os.getenv("MODEL_CACHE", "/app/models")

# Global model references
model = None
processor = None


def load_model():
    """Load SigLIP model and processor."""
    global model, processor
    
    logger.info(f"Loading SigLIP model: {MODEL_NAME}")
    logger.info(f"Device: {DEVICE}")
    logger.info(f"Cache dir: {MODEL_CACHE}")
    
    # Use local_files_only=True for offline/Docker mode
    local_only = os.getenv("HF_HUB_OFFLINE", "0") == "1"
    
    processor = AutoProcessor.from_pretrained(
        MODEL_NAME,
        cache_dir=MODEL_CACHE,
        local_files_only=local_only,
        use_fast=True
    )
    
    model = AutoModel.from_pretrained(
        MODEL_NAME,
        cache_dir=MODEL_CACHE,
        local_files_only=local_only,
        dtype=torch.float16 if DEVICE == "cuda" else torch.float32
    ).to(DEVICE).eval()
    
    logger.info(f"Model loaded successfully!")
    logger.info(f"Text embedding dim: {model.config.text_config.hidden_size}")
    logger.info(f"Vision embedding dim: {model.config.vision_config.hidden_size}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup."""
    load_model()
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="SigLIP Embeddings API",
    description="Cross-Modal Text-Image Embeddings",
    version="1.0.0",
    lifespan=lifespan
)


# ============ Request/Response Models ============

class TextRequest(BaseModel):
    texts: List[str]
    normalize: bool = True

class TextResponse(BaseModel):
    embeddings: List[List[float]]
    dimensions: int
    model: str

class ImageResponse(BaseModel):
    embeddings: List[List[float]]
    dimensions: int
    model: str

class SimilarityRequest(BaseModel):
    texts: List[str]
    
class SimilarityResponse(BaseModel):
    similarities: List[List[float]]
    text_embeddings: List[List[float]]
    image_embeddings: List[List[float]]


# ============ Helper Functions ============

def normalize_embeddings(embeddings: np.ndarray) -> np.ndarray:
    """L2 normalize embeddings."""
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    return embeddings / np.maximum(norms, 1e-12)


async def load_image(file: UploadFile) -> Image.Image:
    """Load image from upload."""
    content = await file.read()
    return Image.open(io.BytesIO(content)).convert("RGB")


def decode_base64_image(b64_string: str) -> Image.Image:
    """Decode base64 image."""
    # Remove data URI prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",")[1]
    image_data = base64.b64decode(b64_string)
    return Image.open(io.BytesIO(image_data)).convert("RGB")


# ============ API Endpoints ============

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "model": MODEL_NAME,
        "device": DEVICE,
        "dimensions": model.config.text_config.hidden_size if model else None
    }


@app.get("/info")
async def info():
    """Model information."""
    return {
        "model": MODEL_NAME,
        "device": DEVICE,
        "text_dim": model.config.text_config.hidden_size,
        "vision_dim": model.config.vision_config.hidden_size,
        "image_size": getattr(model.config.vision_config, "image_size", "flexible"),
        "cross_modal": True,
        "description": "SigLIP produces aligned text and image embeddings in the same vector space"
    }


@app.post("/embed/text", response_model=TextResponse)
async def embed_text(request: TextRequest):
    """Generate text embeddings."""
    try:
        inputs = processor(
            text=request.texts,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        ).to(DEVICE)
        
        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
        
        embeddings = text_features.cpu().numpy().astype(np.float32)
        
        if request.normalize:
            embeddings = normalize_embeddings(embeddings)
        
        return TextResponse(
            embeddings=embeddings.tolist(),
            dimensions=embeddings.shape[1],
            model=MODEL_NAME
        )
    except Exception as e:
        logger.error(f"Text embedding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/embed/image", response_model=ImageResponse)
async def embed_image(
    file: UploadFile = File(None),
    image_base64: str = Form(None),
    normalize: bool = Form(True)
):
    """Generate image embedding from file upload or base64."""
    try:
        # Load image
        if file and file.filename:
            image = await load_image(file)
        elif image_base64:
            image = decode_base64_image(image_base64)
        else:
            raise HTTPException(status_code=400, detail="No image provided")
        
        # Process image
        inputs = processor(images=image, return_tensors="pt").to(DEVICE)
        
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
        
        embeddings = image_features.cpu().numpy().astype(np.float32)
        
        if normalize:
            embeddings = normalize_embeddings(embeddings)
        
        return ImageResponse(
            embeddings=embeddings.tolist(),
            dimensions=embeddings.shape[1],
            model=MODEL_NAME
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image embedding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/embed/images", response_model=ImageResponse)
async def embed_images(
    files: List[UploadFile] = File(...),
    normalize: bool = Form(True)
):
    """Generate embeddings for multiple images."""
    try:
        images = []
        for file in files:
            img = await load_image(file)
            images.append(img)
        
        inputs = processor(images=images, return_tensors="pt").to(DEVICE)
        
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
        
        embeddings = image_features.cpu().numpy().astype(np.float32)
        
        if normalize:
            embeddings = normalize_embeddings(embeddings)
        
        return ImageResponse(
            embeddings=embeddings.tolist(),
            dimensions=embeddings.shape[1],
            model=MODEL_NAME
        )
    except Exception as e:
        logger.error(f"Multi-image embedding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/similarity")
async def compute_similarity(
    files: List[UploadFile] = File(...),
    texts: str = Form(...)  # JSON array as string
):
    """
    Compute cross-modal similarity between texts and images.
    This is what SigLIP is designed for!
    
    Returns similarity matrix: [num_texts x num_images]
    """
    import json
    
    try:
        text_list = json.loads(texts)
        
        # Load images
        images = []
        for file in files:
            img = await load_image(file)
            images.append(img)
        
        # Process both
        inputs = processor(
            text=text_list,
            images=images,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        ).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(**inputs)
            
            # Get normalized features
            text_embeds = outputs.text_embeds
            image_embeds = outputs.image_embeds
            
            # Compute similarity (already normalized by SigLIP)
            # logits_per_text: [num_texts, num_images]
            logits_per_text = outputs.logits_per_text
            
            # Convert to probabilities with sigmoid (SigLIP uses sigmoid, not softmax!)
            similarities = torch.sigmoid(logits_per_text)
        
        return {
            "similarities": similarities.cpu().numpy().tolist(),
            "text_embeddings": text_embeds.cpu().numpy().tolist(),
            "image_embeddings": image_embeds.cpu().numpy().tolist(),
            "note": "Similarities are sigmoid-normalized (0-1 range)"
        }
    except Exception as e:
        logger.error(f"Similarity error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/rank")
async def rank_images(
    files: List[UploadFile] = File(...),
    query: str = Form(...)
):
    """
    Rank images by relevance to a text query.
    Returns images sorted by similarity score.
    """
    try:
        images = []
        filenames = []
        for file in files:
            img = await load_image(file)
            images.append(img)
            filenames.append(file.filename)
        
        inputs = processor(
            text=[query],
            images=images,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        ).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(**inputs)
            similarities = torch.sigmoid(outputs.logits_per_text)[0]
        
        # Sort by similarity
        scores = similarities.cpu().numpy().tolist()
        ranked = sorted(
            zip(filenames, scores),
            key=lambda x: x[1],
            reverse=True
        )
        
        return {
            "query": query,
            "rankings": [
                {"filename": fn, "score": round(sc, 4), "rank": i+1}
                for i, (fn, sc) in enumerate(ranked)
            ]
        }
    except Exception as e:
        logger.error(f"Ranking error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8091)
