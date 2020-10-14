// @ts-check

const opentelemetry = require("@opentelemetry/api");
/**
 * @param {Error} err
 */
const reportError = (err) => {
  const tracer = opentelemetry.trace.getTracer("futurenhs.frontend");
  const span = tracer.getCurrentSpan();

  // `yarn dev:trace`s ConsoleSpanExporter is not very good at printing exceptions,
  // so we also add an event describing the error.
  if (span) {
    span.addEvent(`exception occurred: ${err}`);
  }

  try {
    // @ts-ignore `yarn dev`s Noopspan doesn't have recordException() at all,
    // so we let it fail and report the error the old fashioned way.
    span.recordException(err);
  } catch {
    console.error("exception occurred but was not reported:", err);
  }
};

module.exports = { reportError };
