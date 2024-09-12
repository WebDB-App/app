import Sentry from "@sentry/node";

class Log {
	error(err, context) {
		console.error(err);
		Sentry.captureMessage(err.message ? err.message : err, {
			level: "error",
			contexts: { trace: { data: { context } } }
		});
	}
}

export default new Log();
