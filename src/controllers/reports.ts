import { Router, Request, Response } from "express";
interface BlueprintItem {
  id: number;
  name: string;
  mother: number;
  father: number;
  total: number;
  min: number;
  max: number;
}

// Base data (ranges)
const baseBlueprint: Omit<BlueprintItem, "mother" | "father" | "total">[] = [
  { id: 1, name: "Genetic Inheritance", min: 9.333, max: 10.777 },
  { id: 2, name: "Constitutional Vitality", min: 8.111, max: 9.111 },
  { id: 3, name: "Mental Patterns", min: 6.111, max: 7.111 },
  { id: 4, name: "Intellectual Capacity", min: 6.333, max: 6.999 },
  { id: 5, name: "Emotional Foundation", min: 7.111, max: 7.999 },
  { id: 6, name: "Spiritual Lineage", min: 5.011, max: 6.011 },
  { id: 7, name: "Soul Connections", min: 5.111, max: 6.222 },
];

// Helper to randomize within range
function randomInRange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(3));
}

// Dates where mother value is higher
function isMotherHigher(date: number): boolean {
  const motherDates = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
  return motherDates.includes(date);
}

export const foundationalBluePrintReport = (req: Request, res: Response) => {
  // allow optional date query
  const date = req.query.date ? Number(req.query.date) : new Date().getDate();
  const motherHigher = isMotherHigher(date);

  // Generate randomized data for each call
  const generatedData = baseBlueprint.map((item) => {
    const mother = randomInRange(item.min, item.max);
    const father = randomInRange(item.min, item.max);
    const total = parseFloat((mother + father).toFixed(3));
    return { ...item, mother, father, total };
  });

  // Compute total values
  const totalMother = generatedData.reduce((sum, i) => sum + i.mother, 0);
  const totalFather = generatedData.reduce((sum, i) => sum + i.father, 0);
  const combined = parseFloat((totalMother + totalFather).toFixed(3));

  // Normalize to 100 (optional step to make total = 100)
  const scaleFactor = 100 / combined;
  const normalizedData = generatedData.map((item) => ({
    ...item,
    mother: parseFloat((item.mother * scaleFactor).toFixed(3)),
    father: parseFloat((item.father * scaleFactor).toFixed(3)),
    total: parseFloat((item.total * scaleFactor).toFixed(3)),
  }));

  const newMotherTotal = parseFloat(
    normalizedData.reduce((sum, i) => sum + i.mother, 0).toFixed(3)
  );
  const newFatherTotal = parseFloat(
    normalizedData.reduce((sum, i) => sum + i.father, 0).toFixed(3)
  );

  const responseData = normalizedData.map((item) => ({
    ...item,
    higher: motherHigher
      ? item.mother > item.father
        ? "Mother"
        : "Father"
      : item.father > item.mother
      ? "Father"
      : "Mother",
    higherValue: motherHigher ? item.mother : item.father,
  }));

  res.json({
    date,
    dominance: motherHigher ? "Mother" : "Father",
    totals: {
      mother: newMotherTotal,
      father: newFatherTotal,
      combined: parseFloat((newMotherTotal + newFatherTotal).toFixed(3)),
    },
    data: responseData,
  });
}
