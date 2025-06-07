import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { selectOrderModalData } from '../../services/slices/ordersSlice';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';

type TOrderInfoWrapperProps = {
  onClose: () => void;
};

export const OrderInfoWrapper: FC<TOrderInfoWrapperProps> = ({ onClose }) => {
  const orderData = useSelector(selectOrderModalData);
  const title = useMemo(() => {
    if (!orderData) return '';
    return `#${orderData.number}`;
  }, [orderData]);

  return (
    <Modal title={title} onClose={onClose}>
      <OrderInfo isModal />
    </Modal>
  );
};
