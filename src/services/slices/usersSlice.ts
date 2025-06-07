import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Типизация состояния
type TUserState = {
  user: TUser; // Объект пользователя
  userIsInit: boolean; // Проверка инициализации
  userIsAuth: boolean; // Проверка авторизации
  registerError: null | SerializedError; // Ошибка регистрации
  loginError: null | SerializedError; // Ошибка входа
};

// Начальное состояние слайса
const initialState: TUserState = {
  user: { email: '', name: '' },
  userIsInit: false,
  userIsAuth: false,
  registerError: null,
  loginError: null
};

// Получение текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
  'user/fetch',
  async () => await getUserApi()
);

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const responce = await registerUserApi(data);

    // Сохраняем токены после регистрации
    localStorage.setItem('refreshToken', responce.refreshToken);
    setCookie('accessToken', responce.accessToken);

    return responce;
  }
);

// Вход пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const responce = await loginUserApi(data);

    // Сохраняем токены после входа
    localStorage.setItem('refreshToken', responce.refreshToken);
    setCookie('accessToken', responce.accessToken);

    return responce;
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

// Выход пользователя
export const logoutUser = createAsyncThunk('user/logout', async () => {
  // Удаляем токены
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

// Создание слайса
export const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectUserIsInit: (state) => state.userIsInit,
    selectUserIsAuth: (state) => state.userIsAuth,
    selectRegisterError: (state) => state.registerError,
    selectLoginError: (state) => state.loginError
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loginError = action.error;
        state.userIsAuth = false;
        state.userIsInit = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userIsAuth = true;
        state.userIsInit = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userIsAuth = true;
        state.userIsInit = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userIsAuth = true;
        state.userIsInit = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginError = action.error;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = initialState.user;
        state.userIsAuth = false;
        state.userIsInit = true;
      });
  }
});

export const {
  selectUser,
  selectUserIsInit,
  selectUserIsAuth,
  selectRegisterError,
  selectLoginError
} = usersSlice.selectors;

export default usersSlice.reducer;
