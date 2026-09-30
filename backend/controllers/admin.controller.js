import { InterviewQuestion } from "../models/interviewQuestion.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";

export const addInterviewQuestion = async (req, res) => {
    try {
        const { topic, subTopic, difficulty, type, question, answer, keyPoints, codeExample, interviewTip, isActive } = req.body;
        
        if (!topic || !difficulty || !question || !answer) {
            return res.status(400).json({
                message: "Topic, difficulty, question, and answer are required.",
                success: false
            });
        }

        const newQuestion = await InterviewQuestion.create({
            topic,
            subTopic: subTopic || "",
            difficulty,
            type: type || "Conceptual",
            question,
            answer,
            keyPoints: keyPoints || [],
            codeExample: codeExample || "",
            interviewTip: interviewTip || "",
            isActive: isActive !== undefined ? isActive : true
        });

        return res.status(201).json({
            message: "Interview question added successfully.",
            success: true,
            question: newQuestion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateInterviewQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const updates = req.body;
        
        const updatedQuestion = await InterviewQuestion.findByIdAndUpdate(questionId, updates, { new: true });
        
        if (!updatedQuestion) {
            return res.status(404).json({
                message: "Question not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Question updated successfully.",
            success: true,
            question: updatedQuestion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getInterviewQuestions = async (req, res) => {
    try {
        const { search, topic, difficulty, type } = req.query;
        let query = {}; // Admin sees all (active and inactive)
        
        if (search) {
            query.question = new RegExp(search, 'i');
        }
        if (topic) {
            query.topic = new RegExp(topic, 'i');
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        if (type) {
            query.type = type;
        }

        const questions = await InterviewQuestion.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteInterviewQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const deletedQuestion = await InterviewQuestion.findByIdAndDelete(questionId);
        
        if (!deletedQuestion) {
            return res.status(404).json({
                message: "Question not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Question deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "student" });
        const totalRecruiters = await User.countDocuments({ role: "recruiter" });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalInterviewQuestions = await InterviewQuestion.countDocuments();
        
        // Let's get some recent activity, e.g., latest users, jobs, applications
        const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).populate('company', 'name');
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
        const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5).populate('applicant', 'fullname').populate('job', 'title');

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalRecruiters,
                totalJobs,
                totalApplications,
                totalInterviewQuestions
            },
            recentActivity: {
                recentJobs,
                recentUsers,
                recentApplications
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getUsers = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { fullname: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        
        if (role) {
            query.role = role;
        }

        const skip = (page - 1) * limit;
        
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalUsers = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            totalUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullname, phoneNumber, role, isActive } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        // Prevent demoting the last admin
        if (user.role === 'admin' && role && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot demote the last admin account.",
                    success: false
                });
            }
        }
        
        // Prevent deactivating the last admin
        if (user.role === 'admin' && isActive === false) {
            const activeAdminCount = await User.countDocuments({ role: 'admin', isActive: true });
            if (activeAdminCount <= 1 && user.isActive === true) {
                return res.status(400).json({
                    message: "Cannot deactivate the last active admin account.",
                    success: false
                });
            }
        }

        // Whitelist fields
        if (fullname !== undefined) user.fullname = fullname;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (role !== undefined) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        const sanitizedUser = user.toObject();
        delete sanitizedUser.password;

        return res.status(200).json({
            message: "User updated successfully.",
            success: true,
            user: sanitizedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Prevent deleting the last admin
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot delete the last admin account.",
                    success: false
                });
            }
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "User deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getRecruiters = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, isActive } = req.query;
        let query = { role: 'recruiter' };
        
        if (search) {
            query.$or = [
                { fullname: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        
        if (isActive !== undefined && isActive !== '') {
            query.isActive = isActive === 'true';
        }

        const skip = (page - 1) * limit;
        
        const recruiters = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        // Fetch companies for these recruiters
        const recruiterIds = recruiters.map(r => r._id);
        const companies = await Company.find({ userId: { $in: recruiterIds } });
        
        const recruitersWithCompanies = recruiters.map(recruiter => {
            const recruiterCompanies = companies.filter(c => c.userId.toString() === recruiter._id.toString());
            return {
                ...recruiter.toObject(),
                companies: recruiterCompanies
            };
        });
            
        const totalRecruiters = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            recruiters: recruitersWithCompanies,
            totalPages: Math.ceil(totalRecruiters / limit),
            currentPage: parseInt(page),
            totalRecruiters
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getRecruiterById = async (req, res) => {
    try {
        const recruiterId = req.params.id;
        const recruiter = await User.findOne({ _id: recruiterId, role: 'recruiter' }).select('-password');
        
        if (!recruiter) {
            return res.status(404).json({
                message: "Recruiter not found.",
                success: false
            });
        }
        
        const companies = await Company.find({ userId: recruiter._id });

        return res.status(200).json({
            success: true,
            recruiter: {
                ...recruiter.toObject(),
                companies
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateRecruiter = async (req, res) => {
    try {
        const recruiterId = req.params.id;
        const { fullname, phoneNumber, isActive } = req.body;
        
        const recruiter = await User.findOne({ _id: recruiterId });
        if (!recruiter) {
            return res.status(404).json({
                message: "Recruiter not found.",
                success: false
            });
        }
        
        if (recruiter.role === 'admin') {
             return res.status(400).json({
                 message: "Cannot modify an admin account through the recruiters endpoint.",
                 success: false
             });
        }

        // Whitelist fields
        if (fullname !== undefined) recruiter.fullname = fullname;
        if (phoneNumber !== undefined) recruiter.phoneNumber = phoneNumber;
        if (isActive !== undefined) recruiter.isActive = isActive;

        await recruiter.save();

        const sanitizedRecruiter = recruiter.toObject();
        delete sanitizedRecruiter.password;

        return res.status(200).json({
            message: "Recruiter updated successfully.",
            success: true,
            recruiter: sanitizedRecruiter
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteRecruiter = async (req, res) => {
    try {
        const recruiterId = req.params.id;
        
        const recruiter = await User.findOne({ _id: recruiterId });
        if (!recruiter) {
            return res.status(404).json({
                message: "Recruiter not found.",
                success: false
            });
        }

        if (recruiter.role === 'admin') {
             return res.status(400).json({
                 message: "Cannot modify an admin account through the recruiters endpoint.",
                 success: false
             });
        }

        await User.findByIdAndDelete(recruiterId);

        return res.status(200).json({
            message: "Recruiter deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getCompanies = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (search) {
            query.name = new RegExp(search, 'i');
        }

        const skip = (page - 1) * limit;
        
        const companies = await Company.find(query)
            .populate('userId', 'fullname email phoneNumber role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalCompanies = await Company.countDocuments(query);

        return res.status(200).json({
            success: true,
            companies,
            totalPages: Math.ceil(totalCompanies / limit),
            currentPage: parseInt(page),
            totalCompanies
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId).populate('userId', 'fullname email phoneNumber');
        
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        
        // Also fetch job count to show the admin
        const jobCount = await Job.countDocuments({ company: company._id });

        return res.status(200).json({
            success: true,
            company: {
                ...company.toObject(),
                jobCount
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location, email, trustLevel } = req.body;
        
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        
        // Whitelist fields
        if (name !== undefined) company.name = name;
        if (description !== undefined) company.description = description;
        if (website !== undefined) company.website = website;
        if (location !== undefined) company.location = location;
        if (email !== undefined) company.email = email;
        if (trustLevel !== undefined) {
             if (["HIGH", "MEDIUM", "LOW"].includes(trustLevel)) {
                 company.trustLevel = trustLevel;
             }
        }

        await company.save();

        return res.status(200).json({
            message: "Company updated successfully.",
            success: true,
            company
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        
        // STRICT POLICY DECISION: Do not leave orphaned jobs
        const jobCount = await Job.countDocuments({ company: companyId });
        if (jobCount > 0) {
            return res.status(400).json({
                message: "Cannot delete company. It has " + jobCount + " associated jobs. Please delete the jobs first.",
                success: false,
                jobCount
            });
        }

        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getJobs = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, status, workMode, jobType } = req.query;
        let query = {};
        
        // If there's a search term, we need to match title OR match company name.
        if (search) {
            const matchingCompanies = await Company.find({ name: new RegExp(search, 'i') }).select('_id');
            const companyIds = matchingCompanies.map(c => c._id);
            
            query.$or = [
                { title: new RegExp(search, 'i') },
                { company: { $in: companyIds } }
            ];
        }

        if (status) query.status = status;
        if (workMode) query.workMode = workMode;
        if (jobType) query.jobType = jobType;

        const skip = (page - 1) * limit;
        
        const jobs = await Job.find(query)
            .populate('company', 'name logo')
            .populate('created_by', 'fullname email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalJobs = await Job.countDocuments(query);

        return res.status(200).json({
            success: true,
            jobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: parseInt(page),
            totalJobs
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate('company', 'name logo')
            .populate('created_by', 'fullname email');
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        
        const applicationCount = await Application.countDocuments({ job: job._id });

        return res.status(200).json({
            success: true,
            job: {
                ...job.toObject(),
                applicationCount
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, salary, experienceLevel, location, jobType, workMode, position, status } = req.body;
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        
        // Whitelist fields
        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (salary !== undefined) job.salary = salary;
        if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (workMode !== undefined) {
             if (['Remote', 'Hybrid', 'On-site'].includes(workMode)) {
                 job.workMode = workMode;
             }
        }
        if (position !== undefined) job.position = position;
        if (status !== undefined) {
             if (['active', 'closed'].includes(status)) {
                 job.status = status;
             }
        }

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        
        // STRICT POLICY DECISION: Do not leave orphaned applications
        const applicationCount = await Application.countDocuments({ job: jobId });
        if (applicationCount > 0) {
            return res.status(400).json({
                message: "Cannot delete job. It has " + applicationCount + " associated applications. Please close the job instead.",
                success: false,
                applicationCount
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

const APPLICATION_TRANSITIONS = {
    pending: ["review", "shortlisted", "rejected"],
    review: ["shortlisted", "interview", "rejected"],
    shortlisted: ["interview", "offer", "rejected"],
    interview: ["offer", "shortlisted", "rejected"],
    offer: ["hired", "rejected"],
    hired: ["rejected"],
    rejected: ["review", "pending"],
};

export const getApplications = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, status, jobId, companyId, recruiterId, candidateId } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (jobId) query.job = jobId;
        if (candidateId) query.applicant = candidateId;

        // If search by candidate name or email is needed:
        if (search) {
            const matchingCandidates = await User.find({
                $or: [
                    { fullname: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') }
                ]
            }).select('_id');
            query.applicant = { $in: matchingCandidates.map(c => c._id) };
        }

        // To filter by company or recruiter, we need to find jobs matching those first.
        let jobQuery = {};
        if (companyId) jobQuery.company = companyId;
        if (recruiterId) jobQuery.created_by = recruiterId;

        if (Object.keys(jobQuery).length > 0) {
            const jobs = await Job.find(jobQuery).select('_id');
            query.job = { $in: jobs.map(j => j._id) };
        }

        const skip = (page - 1) * limit;
        
        const applications = await Application.find(query)
            .populate({
                path: 'job',
                populate: [
                    { path: 'company', select: 'name logo' },
                    { path: 'created_by', select: 'fullname email' }
                ]
            })
            .populate('applicant', 'fullname email phoneNumber profile.resume profile.resumeOriginalName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalApplications = await Application.countDocuments(query);

        return res.status(200).json({
            success: true,
            applications,
            totalPages: Math.ceil(totalApplications / limit),
            currentPage: parseInt(page),
            totalApplications
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const appId = req.params.id;
        const application = await Application.findById(appId)
            .populate({
                path: 'job',
                populate: [
                    { path: 'company', select: 'name location website email' },
                    { path: 'created_by', select: 'fullname email phoneNumber' }
                ]
            })
            .populate('applicant', 'fullname email phoneNumber profile');
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }
        
        return res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const appId = req.params.id;
        const { status, notes, interviewDate } = req.body;
        
        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false
            });
        }

        const application = await Application.findById(appId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }
        
        const normalizedStatus = status.toLowerCase();
        const currentStatus = application.status || "pending";
        const isStatusChanging = currentStatus !== normalizedStatus;
        
        if (isStatusChanging) {
            const allowed = APPLICATION_TRANSITIONS[currentStatus] || [];
            if (!allowed.includes(normalizedStatus)) {
                return res.status(400).json({
                    message: "Cannot transition application status from '" + currentStatus + "' to '" + normalizedStatus + "'.",
                    success: false
                });
            }
        }

        application.status = normalizedStatus;
        if (notes !== undefined) application.notes = notes;
        if (interviewDate) application.interviewDate = new Date(interviewDate);

        application.statusHistory.push({
            previousStatus: currentStatus,
            status: normalizedStatus,
            changedAt: new Date(),
            comment: notes || (isStatusChanging ? "Admin updated status from " + currentStatus + " to " + normalizedStatus : "Admin updated application notes"),
            changedBy: req.id,
        });

        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully.",
            success: true,
            application
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        // STRICT POLICY DECISION: Internal applications are permanent historical records.
        return res.status(400).json({
            message: "Applications are permanent historical records and cannot be deleted. Please transition the application to 'rejected' instead.",
            success: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
