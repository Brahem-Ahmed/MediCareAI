export interface Disease {
  id?: number;
  name: string;
  description?: string;
  causes?: string;
  treatment?: string;
  specialtyId: number;
  symptomIds?: number[];
}

export interface Symptom {
  id?: number;
  name: string;
  description?: string;
}

export interface MedicalRecord {
  id?: number;
  patientId: number;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  status?: string;
  medicalHistories?: MedicalHistory[];
  allergies?: Allergy[];
  chronicDiseases?: ChronicDisease[];
}

export interface MedicalHistory {
  id?: number;
  condition: string;
  type?: string;
  description?: string;
  occurredAt?: string;
}

export interface Allergy {
  id?: number;
  allergen: string;
  reaction?: string;
  severity?: string;
}

export interface ChronicDisease {
  id?: number;
  name: string;
  icdCode?: string;
  diagnosedAt?: string;
  notes?: string;
}
