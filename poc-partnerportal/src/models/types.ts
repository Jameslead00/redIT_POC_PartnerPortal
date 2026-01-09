export interface Partner {
  id: string;
  name: string;
}

export interface LastCheckIn {
  score: number;
  comment: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  lastCheckIn: LastCheckIn | null;
}

export interface ContextResponse {
  ok: boolean;
  partner: Partner;
  goals: Goal[];
}

export interface SubmitCheckInRequest {
  goalId: string;
  score: number;
  comment: string | null;
}

export interface SubmitCheckInResponse {
  ok: boolean;
}