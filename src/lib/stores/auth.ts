import { writable, derived } from 'svelte/store';
import type { AdminUser, AdminRole } from '$lib/api/types';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  function loadFromStorage(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('tmag-support-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user ?? null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  function persist(user: AdminUser | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem('tmag-support-auth', JSON.stringify({ user }));
    } else {
      localStorage.removeItem('tmag-support-auth');
    }
  }

  return {
    subscribe,
    init() {
      const user = loadFromStorage();
      set({ user, isAuthenticated: !!user, isLoading: false });
    },
    login(user: AdminUser) {
      persist(user);
      set({ user, isAuthenticated: true, isLoading: false });
    },
    logout() {
      persist(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    },
    setLoading(isLoading: boolean) {
      update((s) => ({ ...s, isLoading }));
    }
  };
}

export const authStore = createAuthStore();

export const currentUser = derived(authStore, ($auth) => $auth.user);
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(authStore, ($auth) => $auth.isLoading);

export function hasRole(role: AdminRole): boolean {
  let result = false;
  authStore.subscribe((s) => {
    result = s.user?.role === role;
  })();
  return result;
}

export function hasAnyRole(...roles: AdminRole[]): boolean {
  let result = false;
  authStore.subscribe((s) => {
    result = roles.includes(s.user?.role as AdminRole);
  })();
  return result;
}

export function isSuperAdmin(): boolean {
  return hasRole('super_admin');
}

export const ROLE_SECTIONS = {
	super_admin: [
		'dashboard',
		'billing',
		'company',
		'users',
		'plans',
		'technical',
		'analytics'
	],
	client_admin: ['dashboard', 'billing', 'company', 'users', 'plans'],
	support_admin: ['dashboard', 'billing', 'company', 'users', 'plans']
} as const;

export type SupportSection = 'dashboard' | 'billing' | 'company' | 'users' | 'plans' | 'technical' | 'analytics';
