function callApi(apiName) {
  return async ({ query, variables, operationName }) => {
    const response = await fetch(
      apiName === 'orders'
        ? `https://api.crystallize.com/${process.env.NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/${apiName}`
        : 'https://pim.crystallize.com/graph/core',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-Crystallize-Access-Token-Secret':
            process.env.CRYSTALLIZE_SECRET_TOKEN,
          'X-Crystallize-Access-Token-Id':
            process.env.CRYSTALLIZE_SECRET_TOKEN_ID
        },
        body: JSON.stringify({ operationName, query, variables })
      }
    );

    return response.json();
  };
}

export const callOrdersApi = callApi('orders');
export const callCoreApi = callApi('core');

/*
### original:
function createApiCaller(uri) {
  return async function callApi({ query, variables, operationName }) {
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Crystallize-Access-Token-Secret':
          process.env.CRYSTALLIZE_SECRET_TOKEN,
        'X-Crystallize-Access-Token-Id': process.env.CRYSTALLIZE_SECRET_TOKEN_ID
      },
      body: JSON.stringify({ operationName, query, variables })
    });

    return response.json();
  };
}

export const callOrdersApi = createApiCaller(
  `https://api.crystallize.com/${process.env.NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/orders`
);

export const callCoreApi = createApiCaller(
  'https://pim.crystallize.com/graph/core'
);
*/
