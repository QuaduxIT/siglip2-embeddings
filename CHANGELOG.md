<!--
Copyright © 2025-2026 Quadux IT GmbH
   ____                  __              __________   ______          __    __  __
  / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
 / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
/ /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
\___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
Author: Walter Hoffmann
-->

# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [1.0.0] - 2026-01-11

### 🎉 Initial Release

Erste stabile Version des SigLIP Embeddings API Containers.

### Added

- **LICENSE-Datei** - Explizite Apache 2.0-Lizenzdatei im Verzeichnis (Quadux-Dateien). SigLIP-Modell: Apache 2.0 (Google).
- **NOTICE** - Third-Party-Hinweise für Google SigLIP Model
- **Cross-Modal Text-Image Embeddings** - Echte Text-zu-Bild-Suche mit kontrastivem Training
- **Docker Container** - Vollständig offline-fähiger Container (~800MB mit Modell)
- **Multiple API Endpoints**:
  - `/health` - Gesundheitsstatus
  - `/info` - Modellinformationen
  - `/embed/text` - Text-Embeddings (768 dims)
  - `/embed/image` - Einzelbild-Embeddings
  - `/embed/images` - Mehrere Bilder gleichzeitig
  - `/similarity` - Cross-Modal Similarity Matrix
  - `/rank` - Ranking von Bildern nach Text-Query
- **GPU & CPU Support** - CUDA 13.0 (RTX 5090 Blackwell sm_120) oder CPU-Fallback
- **Docker Healthcheck** - Automatische Gesundheitsprüfung
- **Offline-fähig** - Modell wird beim Build heruntergeladen
- **Test Suite** - Umfangreiche Tests mit klassischen Texten und Bildern
- **Start Scripts** - `start.bat` (Windows) und `start.sh` (Linux/macOS)
- **Lizenz-Header** - Alle Dateien mit einheitlichem Copyright-Header (Apache 2.0)
- **Dokumentation**:
  - README mit "Warum dieses Projekt?" Sektion
  - Sprachunterstützung-Guide (Englisch/Deutsch)
  - Text-Stil und Matching-Qualität Analyse
  - Vergleich mit Jina v4
  - Umgebungsvariablen-Dokumentation
  - Verzeichnisstruktur-Übersicht
- **Test Assets**:
  - Testbilder von Unsplash (Public Domain, Full HD)
  - Klassische Literatur-Texte (Public Domain)
  - Quellenangaben in SOURCES.md Dateien

### Technical Details

- **Base Image:** `pytorch/pytorch:2.9.1-cuda13.0-cudnn9-runtime`
- **GPU:** RTX 5090 (Blackwell, sm_120) Support
- **Model:** `google/siglip2-base-patch16-224` (Standard)
- **Embedding Dimension:** 768
- **Max. Image Resolution:** 224x224
- **Framework:** FastAPI + Uvicorn
- **Modellgröße:** ~400MB (base model)
- **VRAM:** ~2GB

### Features

- ✅ **Text-zu-Bild-Suche** - Finden Sie Bilder anhand von Textbeschreibungen
- ✅ **Bild-zu-Text-Matching** - Ordnen Sie Bilder zu passenden Beschreibungen zu
- ✅ **Echtes kontrastives Training** - Text und Bild im gleichen Vektorraum
- ✅ **Cross-Modal Similarity** - Similarity-Matrix zwischen Texten und Bildern
- ✅ **Image Ranking** - Sortieren Sie Bilder nach Relevanz zu einer Query
- ✅ **Schnell und ressourcensparend** - Nur ~400MB Modell, ~2GB VRAM

### Known Limitations

- **Sprachunterstützung:** Primär für Englisch optimiert (~88% Accuracy)
  - Deutsche Texte: ~50% Accuracy (funktioniert, aber niedrigere Scores)
  - Empfehlung: Deutsche Queries ins Englische übersetzen
- **Text-Stil:** Optimiert für kurze, direkte Beschreibungen
  - Poetische/literarische Texte haben sehr niedrige Accuracy
  - Metaphorische Sprache wird nicht gut erkannt
  - Training auf Bild-Alt-Texte, nicht auf literarische Werke

### Recommendations

- **Produktiveinsatz:** Kurze, beschreibende englische Queries verwenden
- **Text-Suche (RAG, Dokumente):** Jina v4 verwenden (Port 8090)
- **Bild-Suche (Text→Image):** SigLIP verwenden (Port 8091)
- **Nicht-englische Texte:** Query-Übersetzung vor dem Embedding

---

[1.0.0]: https://github.com/quaduxit/siglip-embeddings/releases/tag/v1.0.0
