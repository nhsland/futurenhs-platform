# Azure Active Directory B2C

We use Azure Active Directory B2C as our main identity provider. See [./tech-stack](Tech Stack) for details about the decision.

## Initial setup

We setup our Azure AD B2C tenant with the following steps:

1. Create a new Azure AD B2C Tenant

   Organization name: FutureNHS
   Initial domain name: futurenhsplatform.onmicrosoft.com
   Country/Region: West Europe

1. Link the tenant to our production subscription

1. Create app registration "Development"

   Name: Development
   Supported account types: Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C.
   Redirect URI: Web, http://localhost:3000/auth/callback
   Permissions: Grant admin consent to openid and offline_access permissions

1. Create client secret for "Development" app registration. Then copy client secret, client id (called Application ID in the portal) and create a sealed secret:

   ```sh
   kubectl create secret generic sessions \
       --from-literal="AAD_B2C_CLIENT_SECRET=<paste client secret here>" \
       --from-literal="AAD_B2C_CLIENT_ID=<paste client id here>"
       --from-literal="COOKIE_SECRET=$(openssl rand -base64 30)"
       --dry-run=client -o yaml \
       | kubeseal -o yaml > frontend/manifests/dev-template/secret-sessions.yaml
   ```

1. Create app registration "Production"

   Name: Production
   Supported account types: Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C.
   Redirect URI: Web, https://beta.future.nhs.uk/auth/callback
   Permissions: Grant admin consent to openid and offline_access permissions

1. Create client secret for "Production" app registration. Then copy client secret, client id (called Application ID in the portal) and create a sealed secret:

   ```sh
   kubectl create secret generic sessions \
       --from-literal="AAD_B2C_CLIENT_SECRET=<paste client secret here>" \
       --from-literal="AAD_B2C_CLIENT_ID=<paste client id here>"
       --from-literal="COOKIE_SECRET=$(openssl rand -base64 30)"
       --dry-run=client -o yaml \
       | kubeseal -o yaml --context production > frontend/manifests/production/secret-sessions.yaml
   ```

1. Create user flow "Sign in"

   Version: Recommended
   Name: signin
   Identity providers: Email signin
   Multifactor authentication: Disabled
   Application claims: Display Name, Email Addresses

1. Change the page layout "Sign in page" of the user flow "Sign in"

   Use custom page content: Yes
   Custom page URI: https://beta.future.nhs.uk/auth-page-layouts/login

1. Create user flow "Password reset"

   Version: Recommended
   Name: passwordreset
   Identity providers: Reset password using email address
   Multifactor authentication: Disabled
   Application claims: Display Name, Email Addresses

## Create admin user

1. Invite a new user with their correct email address

1. Set Roles to "Global administrator"

## Create service team user

1. Create a new Azure AD B2C user

   Sign in method: Email

1. Set Roles to "User administrator"

1. Let them know their initial password. The password can only be changed using the above created password reset flow.

## Create platform member user

1. Create a new Azure AD B2C user

   Sign in method: Email

1. Let them know their initial password. The password can only be changed using the above created password reset flow.
