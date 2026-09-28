/**
 * Transparent, deterministic job matching utility based on candidate profile.
 * Profile and job requirements matching.
 */

export const SKILL_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  react: "react",
  reactjs: "react",
  "react.js": "react",
  node: "node",
  nodejs: "node",
  "node.js": "node",
  mongo: "mongodb",
  mongodb: "mongodb",
  "mongo.db": "mongodb",
  express: "express",
  expressjs: "express",
  "express.js": "express",
  py: "python",
  python: "python",
  python3: "python",
  java: "java",
  cpp: "c++",
  "c++": "c++",
  csharp: "c#",
  "c#": "c#",
  golang: "go",
  go: "go",
  postgres: "postgresql",
  postgresql: "postgresql",
  sql: "sql",
  mysql: "mysql",
  aws: "aws",
  docker: "docker",
  k8s: "kubernetes",
  kubernetes: "kubernetes",
  html: "html",
  html5: "html",
  css: "css",
  css3: "css",
  tailwind: "tailwind",
  tailwindcss: "tailwind",
  redux: "redux",
  git: "git",
  github: "git",
  graphql: "graphql",
  rest: "rest api",
  "rest api": "rest api",
};

export const normalizeSkill = (skill) => {
  if (!skill) return "";
  const cleaned = String(skill).toLowerCase().trim();
  return SKILL_ALIASES[cleaned] || cleaned;
};

export const extractSkillsFromText = (text) => {
  if (!text) return [];
  const rawTokens = String(text)
    .toLowerCase()
    .split(/[,/;\n()]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const recognized = new Set();
  rawTokens.forEach((token) => {
    recognized.add(normalizeSkill(token));
    const words = token.split(/\s+/).map((w) => w.trim()).filter(Boolean);
    words.forEach((w) => recognized.add(normalizeSkill(w)));
  });

  return recognized;
};

export const calculateJobMatch = (job, user) => {
  if (!job || !user || user.role !== "student") {
    return {
      score: 0,
      breakdown: {
        skills: { score: 0, max: 40, matched: [], missing: [] },
        experience: { score: 0, max: 25, reason: "No profile data" },
        location: { score: 0, max: 15, isMatch: false },
        jobType: { score: 0, max: 10 },
        salary: { score: 0, max: 10 },
      },
      reasons: ["Sign in as candidate to see your personalized match score."],
      missingKeySkills: [],
    };
  }

  const profile = user.profile || {};
  const userRawSkills = (profile.skills || []).map((s) => String(s).trim()).filter(Boolean);
  const normalizedUserSkills = new Map();
  userRawSkills.forEach((s) => {
    normalizedUserSkills.set(normalizeSkill(s), s);
  });

  const userLocation = (profile.location || "").toLowerCase().trim();
  const userExperience = (profile.experience || "").toLowerCase().trim();
  const userPreferredJobType = (profile.preferredJobType || "").toLowerCase().trim();
  const userExpectedSalary = Number(profile.expectedSalary) || 0;

  // 1. SKILLS MATCHING (Max 40 points)
  const jobRequirements = (job.requirements || []).map((r) => String(r).trim()).filter(Boolean);
  const matchedSkills = [];
  const missingSkills = [];

  // Match each requirement using token/exact equality, avoiding naive substring collisions (e.g. java vs javascript)
  jobRequirements.forEach((req) => {
    const tokens = extractSkillsFromText(req);
    let isMatched = false;

    for (const [normUserSkill, displayUserSkill] of normalizedUserSkills.entries()) {
      if (tokens.has(normUserSkill)) {
        isMatched = true;
        if (!matchedSkills.includes(displayUserSkill)) {
          matchedSkills.push(displayUserSkill);
        }
      }
    }

    if (!isMatched) {
      const shortReq = req.split(/[,.]/)[0].trim().slice(0, 30);
      if (shortReq && !missingSkills.includes(shortReq)) {
        missingSkills.push(shortReq);
      }
    }
  });

  let skillPoints = 0;
  if (jobRequirements.length > 0) {
    const ratio = matchedSkills.length / Math.max(jobRequirements.length, 1);
    skillPoints = Math.round(Math.min(ratio * 40, 40));
  } else if (matchedSkills.length > 0) {
    skillPoints = Math.min(matchedSkills.length * 15, 40);
  } else {
    skillPoints = 10; // Baseline if no explicit requirements listed
  }

  // 2. EXPERIENCE MATCHING (Max 25 points)
  let experiencePoints = 15;
  let experienceReason = "Experience level partially aligned";
  const jobExp = (job.experienceLevel || "").toLowerCase();

  if (!userExperience) {
    experiencePoints = 12;
    experienceReason = "Add experience to your profile for exact match";
  } else if (
    jobExp.includes("entry") ||
    jobExp.includes("college") ||
    jobExp.includes("intern") ||
    jobExp.includes("fresher")
  ) {
    experiencePoints = 25;
    experienceReason = "Entry/fresher level matches your profile";
  } else if (
    (userExperience.includes("2") || userExperience.includes("3") || userExperience.includes("mid")) &&
    (jobExp.includes("2") || jobExp.includes("3") || jobExp.includes("mid") || jobExp.includes("1-3"))
  ) {
    experiencePoints = 25;
    experienceReason = "Your experience matches role requirement";
  } else if (
    userExperience.includes("senior") &&
    jobExp.includes("senior")
  ) {
    experiencePoints = 25;
    experienceReason = "Senior level matches requirement";
  } else {
    experiencePoints = 18;
    experienceReason = "Experience level is compatible";
  }

  // 3. LOCATION & WORK MODE (Max 15 points)
  let locationPoints = 5;
  let locationMatch = false;
  const jobLoc = (job.location || "").toLowerCase();
  const workMode = (job.workMode || "").toLowerCase();

  if (workMode === "remote" || jobLoc.includes("remote")) {
    locationPoints = 15;
    locationMatch = true;
  } else if (userLocation && (jobLoc.includes(userLocation) || userLocation.includes(jobLoc))) {
    locationPoints = 15;
    locationMatch = true;
  } else if (!userLocation) {
    locationPoints = 10;
  } else {
    locationPoints = 7;
  }

  // 4. JOB TYPE MATCH (Max 10 points)
  let jobTypePoints = 10;
  const jobType = (job.jobType || "").toLowerCase();
  if (userPreferredJobType && !jobType.includes(userPreferredJobType)) {
    jobTypePoints = 6;
  }

  // 5. SALARY EXPECTATIONS (Max 10 points)
  let salaryPoints = 10;
  const jobSalary = Number(job.salary) || 0;
  if (userExpectedSalary > 0 && jobSalary > 0) {
    if (jobSalary >= userExpectedSalary) {
      salaryPoints = 10;
    } else {
      const salRatio = jobSalary / userExpectedSalary;
      salaryPoints = Math.round(Math.max(4, Math.min(10, salRatio * 10)));
    }
  }

  const totalScore = Math.min(
    100,
    skillPoints + experiencePoints + locationPoints + jobTypePoints + salaryPoints
  );

  // Structured explanations
  const reasons = [];
  if (matchedSkills.length > 0) {
    matchedSkills.slice(0, 3).forEach((s) => {
      reasons.push(`✓ ${s.charAt(0).toUpperCase() + s.slice(1)} matches your skills`);
    });
  }
  if (locationMatch) {
    reasons.push(
      workMode === "remote" || jobLoc.includes("remote")
        ? "✓ Remote position available from anywhere"
        : `✓ Located in or near ${job.location}`
    );
  }
  if (missingSkills.length > 0) {
    missingSkills.slice(0, 2).forEach((s) => {
      reasons.push(`⚠ ${s.charAt(0).toUpperCase() + s.slice(1)} preferred`);
    });
  }

  return {
    score: totalScore,
    breakdown: {
      skills: { score: skillPoints, max: 40, matched: matchedSkills, missing: missingSkills },
      experience: { score: experiencePoints, max: 25, reason: experienceReason },
      location: { score: locationPoints, max: 15, isMatch: locationMatch },
      jobType: { score: jobTypePoints, max: 10 },
      salary: { score: salaryPoints, max: 10 },
    },
    reasons,
    missingKeySkills: missingSkills.slice(0, 3),
  };
};

/**
 * Calculate profile completion score and breakdown
 */
export const calculateProfileScore = (user) => {
  if (!user) return { score: 0, checks: [] };

  const checks = [
    {
      label: "Basic details (Name, Email, Phone)",
      completed: Boolean(user.fullname && user.email && user.phoneNumber),
      weight: 15,
    },
    {
      label: "Professional Bio",
      completed: Boolean(user.profile?.bio && user.profile.bio.trim().length > 10),
      weight: 15,
    },
    {
      label: "Skills (at least 3)",
      completed: Boolean(user.profile?.skills && user.profile.skills.length >= 3),
      weight: 20,
    },
    {
      label: "Resume uploaded",
      completed: Boolean(user.profile?.resume),
      weight: 20,
    },
    {
      label: "Experience & Education",
      completed: Boolean(user.profile?.experience || user.profile?.education),
      weight: 15,
    },
    {
      label: "Links (GitHub / Portfolio)",
      completed: Boolean(user.profile?.github || user.profile?.portfolio),
      weight: 15,
    },
  ];

  const totalScore = checks.reduce((acc, curr) => acc + (curr.completed ? curr.weight : 0), 0);
  return { score: totalScore, checks };
};

