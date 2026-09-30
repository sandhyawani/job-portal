import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Navbar from '../shared/Navbar';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminInterviewQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (topic) params.append('topic', topic);
            if (difficulty) params.append('difficulty', difficulty);
            if (type) params.append('type', type);

            const res = await axios.get(`${ADMIN_API_END_POINT}/interview-questions?${params.toString()}`, { withCredentials: true });
            if (res.data.success) {
                setQuestions(res.data.questions);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch questions');
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
                ...question,
                keyPoints: question.keyPoints?.join('\n') || ''
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
            const dataToSubmit = {
                ...formData,
                keyPoints: formData.keyPoints.split('\n').filter(p => p.trim() !== '')
            };

            if (editingQuestion) {
                const res = await axios.put(`${ADMIN_API_END_POINT}/interview-questions/${editingQuestion._id}`, dataToSubmit, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Question updated successfully');
                    fetchQuestions();
                    setIsModalOpen(false);
                }
            } else {
                const res = await axios.post(`${ADMIN_API_END_POINT}/interview-questions`, dataToSubmit, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Question created successfully');
                    fetchQuestions();
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            const res = await axios.delete(`${ADMIN_API_END_POINT}/interview-questions/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success('Question deleted successfully');
                fetchQuestions();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete question');
        }
    };

    const handleToggleActive = async (question) => {
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/interview-questions/${question._id}`, { isActive: !question.isActive }, { withCredentials: true });
            if (res.data.success) {
                toast.success(`Question ${question.isActive ? 'deactivated' : 'activated'}`);
                fetchQuestions();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update question status');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Interview Questions</h1>
                    <button 
                        onClick={() => handleOpenModal()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus size={20} className="mr-2" /> Add Question
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search questions..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="border rounded-md px-4 py-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
                        <option value="">All Topics</option>
                        <option value="React">React</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value="MongoDB">MongoDB</option>
                        <option value="General">General</option>
                    </select>
                    <select className="border rounded-md px-4 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select className="border rounded-md px-4 py-2" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="Conceptual">Conceptual</option>
                        <option value="Coding">Coding</option>
                        <option value="System Design">System Design</option>
                        <option value="Behavioral">Behavioral</option>
                    </select>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {questions.map(q => (
                                    <tr key={q._id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-md" title={q.question}>{q.question}</div>
                                            <div className="text-sm text-gray-500">{q.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {q.topic}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {q.difficulty}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => handleToggleActive(q)} className="flex items-center">
                                                {q.isActive ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleOpenModal(q)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {questions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No questions found.
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
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
                            <form onSubmit={handleSave}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {editingQuestion ? 'Edit Question' : 'Add Question'}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Question</label>
                                            <textarea name="question" required value={formData.question} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="2"></textarea>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Answer</label>
                                            <textarea name="answer" required value={formData.answer} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Topic</label>
                                            <input type="text" name="topic" required value={formData.topic} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sub Topic</label>
                                            <input type="text" name="subTopic" value={formData.subTopic} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Type</label>
                                            <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="Conceptual">Conceptual</option>
                                                <option value="Coding">Coding</option>
                                                <option value="System Design">System Design</option>
                                                <option value="Behavioral">Behavioral</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Key Points (one per line)</label>
                                            <textarea name="keyPoints" value={formData.keyPoints} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="3" placeholder="Point 1&#10;Point 2"></textarea>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Code Example</label>
                                            <textarea name="codeExample" value={formData.codeExample} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm" rows="4"></textarea>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Interview Tip</label>
                                            <input type="text" name="interviewTip" value={formData.interviewTip} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div className="col-span-2 flex items-center mt-2">
                                            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active (Visible to candidates)</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInterviewQuestions;
