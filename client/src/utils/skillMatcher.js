export const calculateSkillMatch = (candidateSkills = [], job = {}) => {
  if (!candidateSkills || !Array.isArray(candidateSkills) || candidateSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      hasSkills: false,
    };
  }

  // Normalize candidate skills
  const normalizedCandidateSkills = candidateSkills
    .flatMap((s) => (typeof s === "string" ? s.split(",") : [s]))
    .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : ""))
    .filter(Boolean);

  if (normalizedCandidateSkills.length === 0) {
    return { matchPercentage: 0, matchedSkills: [], missingSkills: [], hasSkills: false };
  }

  // Extract job requirements
  let jobReqs = [];
  if (Array.isArray(job?.requirements) && job.requirements.length > 0) {
    jobReqs = job.requirements.flatMap((r) =>
      typeof r === "string" ? r.split(",") : [r]
    );
  } else if (typeof job?.requirements === "string") {
    jobReqs = job.requirements.split(",");
  }

  // If no explicit requirements, extract common tech words from title and description
  const searchableText = `${job?.title || ""} ${job?.description || ""}`.toLowerCase();

  let matched = [];
  let missing = [];

  if (jobReqs.length > 0) {
    jobReqs = jobReqs.map((r) => r.trim()).filter(Boolean);
    jobReqs.forEach((req) => {
      const lowerReq = req.toLowerCase();
      const isMatch = normalizedCandidateSkills.some(
        (cs) => lowerReq.includes(cs) || cs.includes(lowerReq)
      );
      if (isMatch) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });
  } else {
    // Match against text
    normalizedCandidateSkills.forEach((skill) => {
      if (searchableText.includes(skill)) {
        matched.push(skill);
      }
    });
  }

  const totalConsidered = jobReqs.length > 0 ? jobReqs.length : Math.max(normalizedCandidateSkills.length, 3);
  let percentage = Math.round((matched.length / totalConsidered) * 100);

  // If candidate has good skills that match the title/domain, guarantee reasonable score
  if (matched.length > 0 && percentage < 40) {
    percentage = 50 + matched.length * 10;
  }
  percentage = Math.min(percentage, 98); // Cap at 98% for realistic humility

  return {
    matchPercentage: percentage,
    matchedSkills: matched,
    missingSkills: missing,
    hasSkills: true,
  };
};
