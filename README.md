[![Quadux IT Logo](https://quadux.it/Logo.png)](https://quadux.it/)

Copyright © 2025-2026 Quadux IT GmbH

License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
Author: Walter Hoffmann

# SigLIP Embeddings API

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![Docker Hub](https://img.shields.io/badge/docker-quaduxit%2Fsiglip2--embeddings-blue.svg)](https://hub.docker.com/r/quaduxit/siglip2-embeddings)
[![GitHub](https://img.shields.io/badge/github-quaduxit%2Fsiglip2--embeddings-black.svg)](https://github.com/quaduxit/siglip2-embeddings)

Cross-Modal Text-Image Embeddings that **actually work**!

## Warum dieses Projekt?

Wir haben diese Software geschrieben, um **echte Cross-Modal-Suche** zwischen Text und Bildern zu ermöglichen. SigLIP ist speziell für Text-zu-Bild-Matching trainiert - im Gegensatz zu vielen anderen Modellen, die zwar Text- und Bild-Embeddings bieten, aber nicht im gleichen Vektorraum arbeiten.

Mit diesem Projekt erhalten Sie:

- 🔍 **Text-zu-Bild-Suche** - Finden Sie Bilder anhand von Textbeschreibungen
- 🖼️ **Bild-zu-Text-Matching** - Ordnen Sie Bilder zu passenden Beschreibungen zu
- 🎯 **Echtes kontrastives Training** - Text und Bild im gleichen Vektorraum
- 🚀 **Schnell und ressourcensparend** - Nur ~400MB Modellgröße, ~2GB VRAM

## Model

**google/siglip2-base-patch16-224**

- Base model (~400MB)
- 768 dimensions
- 224px image resolution
- Apache 2.0 License
- **Echtes kontrastives Training** - Text und Bild im gleichen Vektorraum!

Alternative größere Modelle:

- `siglip2-so400m-patch14-384` (400M params, 1152 dim, 384px)

## Sprachunterstützung

⚠️ **Wichtig**: SigLIP wurde primär auf englischen Bild-Text-Paaren trainiert (WebLI Dataset).

| Sprache     | Text→Image Accuracy | Empfehlung                              |
| ----------- | ------------------- | --------------------------------------- |
| 🇬🇧 Englisch | ~88%                | ✅ Optimal                              |
| 🇩🇪 Deutsch  | ~50%                | ⚠️ Funktioniert, aber niedrigere Scores |

### Optionen für nicht-englische Texte

| Ansatz                    | Aufwand | Qualität |
| ------------------------- | ------- | -------- |
| 🔄 **Queries übersetzen** | Gering  | Sehr gut |
| 🌍 **Multilingual-CLIP**  | Mittel  | Gut      |
| 📝 **Englische Keywords** | Gering  | Okay     |

**Empfehlung**: Deutsche Suchanfragen vor dem Embedding ins Englische übersetzen (z.B. via DeepL API oder lokales Übersetzungsmodell wie Helsinki-NLP/opus-mt-de-en).

Der **Vision-Encoder ist sprachneutral** - Bilder selbst brauchen keine Anpassung. Nur der Text-Encoder bevorzugt Englisch.

## Text-Stil und Matching-Qualität

📊 **Wichtige Erkenntnis aus Tests mit klassischer Literatur:**

| Text-Stil                                | Accuracy | Beispiel                               |
| ---------------------------------------- | -------- | -------------------------------------- |
| 🔤 **Kurze, direkte Beschreibungen**     | ~88%     | "a cat sitting on a chair"             |
| 📜 **Poetische/literarische Texte (EN)** | ~0%      | "Tyger Tyger, burning bright..."       |
| 📜 **Poetische/literarische Texte (DE)** | ~50%     | "Wie herrlich leuchtet mir die Natur!" |

### Warum?

SigLIP wurde auf **Bild-Beschreibungen** trainiert (Alt-Text, Captions), nicht auf metaphorische Literatur:

- ✅ **Funktioniert gut**: "colorful spring flowers blooming in the sun"
- ❌ **Funktioniert schlecht**: "I wandered lonely as a cloud" (Wordsworth)
- ❌ **Funktioniert schlecht**: "Tyger Tyger, burning bright, In the forests of the night" (Blake)

### Empfehlung für Produktiveinsatz

```
✅ DO:  Kurze, beschreibende englische Queries verwenden
✅ DO:  Konkrete Objekte und Szenen beschreiben
❌ DON'T: Metaphorische oder abstrakte Sprache verwenden
❌ DON'T: Lange literarische Texte als Suchquery nutzen
```

**Die klassischen Texte im Test (`test/texts/classic_texts.js`) dienen als Benchmark für die Grenzen des Modells, nicht als Beispiel für produktive Nutzung.**

## API Endpoints

| Endpoint        | Method | Description                   |
| --------------- | ------ | ----------------------------- |
| `/health`       | GET    | Health check                  |
| `/info`         | GET    | Model information             |
| `/embed/text`   | POST   | Text embeddings               |
| `/embed/image`  | POST   | Single image embedding        |
| `/embed/images` | POST   | Multiple image embeddings     |
| `/similarity`   | POST   | Cross-modal similarity matrix |
| `/rank`         | POST   | Rank images by text query     |

## Quick Start

### Mit Start-Scripts (empfohlen)

```bash
.\start.bat          # Windows
./start.sh           # Linux/macOS
```

### Manuell mit Docker

```bash
# Lokales Build
docker build -t quaduxit/siglip-embeddings .

# Oder von Docker Hub:
docker pull quaduxit/siglip-embeddings:latest

# Container starten
docker run -d --name siglip-embed \
  --gpus all \
  -p 8091:8000 \
  quaduxit/siglip-embeddings

# Health Check
curl http://localhost:8091/health
```

## Usage Examples

### Text Embedding

```bash
curl -X POST http://localhost:8091/embed/text \
  -H "Content-Type: application/json" \
  -d '{"texts": ["a photo of a cat", "a photo of a dog"]}'
```

### Image Embedding

```bash
curl -X POST http://localhost:8091/embed/image \
  -F "file=@cat.jpg"
```

### Cross-Modal Similarity (THE MAIN USE CASE!)

```bash
curl -X POST http://localhost:8091/similarity \
  -F "files=@cat.jpg" \
  -F "files=@dog.jpg" \
  -F "texts=[\"a photo of a cat\", \"a photo of a dog\"]"
```

Response:

```json
{
  "similarities": [
    [0.85, 0.12], // "cat" query: 85% cat.jpg, 12% dog.jpg
    [0.15, 0.82] // "dog" query: 15% cat.jpg, 82% dog.jpg
  ]
}
```

### Rank Images by Query

```bash
curl -X POST http://localhost:8091/rank \
  -F "files=@img1.jpg" \
  -F "files=@img2.jpg" \
  -F "files=@img3.jpg" \
  -F "query=a sunset over mountains"
```

## Vergleich mit Jina v4

| Feature          | Jina v4               | SigLIP                  |
| ---------------- | --------------------- | ----------------------- |
| Text ↔ Text      | ✅ Excellent (0.81)   | ⚠️ OK                   |
| Image ↔ Image    | ⚠️ OK (0.30)          | ✅ Good                 |
| **Text ↔ Image** | ❌ Broken (0.01-0.06) | ✅ **Works! (0.3-0.8)** |
| Modellgröße      | 7.5GB                 | ~400MB                  |
| VRAM             | ~16GB                 | ~2GB                    |
| Dimensionen      | 2048                  | 768                     |

## Empfehlung

- **Text-Suche (RAG, Dokumente)**: Jina v4 (Port 8090)
- **Bild-Suche (Text→Image)**: SigLIP (Port 8091)

## Umgebungsvariablen

| Variable     | Default                           | Beschreibung       |
| ------------ | --------------------------------- | ------------------ |
| `API_HOST`   | `0.0.0.0`                         | Bind-Adresse       |
| `API_PORT`   | `8091`                            | API-Port           |
| `FORCE_CPU`  | -                                 | `1` für CPU-Modus  |
| `HF_HOME`    | `/models`                         | Hugging Face Cache |
| `MODEL_NAME` | `google/siglip2-base-patch16-224` | Modellname         |

## Tests

```bash
cd test
node test.js
```

Testet:

- ✅ Health endpoint
- ✅ Text embeddings
- ✅ Image embeddings
- ✅ Cross-modal similarity
- ✅ Image ranking

## Verzeichnisstruktur

```
siglip-embeddings-docker/
├── build/
│   ├── Dockerfile          # Container-Definition
│   ├── app.py              # FastAPI Server
│   ├── download_model.py   # Model Download Script
│   └── requirements.txt    # Python-Abhängigkeiten
├── test/
│   ├── photos/             # Testbilder (Unsplash)
│   ├── texts/              # Testtexte (Public Domain)
│   └── test.js             # Test-Suite
├── LICENSE                 # Apache 2.0-Lizenz (Quadux-Dateien)
├── NOTICE                  # Third-Party-Hinweise (Google SigLIP)
├── CHANGELOG.md            # Änderungsprotokoll
├── NOTICE                  # Third-Party-Hinweise (Google SigLIP)
├── start.bat               # Windows Start-Script
├── start.sh                # Linux/macOS Start-Script
└── README.md               # Diese Dokumentation
```

## Technische Details

- **Base Image:** `pytorch/pytorch:2.9.1-cuda13.0-cudnn9-runtime`
- **GPU:** CUDA 13.0 Support (RTX 5090 Blackwell sm_120)
- **Model:** `google/siglip2-base-patch16-224`
- **Embedding Dimension:** 768
- **Max. Image Resolution:** 224x224
- **Framework:** FastAPI + Uvicorn

## Lizenz

Dieser Docker-Container und die Quadux-spezifischen Container-Steuerungen stehen unter der **Apache License 2.0** (siehe [LICENSE](LICENSE)).

### SigLIP Model

Das Modell `google/siglip2-base-patch16-224` ist ebenfalls unter der **Apache License 2.0** von Google LLC lizenziert:

- ✅ **Kommerzielle Nutzung erlaubt** ohne Einschränkungen
- ✅ **Patent-Grant enthalten**
- ✅ **Keine Trademark-Rechte**

Weitere Details:

- **[NOTICE](NOTICE)** – Third-Party-Hinweise für Google SigLIP
- **[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)** – Volltext der Lizenz

### Test Assets

Die Testbilder stammen von Unsplash und unterliegen der [Unsplash License](https://unsplash.com/license) (kostenlose kommerzielle Nutzung, keine Attribution erforderlich, aber Credits in [test/photos/SOURCES.md](test/photos/SOURCES.md) angegeben).

Die Testtexte sind gemeinfreie klassische Literatur (Public Domain) mit Quellenangaben in [test/texts/SOURCES.md](test/texts/SOURCES.md).

## Support & Haftungsausschluss

> &nbsp;
>
> ⚠️ **Kein Support durch Quadux IT GmbH**
>
> Dieses Projekt wird „as is" ohne Gewährleistung oder Support bereitgestellt. Wir können **keine Fragen zum SigLIP-Modell selbst** beantworten und leisten **keinen technischen Support** für dieses Paket.
>
> Bei Fragen zum Modell `google/siglip2-base-patch16-224` wenden Sie sich bitte an:
>
> - **Hugging Face:** [huggingface.co/google/siglip2-base-patch16-224](https://huggingface.co/google/siglip2-base-patch16-224)
> - **Google Research:** [github.com/google-research/big_vision](https://github.com/google-research/big_vision)
>
> &nbsp;
