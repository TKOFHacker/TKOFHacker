const API_BASE = '/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('livelihood_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      success: false,
      data: null,
      message: 'Network connection failed or service offline',
      error: { code: 'NETWORK_ERROR' }
    } as any;
  }
}

export const api = {
  // Auth
  auth: {
    login: (phone: string, password: string = 'password123') =>
      fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password })
      }),
    register: (userData: any) =>
      fetchApi<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getMe: () => fetchApi<any>('/auth/me'),
  },

  // Beneficiaries
  beneficiaries: {
    get: (id: number) => fetchApi<any>(`/beneficiaries/${id}`),
    update: (id: number, data: any) =>
      fetchApi<any>(`/beneficiaries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getSkills: (id: number) => fetchApi<any>(`/beneficiaries/${id}/skills`),
    getRecommendations: (id: number) => fetchApi<any>(`/beneficiaries/${id}/recommendations`),
  },

  // Assessment
  assessment: {
    start: (beneficiaryId: number = 1, language: string = 'ta') =>
      fetchApi<any>('/assessment/start', {
        method: 'POST',
        body: JSON.stringify({ beneficiary_id: beneficiaryId, language, channel: 'voice_web' })
      }),
    sendMessage: (assessmentId: number, messageText: string, questionKey?: string) =>
      fetchApi<any>(`/assessment/${assessmentId}/message`, {
        method: 'POST',
        body: JSON.stringify({ message_text: messageText, question_key: questionKey })
      }),
    sendAudio: (assessmentId: number, audioBase64?: string) =>
      fetchApi<any>(`/assessment/${assessmentId}/audio`, {
        method: 'POST',
        body: JSON.stringify({ audio_base64: audioBase64 || '' })
      }),
    complete: (assessmentId: number) =>
      fetchApi<any>(`/assessment/${assessmentId}/complete`, { method: 'POST' }),
    get: (assessmentId: number) => fetchApi<any>(`/assessment/${assessmentId}`),
  },

  // AI & Skills
  ai: {
    analyzeSkills: (data: any) =>
      fetchApi<any>('/ai/skill-analysis', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    analyzeGap: (targetCareer: string = 'Electrician', currentSkills?: string[]) =>
      fetchApi<any>('/ai/skill-gap', {
        method: 'POST',
        body: JSON.stringify({ target_career: targetCareer, current_skills: currentSkills })
      }),
    getRecommendations: (beneficiaryId: number = 1) =>
      fetchApi<any>('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify({ beneficiary_id: beneficiaryId })
      }),
  },

  // Jobs
  jobs: {
    list: (params?: { sector?: string; district?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return fetchApi<any>(`/jobs${q ? '?' + q : ''}`);
    },
    get: (id: number) => fetchApi<any>(`/jobs/${id}`),
    recommended: (beneficiaryId: number = 1) =>
      fetchApi<any>(`/jobs/recommended/${beneficiaryId}`),
    apply: (jobId: number, beneficiaryId: number = 1) =>
      fetchApi<any>(`/jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify({ beneficiary_id: beneficiaryId })
      }),
  },

  // Training
  training: {
    list: (params?: { sector?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return fetchApi<any>(`/training${q ? '?' + q : ''}`);
    },
    get: (id: number) => fetchApi<any>(`/training/${id}`),
    recommended: (beneficiaryId: number = 1) =>
      fetchApi<any>(`/training/recommended/${beneficiaryId}`),
    enroll: (trainingId: number, beneficiaryId: number = 1) =>
      fetchApi<any>(`/training/${trainingId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ beneficiary_id: beneficiaryId })
      }),
  },

  // Schemes
  schemes: {
    list: (category?: string) =>
      fetchApi<any>(`/schemes${category ? '?category=' + category : ''}`),
    get: (id: number) => fetchApi<any>(`/schemes/${id}`),
    eligible: (beneficiaryId: number = 1) =>
      fetchApi<any>(`/schemes/eligible/${beneficiaryId}`),
  },

  // Roadmap
  roadmap: {
    generate: (beneficiaryId: number = 1, goalTitle?: string) =>
      fetchApi<any>('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ beneficiary_id: beneficiaryId, goal_title: goalTitle })
      }),
    get: (beneficiaryId: number = 1) =>
      fetchApi<any>(`/roadmap/beneficiary/${beneficiaryId}`),
    updateStepProgress: (stepId: number, isCompleted: boolean) =>
      fetchApi<any>(`/roadmap/step/${stepId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ is_completed: isCompleted })
      }),
  },

  // Voice Telephony & Simulator
  voice: {
    simulateTurn: (callSid: string, userInput: string, language: string = 'ta') =>
      fetchApi<any>('/voice/simulate', {
        method: 'POST',
        body: JSON.stringify({ call_sid: callSid, user_input: userInput, language })
      }),
    endCall: (callSid: string) =>
      fetchApi<any>('/voice/end', {
        method: 'POST',
        body: JSON.stringify({ call_sid: callSid })
      }),
  },

  // Notifications
  notifications: {
    list: () => fetchApi<any>('/notifications'),
    markRead: (id: number) => fetchApi<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  },

  // Admin
  admin: {
    getDashboard: () => fetchApi<any>('/admin/dashboard'),
    getBeneficiaries: () => fetchApi<any>('/admin/beneficiaries'),
    getCalls: () => fetchApi<any>('/admin/calls'),
    getAssessments: () => fetchApi<any>('/admin/assessments'),
    getAnalytics: () => fetchApi<any>('/admin/analytics'),
  },
};
