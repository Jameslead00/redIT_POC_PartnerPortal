import { ContextResponse, SubmitCheckInRequest, SubmitCheckInResponse } from '../models/types';

const API_BASE = 'https://pocpartnerportal-d8apevetgacbfyec.switzerlandnorth-01.azurewebsites.net/api';

export async function getContext(token: string): Promise<ContextResponse> {
  const response = await fetch(`${API_BASE}/GetContext`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch context');
  }
  return response.json();
}

export async function submitCheckIn(token: string, data: SubmitCheckInRequest): Promise<SubmitCheckInResponse> {
  const response = await fetch(`${API_BASE}/SubmitCheckIn`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to submit check-in');
  }
  return response.json();
}