import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TIsModal } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrderModalData
} from '../../services/slices/ordersSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC<TIsModal> = ({ isModal }) => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(selectOrderModalData);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const dispatch = useDispatch();
  const { number } = useParams();

  useEffect(() => {
    dispatch(fetchOrderByNumber(Number(number)));
  }, [dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  const title = `#${orderInfo.number}`;

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} title={title} />;
};
