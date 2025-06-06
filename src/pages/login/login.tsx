import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, selectLoginError } from '../../services/slices/usersSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginError = useSelector(selectLoginError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || '/profile';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const responce = await dispatch(loginUser({ email, password })).unwrap();

      if (responce && responce.success) navigate(from, { replace: true });
    } catch (e) {}
  };

  return (
    <LoginUI
      errorText={loginError?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
