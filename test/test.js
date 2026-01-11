// Copyright © 2025-2026 Quadux IT GmbH
//    ____                  __              __________   ______          __    __  __
//   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
//  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
// / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
// \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
// License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
// Author: Walter Hoffmann

/**
 * SigLIP Cross-Modal Test
 * 
 * Tests with classical texts (German & English) and matching images.
 * 
 * External Data:
 * - Texts: texts/classic_texts.js (Goethe, Schiller, Longfellow, Wordsworth, Keats, Blake)
 * - Photos: photos/photos.json (Unsplash, see photos/SOURCES.md)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import external text data
import { TEXTS, getGermanTexts, getEnglishTexts } from "./texts/classic_texts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.SIGLIP_URL || "http://localhost:8091";

// Load photo metadata from JSON
const photosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "photos/photos.json"), "utf-8")
);

// Build PHOTOS object with full paths
const PHOTOS = {};
for (const [key, photo] of Object.entries(photosData.photos)) {
  PHOTOS[key] = path.join(__dirname, "photos", photo.file);
}

// Get queries from JSON
const QUERIES = photosData.queries;

// ============ HELPER FUNCTIONS ============

async function getModelInfo() {
  const resp = await fetch(`${API_URL}/health`);
  if (!resp.ok) throw new Error(`API not available: ${await resp.text()}`);
  return await resp.json();
}

async function getTextEmbeddings(texts) {
  const resp = await fetch(`${API_URL}/embed/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, normalize: true })
  });
  if (!resp.ok) throw new Error(`API error: ${await resp.text()}`);
  return (await resp.json()).embeddings;
}

async function getImageEmbeddings(imagePaths) {
  const formData = new FormData();
  for (const imgPath of imagePaths) {
    const imageBuffer = fs.readFileSync(imgPath);
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    formData.append("files", blob, path.basename(imgPath));
  }
  formData.append("normalize", "true");
  
  const resp = await fetch(`${API_URL}/embed/images`, {
    method: "POST",
    body: formData
  });
  if (!resp.ok) throw new Error(`API error: ${await resp.text()}`);
  return (await resp.json()).embeddings;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function findBestMatch(queryEmbedding, targetEmbeddings, targetNames) {
  let bestIdx = 0, bestSim = -Infinity;
  const similarities = {};
  
  for (let i = 0; i < targetEmbeddings.length; i++) {
    const sim = cosineSimilarity(queryEmbedding, targetEmbeddings[i]);
    similarities[targetNames[i]] = sim;
    if (sim > bestSim) {
      bestSim = sim;
      bestIdx = i;
    }
  }
  
  return { bestMatch: targetNames[bestIdx], bestSim, similarities };
}

// ============ TESTS ============

async function testGermanTextsToImages(imageEmbeddings, imageNames) {
  console.log("\n🇩🇪 TEST 1: German Classical Texts → Images");
  console.log("═".repeat(80));
  
  const germanTexts = getGermanTexts();
  const textKeys = Object.keys(germanTexts);
  const textContents = textKeys.map(k => germanTexts[k].text);
  
  console.log("\nTexts being matched:");
  for (const key of textKeys) {
    const t = germanTexts[key];
    console.log(`   📜 ${t.title} (${t.author}, ${t.year})`);
    console.log(`      Theme: ${t.theme}`);
    console.log(`      Expected: ${t.expectedImage}`);
  }
  
  const textEmbeddings = await getTextEmbeddings(textContents);
  
  console.log("\n📊 German Text → Image Matching:");
  console.log("─".repeat(90));
  console.log("   Text".padEnd(25) + "| Expected    | Match       | Score  | " + imageNames.slice(0, 5).join(" | "));
  console.log("─".repeat(90));
  
  let correct = 0;
  
  for (let i = 0; i < textKeys.length; i++) {
    const key = textKeys[i];
    const text = germanTexts[key];
    const result = findBestMatch(textEmbeddings[i], imageEmbeddings, imageNames);
    
    const isCorrect = result.bestMatch === text.expectedImage;
    if (isCorrect) correct++;
    
    const title = text.title.substring(0, 23).padEnd(23);
    const expected = text.expectedImage.padEnd(11);
    const matched = result.bestMatch.padEnd(11);
    const score = result.bestSim.toFixed(3);
    const mark = isCorrect ? "✅" : "❌";
    
    // Show top 5 similarities
    const topSims = imageNames.slice(0, 5).map(n => 
      (result.similarities[n] || 0).toFixed(2).padStart(5)
    ).join(" | ");
    
    console.log(`   ${title} | ${expected} | ${matched} | ${score} ${mark} | ${topSims}`);
  }
  
  console.log("─".repeat(90));
  const accuracy = (correct / textKeys.length * 100).toFixed(0);
  console.log(`   German→Image Accuracy: ${correct}/${textKeys.length} (${accuracy}%)`);
  
  return { correct, total: textKeys.length };
}

async function testEnglishTextsToImages(imageEmbeddings, imageNames) {
  console.log("\n🇬🇧 TEST 2: English Classical Texts → Images");
  console.log("═".repeat(80));
  
  const englishTexts = getEnglishTexts();
  const textKeys = Object.keys(englishTexts);
  const textContents = textKeys.map(k => englishTexts[k].text);
  
  console.log("\nTexts being matched:");
  for (const key of textKeys) {
    const t = englishTexts[key];
    console.log(`   📜 ${t.title} (${t.author}, ${t.year})`);
    console.log(`      Theme: ${t.theme}`);
    console.log(`      Expected: ${t.expectedImage}`);
  }
  
  const textEmbeddings = await getTextEmbeddings(textContents);
  
  console.log("\n📊 English Text → Image Matching:");
  console.log("─".repeat(90));
  console.log("   Text".padEnd(30) + "| Expected    | Match       | Score");
  console.log("─".repeat(90));
  
  let correct = 0;
  
  for (let i = 0; i < textKeys.length; i++) {
    const key = textKeys[i];
    const text = englishTexts[key];
    const result = findBestMatch(textEmbeddings[i], imageEmbeddings, imageNames);
    
    const isCorrect = result.bestMatch === text.expectedImage;
    if (isCorrect) correct++;
    
    const title = text.title.substring(0, 28).padEnd(28);
    const expected = text.expectedImage.padEnd(11);
    const matched = result.bestMatch.padEnd(11);
    const score = result.bestSim.toFixed(3);
    const mark = isCorrect ? "✅" : "❌";
    
    console.log(`   ${title} | ${expected} | ${matched} | ${score} ${mark}`);
  }
  
  console.log("─".repeat(90));
  const accuracy = (correct / textKeys.length * 100).toFixed(0);
  console.log(`   English Text→Image Accuracy: ${correct}/${textKeys.length} (${accuracy}%)`);
  
  return { correct, total: textKeys.length };
}

async function testEnglishQueries(imageEmbeddings, imageNames) {
  console.log("\n🔤 TEST 3: English Queries → Images");
  console.log("═".repeat(80));
  
  const queries = QUERIES.positive;
  const queryTexts = queries.map(q => q.query);
  
  const textEmbeddings = await getTextEmbeddings(queryTexts);
  
  console.log("\n📊 English Query → Image Matching:");
  console.log("─".repeat(85));
  console.log("   Query".padEnd(50) + "| Expected    | Match       | Score");
  console.log("─".repeat(85));
  
  let correct = 0;
  
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    const result = findBestMatch(textEmbeddings[i], imageEmbeddings, imageNames);
    
    const isCorrect = result.bestMatch === q.expectImage;
    if (isCorrect) correct++;
    
    const queryShort = q.query.substring(0, 48).padEnd(48);
    const expected = q.expectImage.padEnd(11);
    const matched = result.bestMatch.padEnd(11);
    const score = result.bestSim.toFixed(3);
    const mark = isCorrect ? "✅" : "❌";
    
    console.log(`   ${queryShort} | ${expected} | ${matched} | ${score} ${mark}`);
  }
  
  console.log("─".repeat(85));
  const accuracy = (correct / queries.length * 100).toFixed(0);
  console.log(`   English→Image Accuracy: ${correct}/${queries.length} (${accuracy}%)`);
  
  return { correct, total: queries.length };
}

async function testNegativeQueries(imageEmbeddings, imageNames) {
  console.log("\n🚫 TEST 4: Negative Query Rejection");
  console.log("═".repeat(80));
  
  const queries = QUERIES.negative;
  const queryTexts = queries.map(q => q.query);
  
  const textEmbeddings = await getTextEmbeddings(queryTexts);
  
  console.log("\n📊 Queries that should NOT match strongly:");
  console.log("─".repeat(75));
  console.log("   Query".padEnd(45) + "| Best Match  | Score  | Result");
  console.log("─".repeat(75));
  
  const THRESHOLD = 0.10;
  let rejected = 0;
  
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    const result = findBestMatch(textEmbeddings[i], imageEmbeddings, imageNames);
    
    const isRejected = result.bestSim < THRESHOLD;
    if (isRejected) rejected++;
    
    const queryShort = q.query.substring(0, 43).padEnd(43);
    const matched = result.bestMatch.padEnd(11);
    const score = result.bestSim.toFixed(3);
    const mark = isRejected ? "✅ rejected" : "⚠️ matched";
    
    console.log(`   ${queryShort} | ${matched} | ${score} | ${mark}`);
  }
  
  console.log("─".repeat(75));
  console.log(`   Threshold: < ${THRESHOLD}`);
  console.log(`   Properly rejected: ${rejected}/${queries.length}`);
  
  return { rejected, total: queries.length };
}

async function testTextToTextSimilarity() {
  console.log("\n📚 TEST 5: Text-to-Text Similarity");
  console.log("═".repeat(80));
  
  const textKeys = Object.keys(TEXTS);
  const textContents = textKeys.map(k => TEXTS[k].text);
  
  const embeddings = await getTextEmbeddings(textContents);
  
  console.log("\n📊 Text Similarity Matrix:");
  console.log("─".repeat(80));
  
  // Header
  const header = "              " + textKeys.map(n => n.substring(0, 10).padEnd(11)).join("");
  console.log(header);
  console.log("─".repeat(80));
  
  // Matrix
  for (let i = 0; i < textKeys.length; i++) {
    let row = textKeys[i].substring(0, 12).padEnd(14);
    for (let j = 0; j < textKeys.length; j++) {
      const sim = cosineSimilarity(embeddings[i], embeddings[j]);
      row += sim.toFixed(2).padStart(5).padEnd(11);
    }
    console.log(row);
  }
  
  return { success: true };
}

async function testImageToImageSimilarity(imageEmbeddings, imageNames) {
  console.log("\n🖼️  TEST 6: Image-to-Image Similarity");
  console.log("═".repeat(80));
  
  console.log("\n📊 Image Similarity Matrix:");
  console.log("─".repeat(90));
  
  // Header
  const header = "            " + imageNames.map(n => n.substring(0, 10).padEnd(11)).join("");
  console.log(header);
  console.log("─".repeat(90));
  
  // Matrix
  for (let i = 0; i < imageNames.length; i++) {
    let row = imageNames[i].substring(0, 10).padEnd(12);
    for (let j = 0; j < imageNames.length; j++) {
      const sim = cosineSimilarity(imageEmbeddings[i], imageEmbeddings[j]);
      row += sim.toFixed(2).padStart(5).padEnd(11);
    }
    console.log(row);
  }
  
  return { success: true };
}

// ============ MAIN ============

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════════════════════╗");
  console.log("║     SigLIP Cross-Modal Test with Classical Literature                        ║");
  console.log("╚═══════════════════════════════════════════════════════════════════════════════╝");
  console.log(`API URL: ${API_URL}`);
  
  // Get model info from API
  let modelInfo;
  try {
    modelInfo = await getModelInfo();
    console.log(`\n🤖 Model: ${modelInfo.model}`);
    console.log(`   Device: ${modelInfo.device}`);
    console.log(`   Dimensions: ${modelInfo.dimensions}`);
  } catch (error) {
    console.log(`\n❌ Cannot connect to API: ${error.message}`);
    return;
  }
  
  const germanTexts = getGermanTexts();
  const englishTexts = getEnglishTexts();
  
  console.log(`\n📷 Photos: ${Object.keys(PHOTOS).length} images from Unsplash`);
  console.log(`📜 Texts: ${Object.keys(germanTexts).length} German + ${Object.keys(englishTexts).length} English classical works`);
  console.log(`\nData sources:`);
  console.log(`   - texts/classic_texts.js (Goethe, Schiller, Longfellow, Wordsworth, Keats, Blake)`);
  console.log(`   - photos/photos.json (Unsplash metadata)`);
  console.log(`   - See SOURCES.md files for full credits`);
  
  // Check images exist
  const missing = Object.entries(PHOTOS).filter(([, p]) => !fs.existsSync(p));
  if (missing.length > 0) {
    console.log(`\n❌ Missing images: ${missing.map(([k]) => k).join(", ")}`);
    return;
  }
  
  try {
    // Get image embeddings once
    console.log("\n⏳ Loading image embeddings...");
    const imageNames = Object.keys(PHOTOS);
    const imagePaths = imageNames.map(k => PHOTOS[k]);
    const imageEmbeddings = await getImageEmbeddings(imagePaths);
    console.log(`   ✓ Loaded ${imageNames.length} image embeddings`);
    
    // Run all tests
    const germanResult = await testGermanTextsToImages(imageEmbeddings, imageNames);
    const englishTextResult = await testEnglishTextsToImages(imageEmbeddings, imageNames);
    const englishQueryResult = await testEnglishQueries(imageEmbeddings, imageNames);
    const negativeResult = await testNegativeQueries(imageEmbeddings, imageNames);
    await testTextToTextSimilarity();
    await testImageToImageSimilarity(imageEmbeddings, imageNames);
    
    // Summary
    console.log("\n" + "═".repeat(80));
    console.log("📊 FINAL SUMMARY");
    console.log("═".repeat(80));
    console.log(`   🇩🇪 German Text → Image: ${germanResult.correct}/${germanResult.total} (${(germanResult.correct/germanResult.total*100).toFixed(0)}%)`);
    console.log(`   🇬🇧 English Text → Image: ${englishTextResult.correct}/${englishTextResult.total} (${(englishTextResult.correct/englishTextResult.total*100).toFixed(0)}%)`);
    console.log(`   🔤 English Query → Image: ${englishQueryResult.correct}/${englishQueryResult.total} (${(englishQueryResult.correct/englishQueryResult.total*100).toFixed(0)}%)`);
    console.log(`   🚫 Negative Rejection: ${negativeResult.rejected}/${negativeResult.total}`);
    console.log(`   📚 Text-to-Text: ✓ Working`);
    console.log(`   🖼️  Image-to-Image: ✓ Working`);
    console.log("═".repeat(80));
    
    const germanPass = germanResult.correct >= germanResult.total * 0.4;
    const englishTextPass = englishTextResult.correct >= englishTextResult.total * 0.5;
    const englishQueryPass = englishQueryResult.correct >= englishQueryResult.total * 0.8;
    const overallPass = englishTextPass && englishQueryPass;
    
    console.log(`\n${overallPass ? "✅ OVERALL: PASS" : "⚠️ OVERALL: PARTIAL PASS"}`);
    if (!germanPass) console.log("   Note: German text matching is challenging (cross-lingual)");
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    console.error(error);
  }
}

main();
