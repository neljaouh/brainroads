import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";

// Custom hook to load questionnaire data
function useQuestionnaire(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/questionnaires/${id}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load questionnaire");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading questionnaire:", err);
        setLoading(false);
      });
  }, [id]);

  return { data, loading };
}

// BrainRoads – Questionnaire Player with Revision Mode, Explanations & Results

export default function QuestionnairePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: questionnaire, loading } = useQuestionnaire(id);

  const questions = questionnaire?.questions || [];

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [isRevision, setIsRevision] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [language, setLanguage] = useState("en");

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

    return isCorrect;
  };

  // Auto-advance in Quick Mode for non-text questions
  useEffect(() => {
    if (!isQuickMode || !answer || !q || q.type === "text" || feedback) {
      return;
    }

    // Submit the answer
    let isCorrect = false;
    if (q.type === "truefalse") {
      isCorrect = String(q.correct) === answer;
    } else if (q.type === "mcq" || q.type === "dropdown") {
      isCorrect = q.correct === answer;
    }

    // Only show feedback if Revision Mode is active
    if (isRevision) {
      setFeedback(isCorrect ? "Correct!" : "Incorrect.");
    }

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
    
    // Auto-advance logic
    const advance = () => {
      if (isRevision && !isCorrect) {
        // In revision mode, don't advance if wrong
        return;
      }
      
      if (index < questions.length - 1) {
        setIndex((prev) => prev + 1);
        setAnswer("");
        setFeedback(null);
        setShowExplanation(false);
      } else {
        setIndex(questions.length); // move to results screen
      }
    };

    // If Revision Mode is on, wait to show feedback, otherwise advance immediately
    if (isRevision) {
      const timer = setTimeout(() => {
        advance();
      }, 800); // 800ms delay to show feedback
      return () => clearTimeout(timer);
    } else {
      // Immediate advance in Quick Mode without Revision Mode
      advance();
    }
  }, [answer, isQuickMode, q, feedback, isRevision, index, questions.length]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state if questionnaire not found
  if (!questionnaire) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="text-lg mb-4">Questionnaire not found</div>
        <Link to="/" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl mb-10">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Cerveau" className="h-5 w-5 text-white">
                <path d="M12.417 2.08497C13.1595 2.07718 13.928 2.30924 14.5215 2.81544C15.0187 3.23964 15.3659 3.83436 15.4756 4.56837C17.7228 5.25845 18.6116 8.06419 17.2881 9.94434C18.484 11.643 17.9138 14.1413 16.0137 15.1016C15.5614 16.6946 14.2619 17.7428 12.873 17.8955C12.1235 17.9779 11.3488 17.7969 10.7002 17.2969C10.435 17.0924 10.2019 16.8392 10 16.543C9.79813 16.8392 9.565 17.0924 9.2998 17.2969C8.65115 17.7969 7.87652 17.9779 7.12695 17.8955C5.73805 17.7428 4.43755 16.6947 3.98535 15.1016C2.08588 14.141 1.51618 11.6427 2.71191 9.94434C1.3886 8.06443 2.27688 5.25892 4.52343 4.56837C4.63309 3.8343 4.98126 3.23967 5.47851 2.81544C6.07202 2.30924 6.84047 2.07718 7.583 2.08497C8.32607 2.09281 9.09216 2.34177 9.68164 2.85938C9.79607 2.9599 9.90263 3.06931 10 3.18751C10.0974 3.06931 10.2039 2.9599 10.3184 2.85938C10.9078 2.34178 11.6739 2.09282 12.417 2.08497ZM9.33496 5.14258C9.33486 4.53819 9.11005 4.1274 8.80371 3.8584C8.48431 3.57797 8.03808 3.42002 7.56933 3.41505C7.10021 3.41009 6.65707 3.55915 6.34179 3.82813C6.0406 4.08512 5.81738 4.48266 5.81738 5.07813V5.10255C5.81929 5.43475 5.57591 5.71744 5.24707 5.76465C3.51732 6.01303 2.80432 8.25192 4.04394 9.47169L4.1289 9.57325C4.20251 9.68226 4.24212 9.8118 4.24218 9.94532C4.24218 10.1235 4.17098 10.2949 4.04394 10.4199C2.97893 11.468 3.32104 13.3372 4.65917 13.9531L4.79101 14.0088L4.86914 14.044C5.04329 14.1372 5.16808 14.3043 5.20703 14.501C5.45172 15.739 6.38692 16.4768 7.27246 16.5742C7.7085 16.6221 8.13302 16.5171 8.4873 16.2441C8.83301 15.9777 9.15693 15.5133 9.33496 14.7607V5.14258ZM10.665 14.7607C10.8431 15.5133 11.167 15.9777 11.5127 16.2441C11.867 16.5171 12.2915 16.6221 12.7275 16.5742C13.6131 16.4768 14.5483 15.739 14.793 14.501L14.8144 14.419C14.8772 14.2314 15.0214 14.0801 15.209 14.0088C16.6556 13.4584 17.0552 11.5017 15.956 10.4199C15.829 10.2949 15.7578 10.1235 15.7578 9.94532C15.7579 9.76723 15.8291 9.59662 15.956 9.47169C17.1569 8.29005 16.5253 6.15225 14.9121 5.79395L14.7529 5.76465C14.4241 5.71744 14.1807 5.43475 14.1826 5.10255V5.07813L14.1719 4.86426C14.1252 4.38549 13.9218 4.05306 13.6582 3.82813C13.3429 3.55915 12.8998 3.41009 12.4307 3.41505C11.9619 3.42002 11.5157 3.57797 11.1963 3.8584C10.9282 4.09377 10.7221 4.43764 10.6748 4.92481L10.665 5.14258V14.7607Z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">BrainRoads</span>
          </div>
          <nav className="space-x-6 text-base text-gray-300 flex items-center">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <div className="relative flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Globe" className="h-5 w-5 text-gray-300">
                <path d="M10 2.125C14.3492 2.125 17.875 5.65076 17.875 10C17.875 14.3492 14.3492 17.875 10 17.875C5.65076 17.875 2.125 14.3492 2.125 10C2.125 5.65076 5.65076 2.125 10 2.125ZM7.88672 10.625C7.94334 12.3161 8.22547 13.8134 8.63965 14.9053C8.87263 15.5194 9.1351 15.9733 9.39453 16.2627C9.65437 16.5524 9.86039 16.625 10 16.625C10.1396 16.625 10.3456 16.5524 10.6055 16.2627C10.8649 15.9733 11.1274 15.5194 11.3604 14.9053C11.7745 13.8134 12.0567 12.3161 12.1133 10.625H7.88672ZM3.40527 10.625C3.65313 13.2734 5.45957 15.4667 7.89844 16.2822C7.7409 15.997 7.5977 15.6834 7.4707 15.3486C6.99415 14.0923 6.69362 12.439 6.63672 10.625H3.40527ZM13.3633 10.625C13.3064 12.439 13.0059 14.0923 12.5293 15.3486C12.4022 15.6836 12.2582 15.9969 12.1006 16.2822C14.5399 15.467 16.3468 13.2737 16.5947 10.625H13.3633ZM12.1006 3.7168C12.2584 4.00235 12.4021 4.31613 12.5293 4.65137C13.0059 5.90775 13.3064 7.56102 13.3633 9.375H16.5947C16.3468 6.72615 14.54 4.53199 12.1006 3.7168ZM10 3.375C9.86039 3.375 9.65437 3.44756 9.39453 3.7373C9.1351 4.02672 8.87263 4.48057 8.63965 5.09473C8.22547 6.18664 7.94334 7.68388 7.88672 9.375H12.1133C12.0567 7.68388 11.7745 6.18664 11.3604 5.09473C11.1274 4.48057 10.8649 4.02672 10.6055 3.7373C10.3456 3.44756 10.1396 3.375 10 3.375ZM7.89844 3.7168C5.45942 4.53222 3.65314 6.72647 3.40527 9.375H6.63672C6.69362 7.56102 6.99415 5.90775 7.4707 4.65137C7.59781 4.31629 7.74073 4.00224 7.89844 3.7168Z"></path>
              </svg>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent border-none text-gray-300 hover:text-white transition cursor-pointer py-1"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
          </nav>
        </header>

        <div className="mb-10">
          <div className="text-xs text-indigo-300 font-medium mb-1">{questionnaire.subject}</div>
          <div className="text-2xl font-semibold text-white">
            {questionnaire.title}
          </div>
          {isRevision && (
            <div className="mt-2 text-sm text-green-300">
              Must answer correctly to proceed
            </div>
          )}
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="w-full max-w-3xl mb-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsQuickMode((prev) => !prev)}
          className={`px-4 py-2 rounded-xl text-sm border transition ${
            isQuickMode
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-gray-700 border-gray-600 text-gray-100"
          }`}
        >
          {isQuickMode ? "Quick Mode On" : "Quick Mode Off"}
        </button>
        <button
          type="button"
          onClick={() => setIsRevision((prev) => !prev)}
          className={`px-4 py-2 rounded-xl text-sm border transition ${
            isRevision
              ? "bg-green-600 border-green-500 text-white"
              : "bg-gray-700 border-gray-600 text-gray-100"
          }`}
        >
          {isRevision ? "Revision Mode On" : "Revision Mode Off"}
        </button>
      </div>

      {/* Results Screen */}
      {finished ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">Results</h2>
          <p className="text-gray-300 mb-6">
            You scored {results.filter((r) => r.correct).length} / {questions.length}
          </p>

          {/* List of Wrong Questions */}
          {results.filter((r) => !r.correct).length > 0 ? (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <h3 className="text-base font-semibold text-red-300 mb-3">
                Questions answered incorrectly ({results.filter((r) => !r.correct).length}):
              </h3>
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
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
              <p className="text-sm text-green-300">Great job! You answered all questions correctly.</p>
            </div>
          )}

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
                    <span className={`ml-4 text-base ${r.correct ? "text-green-400" : "text-red-400"}`}>
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
                <h2 className="text-xl font-semibold mb-6 text-white">
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

                {/* Feedback - only show in Revision Mode */}
                {feedback && isRevision && (
                  <div
                    className={`mt-4 text-base font-semibold ${
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
                    {isRevision && (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm"
                      >
                        Check
                      </button>
                    )}
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
