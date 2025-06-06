import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { TIsModal } from '@utils-types';

export const IngredientDetails: FC<TIsModal> = ({ isModal }) => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const ingredientData = useSelector(selectIngredients).find(
    (item) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI ingredientData={ingredientData} isModal={isModal} />
  );
};
