// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password) => {
  const userFlow = "B2C_1_signin";
  const baseUrl = `https://futurenhsplatform.b2clogin.com/futurenhsplatform.onmicrosoft.com/${userFlow}`;

  const extract = (re, text) => {
    const result = re.exec(text);
    if (!result || !result.length === 2) {
      throw new Error(`Could not extract ${re}. Result: ${result}`);
    }

    return result[1];
  };

  cy.request("/auth/login")
    .its("body")
    .then((body) => {
      const tx = extract(/"transId":"([a-zA-Z0-9+/=]+)"/, body);
      const csrfToken = extract(/"csrf":"([a-zA-Z0-9+/=]+)"/, body);

      const loginUrl = new URL(`${baseUrl}/SelfAsserted`);
      loginUrl.searchParams.set("p", userFlow);
      loginUrl.searchParams.set("tx", tx);
      cy.request({
        method: "POST",
        url: loginUrl.toString(),
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        form: true,
        body: {
          request_type: "RESPONSE",
          email,
          password,
        },
      });

      const redirectUrl = new URL(
        `${baseUrl}/api/CombinedSigninAndSignup/confirmed?rememberMe=false`
      );
      redirectUrl.searchParams.set("p", userFlow);
      redirectUrl.searchParams.set("tx", tx);
      redirectUrl.searchParams.set("csrf_token", csrfToken);
      cy.request(redirectUrl.toString());
    });
});
