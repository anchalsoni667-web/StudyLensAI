import { useState } from "react";
import "./App.css";
import * as pdfjsLib from "pdfjs-dist";

function App() {
const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;
  setFileInfo({
  name: file.name,
  type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "TXT",
});

  const isTxt = file.name.toLowerCase().endsWith(".txt");
  const isPdf = file.name.toLowerCase().endsWith(".pdf");

  if (!isTxt && !isPdf) {
    alert("Please select a TXT or PDF file.");
    event.target.value = "";
    return;
  }

  try {
    if (isTxt) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setText(e.target.result);
      };

      reader.onerror = () => {
        alert("Could not read the TXT file. Please try again.");
      };

      reader.readAsText(file);
    } else {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      let extractedText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        extractedText +=
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ") + "\n";
      }

      if (!extractedText.trim()) {
        alert("No readable text found in this PDF.");
        return;
      }

      setText(extractedText);
    }
  } catch (error) {
    console.error("File reading error:", error);
    alert("Could not read this file. Please try another file.");
  }
};
  const [text, setText] = useState("");
const [notes, setNotes] = useState("");
const [loading, setLoading] = useState(false);
const [fileInfo, setFileInfo]  = useState(null);
const [noteFormat, setNoteFormat] = useState("bullets");
const [quiz, setQuiz] = useState([]);
const [quizAnswers, setQuizAnswers] = useState({});
const [quizSubmitted, setQuizSubmitted] = useState(false);
const [selectedTopic, setSelectedTopic] = useState("All Topics");
 const generateNotes = async () => {
  setLoading(true);
  if (!text.trim()) {
    setNotes("Please enter some study material first.");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("https://studylens-ai-backend-cwr9.onrender.com/generate-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, noteFormat }),
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (response.ok) {
      setNotes(data.notes);
    } else {
      setNotes("Something went wrong. Please try again.");
    }
  } catch (error) {
    setNotes("Cannot connect to the StudyLens AI server.");
    console.error(error);
  }
  setLoading(false);
};
const generateQuiz = () => {
  if (!text.trim()) {
    alert("Please enter study material first.");
    return;
  }

  const material = text.toLowerCase();

  const questionBank = [
    {
      topic: "photosynthesis",
      question: "What is the main purpose of photosynthesis?",
      options: [
        "To make food using light energy",
        "To absorb minerals from soil",
        "To release energy from food",
        "To take oxygen into the roots",
      ],
      correctAnswer: "To make food using light energy",
    },
    {
      topic: "chlorophyll",
      question: "What is the role of chlorophyll in photosynthesis?",
      options: [
        "To absorb light energy",
        "To absorb minerals from soil",
        "To transport food through roots",
        "To release energy from glucose",
      ],
      correctAnswer: "To absorb light energy",
    },
    {
      topic: "carbon dioxide",
      question: "Which gas do plants use during photosynthesis?",
      options: [
        "Carbon dioxide",
        "Oxygen",
        "Nitrogen",
        "Hydrogen",
      ],
      correctAnswer: "Carbon dioxide",
    },
    {
      topic: "oxygen",
      question: "Which gas is released during photosynthesis?",
      options: [
        "Oxygen",
        "Nitrogen",
        "Carbon dioxide",
        "Hydrogen",
      ],
      correctAnswer: "Oxygen",
    },
    {
      topic: "glucose",
      question: "Which food substance do plants produce during photosynthesis?",
      options: [
        "Glucose",
        "Protein",
        "Mineral salts",
        "Vitamins",
      ],
      correctAnswer: "Glucose",
    },
 {
      topic: "c programming",
      question: "Which symbol ends a C statement?",
      options: [";", ",", ":", "."],
      correctAnswer: ";",
    },
    {
      topic: "c programming",
      question: "Which function is the usual entry point of a C program?",
      options: ["main()", "start()", "run()", "begin()"],
      correctAnswer: "main()",
    },
    {
      topic: "c programming",
      question: "Which header file declares printf()?",
      options: ["stdio.h", "math.h", "string.h", "time.h"],
      correctAnswer: "stdio.h",
    },
    {
      topic: "c programming",
      question: "Which data type stores a whole number?",
      options: ["int", "float", "char", "double"],
      correctAnswer: "int",
    },
    {
      topic: "c programming",
      question: "Which data type stores a single character?",
      options: ["char", "int", "float", "void"],
      correctAnswer: "char",
    },
    {
      topic: "c programming",
      question: "Which format specifier is commonly used for int in printf()?",
      options: ["%d", "%f", "%c", "%s"],
      correctAnswer: "%d",
    },
    {
      topic: "c programming",
      question: "Which format specifier is commonly used for float in printf()?",
      options: ["%f", "%d", "%c", "%s"],
      correctAnswer: "%f",
    },
    {
      topic: "c programming",
      question: "Which operator assigns a value to a variable?",
      options: ["=", "==", "!=", "<="],
      correctAnswer: "=",
    },
    {
      topic: "c programming",
      question: "Which operator checks equality?",
      options: ["==", "=", "!=", "&&"],
      correctAnswer: "==",
    },
    {
      topic: "c programming",
      question: "What is the result of 10 % 3 in C?",
      options: ["1", "3", "0", "10"],
      correctAnswer: "1",
    },
    {
      topic: "c programming",
      question: "Which operator means logical AND?",
      options: ["&&", "||", "!", "&"],
      correctAnswer: "&&",
    },
    {
      topic: "c programming",
      question: "Which statement is used for decision-making?",
      options: ["if", "printf", "include", "typedef"],
      correctAnswer: "if",
    },
    {
      topic: "c programming",
      question: "Which statement selects among multiple cases?",
      options: ["switch", "break", "continue", "sizeof"],
      correctAnswer: "switch",
    },
    {
      topic: "c programming",
      question: "Which keyword provides an alternative branch after if?",
      options: ["else", "case", "default", "return"],
      correctAnswer: "else",
    },
    {
      topic: "loops",
      question: "Which loop checks its condition before each iteration?",
      options: ["while", "do-while", "Both check only afterward", "Neither"],
      correctAnswer: "while",
    },
    {
      topic: "loops",
      question: "Which loop executes its body at least once?",
      options: ["do-while", "while", "for", "None of these"],
      correctAnswer: "do-while",
    },
    {
      topic: "loops",
      question: "Which keyword immediately exits a loop?",
      options: ["break", "continue", "case", "sizeof"],
      correctAnswer: "break",
    },
    {
      topic: "loops",
      question: "Which keyword skips to the next loop iteration?",
      options: ["continue", "break", "switch", "typedef"],
      correctAnswer: "continue",
    },
    {
      topic: "arrays",
      question: "What is the first valid index of an array in C?",
      options: ["0", "1", "-1", "Depends on the array values"],
      correctAnswer: "0",
    },
    {
      topic: "arrays",
      question: "How do you declare an array of 5 integers?",
      options: ["int a[5];", "int a(5);", "array int a;", "int[5] a;"],
      correctAnswer: "int a[5];",
    },
    {
      topic: "string",
      question: "Which character terminates a C string?",
      options: ["\\0", "\\n", "\\t", "\\b"],
      correctAnswer: "\\0",
    },
    {
      topic: "string",
      question: "Which function returns the length of a string?",
      options: ["strlen()", "strcpy()", "strcmp()", "strcat()"],
      correctAnswer: "strlen()",
    },
    {
      topic: "string",
      question: "Which header file declares strlen()?",
      options: ["string.h", "stdio.h", "math.h", "ctype.h"],
      correctAnswer: "string.h",
    },
    {
      topic: "functions",
      question: "Which keyword declares a function that returns no value?",
      options: ["void", "int", "char", "float"],
      correctAnswer: "void",
    },
    {
      topic: "recursion",
      question: "What is recursion in programming?",
      options: [
        "A function calling itself",
        "A variable changing type",
        "A loop without a condition",
        "An array storing strings only",
      ],
      correctAnswer: "A function calling itself",
    },
    {
      topic: "funtions",
      question: "What is a function prototype used for?",
      options: [
        "Declaring a function's interface",
        "Running a function repeatedly",
        "Creating an array",
        "Opening a file",
      ],
      correctAnswer: "Declaring a function's interface",
    },
    {
      topic: "pointer",
      question: "Which operator obtains the address of a variable?",
      options: ["&", "*", "%", "#"],
      correctAnswer: "&",
    },
    {
      topic: "pointer",
      question: "Which symbol is used to declare a pointer?",
      options: ["*", "&", "%", "!"],
      correctAnswer: "*",
    },
    {
      topic: "pointer",
      question: "What does a pointer store?",
      options: [
        "A memory address",
        "Only a character",
        "Only a decimal value",
        "A header file name",
      ],
      correctAnswer: "A memory address",
    },
    {
      topic: "structure",
      question: "Which operator accesses a structure member through a structure variable?",
      options: [".", "->", "::", "#"],
      correctAnswer: ".",
    },
    {
      topic: "structure",
      question: "Which keyword defines a structure in C?",
      options: ["struct", "class", "object", "record"],
      correctAnswer: "struct",
    },
    {
      topic: "union",
      question: "What is a union mainly used for?",
      options: [
        "Sharing storage among its members",
        "Giving every member separate storage",
        "Repeating a loop",
        "Declaring a function",
      ],
      correctAnswer: "Sharing storage among its members",
    },
    {
      topic: "structure",
      question: "Which keyword creates an alias for a type?",
      options: ["typedef", "define", "struct", "extern"],
      correctAnswer: "typedef",
    },
    {
      topic: "c programming",
      question: "Which preprocessor directive includes a header file?",
      options: ["#include", "#define", "#ifdef", "#endif"],
      correctAnswer: "#include",
    },
    {
      topic: "c programming",
      question: "Which directive defines a macro?",
      options: ["#define", "#include", "#return", "#switch"],
      correctAnswer: "#define",
    },
    {
      topic: "c programming",
      question: "Which function opens a file in C?",
      options: ["fopen()", "fclose()", "fprintf()", "fread()"],
      correctAnswer: "fopen()",
    },
    {
      topic: "c programming",
      question: "Which mode opens a file for reading?",
      options: ["r", "w", "a", "x"],
      correctAnswer: "r",
    },
    {
      topic: "c programming",
      question: "Which function closes an opened file?",
      options: ["fclose()", "fopen()", "fscanf()", "fseek()"],
      correctAnswer: "fclose()",
    },
    {
      topic: "c programming",
      question: "Which function allocates memory dynamically?",
      options: ["malloc()", "printf()", "strlen()", "fclose()"],
      correctAnswer: "malloc()",
    },
    {
      topic: "c programming",
      question: "Which header file declares malloc()?",
      options: ["stdlib.h", "stdio.h", "string.h", "math.h"],
      correctAnswer: "stdlib.h",
    },
    
     
  ];

  

 const normalizedMaterial = material.toLowerCase();

const topicKeywords = {
  "c programming": [
    "c programming",
    "programming in c",
  ],
  "arrays": ["array", "arrays", "matrix"],
  "pointers": ["pointer", "pointers", "address operator"],
  "loops": ["loop", "loops", "for loop", "while loop", "do-while"],
  "functions": ["function", "functions", "function declaration"],
  "recursion": ["recursion", "recursive", "factorial", "fibonacci"],
  "strings": ["string", "strings", "strlen", "strcpy", "strcmp"],
  "structures": ["structure", "structures", "struct", "union", "unions"],
  "file handling": ["file handling", "fopen", "fclose", "file reading"],
  "memory management": ["malloc", "calloc", "realloc", "free"],
};

const matchedTopics = Object.entries(topicKeywords)
  .filter(([topic, keywords]) =>
    keywords.some((keyword) => normalizedMaterial.includes(keyword))
  )
  .map(([topic]) => topic);

const newQuiz = questionBank
  .filter((item) => {
    const itemTopic = item.topic.toLowerCase();
    if (selectedTopic !== "All Topics") {
  const topicAliases = {
    "c programming": ["c programming"],
    arrays: ["array", "arrays"],
    loops: ["loop", "loops"],
    pointers: ["pointer", "pointers"],
    strings: ["string", "strings"],
    functions: ["function", "functions"],
    recursion: ["recursion"],
    structures: ["structure", "structures"],
    "file handling": ["file handling"],
    "memory management": ["memory management"],
    photosynthesis: ["photosynthesis"],
  };

  const allowedTopics = topicAliases[selectedTopic.toLowerCase()] || [
    selectedTopic.toLowerCase(),
  ];

  return allowedTopics.includes(itemTopic);
}

    if (itemTopic === "photosynthesis") {
      return normalizedMaterial.includes("photosynthesis");
    }

    return matchedTopics.some((topic) => {
      if (topic === "c programming") {
        return itemTopic === "c programming";
      }
      return itemTopic.includes(topic);
    });
  })
  .map((item, index) => ({
    id: index + 1,
    question: item.question,
    options: [...item.options].sort(() => Math.random() - 0.5),
    correctAnswer: item.correctAnswer,
  }));
  if (newQuiz.length === 0) {
    alert(
      "Sorry, no matching quiz questions were found. Try adding more details about the topic."
    );
    return;
  }

  setQuiz(newQuiz);
  setQuizAnswers({});
  setQuizSubmitted(false);
};
const submitQuiz = () => {
  if (Object.keys(quizAnswers).length < quiz.length) {
    alert("Please answer all questions before submitting.");
    return;
  }

  setQuizSubmitted(true);
};
const score = quiz.filter(
  (question) =>
    quizAnswers[question.id] === question.correctAnswer
).length;
  return (
    <div className="app">
      <header>
        <h1>StudyLens AI</h1>
        <p>Turn your study material into simple notes</p>
      </header>

      <main>
      <button
  type="button"
  onClick={() =>
    setText(
      "Photosynthesis is the process by which green plants make their own food using sunlight, carbon dioxide, and water. Chlorophyll absorbs sunlight. The process produces glucose and releases oxygen. Photosynthesis mainly occurs in the leaves of plants."
    )
  }
>
  Try Sample Material
</button>
  <label htmlFor="noteFormat">Choose Note Format:</label>

  <select
    id="noteFormat"
    value={noteFormat}
    onChange={(e) => setNoteFormat(e.target.value)}
  >
    <option value="bullets">Bullet Points</option>
    <option value="short">Short Notes</option>
    <option value="detailed">Detailed Notes</option>
  </select>

  <textarea
  placeholder="Paste your study material here..."
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

<p className="word-counter">
  Word count: {text.trim() ? text.trim().split(/\s+/).length : 0}
</p>
        <div className="upload-section">
  <label htmlFor="study-file">
    Upload study material (.txt)
  </label>

 <input
  id="study-file"
  type="file"
  accept=".txt,.pdf,text/plain,application/pdf"
  onChange={handleFileUpload}
/>
</div>
{fileInfo && (
  <p className="file-info">
    📄 Selected file: <strong>{fileInfo.name}</strong>
    {" "}({fileInfo.type})
  </p>
)}

       <button onClick={generateNotes} disabled={loading}>
  {loading ? "⏳ Generating your notes..." : "✨ Generate Notes"}
</button>
<button
  type="button"
  onClick={generateQuiz}
  disabled={loading}
>
  📝 Generate Quiz
  <div className="topic-selector">
  <label htmlFor="quiz-topic">Choose Quiz Topic:</label>
  <select
    id="quiz-topic"
    value={selectedTopic}
    onChange={(event) => setSelectedTopic(event.target.value)}
  >
    <option value="All Topics">All Topics</option>
    <option value="c programming">C Programming Basics</option>
    <option value="arrays">Arrays</option>
    <option value="loops">Loops</option>
    <option value="pointers">Pointers</option>
    <option value="strings">Strings</option>
    <option value="functions">Functions</option>
    <option value="recursion">Recursion</option>
    <option value="structures">Structures and Unions</option>
    <option value="file handling">File Handling</option>
    <option value="memory management">Memory Management</option>
    <option value="photosynthesis">Photosynthesis</option>
  </select>
</div>
</button>
{loading && (
  <p className="loading-message" role="status" aria-live="polite">
    Please wait while StudyLens AI prepares your notes...
  </p>
)}

<button
  onClick={() => {
    setText("");
    setNotes("");
    setFileInfo(null);
  }}
  disabled={loading}
>
  Clear
</button>
        <div className="output">
          <h2>Your AI Notes</h2>
          <button
  onClick={() => {
    const notesText = Array.isArray(notes)
      ? notes.join("\n")
      : notes;

    navigator.clipboard.writeText(notesText || "");
    alert("Notes copied successfully!");
  }}
  disabled={!notes || loading}
>
  Copy Notes
</button>
<button
  onClick={() => {
    const notesText = Array.isArray(notes)
      ? notes.join("\n")
      : notes;

    const blob = new Blob([notesText || ""], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "StudyLens-AI-Notes.txt";
    link.click();

    URL.revokeObjectURL(url);
  }}
  disabled={!notes || loading}
>
  Download Notes
</button>

          {notes ? (
  <div className="notes-output">
    <div className="notes-statistics">
  <span>
    Words: {
      (Array.isArray(notes) ? notes.join(" ") : notes)
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    }
  </span>
  <span>
    Characters: {
      (Array.isArray(notes) ? notes.join(" ") : notes).length
    }
  </span>
  <span>
    Notes: {Array.isArray(notes) ? notes.length : 1}
  </span>
</div>
    {typeof notes === "string" ? (
      <pre>{notes}</pre>
    ) : (
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    )}
  </div>
) : (
  <p>Your simplified notes will appear here.</p>
)}
        </div>
        {quiz.length > 0 && (
  <div className="output">
    <h2>📝 Your Quiz</h2>

    {quiz.map((question) => (
      <div key={question.id} className="quiz-question">
        <h3>
          {question.id}. {question.question}
        </h3>

        {question.options.map((option, index) => (
          <label key={index} className="quiz-option">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={quizAnswers[question.id] === option}
              onChange={() =>
                setQuizAnswers({
                  ...quizAnswers,
                  [question.id]: option,
                })
              }
            />
            {" "}{option}
          </label>
        ))}
      </div>
    ))}

    <p>Questions generated: {quiz.length}</p>
    <button
  type="button"
  onClick={submitQuiz}
  disabled={quizSubmitted}
>
  Submit Quiz
</button>

{quizSubmitted && (
  <div className="quiz-result">
    <h3>Your Score: {score}/{quiz.length}</h3>

    {quiz.map((question) => (
      <p key={question.id}>
        Question {question.id}:{" "}
        {quizAnswers[question.id] === question.correctAnswer
          ? "Correct!"
          : `Correct answer: ${question.correctAnswer}`}
      </p>
    ))}
  </div>
)}
  </div>
)}
      </main>
    </div>
  );

}

export default App;