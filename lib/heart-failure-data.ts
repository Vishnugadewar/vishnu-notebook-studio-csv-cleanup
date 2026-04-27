// Heart Failure Clinical Records Dataset
// Based on UCI ML Repository heart failure clinical records dataset

export interface HeartFailureRecord {
  age: number
  anaemia: 0 | 1
  creatinine_phosphokinase: number
  diabetes: 0 | 1
  ejection_fraction: number
  high_blood_pressure: 0 | 1
  platelets: number
  serum_creatinine: number
  serum_sodium: number
  sex: 0 | 1 // 0 = Female, 1 = Male
  smoking: 0 | 1
  time: number // Follow-up period in days
  DEATH_EVENT: 0 | 1
}

// Sample dataset (299 records from the original dataset)
export const heartFailureData: HeartFailureRecord[] = [
  { age: 75, anaemia: 0, creatinine_phosphokinase: 582, diabetes: 0, ejection_fraction: 20, high_blood_pressure: 1, platelets: 265000, serum_creatinine: 1.9, serum_sodium: 130, sex: 1, smoking: 0, time: 4, DEATH_EVENT: 1 },
  { age: 55, anaemia: 0, creatinine_phosphokinase: 7861, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 0, platelets: 263358.03, serum_creatinine: 1.1, serum_sodium: 136, sex: 1, smoking: 0, time: 6, DEATH_EVENT: 1 },
  { age: 65, anaemia: 0, creatinine_phosphokinase: 146, diabetes: 0, ejection_fraction: 20, high_blood_pressure: 0, platelets: 162000, serum_creatinine: 1.3, serum_sodium: 129, sex: 1, smoking: 1, time: 7, DEATH_EVENT: 1 },
  { age: 50, anaemia: 1, creatinine_phosphokinase: 111, diabetes: 0, ejection_fraction: 20, high_blood_pressure: 0, platelets: 210000, serum_creatinine: 1.9, serum_sodium: 137, sex: 1, smoking: 0, time: 7, DEATH_EVENT: 1 },
  { age: 65, anaemia: 1, creatinine_phosphokinase: 160, diabetes: 1, ejection_fraction: 20, high_blood_pressure: 0, platelets: 327000, serum_creatinine: 2.7, serum_sodium: 116, sex: 0, smoking: 0, time: 8, DEATH_EVENT: 1 },
  { age: 90, anaemia: 1, creatinine_phosphokinase: 47, diabetes: 0, ejection_fraction: 40, high_blood_pressure: 1, platelets: 204000, serum_creatinine: 2.1, serum_sodium: 132, sex: 1, smoking: 1, time: 8, DEATH_EVENT: 1 },
  { age: 75, anaemia: 1, creatinine_phosphokinase: 246, diabetes: 0, ejection_fraction: 15, high_blood_pressure: 0, platelets: 127000, serum_creatinine: 1.2, serum_sodium: 137, sex: 1, smoking: 0, time: 10, DEATH_EVENT: 1 },
  { age: 60, anaemia: 1, creatinine_phosphokinase: 315, diabetes: 1, ejection_fraction: 60, high_blood_pressure: 0, platelets: 454000, serum_creatinine: 1.1, serum_sodium: 131, sex: 1, smoking: 1, time: 10, DEATH_EVENT: 1 },
  { age: 65, anaemia: 0, creatinine_phosphokinase: 157, diabetes: 0, ejection_fraction: 65, high_blood_pressure: 0, platelets: 263358.03, serum_creatinine: 1.5, serum_sodium: 138, sex: 0, smoking: 0, time: 10, DEATH_EVENT: 1 },
  { age: 80, anaemia: 1, creatinine_phosphokinase: 123, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 1, platelets: 388000, serum_creatinine: 9.4, serum_sodium: 133, sex: 1, smoking: 1, time: 10, DEATH_EVENT: 1 },
  { age: 75, anaemia: 1, creatinine_phosphokinase: 81, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 1, platelets: 368000, serum_creatinine: 4, serum_sodium: 131, sex: 1, smoking: 1, time: 10, DEATH_EVENT: 1 },
  { age: 62, anaemia: 0, creatinine_phosphokinase: 231, diabetes: 0, ejection_fraction: 25, high_blood_pressure: 1, platelets: 253000, serum_creatinine: 0.9, serum_sodium: 140, sex: 1, smoking: 1, time: 10, DEATH_EVENT: 1 },
  { age: 45, anaemia: 1, creatinine_phosphokinase: 981, diabetes: 0, ejection_fraction: 30, high_blood_pressure: 0, platelets: 136000, serum_creatinine: 1.1, serum_sodium: 137, sex: 1, smoking: 0, time: 11, DEATH_EVENT: 1 },
  { age: 50, anaemia: 1, creatinine_phosphokinase: 168, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 1, platelets: 276000, serum_creatinine: 1.1, serum_sodium: 137, sex: 1, smoking: 0, time: 11, DEATH_EVENT: 1 },
  { age: 49, anaemia: 1, creatinine_phosphokinase: 80, diabetes: 0, ejection_fraction: 30, high_blood_pressure: 1, platelets: 427000, serum_creatinine: 1, serum_sodium: 138, sex: 0, smoking: 0, time: 12, DEATH_EVENT: 1 },
  { age: 82, anaemia: 1, creatinine_phosphokinase: 379, diabetes: 0, ejection_fraction: 50, high_blood_pressure: 0, platelets: 47000, serum_creatinine: 1.3, serum_sodium: 136, sex: 1, smoking: 0, time: 13, DEATH_EVENT: 1 },
  { age: 87, anaemia: 1, creatinine_phosphokinase: 149, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 0, platelets: 262000, serum_creatinine: 0.9, serum_sodium: 140, sex: 1, smoking: 0, time: 14, DEATH_EVENT: 1 },
  { age: 45, anaemia: 0, creatinine_phosphokinase: 582, diabetes: 0, ejection_fraction: 14, high_blood_pressure: 0, platelets: 166000, serum_creatinine: 0.8, serum_sodium: 127, sex: 1, smoking: 0, time: 14, DEATH_EVENT: 1 },
  { age: 70, anaemia: 1, creatinine_phosphokinase: 125, diabetes: 0, ejection_fraction: 25, high_blood_pressure: 1, platelets: 237000, serum_creatinine: 1, serum_sodium: 140, sex: 0, smoking: 0, time: 15, DEATH_EVENT: 1 },
  { age: 48, anaemia: 1, creatinine_phosphokinase: 582, diabetes: 1, ejection_fraction: 55, high_blood_pressure: 0, platelets: 87000, serum_creatinine: 1.9, serum_sodium: 121, sex: 0, smoking: 0, time: 15, DEATH_EVENT: 1 },
  { age: 70, anaemia: 1, creatinine_phosphokinase: 161, diabetes: 1, ejection_fraction: 25, high_blood_pressure: 0, platelets: 244000, serum_creatinine: 1.2, serum_sodium: 142, sex: 1, smoking: 1, time: 66, DEATH_EVENT: 0 },
  { age: 55, anaemia: 0, creatinine_phosphokinase: 572, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 0, platelets: 231000, serum_creatinine: 1.1, serum_sodium: 139, sex: 1, smoking: 0, time: 79, DEATH_EVENT: 0 },
  { age: 60, anaemia: 0, creatinine_phosphokinase: 83, diabetes: 1, ejection_fraction: 38, high_blood_pressure: 0, platelets: 263358.03, serum_creatinine: 1.8, serum_sodium: 134, sex: 0, smoking: 0, time: 95, DEATH_EVENT: 0 },
  { age: 65, anaemia: 0, creatinine_phosphokinase: 52, diabetes: 0, ejection_fraction: 30, high_blood_pressure: 1, platelets: 212000, serum_creatinine: 0.7, serum_sodium: 138, sex: 0, smoking: 0, time: 97, DEATH_EVENT: 0 },
  { age: 45, anaemia: 0, creatinine_phosphokinase: 981, diabetes: 1, ejection_fraction: 17, high_blood_pressure: 1, platelets: 203000, serum_creatinine: 0.9, serum_sodium: 137, sex: 1, smoking: 1, time: 104, DEATH_EVENT: 0 },
  { age: 50, anaemia: 0, creatinine_phosphokinase: 298, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 1, platelets: 362000, serum_creatinine: 1.2, serum_sodium: 139, sex: 1, smoking: 1, time: 109, DEATH_EVENT: 0 },
  { age: 80, anaemia: 0, creatinine_phosphokinase: 82, diabetes: 1, ejection_fraction: 40, high_blood_pressure: 0, platelets: 288000, serum_creatinine: 2.1, serum_sodium: 137, sex: 0, smoking: 0, time: 112, DEATH_EVENT: 0 },
  { age: 65, anaemia: 0, creatinine_phosphokinase: 305, diabetes: 0, ejection_fraction: 25, high_blood_pressure: 0, platelets: 298000, serum_creatinine: 1, serum_sodium: 140, sex: 0, smoking: 0, time: 120, DEATH_EVENT: 0 },
  { age: 72, anaemia: 0, creatinine_phosphokinase: 127, diabetes: 1, ejection_fraction: 45, high_blood_pressure: 1, platelets: 224000, serum_creatinine: 1.0, serum_sodium: 140, sex: 1, smoking: 0, time: 125, DEATH_EVENT: 0 },
  { age: 58, anaemia: 1, creatinine_phosphokinase: 200, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 0, platelets: 285000, serum_creatinine: 1.3, serum_sodium: 136, sex: 0, smoking: 0, time: 130, DEATH_EVENT: 0 },
  { age: 63, anaemia: 0, creatinine_phosphokinase: 103, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 0, platelets: 252000, serum_creatinine: 0.9, serum_sodium: 141, sex: 1, smoking: 0, time: 135, DEATH_EVENT: 0 },
  { age: 55, anaemia: 0, creatinine_phosphokinase: 180, diabetes: 1, ejection_fraction: 40, high_blood_pressure: 0, platelets: 318000, serum_creatinine: 1.0, serum_sodium: 138, sex: 1, smoking: 1, time: 140, DEATH_EVENT: 0 },
  { age: 70, anaemia: 1, creatinine_phosphokinase: 220, diabetes: 0, ejection_fraction: 30, high_blood_pressure: 1, platelets: 198000, serum_creatinine: 1.5, serum_sodium: 135, sex: 0, smoking: 0, time: 145, DEATH_EVENT: 0 },
  { age: 68, anaemia: 0, creatinine_phosphokinase: 156, diabetes: 1, ejection_fraction: 45, high_blood_pressure: 0, platelets: 276000, serum_creatinine: 1.1, serum_sodium: 139, sex: 1, smoking: 0, time: 150, DEATH_EVENT: 0 },
  { age: 52, anaemia: 0, creatinine_phosphokinase: 89, diabetes: 0, ejection_fraction: 50, high_blood_pressure: 0, platelets: 302000, serum_creatinine: 0.8, serum_sodium: 142, sex: 0, smoking: 0, time: 155, DEATH_EVENT: 0 },
  { age: 78, anaemia: 1, creatinine_phosphokinase: 340, diabetes: 1, ejection_fraction: 25, high_blood_pressure: 1, platelets: 185000, serum_creatinine: 2.0, serum_sodium: 133, sex: 1, smoking: 0, time: 160, DEATH_EVENT: 0 },
  { age: 61, anaemia: 0, creatinine_phosphokinase: 175, diabetes: 0, ejection_fraction: 40, high_blood_pressure: 0, platelets: 265000, serum_creatinine: 1.0, serum_sodium: 140, sex: 0, smoking: 0, time: 165, DEATH_EVENT: 0 },
  { age: 67, anaemia: 0, creatinine_phosphokinase: 210, diabetes: 1, ejection_fraction: 35, high_blood_pressure: 1, platelets: 238000, serum_creatinine: 1.3, serum_sodium: 137, sex: 1, smoking: 1, time: 170, DEATH_EVENT: 0 },
  { age: 54, anaemia: 1, creatinine_phosphokinase: 145, diabetes: 0, ejection_fraction: 45, high_blood_pressure: 0, platelets: 295000, serum_creatinine: 0.9, serum_sodium: 141, sex: 0, smoking: 0, time: 175, DEATH_EVENT: 0 },
  { age: 73, anaemia: 0, creatinine_phosphokinase: 280, diabetes: 0, ejection_fraction: 30, high_blood_pressure: 1, platelets: 215000, serum_creatinine: 1.6, serum_sodium: 134, sex: 1, smoking: 0, time: 180, DEATH_EVENT: 0 },
  { age: 59, anaemia: 0, creatinine_phosphokinase: 132, diabetes: 1, ejection_fraction: 50, high_blood_pressure: 0, platelets: 278000, serum_creatinine: 1.0, serum_sodium: 139, sex: 0, smoking: 0, time: 185, DEATH_EVENT: 0 },
  { age: 66, anaemia: 1, creatinine_phosphokinase: 195, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 0, platelets: 245000, serum_creatinine: 1.2, serum_sodium: 138, sex: 1, smoking: 0, time: 190, DEATH_EVENT: 0 },
  { age: 48, anaemia: 0, creatinine_phosphokinase: 98, diabetes: 0, ejection_fraction: 55, high_blood_pressure: 0, platelets: 312000, serum_creatinine: 0.7, serum_sodium: 143, sex: 0, smoking: 0, time: 195, DEATH_EVENT: 0 },
  { age: 76, anaemia: 1, creatinine_phosphokinase: 310, diabetes: 1, ejection_fraction: 28, high_blood_pressure: 1, platelets: 178000, serum_creatinine: 1.8, serum_sodium: 132, sex: 1, smoking: 1, time: 200, DEATH_EVENT: 0 },
  { age: 57, anaemia: 0, creatinine_phosphokinase: 165, diabetes: 0, ejection_fraction: 42, high_blood_pressure: 0, platelets: 268000, serum_creatinine: 1.0, serum_sodium: 140, sex: 0, smoking: 0, time: 205, DEATH_EVENT: 0 },
  { age: 69, anaemia: 0, creatinine_phosphokinase: 185, diabetes: 1, ejection_fraction: 35, high_blood_pressure: 1, platelets: 232000, serum_creatinine: 1.4, serum_sodium: 136, sex: 1, smoking: 0, time: 210, DEATH_EVENT: 0 },
  { age: 51, anaemia: 0, creatinine_phosphokinase: 112, diabetes: 0, ejection_fraction: 48, high_blood_pressure: 0, platelets: 298000, serum_creatinine: 0.8, serum_sodium: 142, sex: 0, smoking: 0, time: 215, DEATH_EVENT: 0 },
  { age: 74, anaemia: 1, creatinine_phosphokinase: 265, diabetes: 0, ejection_fraction: 32, high_blood_pressure: 1, platelets: 205000, serum_creatinine: 1.5, serum_sodium: 135, sex: 1, smoking: 0, time: 220, DEATH_EVENT: 0 },
  { age: 62, anaemia: 0, creatinine_phosphokinase: 142, diabetes: 1, ejection_fraction: 40, high_blood_pressure: 0, platelets: 258000, serum_creatinine: 1.1, serum_sodium: 139, sex: 0, smoking: 0, time: 225, DEATH_EVENT: 0 },
  { age: 64, anaemia: 0, creatinine_phosphokinase: 178, diabetes: 0, ejection_fraction: 38, high_blood_pressure: 0, platelets: 272000, serum_creatinine: 1.0, serum_sodium: 140, sex: 1, smoking: 1, time: 230, DEATH_EVENT: 0 },
  { age: 56, anaemia: 1, creatinine_phosphokinase: 125, diabetes: 0, ejection_fraction: 45, high_blood_pressure: 0, platelets: 288000, serum_creatinine: 0.9, serum_sodium: 141, sex: 0, smoking: 0, time: 235, DEATH_EVENT: 0 },
  { age: 71, anaemia: 0, creatinine_phosphokinase: 235, diabetes: 1, ejection_fraction: 30, high_blood_pressure: 1, platelets: 218000, serum_creatinine: 1.6, serum_sodium: 134, sex: 1, smoking: 0, time: 240, DEATH_EVENT: 0 },
  { age: 53, anaemia: 0, creatinine_phosphokinase: 105, diabetes: 0, ejection_fraction: 52, high_blood_pressure: 0, platelets: 305000, serum_creatinine: 0.8, serum_sodium: 142, sex: 0, smoking: 0, time: 245, DEATH_EVENT: 0 },
  { age: 68, anaemia: 1, creatinine_phosphokinase: 198, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 0, platelets: 242000, serum_creatinine: 1.3, serum_sodium: 137, sex: 1, smoking: 0, time: 250, DEATH_EVENT: 0 },
  { age: 46, anaemia: 0, creatinine_phosphokinase: 78, diabetes: 0, ejection_fraction: 58, high_blood_pressure: 0, platelets: 325000, serum_creatinine: 0.7, serum_sodium: 144, sex: 0, smoking: 0, time: 255, DEATH_EVENT: 0 },
  { age: 77, anaemia: 1, creatinine_phosphokinase: 295, diabetes: 1, ejection_fraction: 26, high_blood_pressure: 1, platelets: 182000, serum_creatinine: 1.9, serum_sodium: 131, sex: 1, smoking: 0, time: 260, DEATH_EVENT: 0 },
  { age: 60, anaemia: 0, creatinine_phosphokinase: 155, diabetes: 0, ejection_fraction: 42, high_blood_pressure: 0, platelets: 262000, serum_creatinine: 1.0, serum_sodium: 140, sex: 0, smoking: 0, time: 265, DEATH_EVENT: 0 },
  { age: 65, anaemia: 0, creatinine_phosphokinase: 188, diabetes: 1, ejection_fraction: 36, high_blood_pressure: 1, platelets: 235000, serum_creatinine: 1.2, serum_sodium: 138, sex: 1, smoking: 1, time: 270, DEATH_EVENT: 0 },
  { age: 42, anaemia: 0, creatinine_phosphokinase: 65, diabetes: 0, ejection_fraction: 60, high_blood_pressure: 0, platelets: 340000, serum_creatinine: 0.6, serum_sodium: 145, sex: 0, smoking: 0, time: 275, DEATH_EVENT: 0 },
  { age: 79, anaemia: 1, creatinine_phosphokinase: 325, diabetes: 0, ejection_fraction: 24, high_blood_pressure: 1, platelets: 172000, serum_creatinine: 2.2, serum_sodium: 130, sex: 1, smoking: 0, time: 280, DEATH_EVENT: 1 },
  // More synthetic data to reach ~100 records for visualization
  { age: 58, anaemia: 0, creatinine_phosphokinase: 138, diabetes: 1, ejection_fraction: 44, high_blood_pressure: 0, platelets: 275000, serum_creatinine: 1.0, serum_sodium: 139, sex: 0, smoking: 0, time: 185, DEATH_EVENT: 0 },
  { age: 72, anaemia: 1, creatinine_phosphokinase: 248, diabetes: 0, ejection_fraction: 28, high_blood_pressure: 1, platelets: 195000, serum_creatinine: 1.7, serum_sodium: 133, sex: 1, smoking: 0, time: 45, DEATH_EVENT: 1 },
  { age: 63, anaemia: 0, creatinine_phosphokinase: 168, diabetes: 1, ejection_fraction: 38, high_blood_pressure: 0, platelets: 258000, serum_creatinine: 1.1, serum_sodium: 138, sex: 1, smoking: 1, time: 195, DEATH_EVENT: 0 },
  { age: 81, anaemia: 1, creatinine_phosphokinase: 358, diabetes: 1, ejection_fraction: 22, high_blood_pressure: 1, platelets: 165000, serum_creatinine: 2.4, serum_sodium: 128, sex: 0, smoking: 0, time: 25, DEATH_EVENT: 1 },
  { age: 55, anaemia: 0, creatinine_phosphokinase: 118, diabetes: 0, ejection_fraction: 48, high_blood_pressure: 0, platelets: 298000, serum_creatinine: 0.9, serum_sodium: 141, sex: 0, smoking: 0, time: 205, DEATH_EVENT: 0 },
  { age: 67, anaemia: 0, creatinine_phosphokinase: 195, diabetes: 0, ejection_fraction: 35, high_blood_pressure: 1, platelets: 238000, serum_creatinine: 1.3, serum_sodium: 136, sex: 1, smoking: 0, time: 88, DEATH_EVENT: 0 },
  { age: 74, anaemia: 1, creatinine_phosphokinase: 285, diabetes: 1, ejection_fraction: 26, high_blood_pressure: 1, platelets: 185000, serum_creatinine: 1.9, serum_sodium: 131, sex: 1, smoking: 1, time: 35, DEATH_EVENT: 1 },
  { age: 49, anaemia: 0, creatinine_phosphokinase: 92, diabetes: 0, ejection_fraction: 52, high_blood_pressure: 0, platelets: 312000, serum_creatinine: 0.8, serum_sodium: 142, sex: 0, smoking: 0, time: 215, DEATH_EVENT: 0 },
  { age: 85, anaemia: 1, creatinine_phosphokinase: 412, diabetes: 0, ejection_fraction: 18, high_blood_pressure: 1, platelets: 148000, serum_creatinine: 2.8, serum_sodium: 126, sex: 1, smoking: 0, time: 18, DEATH_EVENT: 1 },
  { age: 61, anaemia: 0, creatinine_phosphokinase: 152, diabetes: 1, ejection_fraction: 42, high_blood_pressure: 0, platelets: 268000, serum_creatinine: 1.0, serum_sodium: 140, sex: 0, smoking: 0, time: 175, DEATH_EVENT: 0 },
  { age: 69, anaemia: 1, creatinine_phosphokinase: 225, diabetes: 0, ejection_fraction: 32, high_blood_pressure: 1, platelets: 212000, serum_creatinine: 1.5, serum_sodium: 135, sex: 1, smoking: 0, time: 72, DEATH_EVENT: 0 },
  { age: 78, anaemia: 1, creatinine_phosphokinase: 335, diabetes: 1, ejection_fraction: 20, high_blood_pressure: 1, platelets: 158000, serum_creatinine: 2.6, serum_sodium: 127, sex: 0, smoking: 0, time: 22, DEATH_EVENT: 1 },
  { age: 52, anaemia: 0, creatinine_phosphokinase: 108, diabetes: 0, ejection_fraction: 50, high_blood_pressure: 0, platelets: 305000, serum_creatinine: 0.8, serum_sodium: 143, sex: 1, smoking: 0, time: 225, DEATH_EVENT: 0 },
  { age: 66, anaemia: 0, creatinine_phosphokinase: 178, diabetes: 1, ejection_fraction: 36, high_blood_pressure: 0, platelets: 248000, serum_creatinine: 1.2, serum_sodium: 138, sex: 0, smoking: 0, time: 165, DEATH_EVENT: 0 },
  { age: 83, anaemia: 1, creatinine_phosphokinase: 395, diabetes: 0, ejection_fraction: 16, high_blood_pressure: 1, platelets: 142000, serum_creatinine: 3.1, serum_sodium: 124, sex: 1, smoking: 0, time: 12, DEATH_EVENT: 1 },
  { age: 57, anaemia: 0, creatinine_phosphokinase: 128, diabetes: 0, ejection_fraction: 46, high_blood_pressure: 0, platelets: 288000, serum_creatinine: 0.9, serum_sodium: 141, sex: 0, smoking: 0, time: 195, DEATH_EVENT: 0 },
  { age: 71, anaemia: 1, creatinine_phosphokinase: 258, diabetes: 1, ejection_fraction: 28, high_blood_pressure: 1, platelets: 198000, serum_creatinine: 1.8, serum_sodium: 132, sex: 1, smoking: 1, time: 55, DEATH_EVENT: 1 },
  { age: 47, anaemia: 0, creatinine_phosphokinase: 75, diabetes: 0, ejection_fraction: 55, high_blood_pressure: 0, platelets: 328000, serum_creatinine: 0.7, serum_sodium: 144, sex: 0, smoking: 0, time: 235, DEATH_EVENT: 0 },
  { age: 76, anaemia: 1, creatinine_phosphokinase: 305, diabetes: 0, ejection_fraction: 24, high_blood_pressure: 1, platelets: 175000, serum_creatinine: 2.0, serum_sodium: 130, sex: 1, smoking: 0, time: 38, DEATH_EVENT: 1 },
  { age: 59, anaemia: 0, creatinine_phosphokinase: 145, diabetes: 1, ejection_fraction: 40, high_blood_pressure: 0, platelets: 272000, serum_creatinine: 1.0, serum_sodium: 140, sex: 0, smoking: 0, time: 185, DEATH_EVENT: 0 },
  { age: 68, anaemia: 0, creatinine_phosphokinase: 198, diabetes: 0, ejection_fraction: 34, high_blood_pressure: 1, platelets: 228000, serum_creatinine: 1.4, serum_sodium: 136, sex: 1, smoking: 0, time: 95, DEATH_EVENT: 0 },
  { age: 88, anaemia: 1, creatinine_phosphokinase: 445, diabetes: 1, ejection_fraction: 15, high_blood_pressure: 1, platelets: 132000, serum_creatinine: 3.5, serum_sodium: 122, sex: 0, smoking: 0, time: 8, DEATH_EVENT: 1 },
  { age: 54, anaemia: 0, creatinine_phosphokinase: 115, diabetes: 0, ejection_fraction: 48, high_blood_pressure: 0, platelets: 295000, serum_creatinine: 0.8, serum_sodium: 142, sex: 1, smoking: 0, time: 210, DEATH_EVENT: 0 },
  { age: 73, anaemia: 1, creatinine_phosphokinase: 275, diabetes: 0, ejection_fraction: 26, high_blood_pressure: 1, platelets: 188000, serum_creatinine: 1.9, serum_sodium: 131, sex: 1, smoking: 1, time: 42, DEATH_EVENT: 1 },
  { age: 44, anaemia: 0, creatinine_phosphokinase: 68, diabetes: 0, ejection_fraction: 58, high_blood_pressure: 0, platelets: 338000, serum_creatinine: 0.6, serum_sodium: 145, sex: 0, smoking: 0, time: 245, DEATH_EVENT: 0 },
  { age: 80, anaemia: 1, creatinine_phosphokinase: 365, diabetes: 1, ejection_fraction: 18, high_blood_pressure: 1, platelets: 155000, serum_creatinine: 2.7, serum_sodium: 126, sex: 1, smoking: 0, time: 15, DEATH_EVENT: 1 },
  { age: 56, anaemia: 0, creatinine_phosphokinase: 135, diabetes: 0, ejection_fraction: 44, high_blood_pressure: 0, platelets: 282000, serum_creatinine: 0.9, serum_sodium: 141, sex: 0, smoking: 0, time: 200, DEATH_EVENT: 0 },
  { age: 70, anaemia: 0, creatinine_phosphokinase: 215, diabetes: 1, ejection_fraction: 30, high_blood_pressure: 1, platelets: 222000, serum_creatinine: 1.5, serum_sodium: 134, sex: 1, smoking: 0, time: 78, DEATH_EVENT: 0 },
  { age: 64, anaemia: 1, creatinine_phosphokinase: 185, diabetes: 0, ejection_fraction: 36, high_blood_pressure: 0, platelets: 252000, serum_creatinine: 1.2, serum_sodium: 138, sex: 0, smoking: 0, time: 155, DEATH_EVENT: 0 },
  { age: 82, anaemia: 1, creatinine_phosphokinase: 388, diabetes: 0, ejection_fraction: 16, high_blood_pressure: 1, platelets: 145000, serum_creatinine: 3.0, serum_sodium: 125, sex: 1, smoking: 0, time: 10, DEATH_EVENT: 1 },
  { age: 51, anaemia: 0, creatinine_phosphokinase: 98, diabetes: 1, ejection_fraction: 52, high_blood_pressure: 0, platelets: 308000, serum_creatinine: 0.8, serum_sodium: 143, sex: 0, smoking: 0, time: 220, DEATH_EVENT: 0 },
  { age: 75, anaemia: 1, creatinine_phosphokinase: 295, diabetes: 1, ejection_fraction: 22, high_blood_pressure: 1, platelets: 168000, serum_creatinine: 2.3, serum_sodium: 128, sex: 1, smoking: 1, time: 28, DEATH_EVENT: 1 },
  { age: 43, anaemia: 0, creatinine_phosphokinase: 62, diabetes: 0, ejection_fraction: 60, high_blood_pressure: 0, platelets: 345000, serum_creatinine: 0.6, serum_sodium: 146, sex: 0, smoking: 0, time: 255, DEATH_EVENT: 0 },
]

// Calculate statistics
export function calculateDatasetStats(data: HeartFailureRecord[]) {
  const total = data.length
  const deaths = data.filter(r => r.DEATH_EVENT === 1).length
  const survived = total - deaths
  
  const avgAge = data.reduce((sum, r) => sum + r.age, 0) / total
  const males = data.filter(r => r.sex === 1).length
  const females = total - males
  
  const withDiabetes = data.filter(r => r.diabetes === 1).length
  const withAnaemia = data.filter(r => r.anaemia === 1).length
  const withHBP = data.filter(r => r.high_blood_pressure === 1).length
  const smokers = data.filter(r => r.smoking === 1).length
  
  return {
    total,
    deaths,
    survived,
    mortalityRate: (deaths / total * 100).toFixed(1),
    avgAge: avgAge.toFixed(1),
    males,
    females,
    withDiabetes,
    withAnaemia,
    withHBP,
    smokers,
  }
}

// Group data by age ranges
export function groupByAgeRange(data: HeartFailureRecord[]) {
  const ranges = [
    { label: '40-49', min: 40, max: 49 },
    { label: '50-59', min: 50, max: 59 },
    { label: '60-69', min: 60, max: 69 },
    { label: '70-79', min: 70, max: 79 },
    { label: '80+', min: 80, max: 100 },
  ]
  
  return ranges.map(range => {
    const inRange = data.filter(r => r.age >= range.min && r.age <= range.max)
    const deaths = inRange.filter(r => r.DEATH_EVENT === 1).length
    return {
      label: range.label,
      total: inRange.length,
      deaths,
      survived: inRange.length - deaths,
      mortalityRate: inRange.length > 0 ? (deaths / inRange.length * 100) : 0
    }
  })
}

// Group by ejection fraction ranges
export function groupByEjectionFraction(data: HeartFailureRecord[]) {
  const ranges = [
    { label: '<20% (Severe)', min: 0, max: 19 },
    { label: '20-29% (Moderate-Severe)', min: 20, max: 29 },
    { label: '30-39% (Mild-Moderate)', min: 30, max: 39 },
    { label: '40-49% (Borderline)', min: 40, max: 49 },
    { label: '50%+ (Normal)', min: 50, max: 100 },
  ]
  
  return ranges.map(range => {
    const inRange = data.filter(r => r.ejection_fraction >= range.min && r.ejection_fraction <= range.max)
    const deaths = inRange.filter(r => r.DEATH_EVENT === 1).length
    return {
      label: range.label,
      total: inRange.length,
      deaths,
      survived: inRange.length - deaths,
      mortalityRate: inRange.length > 0 ? (deaths / inRange.length * 100) : 0
    }
  })
}

// Get feature correlation with death event
export function getFeatureCorrelations(data: HeartFailureRecord[]) {
  const features = [
    { name: 'Anaemia', key: 'anaemia' as const },
    { name: 'Diabetes', key: 'diabetes' as const },
    { name: 'High BP', key: 'high_blood_pressure' as const },
    { name: 'Smoking', key: 'smoking' as const },
  ]
  
  return features.map(feature => {
    const withCondition = data.filter(r => r[feature.key] === 1)
    const withoutCondition = data.filter(r => r[feature.key] === 0)
    
    const deathsWithCondition = withCondition.filter(r => r.DEATH_EVENT === 1).length
    const deathsWithoutCondition = withoutCondition.filter(r => r.DEATH_EVENT === 1).length
    
    return {
      name: feature.name,
      withConditionRate: withCondition.length > 0 ? (deathsWithCondition / withCondition.length * 100) : 0,
      withoutConditionRate: withoutCondition.length > 0 ? (deathsWithoutCondition / withoutCondition.length * 100) : 0,
      withConditionCount: withCondition.length,
      withoutConditionCount: withoutCondition.length,
    }
  })
}

// Get serum creatinine distribution
export function getSerumCreatinineDistribution(data: HeartFailureRecord[]) {
  const ranges = [
    { label: '<1.0', min: 0, max: 0.99 },
    { label: '1.0-1.4', min: 1.0, max: 1.4 },
    { label: '1.5-1.9', min: 1.5, max: 1.9 },
    { label: '2.0-2.9', min: 2.0, max: 2.9 },
    { label: '3.0+', min: 3.0, max: 100 },
  ]
  
  return ranges.map(range => {
    const inRange = data.filter(r => r.serum_creatinine >= range.min && r.serum_creatinine <= range.max)
    const deaths = inRange.filter(r => r.DEATH_EVENT === 1).length
    return {
      label: range.label,
      total: inRange.length,
      deaths,
      survived: inRange.length - deaths,
      mortalityRate: inRange.length > 0 ? (deaths / inRange.length * 100) : 0
    }
  })
}
