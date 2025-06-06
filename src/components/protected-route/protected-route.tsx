import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUserIsAuth,
  selectUserIsInit
} from '../../services/slices/usersSlice';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const location = useLocation();
  const userIsInit = useSelector(selectUserIsInit);
  const userIsAuth = useSelector(selectUserIsAuth);

  // Пока идёт инициализация - прелоадер
  if (!userIsInit) return <Preloader />;

  // Маршрут для авторизованных, но пользователь не авторизован - перенаправление на страницу входа
  if (!onlyUnAuth && !userIsAuth)
    return <Navigate to={'/login'} replace state={{ from: location }} />;

  // Маршрут для неавторизованных, но пользователь авторизован - перенаправление назад или на главную
  if (onlyUnAuth && userIsAuth)
    return <Navigate to={location.state?.from || { pathname: '/' }} replace />;

  return children;
};
