import { Route, Routes } from 'react-router-dom';
import { Callback } from '../components/Callback';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="callback" element={<Callback />} />
    </Routes>
  );
};
