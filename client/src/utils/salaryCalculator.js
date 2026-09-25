// src/utils/salaryCalculator.js

/**
 * Calculates estimated monthly in-hand take-home pay based on annual CTC.
 * @param {string|number} rawSalary
 * @returns {{ annualCtc: number, monthlyGross: number, estimatedInHand: number, formattedInHand: string, formattedAnnual: string, valid: boolean }}
 */
export const calculateMonthlyTakeHome = (rawSalary) => {
  if (!rawSalary) return { valid: false };

  // Strip currency symbols and letters except digits and decimals
  const cleanStr = String(rawSalary).replace(/[₹,]/g, "").trim();
  const num = parseFloat(cleanStr);

  if (isNaN(num) || num <= 0) {
    return { valid: false };
  }

  let annualCtc = num;
  // If the number is small (e.g. 3, 6, 12, 25, 40), it represents LPA (Lakhs Per Annum)
  if (num <= 100) {
    annualCtc = num * 100000;
  }

  const monthlyGross = Math.round(annualCtc / 12);

  // Simplified Indian New Tax Regime estimation (~approximate EPF + tax bracket)
  let taxRate = 0;
  if (annualCtc > 1500000) {
    taxRate = 0.18;
  } else if (annualCtc > 1000000) {
    taxRate = 0.14;
  } else if (annualCtc > 750000) {
    taxRate = 0.08;
  } else {
    // Under 7.5L, effective tax is virtually 0 with rebate 87A
    taxRate = 0.03; // Nominal PF only
  }

  const estimatedInHand = Math.round(monthlyGross * (1 - taxRate));

  return {
    valid: true,
    annualCtc,
    monthlyGross,
    estimatedInHand,
    formattedAnnual: `₹${(annualCtc / 100000).toFixed(annualCtc % 100000 === 0 ? 0 : 1)} LPA`,
    formattedInHand: `~₹${estimatedInHand.toLocaleString("en-IN")}/mo`,
    formattedGross: `₹${monthlyGross.toLocaleString("en-IN")}/mo`,
  };
};
