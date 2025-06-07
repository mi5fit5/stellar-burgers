import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 } from 'uuid';

// Типизация состояния
type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

// Начальное состояние
export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

// Создание слайса
const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredientBurger: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (item: TIngredient) => ({
        payload: { ...item, id: v4() }
      })
    },
    // Удаление игредиента
    removeIngredientBurger(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Перемещение ингредиента внутри бургера
    moveIngredientBurger(
      state,
      action: PayloadAction<{
        ingredient: TConstructorIngredient;
        upwards: boolean;
      }>
    ) {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.ingredient.id
      );
      if (index < 0) return;

      const newIndex = action.payload.upwards ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= state.ingredients.length) return;

      [state.ingredients[index], state.ingredients[newIndex]] = [
        state.ingredients[newIndex],
        state.ingredients[index]
      ];
    },
    // Сброс конструктора
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructor: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  addIngredientBurger,
  removeIngredientBurger,
  moveIngredientBurger,
  resetConstructor
} = constructorSlice.actions;
export const { selectConstructor } = constructorSlice.selectors;

export default constructorSlice.reducer;
