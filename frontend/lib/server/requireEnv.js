// @ts-check

/**
 * @param {string} name
 * @returns {string}
 */
const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
};

module.exports = { requireEnv };
