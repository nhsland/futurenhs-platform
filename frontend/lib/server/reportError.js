// @ts-check

const opentelemetry = require("@opentelemetry/api");

/**
 * @param {Error} err
 */
const reportError = (err) => {
  const tracer = opentelemetry.trace.getTracer("futurenhs.frontend");
  const span = tracer.getCurrentSpan();

  if (span) {
    span.recordException(err);
  } else {
    console.log("Cannot report error, because no current span.", err);
  }
};

module.exports = { reportError };
