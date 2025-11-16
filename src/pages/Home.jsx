import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ===== Questionnaires Listing Page (Dark Mode + Search + Filters + Subjects) =====

export default function QuestionnairesHome() {
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetch("/questionnaires/index.json?v=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setAllQuestionnaires(data);
      })
      .catch((err) => {
        console.error("Failed to load questionnaires:", err);
        setAllQuestionnaires([]);
      });
  }, []);

  // Filter by language first - only show questionnaires that have the selected language
  const languageFiltered = allQuestionnaires.filter((q) => {
    // If no languages field exists, treat as English-only (backward compatibility)
    if (!q.languages || !Array.isArray(q.languages) || q.languages.length === 0) {
      return language === "en";
    }
    // Must include the selected language
    return q.languages.includes(language);
  });

  // Get unique subjects from questionnaires in the selected language
  const subjects = [
    "All Subjects",
    ...Array.from(new Set(languageFiltered.map((q) => q.subject))).sort(),
  ];

  const filtered = languageFiltered.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "All Levels" || q.difficulty === filterLevel;
    const matchesSubject = filterSubject === "All Subjects" || q.subject === filterSubject;
    return matchesSearch && matchesLevel && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Cerveau" className="h-5 w-5 text-white">
              <path d="M12.417 2.08497C13.1595 2.07718 13.928 2.30924 14.5215 2.81544C15.0187 3.23964 15.3659 3.83436 15.4756 4.56837C17.7228 5.25845 18.6116 8.06419 17.2881 9.94434C18.484 11.643 17.9138 14.1413 16.0137 15.1016C15.5614 16.6946 14.2619 17.7428 12.873 17.8955C12.1235 17.9779 11.3488 17.7969 10.7002 17.2969C10.435 17.0924 10.2019 16.8392 10 16.543C9.79813 16.8392 9.565 17.0924 9.2998 17.2969C8.65115 17.7969 7.87652 17.9779 7.12695 17.8955C5.73805 17.7428 4.43755 16.6947 3.98535 15.1016C2.08588 14.141 1.51618 11.6427 2.71191 9.94434C1.3886 8.06443 2.27688 5.25892 4.52343 4.56837C4.63309 3.8343 4.98126 3.23967 5.47851 2.81544C6.07202 2.30924 6.84047 2.07718 7.583 2.08497C8.32607 2.09281 9.09216 2.34177 9.68164 2.85938C9.79607 2.9599 9.90263 3.06931 10 3.18751C10.0974 3.06931 10.2039 2.9599 10.3184 2.85938C10.9078 2.34178 11.6739 2.09282 12.417 2.08497ZM9.33496 5.14258C9.33486 4.53819 9.11005 4.1274 8.80371 3.8584C8.48431 3.57797 8.03808 3.42002 7.56933 3.41505C7.10021 3.41009 6.65707 3.55915 6.34179 3.82813C6.0406 4.08512 5.81738 4.48266 5.81738 5.07813V5.10255C5.81929 5.43475 5.57591 5.71744 5.24707 5.76465C3.51732 6.01303 2.80432 8.25192 4.04394 9.47169L4.1289 9.57325C4.20251 9.68226 4.24212 9.8118 4.24218 9.94532C4.24218 10.1235 4.17098 10.2949 4.04394 10.4199C2.97893 11.468 3.32104 13.3372 4.65917 13.9531L4.79101 14.0088L4.86914 14.044C5.04329 14.1372 5.16808 14.3043 5.20703 14.501C5.45172 15.739 6.38692 16.4768 7.27246 16.5742C7.7085 16.6221 8.13302 16.5171 8.4873 16.2441C8.83301 15.9777 9.15693 15.5133 9.33496 14.7607V5.14258ZM10.665 14.7607C10.8431 15.5133 11.167 15.9777 11.5127 16.2441C11.867 16.5171 12.2915 16.6221 12.7275 16.5742C13.6131 16.4768 14.5483 15.739 14.793 14.501L14.8144 14.419C14.8772 14.2314 15.0214 14.0801 15.209 14.0088C16.6556 13.4584 17.0552 11.5017 15.956 10.4199C15.829 10.2949 15.7578 10.1235 15.7578 9.94532C15.7579 9.76723 15.8291 9.59662 15.956 9.47169C17.1569 8.29005 16.5253 6.15225 14.9121 5.79395L14.7529 5.76465C14.4241 5.71744 14.1807 5.43475 14.1826 5.10255V5.07813L14.1719 4.86426C14.1252 4.38549 13.9218 4.05306 13.6582 3.82813C13.3429 3.55915 12.8998 3.41009 12.4307 3.41505C11.9619 3.42002 11.5157 3.57797 11.1963 3.8584C10.9282 4.09377 10.7221 4.43764 10.6748 4.92481L10.665 5.14258V14.7607Z"></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">BrainRoads</span>
        </div>
        <nav className="space-x-6 text-base text-gray-300 flex items-center">
          <Link to="/" className="hover:text-white transition">Home</Link>
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
