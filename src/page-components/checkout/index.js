import React from 'react';
import { CurrencyValue } from 'components/currency-value';
import { useSettings } from 'components/settings-context';
import { useBasket } from 'components/basket';
import Layout from 'components/layout';
import OrderItems from 'components/order-items';
import { Row, Rows, StrikeThrough } from 'components/basket/totals/styles';
import { H3 } from 'ui';
import Payment from './payment';
import { Outer, Inner, SectionHeader, Container } from './styles';

function Checkout() {
  const basket = useBasket();
  const settings = useSettings();

  if (!basket.state.ready) {
    return <Outer center>Lite øyeblikk.. Henter frem din hurtigkurv...</Outer>;
  }

  const { items } = basket.state;
  const { currency } = settings;
  const { totalToPay, totalVatAmount, shipping, freeShipping } = basket.state;

  if (!items.length) {
    return <Outer center>Hurtigkurven er tom...</Outer>;
  }

  return (
    <Outer>
      <Inner>
        <Container>
          <SectionHeader>Hurtigkasse</SectionHeader>
          <Payment items={items} currency={currency} />
        </Container>
        <Container>
          <SectionHeader>Hurtigkurv</SectionHeader>
          <OrderItems items={items} currency={currency} />
          <Rows>
            <Row modifier="total-vat">
              <span>MVA.:</span>
              <span>
                <CurrencyValue value={totalVatAmount} />
              </span>
            </Row>
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
            <Row modifier="to-pay">
              <span>
                <H3>Totalt å betale:</H3>
              </span>
              <span>
                <strong>
                  <H3>
                    <CurrencyValue value={totalToPay + 99} />
                  </H3>
                </strong>
              </span>
            </Row>
          </Rows>
        </Container>
      </Inner>
    </Outer>
  );
}

export default function CheckoutWithLayout(props) {
  return (
    <Layout title="Betal med Vipps Hurtigkasse" simple>
      <Checkout {...props} />
    </Layout>
  );
}
