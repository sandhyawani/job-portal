import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Search,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import axios from 'axios';
import { INTERVIEW_QUESTIONS_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

/**
 * Safely parses inline markdown tokens: **bold**, `inline code`, and *italic*.
 */
const parseInlineMarkdown = (text) => {
  if (!text || typeof text !== "string") return text;
  
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`c-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-teal-800 font-mono text-[11px] sm:text-xs border border-slate-200/70 font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`i-${match.index}`} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

/**
 * Renders structured content cleanly: splits paragraphs, detects lists, and parses inline formatting.
 */
const StructuredAnswer = ({ text }) => {
  if (!text) return null;

  const rawLines = text.split(/\r?\n/);
  const elements = [];
  
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line contains inline multiple numbered points (e.g. "Intro: 1. A 2. B 3. C" or "1) A 2) B")
    const inlineNumMatches = trimmed.match(/(?:^|[\s:])(\d+[\.\)]\s+)/g);
    if (inlineNumMatches && inlineNumMatches.length >= 2) {
      const firstIdx = trimmed.search(/(?:^|[\s:])\d+[\.\)]\s+/);
      const prefix = trimmed.substring(0, firstIdx).trim();
      if (prefix) {
        elements.push({ type: "paragraph", content: prefix });
      }

      const rest = trimmed.substring(firstIdx);
      const items = rest.split(/(?=(?:^|\s)\d+[\.\)]\s+)/).map((s) => s.trim()).filter(Boolean);
      for (const item of items) {
        const matchNum = item.match(/^(\d+[\.\)])\s+(.*)/);
        if (matchNum) {
          elements.push({ type: "numbered", number: matchNum[1], content: matchNum[2] });
        } else {
          elements.push({ type: "paragraph", content: item });
        }
      }
      continue;
    }

    // Check if line is bullet list item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      elements.push({ type: "bullet", content: bulletMatch[1] });
      continue;
    }

    // Check if line starts with numbered list item: '1. ' or '1) '
    const lineNumMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
    if (lineNumMatch) {
      elements.push({ type: "numbered", number: lineNumMatch[1], content: lineNumMatch[2] });
      continue;
    }

    elements.push({ type: "paragraph", content: trimmed });
  }

  // Group contiguous items of same list type for clean semantic rendering
  const renderedGroups = [];
  let currentGroup = null;

  elements.forEach((el, index) => {
    if (el.type === "bullet") {
      if (currentGroup && currentGroup.type === "bullet") {
        currentGroup.items.push(el.content);
      } else {
        if (currentGroup) renderedGroups.push(currentGroup);
        currentGroup = { type: "bullet", items: [el.content] };
      }
    } else if (el.type === "numbered") {
      if (currentGroup && currentGroup.type === "numbered") {
        currentGroup.items.push({ number: el.number, content: el.content });
      } else {
        if (currentGroup) renderedGroups.push(currentGroup);
        currentGroup = { type: "numbered", items: [{ number: el.number, content: el.content }] };
      }
    } else {
      if (currentGroup) {
        renderedGroups.push(currentGroup);
        currentGroup = null;
      }
      renderedGroups.push({ type: "paragraph", content: el.content });
    }
  });
  if (currentGroup) renderedGroups.push(currentGroup);

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
      {renderedGroups.map((grp, gIdx) => {
        if (grp.type === "paragraph") {
          return (
            <p key={`p-${gIdx}`} className="leading-relaxed">
              {parseInlineMarkdown(grp.content)}
            </p>
          );
        }
        if (grp.type === "bullet") {
          return (
            <ul key={`ul-${gIdx}`} className="space-y-1.5 pl-1 my-2">
              {grp.items.map((item, iIdx) => (
                <li key={`b-${iIdx}`} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                  <span className="flex-1">{parseInlineMarkdown(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (grp.type === "numbered") {
          return (
            <ol key={`ol-${gIdx}`} className="space-y-2 pl-0.5 my-2">
              {grp.items.map((item, iIdx) => (
                <li key={`n-${iIdx}`} className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center font-bold text-[11px] text-teal-700 bg-teal-50 border border-teal-200/80 rounded-md px-1.5 py-0.5 shrink-0 mt-0.5">
                    {item.number}
                  </span>
                  <span className="flex-1">{parseInlineMarkdown(item.content)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
};

/**
 * Reusable Code Block with horizontal scroll, preserved whitespace, and copy button.
 */
const CodeSnippetBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-sm max-w-full">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
        <span>Example Code</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 sm:p-4 text-slate-100 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto whitespace-pre selection:bg-teal-700 selection:text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const InterviewPrep = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "";
  const skillsParam = searchParams.get("skills") || "";

  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [topicsList, setTopicsList] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [practicedQuestions, setPracticedQuestions] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${INTERVIEW_QUESTIONS_API_END_POINT}`, { withCredentials: true });
        if (res.data.success) {
          setQuestionsData(res.data.questions);
          
          // Extract unique topics
          const topics = new Set(res.data.questions.map(q => q.topic).filter(Boolean));
          setTopicsList(["All", ...Array.from(topics)]);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load interview questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePracticed = (id, e) => {
    e.stopPropagation();
    setPracticedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = questionsData.filter((q) => {
    if (selectedTopic !== "All" && q.topic !== selectedTopic) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        q.question.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term) ||
        (q.topic && q.topic.toLowerCase().includes(term))
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
                {completedCount} / {questionsData.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search interview questions by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-900 bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {topicsList.map((topic) => (
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

        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading questions...</div>
        ) : (
          <div className="space-y-3.5">
            {filteredQuestions.map((q) => {
              const isExpanded = Boolean(expandedQuestions[q._id]);
              const isPracticed = Boolean(practicedQuestions[q._id]);

              const qType = q.type || 'Conceptual';
              const isBehavioral = qType === 'Behavioral';
              const isScenario = qType === 'Scenario';
              const isCoding = qType === 'Coding';

              // Determine answer section title
              const answerSectionTitle = isBehavioral
                ? "SAMPLE ANSWER / APPROACH"
                : isScenario
                ? "SCENARIO / APPROACH"
                : "ANSWER";

              // Determine key concepts title
              const keyPointsTitle = isBehavioral
                ? "KEY CONCEPTS RECRUITERS EVALUATE"
                : "KEY CONCEPTS";

              // Determine if code block should be displayed:
              // - Behavioral: NEVER show code block
              // - Scenario: Only if genuine code exists
              // - Conceptual: Only if non-empty code exists
              // - Coding: Show code if present
              const hasCode = !isBehavioral && Boolean(q.codeExample && q.codeExample.trim());

              return (
                <div
                  key={q._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
                >
                  <div
                    onClick={() => toggleExpand(q._id)}
                    className="flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => togglePracticed(q._id, e)}
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
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                            {q.topic}
                          </span>
                          {q.difficulty && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block ${
                                q.difficulty === "Easy"
                                  ? "bg-green-100 text-green-700"
                                  : q.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          )}
                          {q.type && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block ${
                                q.type === "Coding"
                                  ? "bg-purple-100 text-purple-700"
                                  : q.type === "Behavioral"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : q.type === "Scenario"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {q.type}
                            </span>
                          )}
                        </div>
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
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs animate-in fade-in-50 space-y-3.5">
                      {/* Answer Section */}
                      <div>
                        <h4 className="font-bold text-slate-500 mb-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                          {answerSectionTitle}
                        </h4>
                        <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-100/90 text-slate-700">
                          <StructuredAnswer text={q.answer} />
                        </div>
                      </div>

                      {/* Key Points / Concepts */}
                      {q.keyPoints && q.keyPoints.length > 0 && (
                        <div>
                          <h4 className="font-bold text-slate-500 mb-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                            {keyPointsTitle}
                          </h4>
                          <ul className="space-y-1.5 pl-1 text-slate-700 text-xs sm:text-[13px]">
                            {q.keyPoints.map((kp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                                <span className="flex-1">{parseInlineMarkdown(kp)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Code Example (Hidden for Behavioral, Conditional for Scenario & Conceptual) */}
                      {hasCode && (
                        <div>
                          <h4 className="font-bold text-slate-500 mb-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                            Code Example
                          </h4>
                          <CodeSnippetBlock code={q.codeExample} />
                        </div>
                      )}

                      {/* Interview Tip */}
                      {q.interviewTip && (
                        <div className="bg-amber-50/90 border border-amber-200/70 p-3 sm:p-3.5 rounded-xl text-amber-900 text-xs sm:text-[13px] flex items-start gap-2.5">
                          <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold mr-1.5">Interview Tip:</span>
                            {parseInlineMarkdown(q.interviewTip)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredQuestions.length === 0 && !loading && (
              <div className="text-center py-10 text-slate-500">
                No questions found matching your criteria.
              </div>
            )}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default InterviewPrep;
