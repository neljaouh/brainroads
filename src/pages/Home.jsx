import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ===== Questionnaires Listing Page (Dark Mode + Search + Filters + Subjects) =====

export default function QuestionnairesHome() {
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterSubject, setFilterSubject] = useState("All Subjects");

  useEffect(() => {
    fetch("/questionnaires/index.json")
      .then((res) => res.json())
      .then((data) => setAllQuestionnaires(data))
      .catch((err) => {
        console.error("Failed to load questionnaires:", err);
        setAllQuestionnaires([]);
      });
  }, []);

  // Get unique subjects from loaded questionnaires
  const subjects = [
    "All Subjects",
    ...Array.from(new Set(allQuestionnaires.map((q) => q.subject))).sort(),
  ];

  const filtered = allQuestionnaires.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "All Levels" || q.difficulty === filterLevel;
    const matchesSubject = filterSubject === "All Subjects" || q.subject === filterSubject;
    return matchesSearch && matchesLevel && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="text-xl font-bold tracking-tight">BrainRoads</div>
        <nav className="space-x-6 text-base text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <a href="#" className="hover:text-white transition">My Progress</a>
        </nav>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search questionnaires..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-1/2 md:w-auto"
          >
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-1/2 md:w-auto"
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of questionnaire cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-700 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2 text-white">{q.title}</h2>
              <p className="text-gray-400 text-xs mb-3">{q.description}</p>
              <div className="text-xs text-gray-500 mb-1">{q.questionsCount} questions</div>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-700/30 text-indigo-300 font-medium">{q.difficulty}</span>
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-700/30 text-green-300 font-medium">{q.subject}</span>
              </div>
            </div>

            <Link
              to={`/play/${q.id}`}
              className="mt-6 w-full py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition block text-center"
            >
              Start
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
