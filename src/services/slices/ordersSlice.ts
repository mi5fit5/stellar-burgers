import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

// Типизация состояния
type TOrderState = {
  orders: TOrder[]; // Список заказов
  orderRequest: boolean; // Индикатор создания нового заказа
  orderModalData: TOrder | null; // Данные текущего заказа для модалки
  isLoadingOrderByNumber: boolean; // Загрузка конкретного заказа
  isLoadingOrders: boolean; // Загрузка всех заказов
  error: null | SerializedError; // Сообщение об ошибке
};

// Начальное состояние слайса
const initialState: TOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  isLoadingOrderByNumber: true,
  isLoadingOrders: true,
  error: null
};

// Получение одного заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (order: number) => (await getOrderByNumberApi(order)).orders[0]
);

// Получение всех заказов
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'orders/create',
  async (order: string[]) => await orderBurgerApi(order)
);

// Создание слайса
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderIsLoading: (state) => state.isLoadingOrderByNumber,
    selectOrdersIsLoading: (state) => state.isLoadingOrders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrderByNumber = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrderByNumber = false;
        state.error = action.error;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrderByNumber = false;
        state.orderModalData = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.error = action.error;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.error = null;
      });
  }
});

export const { resetOrderModalData } = ordersSlice.actions;
export const {
  selectOrders,
  selectOrderModalData,
  selectOrderRequest,
  selectOrderIsLoading,
  selectOrdersIsLoading
} = ordersSlice.selectors;

export default ordersSlice.reducer;
