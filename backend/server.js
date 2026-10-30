const express = require("express");
const cors = require("cors");
const natural = require("natural");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StudyLens AI Backend is running!");
});

app.post("/generate-notes", (req, res) => {
  try {
    const { text, noteFormat = "bullets" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Please provide study material."
      });
    }

    // Split the material into sentences
    const sentences = text
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]?/g)
      ?.map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0) || [];

    if (sentences.length === 0) {
      return res.status(400).json({
        error: "Please enter readable study material."
      });
    }

    // Common words that are less useful for finding key ideas
    const stopWords = new Set([
      "this", "that", "with", "from", "have", "has",
      "are", "was", "were", "been", "being", "the",
      "and", "for", "but", "not", "you", "your",
      "into", "its", "their", "they", "then", "than",
      "which", "when", "where", "what", "will", "would",
      "can", "could", "should", "about", "also", "because",
      "does", "these", "those", "there", "here", "called"
    ]);

    // Count important word frequencies
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const frequency = {};

    words.forEach(word => {
      if (!stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    // Give each sentence a score based on important words
   const ranked = sentences.map((sentence, index) => {
  const sentenceWords =
    sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  const usefulWords = sentenceWords.filter(
    word => !stopWords.has(word)
  );

  // Score words by frequency, but avoid rewarding long sentences too much
  const wordScore = usefulWords.reduce((total, word) => {
    return total + Math.log(1 + (frequency[word] || 0));
  }, 0);

  const lengthPenalty = Math.sqrt(
    Math.max(1, sentenceWords.length)
  );

  // Slightly reward sentences that contain useful information
  const definitionBonus =
    /\b(is|are|means|refers to|defined as|called)\b/i.test(sentence)
      ? 1.5
      : 0;

  const keywordBonus =
  /\b(important|main|key|primary|function|purpose|types|advantages|disadvantages|example|because|therefore|consists of|used for|responsible for)\b/i.test(sentence)
    ? 1.5
    : 0;

const score =
  wordScore / lengthPenalty +
  definitionBonus +
  keywordBonus;

return { sentence, index, score };
});

    // Select the most useful sentences, keeping their original order
    const selectTop = (limit) => {
  const usefulSentences = ranked.filter(({ sentence, score }) => {
    const words = sentence.match(/\b[a-zA-Z]{3,}\b/g) || [];

    if (words.length < 4) return false;
    if (score <= 0) return false;

    return true;
  });

  return usefulSentences
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map(item => item.sentence)
    .filter((sentence, index, all) =>
      all.findIndex(
        item => item.toLowerCase() === sentence.toLowerCase()
      ) === index
    );
};
      
    let notes;

    if (noteFormat === "short") {
      notes = [selectTop(Math.min(2, sentences.length)).join(" ")];
    } else if (noteFormat === "detailed") {
      notes = sentences.map(
        (sentence, index) => `${index + 1}. ${sentence}`
      );
    } else {
      notes = selectTop(Math.min(5, sentences.length));
    }

    console.log("Local notes generated successfully");
    return res.json({ notes });

  } catch (error) {
    console.error("Local note generation error:", error.message);
    return res.status(500).json({
      error: "Could not generate notes. Please try again."
    });
  }
});
app.listen(PORT, () => {
  console.log(`StudyLens AI server running on http://localhost:${PORT}`);
});