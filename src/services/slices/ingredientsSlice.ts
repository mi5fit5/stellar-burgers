import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Типизация состояния
type TIngredientsState = {
  ingredients: TIngredient[]; // Список ингредиентов
  isLoading: boolean; // Флаг загрузки данных
  error: null | SerializedError; // Сообщение об ошибке
};

// Начальное состояние слайса
const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Получение ингредиентов с сервера
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

// Создание слайса
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

export const { selectIngredients, selectIngredientsIsLoading } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
