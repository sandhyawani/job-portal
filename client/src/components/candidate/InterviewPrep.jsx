import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSearchParams, Link } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "../ui/button";

const INTERVIEW_TOPICS = [
  "All",
  "Python",
  "Django",
  "React",
  "JavaScript",
  "Node.js",
  "REST API",
  "SQL & Databases",
  "HR & Behavioral",
];

const QUESTIONS_DATA = [
  {
    id: 1,
    topic: "Python",
    question: "What is the difference between list and tuple in Python?",
    answer:
      "Lists are mutable (can be changed after creation), use square brackets `[]`, and are slightly slower due to dynamic resizing overhead. Tuples are immutable (cannot be modified once created), use parentheses `()`, and are faster and memory-efficient. Tuples can also be used as dictionary keys if they contain immutable elements.",
    keyPoints: [
      "Mutability vs Immutability",
      "Memory overhead & performance differences",
      "Hashability and dictionary key usage",
    ],
  },
  {
    id: 2,
    topic: "Python",
    question: "How does the Python Global Interpreter Lock (GIL) work?",
    answer:
      "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython. This ensures thread safety for memory management (reference counting), but means CPU-bound multi-threaded Python programs do not run in parallel across multiple CPU cores. For CPU-bound parallelism, multiprocessing or external C extensions are used.",
    keyPoints: [
      "CPython memory safety mechanism",
      "Limits CPU-bound concurrency",
      "Multiprocessing is the standard workaround",
    ],
  },
  {
    id: 3,
    topic: "Django",
    question: "Explain Django's MVT (Model-View-Template) architecture.",
    answer:
      "Django follows Model-View-Template: 'Model' handles database schema and ORM operations; 'View' contains the business logic, handles HTTP requests, interacts with models, and renders responses; 'Template' handles user interface representation. The URL dispatcher routes requests to the appropriate View function or class.",
    keyPoints: [
      "Model: Database schema & ORM",
      "View: Request processing & business logic",
      "Template: Presentation layer (HTML/Jinja)",
    ],
  },
  {
    id: 4,
    topic: "Django",
    question: "How do you optimize slow Django ORM database queries?",
    answer:
      "1. Use `select_related` for single-valued relationships (ForeignKey, OneToOne) using SQL JOINs.\n2. Use `prefetch_related` for multi-valued relationships (ManyToMany, reverse ForeignKeys).\n3. Use `.only()` or `.defer()` to load only required database columns.\n4. Add database indexes to frequently queried filter fields.\n5. Use `exists()` and `count()` instead of loading querysets into memory.",
    keyPoints: [
      "select_related vs prefetch_related",
      "Queryset evaluation and lazy loading",
      "Database indexing on models",
    ],
  },
  {
    id: 5,
    topic: "React",
    question: "What is the difference between useEffect, useMemo, and useCallback?",
    answer:
      "`useEffect` handles side-effects (fetching data, subscriptions, DOM manipulation) after render. `useMemo` caches the calculated result of an expensive function between renders. `useCallback` caches a function definition itself so it does not trigger unnecessary child re-renders when passed as a prop.",
    keyPoints: [
      "useEffect for side-effects",
      "useMemo for expensive computation values",
      "useCallback for function reference stability",
    ],
  },
  {
    id: 6,
    topic: "JavaScript",
    question: "Explain Event Loop and Microtask Queue in JavaScript.",
    answer:
      "JavaScript has a single-threaded call stack. Asynchronous operations are delegated to browser/Node APIs. When ready, callbacks enter queues: Microtasks (Promises, process.nextTick) have higher priority and are executed immediately after current stack completes before any Macrotasks (setTimeout, setInterval, setImmediate) are picked up from the Callback queue.",
    keyPoints: [
      "Call Stack vs Event Loop",
      "Microtasks (Promises) run before Macrotasks (setTimeout)",
      "Non-blocking asynchronous I/O",
    ],
  },
  {
    id: 7,
    topic: "REST API",
    question: "What are idempotent HTTP methods and why do they matter?",
    answer:
      "An HTTP method is idempotent if making multiple identical requests has the same effect on the server state as a single request. GET, HEAD, PUT, and DELETE are idempotent. POST and PATCH are generally not idempotent. Idempotency is crucial for safe network retries in distributed web systems.",
    keyPoints: [
      "GET, PUT, DELETE are idempotent",
      "POST creates new resources and is not idempotent",
      "Vital for safe API retry mechanisms",
    ],
  },
  {
    id: 8,
    topic: "SQL & Databases",
    question: "What are Database Indexes and when can they hurt performance?",
    answer:
      "A database index (typically B-Tree) speeds up read queries by allowing fast binary searches without scanning entire tables. However, every INSERT, UPDATE, or DELETE requires the database to maintain and update the index tree, adding write latency and consuming additional disk space. Unused or redundant indexes should be pruned.",
    keyPoints: [
      "B-Tree index speeds up WHERE and ORDER BY",
      "Slows down heavy write/insert workloads",
      "Index selectivity matters",
    ],
  },
  {
    id: 9,
    topic: "HR & Behavioral",
    question: "How do you handle a situation where a project deadline is at risk?",
    answer:
      "Use the STAR method: Situation (describe the deliverable and timeline), Task (your responsibility), Action (proactively communicate with stakeholders, identify non-essential features to descope, reprioritize critical path items, and collaborate with team members), Result (delivered core functionality on time without burnout, with follow-up sprint for secondary features).",
    keyPoints: [
      "Proactive communication before deadline passes",
      "Scope prioritization (MVP vs nice-to-have)",
      "Stakeholder alignment and transparency",
    ],
  },
  {
    id: 10,
    topic: "HR & Behavioral",
    question: "Tell me about a challenging technical bug you resolved.",
    answer:
      "Structure your answer around systematic debugging: 1. How you reproduced the bug reliably with logs or test cases. 2. Root cause analysis (e.g. race condition, unindexed query, timezone discrepancy). 3. The solution implemented and how you verified it. 4. Preventive action taken (unit tests, CI checks, documentation) to prevent regression.",
    keyPoints: [
      "Systematic root-cause diagnosis over guessing",
      "Verification and regression testing",
      "Preventive safeguards",
    ],
  },
];

const InterviewPrep = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "";
  const skillsParam = searchParams.get("skills") || "";

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [practicedQuestions, setPracticedQuestions] = useState({});

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePracticed = (id, e) => {
    e.stopPropagation();
    setPracticedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = QUESTIONS_DATA.filter((q) => {
    if (selectedTopic !== "All" && q.topic !== selectedTopic) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        q.question.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const completedCount = Object.values(practicedQuestions).filter(Boolean).length;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-24 px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold mb-3">
                <GraduationCap size={14} /> Career Preparation Area
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Interview Preparation Workspace
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Master essential questions, architectural concepts, and behavioral techniques for your next round.
              </p>
              {roleParam && (
                <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                  Tailored for: <span className="text-primary-600">{roleParam}</span>
                  {skillsParam && (
                    <span className="text-slate-500 font-normal"> · Skills: {skillsParam}</span>
                  )}
                </div>
              )}
            </div>

            {/* Practice Tracker Pill */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right">
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                Practiced
              </span>
              <span className="text-2xl font-black text-primary-600">
                {completedCount} / {QUESTIONS_DATA.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-2xl border border-slate-200 bg-white">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search interview questions by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-900 bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {INTERVIEW_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedTopic === topic
                    ? "bg-primary-600 text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-3.5">
          {filteredQuestions.map((q) => {
            const isExpanded = Boolean(expandedQuestions[q.id]);
            const isPracticed = Boolean(practicedQuestions[q.id]);

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
              >
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => togglePracticed(q.id, e)}
                      className={`mt-0.5 p-1 rounded-full transition ${
                        isPracticed
                          ? "text-emerald-600 hover:text-emerald-700"
                          : "text-slate-300 hover:text-slate-400"
                      }`}
                      title={isPracticed ? "Mark unpracticed" : "Mark practiced"}
                    >
                      <CheckCircle2
                        size={18}
                        className={isPracticed ? "fill-emerald-100" : ""}
                      />
                    </button>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-1.5 inline-block">
                        {q.topic}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs animate-in fade-in-50">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-100 mb-3">
                      {q.answer}
                    </div>

                    {q.keyPoints && (
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1.5 uppercase tracking-wider text-[10px]">
                          Key concepts recruiters evaluate:
                        </h4>
                        <ul className="space-y-1 text-slate-600 list-disc list-inside">
                          {q.keyPoints.map((kp, idx) => (
                            <li key={idx}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default InterviewPrep;
