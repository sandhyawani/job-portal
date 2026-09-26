import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../utils/db.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { postJob, updateJob } from "../controllers/job.controller.js";
import { applyJob, getApplicants, updateStatus } from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const mockRes = () => {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return res;
};

const runSuite = async () => {
  console.log("\n=======================================================");
  console.log("🔒 STARTING SECURITY & APPLICATION PIPELINE TEST SUITE");
  console.log("=======================================================\n");

  await connectDB();

  const testSuffix = Date.now();
  const createdUserIds = [];
  const createdCompanyIds = [];
  const createdJobIds = [];
  const createdApplicationIds = [];

  let passedTests = 0;
  let totalTests = 0;

  const assert = (description, condition, details = "") => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
      if (details) console.error(`     Details: ${details}`);
    }
  };

  try {
    // ---------------------------------------------------------
    // 0. Setup test actors
    // ---------------------------------------------------------
    const recruiterA = await User.create({
      fullname: `Recruiter A ${testSuffix}`,
      email: `recruiterA_${testSuffix}@test.com`,
      phoneNumber: 9990001111,
      password: "hashedpassword123",
      role: "recruiter",
    });
    createdUserIds.push(recruiterA._id);

    const recruiterB = await User.create({
      fullname: `Recruiter B ${testSuffix}`,
      email: `recruiterB_${testSuffix}@test.com`,
      phoneNumber: 9990002222,
      password: "hashedpassword123",
      role: "recruiter",
    });
    createdUserIds.push(recruiterB._id);

    const candidateA = await User.create({
      fullname: `Candidate A ${testSuffix}`,
      email: `candidateA_${testSuffix}@test.com`,
      phoneNumber: 9990003333,
      password: "hashedpassword123",
      role: "student",
      profile: { skills: ["React", "JavaScript", "Node.js"] },
    });
    createdUserIds.push(candidateA._id);

    // Companies for Recruiter A and Recruiter B
    const companyA = await Company.create({
      name: `Company Alpha ${testSuffix}`,
      userId: recruiterA._id,
      location: "Bengaluru",
      website: "https://alpha.example.com",
    });
    createdCompanyIds.push(companyA._id);

    const companyB = await Company.create({
      name: `Company Beta ${testSuffix}`,
      userId: recruiterB._id,
      location: "Mumbai",
      website: "https://beta.example.com",
    });
    createdCompanyIds.push(companyB._id);

    // ---------------------------------------------------------
    // Test 1: Recruiter A can create own job (201)
    // ---------------------------------------------------------
    const reqCreateJobA = {
      id: recruiterA._id,
      body: {
        title: "Frontend Architect",
        description: "Lead frontend design with React & TypeScript",
        requirements: "React, TypeScript, CSS",
        salary: "24",
        location: "Bengaluru",
        jobType: "Full Time",
        experience: 5,
        position: 2,
        companyId: companyA._id.toString(),
      },
    };
    const resCreateJobA = mockRes();
    await postJob(reqCreateJobA, resCreateJobA);
    const jobA = resCreateJobA.data?.job;
    if (jobA?._id) createdJobIds.push(jobA._id);

    assert(
      "Test 1: Recruiter A can create their own job (Expected: 201)",
      resCreateJobA.statusCode === 201 && jobA?._id,
      `Status: ${resCreateJobA.statusCode}, msg: ${resCreateJobA.data?.message}`
    );

    // Create a job for Recruiter B directly
    const jobB = await Job.create({
      title: "Backend Engineer",
      description: "Build microservices with Node and Go",
      requirements: ["Node.js", "MongoDB", "Docker"],
      salary: "20",
      location: "Mumbai",
      jobType: "Full Time",
      experienceLevel: 3,
      position: 1,
      company: companyB._id,
      created_by: recruiterB._id,
    });
    createdJobIds.push(jobB._id);

    // ---------------------------------------------------------
    // Test 2: Recruiter A can update own job (200)
    // ---------------------------------------------------------
    const reqUpdateJobA = {
      id: recruiterA._id,
      params: { id: jobA._id.toString() },
      body: { title: "Lead Frontend Architect", salary: "26" },
    };
    const resUpdateJobA = mockRes();
    await updateJob(reqUpdateJobA, resUpdateJobA);
    assert(
      "Test 2: Recruiter A can update their own job (Expected: 200)",
      resUpdateJobA.statusCode === 200 && resUpdateJobA.data?.job?.title === "Lead Frontend Architect",
      `Status: ${resUpdateJobA.statusCode}, title: ${resUpdateJobA.data?.job?.title}`
    );

    // ---------------------------------------------------------
    // Test 3: Recruiter A cannot update Recruiter B's job (403)
    // ---------------------------------------------------------
    const reqUpdateJobBbyA = {
      id: recruiterA._id,
      params: { id: jobB._id.toString() },
      body: { title: "Hacked Job Title" },
    };
    const resUpdateJobBbyA = mockRes();
    await updateJob(reqUpdateJobBbyA, resUpdateJobBbyA);
    assert(
      "Test 3: Recruiter A cannot update Recruiter B's job (Expected: 403 Forbidden)",
      resUpdateJobBbyA.statusCode === 403,
      `Status: ${resUpdateJobBbyA.statusCode}, msg: ${resUpdateJobBbyA.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 4: Recruiter A cannot access Recruiter B's applicants (403)
    // ---------------------------------------------------------
    const reqApplicantsBbyA = {
      id: recruiterA._id,
      params: { id: jobB._id.toString() },
    };
    const resApplicantsBbyA = mockRes();
    await getApplicants(reqApplicantsBbyA, resApplicantsBbyA);
    assert(
      "Test 4: Recruiter A cannot access Recruiter B's applicants (Expected: 403 Forbidden)",
      resApplicantsBbyA.statusCode === 403,
      `Status: ${resApplicantsBbyA.statusCode}, msg: ${resApplicantsBbyA.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 5: Candidate A can apply to Recruiter A's job (201)
    // ---------------------------------------------------------
    const reqApplyCandidate = {
      id: candidateA._id,
      params: { id: jobA._id.toString() },
    };
    const resApplyCandidate = mockRes();
    await applyJob(reqApplyCandidate, resApplyCandidate);
    const applicationA = resApplyCandidate.data?.application;
    if (applicationA?._id) createdApplicationIds.push(applicationA._id);

    assert(
      "Test 5: Candidate A can apply to Recruiter A's job (Expected: 201)",
      resApplyCandidate.statusCode === 201 &&
        applicationA?.status === "applied" &&
        applicationA?.statusHistory?.length === 1,
      `Status: ${resApplyCandidate.statusCode}, appStatus: ${applicationA?.status}`
    );

    // ---------------------------------------------------------
    // Test 6: Recruiter A cannot apply to own job (400)
    // ---------------------------------------------------------
    const reqRecruiterApplyOwn = {
      id: recruiterA._id,
      params: { id: jobA._id.toString() },
    };
    const resRecruiterApplyOwn = mockRes();
    await applyJob(reqRecruiterApplyOwn, resRecruiterApplyOwn);
    assert(
      "Test 6: Recruiter A cannot apply to their own job (Expected: 400 or 403)",
      resRecruiterApplyOwn.statusCode === 400 || resRecruiterApplyOwn.statusCode === 403,
      `Status: ${resRecruiterApplyOwn.statusCode}, msg: ${resRecruiterApplyOwn.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 7: Recruiter cannot apply to another recruiter's job (403)
    // ---------------------------------------------------------
    const reqRecruiterAapplyJobB = {
      id: recruiterA._id,
      params: { id: jobB._id.toString() },
    };
    const resRecruiterAapplyJobB = mockRes();
    await applyJob(reqRecruiterAapplyJobB, resRecruiterAapplyJobB);
    assert(
      "Test 7: Recruiter cannot apply to another recruiter's job (Expected: 403 Forbidden)",
      resRecruiterAapplyJobB.statusCode === 403,
      `Status: ${resRecruiterAapplyJobB.statusCode}, msg: ${resRecruiterAapplyJobB.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 8: Candidate cannot modify application status (403)
    // ---------------------------------------------------------
    const reqCandidateUpdateStatus = {
      id: candidateA._id,
      params: { id: applicationA._id.toString() },
      body: { status: "under_review" },
    };
    const resCandidateUpdateStatus = mockRes();
    await updateStatus(reqCandidateUpdateStatus, resCandidateUpdateStatus);
    assert(
      "Test 8: Candidate cannot modify application status (Expected: 403 Forbidden)",
      resCandidateUpdateStatus.statusCode === 403,
      `Status: ${resCandidateUpdateStatus.statusCode}, msg: ${resCandidateUpdateStatus.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 9: Candidate cannot view recruiter applicants list (403)
    // ---------------------------------------------------------
    const reqCandidateGetApplicants = {
      id: candidateA._id,
      params: { id: jobA._id.toString() },
    };
    const resCandidateGetApplicants = mockRes();
    await getApplicants(reqCandidateGetApplicants, resCandidateGetApplicants);
    assert(
      "Test 9: Candidate cannot view recruiter applicants list (Expected: 403 Forbidden)",
      resCandidateGetApplicants.statusCode === 403,
      `Status: ${resCandidateGetApplicants.statusCode}, msg: ${resCandidateGetApplicants.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 10: Recruiter B cannot update status of Recruiter A's applicant (403)
    // ---------------------------------------------------------
    const reqRecruiterBupdateAppA = {
      id: recruiterB._id,
      params: { id: applicationA._id.toString() },
      body: { status: "under_review" },
    };
    const resRecruiterBupdateAppA = mockRes();
    await updateStatus(reqRecruiterBupdateAppA, resRecruiterBupdateAppA);
    assert(
      "Test 10: Recruiter B cannot modify Recruiter A's applicant status (Expected: 403 Forbidden)",
      resRecruiterBupdateAppA.statusCode === 403,
      `Status: ${resRecruiterBupdateAppA.statusCode}, msg: ${resRecruiterBupdateAppA.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 11: Invalid/nonexistent ObjectIds handled safely (400 or 404)
    // ---------------------------------------------------------
    const reqInvalidId = {
      id: recruiterA._id,
      params: { id: "123-not-an-objectid" },
      body: { title: "Test" },
    };
    const resInvalidId = mockRes();
    await updateJob(reqInvalidId, resInvalidId);
    assert(
      "Test 11: Invalid ObjectId handled safely without crashing (Expected: 400)",
      resInvalidId.statusCode === 400,
      `Status: ${resInvalidId.statusCode}, msg: ${resInvalidId.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 12: Unauthenticated requests receive 401
    // ---------------------------------------------------------
    const reqUnauth = { cookies: {} };
    const resUnauth = mockRes();
    let nextCalled = false;
    await isAuthenticated(reqUnauth, resUnauth, () => {
      nextCalled = true;
    });
    assert(
      "Test 12: Unauthenticated request receives 401 Unauthorized",
      resUnauth.statusCode === 401 && !nextCalled,
      `Status: ${resUnauth.statusCode}, msg: ${resUnauth.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 13: State Machine - Valid transition applied -> under_review (200)
    // ---------------------------------------------------------
    const reqTransitionValid = {
      id: recruiterA._id,
      params: { id: applicationA._id.toString() },
      body: { status: "under_review", comment: "Candidate matches core skills" },
    };
    const resTransitionValid = mockRes();
    await updateStatus(reqTransitionValid, resTransitionValid);
    assert(
      "Test 13: State Machine: Valid transition applied -> under_review (Expected: 200)",
      resTransitionValid.statusCode === 200 &&
        resTransitionValid.data?.application?.status === "under_review" &&
        resTransitionValid.data?.application?.statusHistory?.length === 2,
      `Status: ${resTransitionValid.statusCode}, appStatus: ${resTransitionValid.data?.application?.status}`
    );

    // ---------------------------------------------------------
    // Test 14: State Machine - Illegal transition under_review -> hired (400)
    // ---------------------------------------------------------
    const reqTransitionIllegal = {
      id: recruiterA._id,
      params: { id: applicationA._id.toString() },
      body: { status: "hired", comment: "Skipping interview illegally" },
    };
    const resTransitionIllegal = mockRes();
    await updateStatus(reqTransitionIllegal, resTransitionIllegal);
    assert(
      "Test 14: State Machine: Illegal transition under_review -> hired rejected (Expected: 400)",
      resTransitionIllegal.statusCode === 400,
      `Status: ${resTransitionIllegal.statusCode}, msg: ${resTransitionIllegal.data?.message}`
    );

    // ---------------------------------------------------------
    // Test 15: Duplicate application prevention (400)
    // ---------------------------------------------------------
    const reqDuplicateApply = {
      id: candidateA._id,
      params: { id: jobA._id.toString() },
    };
    const resDuplicateApply = mockRes();
    await applyJob(reqDuplicateApply, resDuplicateApply);
    assert(
      "Test 15: Candidate cannot apply to same job twice (Expected: 400 Bad Request)",
      resDuplicateApply.statusCode === 400,
      `Status: ${resDuplicateApply.statusCode}, msg: ${resDuplicateApply.data?.message}`
    );
  } catch (error) {
    console.error("❌ Unexpected test suite failure:", error);
  } finally {
    // ---------------------------------------------------------
    // Teardown & cleanup test records
    // ---------------------------------------------------------
    console.log("\n🧹 Cleaning up test artifacts from database...");
    if (createdApplicationIds.length > 0) {
      await Application.deleteMany({ _id: { $in: createdApplicationIds } });
    }
    if (createdJobIds.length > 0) {
      await Job.deleteMany({ _id: { $in: createdJobIds } });
    }
    if (createdCompanyIds.length > 0) {
      await Company.deleteMany({ _id: { $in: createdCompanyIds } });
    }
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
    }
    console.log("✓ Cleanup completed.");

    console.log("\n=======================================================");
    console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
    console.log("=======================================================\n");

    await mongoose.connection.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  }
};

runSuite();
