import { authApi, otpApi, setAuthTokenHeader } from './xano';
import { setItem, getItem, deleteItem } from './storage';

export type AuthUser = {
  id: number;
  name?: string;
  full_name?: string;
  email: string;
};

export type AuthLoginResponse = {
  authToken?: string;
  token?: string;
  user?: AuthUser;
  [key: string]: any;
};

const TOKEN_KEY = 'auth_token';

export async function saveAuthToken(token: string) {
  await setItem(TOKEN_KEY, token);
  setAuthTokenHeader(token);
}

export async function getAuthToken(): Promise<string | null> {
  const token = await getItem(TOKEN_KEY);
  if (token) setAuthTokenHeader(token);
  return token;
}

export async function clearAuthToken() {
  await deleteItem(TOKEN_KEY);
  setAuthTokenHeader(null);
}

export async function login(params: { email: string; password: string }) {
  const res = await authApi.post<AuthLoginResponse>('/auth/login', params);
  const token = (res.data as any).authToken || (res.data as any).token;
  if (token) await saveAuthToken(token);
  return res.data;
}

export async function signup(params: { name?: string; full_name?: string; email: string; password: string }) {
  const res = await authApi.post<any>('/auth/signup', params);
  // Some Xano setups also return token on signup
  const token = (res.data as any).authToken || (res.data as any).token;
  if (token) await saveAuthToken(token);
  return res.data;
}

export async function me(): Promise<AuthUser> {
  await getAuthToken();
  const res = await authApi.get<AuthUser>('/auth/me');
  return res.data;
}

// OTP verification helpers
export async function verifyOtp(params: { user_id?: number; email?: string; otp_code: string }) {
  // Try to query by user_id and/or email alongside otp_code
  const query: Record<string, any> = { otp_code: params.otp_code };
  if (params.user_id) query.user_id = params.user_id;
  if (params.email) query.email = params.email;

  const res = await otpApi.get('/otp_verification', { params: query });
  const records: any[] = Array.isArray(res.data) ? (res.data as any[]) : [];
  if (records.length === 0) return { ok: false, reason: 'Invalid code' };

  // If expiry exists, ensure it is still valid
  const now = Date.now();
  const valid = records.some((r) => {
    if (!r.otp_expires_at) return true;
    const exp = typeof r.otp_expires_at === 'number' ? r.otp_expires_at : Date.parse(r.otp_expires_at);
    return now <= exp;
  });

  return { ok: valid, reason: valid ? undefined : 'Code expired' };
}

export async function requestPasswordReset(email: string) {
  // Attempt a conventional Xano endpoint name; ignore errors to avoid blocking UX
  try {
    await authApi.post('/auth/forgot', { email });
    return { ok: true };
  } catch (e1) {
    try {
      await authApi.post('/auth/request_password_reset', { email });
      return { ok: true };
    } catch (e2) {
      return { ok: false };
    }
  }
}


