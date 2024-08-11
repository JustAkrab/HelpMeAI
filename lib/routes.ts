export const AppRoutes = {
	HOME: '/',
	LOGIN: '/login',
	DASHBOARD: '/dashboard',
	HISTORY: '/history',
	TICKET: '/ticket',
} as const;

export type TubeAssistRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

export const ProtectedRoutes: TubeAssistRoute[] = [AppRoutes.DASHBOARD, AppRoutes.HISTORY, AppRoutes.TICKET];
