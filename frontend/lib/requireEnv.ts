export const requireEnv = (name: string) => {
  console.log(process.env[name], name);
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
};
