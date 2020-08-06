export const withEnvVars = (vars: { [name: string]: string }) => {
  beforeAll(() => {
    Object.assign(process.env, vars);
  });

  afterAll(() => {
    for (const key of Object.keys(vars)) {
      delete process.env[key];
    }
  });
};
