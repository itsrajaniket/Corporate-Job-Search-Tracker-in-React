// src/components/calculators/salaryUtils.js

export const calculate2026Details = (ctcString) => {
  const ctc =
    typeof ctcString === "string"
      ? parseFloat(ctcString.replace(/\D/g, ""))
      : ctcString;

  if (!ctc || isNaN(ctc)) return null;

  const basic = ctc * 0.5;
  const gratuity = basic * 0.0481;
  const pfEmployer = Math.min(basic * 0.12, 21600);
  const pfEmployee = pfEmployer;
  const fixedGross = ctc - pfEmployer - gratuity;

  let taxableIncome = Math.max(0, fixedGross - 75000);
  let tax = 0;

  if (taxableIncome > 1200000) {
    if (taxableIncome > 400000)
      tax += Math.min(400000, taxableIncome - 400000) * 0.05;
    if (taxableIncome > 800000)
      tax += Math.min(400000, taxableIncome - 800000) * 0.1;
    if (taxableIncome > 1200000)
      tax += Math.min(400000, taxableIncome - 1200000) * 0.15;
    if (taxableIncome > 1600000)
      tax += Math.min(400000, taxableIncome - 1600000) * 0.2;
    if (taxableIncome > 2000000)
      tax += Math.min(400000, taxableIncome - 2000000) * 0.25;
    if (taxableIncome > 2400000) tax += (taxableIncome - 2400000) * 0.3;
    tax = tax * 1.04;
  }

  const annualInHand = fixedGross - pfEmployee - tax;

  return {
    annualInHand,
    monthlyInHand: annualInHand / 12,
    yearlyTax: tax,
    monthlyTax: tax / 12,
    monthlyEPF: pfEmployee / 12,
  };
};
