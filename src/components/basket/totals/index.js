import React from 'react';

import { CurrencyValue } from 'components/currency-value';
import { useBasket } from '../context';

import { Outer, Row, StrikeThrough, Rows } from './styles';

export const Totals = () => {
  const { state } = useBasket();

  const {
    discount,
    totalPrice,
    totalPriceMinusDiscount,
    totalToPay,
    totalVatAmount,
    shipping,
    freeShipping
  } = state;

  return (
    <Outer>
      <Rows>
        <Row modifier="total-price">
          <span>Pris:</span>
          <span>
            <CurrencyValue value={totalPrice} />
          </span>
        </Row>
        {discount && (
          <>
            <Row modifier="discount">
              <span>Rabatt:</span>
              <span>
                <CurrencyValue value={discount} />
              </span>
            </Row>
            <Row modifier="total-after-discount">
              <span>Pris totalt u/frakt:</span>
              <span>
                <CurrencyValue value={totalPriceMinusDiscount} />
              </span>
            </Row>
          </>
        )}
        <Row modifier="shipping">
          <span>Frakt:</span>
          {freeShipping ? (
            <span>
              {shipping && shipping.unit_price > 0 && (
                <StrikeThrough>
                  <CurrencyValue value={shipping.unit_price} />
                </StrikeThrough>
              )}{' '}
              <CurrencyValue value="0" />
            </span>
          ) : (
            <span>
              <CurrencyValue value={shipping ? shipping.unit_price : 99} />
            </span>
          )}
        </Row>

        <Row modifier="total-vat">
          <span>Mva.:</span>
          <span>
            <CurrencyValue value={totalVatAmount} />
          </span>
        </Row>
        <Row modifier="to-pay">
          <span>Totalt å betale:</span>
          <span>
            <CurrencyValue value={totalToPay + shipping} />
          </span>
        </Row>
      </Rows>
    </Outer>
  );
};
