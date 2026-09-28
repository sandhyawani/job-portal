/**
 * Safe formatting and normalization utilities.
 * All functions defensively handle null, undefined, numbers, strings, objects, and arrays.
 */

/**
 * Safely normalize a URL to ensure valid http/https protocol.
 * Handles strings, objects with url/href/link/website, null, undefined, numbers, and arrays.
 * Never throws TypeError: .startsWith is not a function.
 */
export const normalizeUrl = (url) => {
  if (!url) return "#";

  let target = url;

  // If passed an object or array, extract the URL property
  if (typeof target === "object" && target !== null) {
    if (Array.isArray(target)) {
      target = target.length > 0 ? target[0] : "";
    } else {
      target = target.url || target.website || target.href || target.link || "";
    }
  }

  // Ensure target is genuinely a string
  if (typeof target !== "string") {
    return "#";
  }

  const trimmed = target.trim();
  if (!trimmed || trimmed === "#") {
    return "#";
  }

  // Safely check prefix with string guard
  if (
    typeof trimmed.startsWith === "function" &&
    (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

/**
 * Safely format salary value.
 * Handles numbers (e.g. 12 -> "₹12 LPA", 800000 -> "₹8,00,000"), strings, objects, null, undefined.
 * Never calls .startsWith on a non-string.
 */
export const formatSalary = (salary) => {
  if (salary === null || salary === undefined || salary === "") {
    return "Competitive";
  }

  let val = salary;

  // Handle object payload
  if (typeof val === "object" && val !== null) {
    if (Array.isArray(val)) {
      val = val.length > 0 ? val[0] : null;
    } else if (val.amount !== undefined) {
      val = val.amount;
    } else if (val.min !== undefined && val.max !== undefined) {
      return `₹${val.min} - ₹${val.max} LPA`;
    } else if (val.min !== undefined) {
      val = val.min;
    } else {
      return "Competitive";
    }
  }

  if (val === null || val === undefined || val === "") {
    return "Competitive";
  }

  // Handle numeric salary
  if (typeof val === "number") {
    if (isNaN(val) || val <= 0) return "Competitive";
    if (val > 1000) {
      return `₹${val.toLocaleString("en-IN")}`;
    }
    return `₹${val} LPA`;
  }

  // Handle string salary
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return "Competitive";

    const num = Number(trimmed);
    if (!isNaN(num) && num > 0) {
      if (num > 1000) {
        return `₹${num.toLocaleString("en-IN")}`;
      }
      return `₹${num} LPA`;
    }

    if (typeof trimmed.startsWith === "function" && trimmed.startsWith("₹")) {
      return trimmed;
    }

    return `₹${trimmed}`;
  }

  return "Competitive";
};

/**
 * Safely format experience level.
 * Handles numbers, strings, null, undefined, objects.
 */
export const formatExperience = (exp) => {
  if (exp === null || exp === undefined || exp === "") {
    return "Fresher / Any";
  }

  if (typeof exp === "number") {
    if (exp === 0) return "Fresher / Any";
    return `${exp} Year${exp === 1 ? "" : "s"}`;
  }

  if (typeof exp === "string") {
    const trimmed = exp.trim();
    if (!trimmed || trimmed === "0") return "Fresher / Any";
    const num = Number(trimmed);
    if (!isNaN(num) && num >= 0) {
      if (num === 0) return "Fresher / Any";
      return `${num} Year${num === 1 ? "" : "s"}`;
    }
    return trimmed;
  }

  return "Fresher / Any";
};

/**
 * Safely format date string or Date object.
 * Returns human-readable date or "Recently".
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return "Recently";

  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      if (typeof dateVal === "string" && dateVal.includes("T")) {
        return dateVal.split("T")[0];
      }
      return typeof dateVal === "string" ? dateVal : "Recently";
    }

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return typeof dateVal === "string" && dateVal.includes("T")
      ? dateVal.split("T")[0]
      : typeof dateVal === "string"
      ? dateVal
      : "Recently";
  }
};

/**
 * Safely resolve image URL.
 * Handles strings, objects with url/secure_url/src, null, undefined.
 */
export const getValidImageUrl = (img, fallback = "/logo.png") => {
  if (!img) return fallback;

  if (typeof img === "string") {
    const trimmed = img.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof img === "object" && img !== null) {
    const candidate = img.url || img.secure_url || img.src || "";
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return fallback;
};
