import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

// Типизация состояния
type TFeedsState = {
  feeds: TOrdersData; // Данные ленты заказов
  isLoading: boolean; // Флаг загрузки данных
  error: null | SerializedError; // Сообщение об ошибке
};

// Начальное состояник
const initialState: TFeedsState = {
  feeds: { orders: [], total: 0, totalToday: 0 },
  isLoading: false,
  error: null
};

// Получение данных ленты заказов
export const fetchFeeds = createAsyncThunk(
  'feeds/fetch',
  async () => await getFeedsApi()
);

// Создание слайса
const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeeds: (state) => state.feeds,
    selectFeedsOrders: (state) => state.feeds.orders,
    selectFeedsTotal: (state) => state.feeds.total,
    selectFeedsTotalToday: (state) => state.feeds.totalToday,
    selectFeedsIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload;
        state.error = null;
      });
  }
});

export const {
  selectFeeds,
  selectFeedsOrders,
  selectFeedsTotal,
  selectFeedsTotalToday,
  selectFeedsIsLoading
} = feedsSlice.selectors;

export default feedsSlice.reducer;
