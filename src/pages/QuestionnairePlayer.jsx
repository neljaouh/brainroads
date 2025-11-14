import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";

// BrainRoads – Questionnaire Player with Revision Mode, Explanations & Results

export default function QuestionnairePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      type: "mcq",
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correct: "Mars",
      explanation: "Mars appears red because of iron oxide (rust) on its surface.",
    },
    {
      id: 2,
      type: "dropdown",
      question: "The capital of France is ___",
      options: ["Paris", "Lyon", "Marseille", "Nice"],
      correct: "Paris",
      explanation: "Paris has been France's capital since the 10th century.",
    },
    {
      id: 3,
      type: "truefalse",
      question: "Light travels faster than sound.",
      correct: true,
      explanation: "Light travels at ~300,000 km/s, far faster than sound's ~343 m/s.",
    },
    {
      id: 4,
      type: "text",
      question: "Name the process by which plants make their own food.",
      correct: "photosynthesis",
      explanation:
        "Photosynthesis uses sunlight to convert carbon dioxide and water into glucose and oxygen.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [isRevision, setIsRevision] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const finished = index === questions.length;
  const q = finished ? undefined : questions[index];
  const progress = finished ? 100 : ((index + 1) / questions.length) * 100;

  const handleSubmit = () => {
    if (finished || !q) return;

    let isCorrect = false;
    if (q.type === "truefalse") {
      isCorrect = String(q.correct) === answer;
    } else if (q.type === "mcq" || q.type === "dropdown") {
      isCorrect = q.correct === answer;
    } else if (q.type === "text") {
      isCorrect = answer.trim().toLowerCase() === q.correct.toLowerCase();
    }

    setFeedback(isCorrect ? "Correct!" : "Incorrect.");

    setResults((prev) => {
      const exists = prev.find((r) => r.id === q.id);
      const resultData = {
        id: q.id,
        question: q.question,
        correct: isCorrect,
        userAnswer: answer,
        correctAnswer: q.type === "truefalse" ? String(q.correct) : q.correct,
        explanation: q.explanation,
      };
      if (exists)
        return prev.map((r) => (r.id === q.id ? resultData : r));
      return [...prev, resultData];
    });
  };

  const next = () => {
    if (finished) return;

    // Auto-submit if answer exists but hasn't been checked yet
    if (q && answer && !feedback) {
      // Submit the answer first
      let isCorrect = false;
      if (q.type === "truefalse") {
        isCorrect = String(q.correct) === answer;
      } else if (q.type === "mcq" || q.type === "dropdown") {
        isCorrect = q.correct === answer;
      } else if (q.type === "text") {
        isCorrect = answer.trim().toLowerCase() === q.correct.toLowerCase();
      }

      setFeedback(isCorrect ? "Correct!" : "Incorrect.");

      setResults((prev) => {
        const exists = prev.find((r) => r.id === q.id);
        const resultData = {
          id: q.id,
          question: q.question,
          correct: isCorrect,
          userAnswer: answer,
          correctAnswer: q.type === "truefalse" ? String(q.correct) : q.correct,
          explanation: q.explanation,
        };
        if (exists)
          return prev.map((r) => (r.id === q.id ? resultData : r));
        return [...prev, resultData];
      });

      // Then proceed to next question or results
      if (isRevision && !isCorrect) return; // Don't proceed in revision mode if wrong

      if (index < questions.length - 1) {
        setIndex((prev) => prev + 1);
        setAnswer("");
        setFeedback(null);
        setShowExplanation(false);
      } else {
        setIndex(questions.length); // move to results screen
      }
      return;
    }

    if (isRevision && feedback !== "Correct!") return;

    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      setShowExplanation(false);
    } else {
      setIndex(questions.length); // move to results screen
    }
  };

  const back = () => {
    if (index > 0 && !finished) {
      setIndex((prev) => prev - 1);
      setAnswer("");
      setFeedback(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl mb-10">
        <header className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold tracking-tight">BrainRoads</div>
          <nav className="space-x-6 text-lg text-gray-300 flex items-center">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <a href="#" className="hover:text-white transition">
              My Progress
            </a>

            {/* Revision Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsRevision((prev) => !prev)}
              className={`ml-6 px-3 py-1 rounded-xl text-sm border transition ${
                isRevision
                  ? "bg-green-600 border-green-500 text-white"
                  : "bg-gray-700 border-gray-600 text-gray-100"
              }`}
            >
              {isRevision ? "Revision Mode On" : "Revision Mode Off"}
            </button>
          </nav>
        </header>

        <div className="mb-10">
          <div className="text-sm text-indigo-300 font-medium mb-1">Science</div>
          <div className="text-3xl font-semibold text-white">
            Sample Questionnaire Title
          </div>
          {isRevision && (
            <div className="mt-2 text-sm text-green-300">
              Must answer correctly to proceed
            </div>
          )}
        </div>
      </div>

      {/* Results Screen */}
      {finished ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
        >
          <h2 className="text-3xl font-semibold mb-6 text-white">Results</h2>
          <p className="text-gray-300 mb-6">
            You scored {results.filter((r) => r.correct).length} / {questions.length}
          </p>

          {/* List of Wrong Questions */}
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
            <h3 className="text-lg font-semibold text-red-300 mb-3">
              Questions answered incorrectly ({results.filter((r) => !r.correct).length}):
            </h3>
            {results.filter((r) => !r.correct).length > 0 ? (
              <ul className="space-y-2">
                {results
                  .filter((r) => !r.correct)
                  .map((r) => (
                    <li key={r.id} className="text-sm text-gray-200 flex items-start">
                      <span className="text-red-400 mr-2">✘</span>
                      <span>{r.question}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Great job! You answered all questions correctly.</p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {results.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 rounded-xl border ${
                    r.correct
                      ? "bg-gray-700/50 border-green-500/50"
                      : "bg-gray-700 border-red-500/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-100 flex-1">
                      {r.question}
                    </span>
                    <span className={`ml-4 text-lg ${r.correct ? "text-green-400" : "text-red-400"}`}>
                      {r.correct ? "✔" : "✘"}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Your answer: </span>
                      <span className={`font-medium ${r.correct ? "text-green-300" : "text-red-300"}`}>
                        {r.userAnswer || "(No answer)"}
                      </span>
                    </div>
                    {!r.correct && (
                      <div>
                        <span className="text-gray-400">Correct answer: </span>
                        <span className="font-medium text-green-300">
                          {r.correctAnswer}
                        </span>
                      </div>
                    )}
                    {r.explanation && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                        <span className="text-gray-400 text-xs font-medium">Explanation: </span>
                        <span className="text-gray-200">{r.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setAnswer("");
                setFeedback(null);
                setResults([]);
                setShowExplanation(false);
              }}
              className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="w-full max-w-3xl mb-6">
            <div className="text-sm mb-2 text-gray-300">
              Question {index + 1} of {questions.length}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {q && (
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
              >
                <h2 className="text-2xl font-semibold mb-6 text-white">
                  {q.question}
                </h2>

                {/* Explain Button & Block – only in Revision Mode */}
                {isRevision && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowExplanation((prev) => !prev)}
                      className="mb-4 px-3 py-1 rounded-xl bg-purple-700 hover:bg-purple-800 text-sm"
                    >
                      {showExplanation ? "Hide Explanation" : "Explain"}
                    </button>

                    {showExplanation && (
                      <div className="mb-6 p-4 bg-gray-700 rounded-xl text-sm text-gray-200 border border-purple-500/40">
                        {q.explanation}
                      </div>
                    )}
                  </>
                )}

                {/* MCQ */}
                {q.type === "mcq" && q.options && (
                  <div className="space-y-3">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 p-3 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition"
                      >
                        <input
                          type="radio"
                          checked={answer === opt}
                          onChange={() => setAnswer(opt)}
                        />
                        <span className="text-sm text-gray-100">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Dropdown */}
                {q.type === "dropdown" && q.options && (
                  <select
                    className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-sm"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  >
                    <option value="">Select an answer...</option>
                    {q.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {/* True/False */}
                {q.type === "truefalse" && (
                  <div className="flex gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => setAnswer("true")}
                      className={`px-4 py-2 rounded-xl text-sm ${
                        answer === "true" ? "bg-indigo-600" : "bg-gray-700"
                      }`}
                    >
                      True
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswer("false")}
                      className={`px-4 py-2 rounded-xl text-sm ${
                        answer === "false" ? "bg-indigo-600" : "bg-gray-700"
                      }`}
                    >
                      False
                    </button>
                  </div>
                )}

                {/* Text */}
                {q.type === "text" && (
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-sm"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                )}

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`mt-4 text-lg font-semibold ${
                      feedback === "Correct!" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={back}
                    disabled={index === 0}
                    className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-sm"
                  >
                    Back
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm"
                    >
                      Check
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className={`px-5 py-2 rounded-xl text-sm ${
                        isRevision && feedback !== "Correct!"
                          ? "bg-gray-600 opacity-50 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}
