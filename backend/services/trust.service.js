export const calculateTrust = (company) => {
  let score = 100;

  // Email
  if (!company.email) {
    score -= 30;
  } else {
    if (isFreeEmail(company.email)) score -= 20;
    if (!hasValidDomain(company.email)) score -= 40;
  }

  // Registration number (GST)
  if (!company.registrationNumber) {
    score -= 30;
  } else if (!isValidGST(company.registrationNumber)) {
    score -= 40;
  }

  // Website
  if (!company.website) {
    score -= 10;
  }

  score = Math.max(0, Math.min(score, 100));

  let trustLevel = "HIGH";
  if (score < 70) trustLevel = "MEDIUM";
  if (score < 40) trustLevel = "LOW";

  return { score, trustLevel };
};

const isFreeEmail = (email) => {
  const domain = email.split("@")[1];
  return ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(domain);
};

const hasValidDomain = (email) => {
  const domain = email.split("@")[1];
  return Boolean(domain && domain.includes("."));
};

const isValidGST = (gst) => {
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
  return gstRegex.test(gst);
};
