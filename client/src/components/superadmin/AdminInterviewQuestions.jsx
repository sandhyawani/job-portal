import React, { useEffect, useState } from 'react';
import adminApi from '@/api/adminApi';
import Navbar from '../shared/Navbar';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminInterviewQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [type, setType] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        topic: '',
        subTopic: '',
        difficulty: 'Easy',
        type: 'Conceptual',
        question: '',
        answer: '',
        keyPoints: '',
        codeExample: '',
        interviewTip: '',
        isActive: true
    });

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (topic) params.topic = topic;
            if (difficulty) params.difficulty = difficulty;
            if (type) params.type = type;

            const res = await adminApi.getInterviewQuestions(params);
            if (res.data.success) {
                setQuestions(res.data.questions || []);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.friendlyMessage || error.response?.data?.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [search, topic, difficulty, type]);

    const handleInputChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleOpenModal = (question = null) => {
        if (question) {
            setEditingQuestion(question);
            setFormData({
                topic: question.topic || '',
                subTopic: question.subTopic || '',
                difficulty: question.difficulty || 'Easy',
                type: question.type || 'Conceptual',
                question: question.question || '',
                answer: question.answer || '',
                keyPoints: Array.isArray(question.keyPoints) ? question.keyPoints.join('\n') : (question.keyPoints || ''),
                codeExample: question.codeExample || '',
                interviewTip: question.interviewTip || '',
                isActive: question.isActive !== undefined ? question.isActive : true
            });
        } else {
            setEditingQuestion(null);
            setFormData({
                topic: '',
                subTopic: '',
                difficulty: 'Easy',
                type: 'Conceptual',
                question: '',
                answer: '',
                keyPoints: '',
                codeExample: '',
                interviewTip: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const rawPoints = typeof formData.keyPoints === 'string' ? formData.keyPoints : '';
            const dataToSubmit = {
                topic: formData.topic.trim(),
                subTopic: formData.subTopic ? formData.subTopic.trim() : '',
                difficulty: formData.difficulty,
                type: formData.type,
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                codeExample: formData.codeExample || '',
                interviewTip: formData.interviewTip || '',
                isActive: formData.isActive,
                keyPoints: rawPoints
                    .split('\n')
                    .map(p => p.trim())
                    .filter(p => p.length > 0)
            };

            if (!dataToSubmit.topic || !dataToSubmit.question || !dataToSubmit.answer) {
                toast.error('Please fill in Topic, Question, and Answer.');
                return;
            }

            if (editingQuestion) {
                const res = await adminApi.updateInterviewQuestion(editingQuestion._id, dataToSubmit);
                if (res.data.success) {
                    toast.success('Question updated successfully');
                    fetchQuestions();
                    setIsModalOpen(false);
                }
            } else {
                const res = await adminApi.addInterviewQuestion(dataToSubmit);
                if (res.data.success) {
                    toast.success('Question created successfully');
                    fetchQuestions();
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.friendlyMessage || error.response?.data?.message || 'Failed to save question');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            const res = await adminApi.deleteInterviewQuestion(id);
            if (res.data.success) {
                toast.success('Question deleted successfully');
                fetchQuestions();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.friendlyMessage || error.response?.data?.message || 'Failed to delete question');
        }
    };

    const handleToggleActive = async (question) => {
        try {
            const res = await adminApi.updateInterviewQuestion(question._id, { isActive: !question.isActive });
            if (res.data.success) {
                toast.success(`Question ${question.isActive ? 'deactivated' : 'activated'}`);
                fetchQuestions();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.friendlyMessage || error.response?.data?.message || 'Failed to update question status');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Interview Questions</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage technical & conceptual questions for candidate prep</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()} 
                        className="bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition flex items-center font-medium shadow-sm"
                    >
                        <Plus size={18} className="mr-1.5" /> Add Question
                    </button>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search questions by topic or title..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500" value={topic} onChange={(e) => setTopic(e.target.value)}>
                        <option value="">All Topics</option>
                        <option value="React">React</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value="MongoDB">MongoDB</option>
                        <option value="General">General</option>
                    </select>
                    <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="Conceptual">Conceptual</option>
                        <option value="Coding">Coding</option>
                        <option value="Scenario">Scenario</option>
                        <option value="Behavioral">Behavioral</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Topic</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {questions.map(q => (
                                    <tr key={q._id} className="hover:bg-slate-50/60 transition">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900 truncate max-w-md" title={q.question}>{q.question}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{q.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                                                {q.topic}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            {q.difficulty}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => handleToggleActive(q)} 
                                                className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                                                title={q.isActive ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                {q.isActive ? (
                                                    <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                        <CheckCircle size={14} className="mr-1" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                                        <XCircle size={14} className="mr-1" /> Inactive
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleOpenModal(q)} className="text-primary-600 hover:text-primary-800 mr-3 p-1 rounded-lg hover:bg-primary-50 transition cursor-pointer">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(q._id)} className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {questions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                                            No interview questions found. Click "Add Question" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    {/* Modal Dialog Content */}
                    <div className="relative z-10 bg-white rounded-2xl text-left shadow-2xl w-full max-w-3xl border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
                        <form onSubmit={handleSave}>
                            <div className="bg-white px-6 pt-6 pb-5">
                                <h3 className="text-xl font-bold text-slate-900 mb-5">
                                    {editingQuestion ? 'Edit Interview Question' : 'Add New Interview Question'}
                                </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Question *</label>
                                            <textarea 
                                                name="question" 
                                                required 
                                                value={formData.question} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                                rows="2"
                                                placeholder="e.g. Explain how useEffect cleanup works in React"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Answer / Explanation *</label>
                                            <textarea 
                                                name="answer" 
                                                required 
                                                value={formData.answer} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                                rows="4"
                                                placeholder="Provide the comprehensive answer..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Topic *</label>
                                            <input 
                                                type="text" 
                                                name="topic" 
                                                required 
                                                value={formData.topic} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g. React, JavaScript, Node.js"
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sub Topic</label>
                                            <input 
                                                type="text" 
                                                name="subTopic" 
                                                value={formData.subTopic} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g. Hooks, Async/Await"
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty</label>
                                            <select 
                                                name="difficulty" 
                                                value={formData.difficulty} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="Conceptual">Conceptual</option>
                                                <option value="Coding">Coding</option>
                                                <option value="Scenario">Scenario</option>
                                                <option value="Behavioral">Behavioral</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Key Points (one per line)</label>
                                            <textarea 
                                                name="keyPoints" 
                                                value={formData.keyPoints} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                                rows="3" 
                                                placeholder="Cleanup functions prevent memory leaks&#10;Runs before re-render and unmount"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Code Example (Optional)</label>
                                            <textarea 
                                                name="codeExample" 
                                                value={formData.codeExample} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                                rows="3"
                                                placeholder="// Paste code snippet here"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Interview Tip (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="interviewTip" 
                                                value={formData.interviewTip} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g. Mention event listener removal as a real-world use case"
                                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center mt-2">
                                            <input 
                                                type="checkbox" 
                                                name="isActive" 
                                                id="isActive" 
                                                checked={formData.isActive} 
                                                onChange={handleInputChange} 
                                                className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" 
                                            />
                                            <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-slate-700">
                                                Active (Immediately visible to candidates in Interview Prep)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-200 rounded-b-2xl">
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-5 py-2.5 bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 transition shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        {editingQuestion ? 'Save Changes' : 'Create Question'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="w-full sm:w-auto mt-2 sm:mt-0 inline-flex justify-center rounded-xl border border-slate-300 px-4 py-2.5 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            )}
        </div>
    );
};

export default AdminInterviewQuestions;
