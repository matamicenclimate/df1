import { Navigate, Outlet } from 'react-router-dom';

import { Dashboard } from '@/features/misc/routes/Dashboard';
import { Profile } from '@/features/users/routes/Profile';

const App = () => {
  return <Outlet />;
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/profile', element: <Profile /> },
      { path: '/', element: <Dashboard /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
