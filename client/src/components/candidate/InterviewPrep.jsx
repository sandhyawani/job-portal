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
} from "lucide-react";
import axios from 'axios';
import { INTERVIEW_QUESTIONS_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

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

                return (
                <div
                    key={q._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
                >
                    <div
                    onClick={() => toggleExpand(q._id)}
                    className="flex items-start justify-between gap-4 cursor-pointer"
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
                        <div className="flex flex-wrap gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                                {q.topic}
                            </span>
                            {q.difficulty && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {q.difficulty}
                            </span>
                            )}
                            {q.type && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 inline-block">
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
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs animate-in fade-in-50">
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-100 mb-3">
                        {q.answer}
                        </div>

                        {q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="mb-3">
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
                        
                        {q.codeExample && (
                        <div className="mb-3">
                            <h4 className="font-bold text-slate-800 mb-1.5 uppercase tracking-wider text-[10px]">
                            Code Example:
                            </h4>
                            <pre className="bg-slate-900 text-slate-50 p-3 rounded-lg overflow-x-auto whitespace-pre">
                                <code>{q.codeExample}</code>
                            </pre>
                        </div>
                        )}
                        
                        {q.interviewTip && (
                        <div className="mt-2 bg-yellow-50 border border-yellow-100 p-3 rounded-xl text-yellow-800">
                            <strong>Tip:</strong> {q.interviewTip}
                        </div>
                        )}
                    </div>
                    )}
                </div>
                );
            })}
            {filteredQuestions.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-500">No questions found matching your criteria.</div>
            )}
            </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default InterviewPrep;
