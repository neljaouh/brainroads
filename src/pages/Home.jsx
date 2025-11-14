import React, { useState } from "react";
import { Link } from "react-router-dom";

// ===== Questionnaires Listing Page (Dark Mode + Search + Filters + Subjects) =====

export default function QuestionnairesHome() {
  const allQuestionnaires = [
    { id: 1, title: "Introduction to Biology", subject: "Science", description: "Fundamental concepts every beginner should know.", questions: 12, difficulty: "Beginner" },
    { id: 2, title: "Advanced Algebra", subject: "Mathematics", description: "Challenge yourself with higher-level math questions.", questions: 20, difficulty: "Advanced" },
    { id: 3, title: "World History Essentials", subject: "History", description: "Test your knowledge of key historical events.", questions: 15, difficulty: "Intermediate" },
    { id: 4, title: "French Grammar Basics", subject: "Languages", description: "Master the foundations of French grammar.", questions: 18, difficulty: "Beginner" },
    { id: 5, title: "Cybersecurity Fundamentals", subject: "Technology", description: "Learn about digital security threats and protections.", questions: 22, difficulty: "Intermediate" },
    { id: 6, title: "Human Anatomy Advanced", subject: "Science", description: "In-depth exploration of human body systems.", questions: 25, difficulty: "Advanced" },
    { id: 7, title: "Physics: Motion & Forces", subject: "Science", description: "Core principles of Newtonian physics.", questions: 14, difficulty: "Beginner" },
    { id: 8, title: "Modern World Politics", subject: "Politics", description: "Understand key geopolitical dynamics.", questions: 17, difficulty: "Intermediate" },
    { id: 9, title: "Software Engineering Patterns", subject: "Technology", description: "Essential design patterns for developers.", questions: 19, difficulty: "Advanced" },
  ];

  const subjects = ["All Subjects", "Science", "Mathematics", "History", "Languages", "Technology", "Politics"];

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterSubject, setFilterSubject] = useState("All Subjects");

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
        <div className="text-2xl font-bold tracking-tight">BrainRoads</div>
        <nav className="space-x-6 text-lg text-gray-300">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-700 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">{q.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{q.description}</p>
              <div className="text-sm text-gray-500 mb-1">{q.questions} questions</div>

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
