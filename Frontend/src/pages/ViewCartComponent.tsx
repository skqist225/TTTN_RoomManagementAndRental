import styled from 'styled-components';
import {Anchor, Button, Flex} from '../globalStyle';

export const FreeshipNotification = styled(Flex).attrs(() => ({
    width: '100%',
    height: '5.3rem',
    padding: '1.5rem 2rem',
}))`
  margin-bottom: 1.25rem;
  background-color: #fff;
  border: rgba(224, 168, 0, 0.4) 1px solid;
`;

export const Text = styled.span`
  color: #222;
  margin-left: 0.5rem;
  font-size: 1.8rem;
  font-weight: 500;
`;

export const FreeshipImage = styled.div`
  background-image: url('${(props: any) => props.src}');
  background-repeat: no-repeat;
  background-size: contain;
  height: 2.25rem;
  width: 100%;
`;

export const RightTitle = styled(Flex)`
  & div {
    width: 20.43557%;
    text-align: center;
    color: #888;
    font-size: 0.9rem;
    text-transform: capitalize;
  }
`;

export const CartProducts = styled(Flex)`
  background-color: #fff;
`;

export const Line = styled.div`
  flex: 1;
  height: 1px;
  color: #f5f5f5;
`;

export const ShopName = styled(Flex).attrs(props => ({
    width: '100%',
}))`
  & span {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
    font-size: 1.4rem;
    display: inline-block;
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

export const Product = styled.div`
  width: 100%;
`;

export const ProductRight = styled(Flex)`
  height: 100%;
  flex: 1;
  maxWidth: 70%;
  justify-content: flex-end;
`;

export const ProductLeft = styled(Flex)`
  //flex: 1;
  height: 100%;
  //max-width: 46%;
`;

export const ProductImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: contain;
`;

export const ProductName = styled(Anchor)`
  color: rgba(0, 0, 0, 0.8);
  display: block;
  margin-bottom: 5px;
  line-height: 16px;
  max-height: 32px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 1.2rem;
`;

export const DeleteButton = styled(Button)`
  background-color: transparent;
  display: block;
  font-size: ${props => props.fontSize || '1.2rem'};
  color: #000;
  margin: 0 0.8rem;
  padding: 1px 6px;
`;

export const FunctionText = styled.div`
  color: #ee4d2d;
  font-weight: 500;
  font-size: 1.8rem;
  text-align: center;
  width: 100%;
  height: 100%;
`;

export const FunctionTextWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  max-width: 14rem;
  width: 100%;
  justify-self: flex-end;
`;

export const FinalPrice = styled(Flex)`
  justify-content: flex-end;

  & span {
    display: inline-block;
    font-size: 1.4rem;
    color: #ee4d2d;
  }
`;

export const BuyProductBar = styled.div`
  width: 100%;
  height: 18.1rem;
  // position: fixed;
  bottom: 0;
  left: 0;
  background-color: #f5f5f5;
  margin-top: 2rem;
`;

export const ChooseVoucher = styled.div`
  text-transform: capitalize;
  color: #05a;
  font-size: 1.875rem;
  white-space: nowrap;
  cursor: pointer;
`;

export const SelectAll = styled(Button)`
  background-color: transparent;
  color: #000;
  text-transform: capitalize;
  cursor: pointer;
  font-size: 1rem;
`;

export const SaveFavorite = styled(SelectAll)`
  background-color: transparent;
  color: #ee4d2d;
  margin: 0 8px;
  max-width: 16.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: flex-start;
`;

interface ITotalPayStyle {
    fontSize?: string;
}

export const TotalPay = styled.div`
  width: 350px;
  font-size: ${(props: ITotalPayStyle) => props.fontSize || '1.2rem'};
  color: #222222;
  line-height: 1.6rem;
  text-align: right;

  &.first {
    display: flex;
    justify-content: flex-end;
  }

  &.first span {
    display: inline-block;
  }

  & span.savedPrice {
    font-size: 1.2rem;
    margin-left: 5px;
    color: #ee4d2d;
  }
`;

export const BuyButton = styled(Button)`
  padding: 13px 36px;
  margin: 0 22px 0 15px;
  text-transform: capitalize;
  font-weight: 300;
  height: 3rem;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.75rem;
  border-radius: 2px;
  width: 13rem;
  color: #fff;
  background-color: #ee4d2d;
`;

export const OpacityBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Modal = styled.main`
  width: 67.8rem;
  height: 39rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2.25rem;
  border-radius: 3px;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);

  & div.modalHeader {
    font-size: 3rem;
    color: #ee4d2d;
    margin-top: 1.875rem;
  }

  & div {
    margin-top: 2.5rem;
    font-size: 2rem;
    line-height: 2.5rem;
  }
`;

export const YesButton = styled(Button)`
  flex: 1;
  background-color: #ee4d2d;
  color: #fff;
  height: 4rem;
  padding: 0 2rem;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 9%);
  border-radius: 2px;
  overflow: hidden;
  font-size: 1.4rem;
  marin-right: 1.25rem;
  max-width: 48%;
`;

export const CancelButton = styled(YesButton)`
  background-color: #fff;
  color: #222;
  border: 1px solid #222;
`;

export const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
`;

export const OKButton = styled(YesButton)`
  flex: 1;
  max-width: 100%;
  justify-self: flex-end;
`;