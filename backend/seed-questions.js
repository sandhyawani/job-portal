import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { InterviewQuestion } from "./models/interviewQuestion.model.js";

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QUESTIONS_DATA = [
  {
    topic: "Python",
    question: "What is the difference between list and tuple in Python?",
    answer:
      "Lists are mutable (can be changed after creation), use square brackets `[]`, and are slightly slower due to dynamic resizing overhead. Tuples are immutable (cannot be modified once created), use parentheses `()`, and are faster and memory-efficient. Tuples can also be used as dictionary keys if they contain immutable elements.",
    keyPoints: [
      "Mutability vs Immutability",
      "Memory overhead & performance differences",
      "Hashability and dictionary key usage",
    ],
    difficulty: "Easy",
    type: "Conceptual"
  },
  {
    topic: "Python",
    question: "How does the Python Global Interpreter Lock (GIL) work?",
    answer:
      "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython. This ensures thread safety for memory management (reference counting), but means CPU-bound multi-threaded Python programs do not run in parallel across multiple CPU cores. For CPU-bound parallelism, multiprocessing or external C extensions are used.",
    keyPoints: [
      "CPython memory safety mechanism",
      "Limits CPU-bound concurrency",
      "Multiprocessing is the standard workaround",
    ],
    difficulty: "Hard",
    type: "Conceptual"
  },
  {
    topic: "Django",
    question: "Explain Django's MVT (Model-View-Template) architecture.",
    answer:
      "Django follows Model-View-Template: 'Model' handles database schema and ORM operations; 'View' contains the business logic, handles HTTP requests, interacts with models, and renders responses; 'Template' handles user interface representation. The URL dispatcher routes requests to the appropriate View function or class.",
    keyPoints: [
      "Model: Database schema & ORM",
      "View: Request processing & business logic",
      "Template: Presentation layer (HTML/Jinja)",
    ],
    difficulty: "Medium",
    type: "Conceptual"
  },
  {
    topic: "Django",
    question: "How do you optimize slow Django ORM database queries?",
    answer:
      "1. Use `select_related` for single-valued relationships (ForeignKey, OneToOne) using SQL JOINs.\n2. Use `prefetch_related` for multi-valued relationships (ManyToMany, reverse ForeignKeys).\n3. Use `.only()` or `.defer()` to load only required database columns.\n4. Add database indexes to frequently queried filter fields.\n5. Use `exists()` and `count()` instead of loading querysets into memory.",
    keyPoints: [
      "select_related vs prefetch_related",
      "Queryset evaluation and lazy loading",
      "Database indexing on models",
    ],
    difficulty: "Hard",
    type: "Coding"
  },
  {
    topic: "React",
    question: "What is the difference between useEffect, useMemo, and useCallback?",
    answer:
      "`useEffect` handles side-effects (fetching data, subscriptions, DOM manipulation) after render. `useMemo` caches the calculated result of an expensive function between renders. `useCallback` caches a function definition itself so it does not trigger unnecessary child re-renders when passed as a prop.",
    keyPoints: [
      "useEffect for side-effects",
      "useMemo for expensive computation values",
      "useCallback for function reference stability",
    ],
    difficulty: "Medium",
    type: "Conceptual"
  },
  {
    topic: "JavaScript",
    question: "Explain Event Loop and Microtask Queue in JavaScript.",
    answer:
      "JavaScript has a single-threaded call stack. Asynchronous operations are delegated to browser/Node APIs. When ready, callbacks enter queues: Microtasks (Promises, process.nextTick) have higher priority and are executed immediately after current stack completes before any Macrotasks (setTimeout, setInterval, setImmediate) are picked up from the Callback queue.",
    keyPoints: [
      "Call Stack vs Event Loop",
      "Microtasks (Promises) run before Macrotasks (setTimeout)",
      "Non-blocking asynchronous I/O",
    ],
    difficulty: "Hard",
    type: "Conceptual"
  },
  {
    topic: "REST API",
    question: "What are idempotent HTTP methods and why do they matter?",
    answer:
      "An HTTP method is idempotent if making multiple identical requests has the same effect on the server state as a single request. GET, HEAD, PUT, and DELETE are idempotent. POST and PATCH are generally not idempotent. Idempotency is crucial for safe network retries in distributed web systems.",
    keyPoints: [
      "GET, PUT, DELETE are idempotent",
      "POST creates new resources and is not idempotent",
      "Vital for safe API retry mechanisms",
    ],
    difficulty: "Medium",
    type: "Conceptual"
  },
  {
    topic: "SQL & Databases",
    question: "What are Database Indexes and when can they hurt performance?",
    answer:
      "A database index (typically B-Tree) speeds up read queries by allowing fast binary searches without scanning entire tables. However, every INSERT, UPDATE, or DELETE requires the database to maintain and update the index tree, adding write latency and consuming additional disk space. Unused or redundant indexes should be pruned.",
    keyPoints: [
      "B-Tree index speeds up WHERE and ORDER BY",
      "Slows down heavy write/insert workloads",
      "Index selectivity matters",
    ],
    difficulty: "Medium",
    type: "Conceptual"
  },
  {
    topic: "HR & Behavioral",
    question: "How do you handle a situation where a project deadline is at risk?",
    answer:
      "Use the STAR method: Situation (describe the deliverable and timeline), Task (your responsibility), Action (proactively communicate with stakeholders, identify non-essential features to descope, reprioritize critical path items, and collaborate with team members), Result (delivered core functionality on time without burnout, with follow-up sprint for secondary features).",
    keyPoints: [
      "Proactive communication before deadline passes",
      "Scope prioritization (MVP vs nice-to-have)",
      "Stakeholder alignment and transparency",
    ],
    difficulty: "Medium",
    type: "Behavioral"
  },
  {
    topic: "HR & Behavioral",
    question: "Tell me about a challenging technical bug you resolved.",
    answer:
      "Structure your answer around systematic debugging: 1. How you reproduced the bug reliably with logs or test cases. 2. Root cause analysis (e.g. race condition, unindexed query, timezone discrepancy). 3. The solution implemented and how you verified it. 4. Preventive action taken (unit tests, CI checks, documentation) to prevent regression.",
    keyPoints: [
      "Systematic root-cause diagnosis over guessing",
      "Verification and regression testing",
      "Preventive safeguards",
    ],
    difficulty: "Hard",
    type: "Scenario"
  },
];

const seedQuestions = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, clearing old questions...");
    await InterviewQuestion.deleteMany({});
    
    console.log("Inserting new questions...");
    await InterviewQuestion.insertMany(QUESTIONS_DATA);
    
    console.log("Successfully seeded", QUESTIONS_DATA.length, "interview questions.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedQuestions();