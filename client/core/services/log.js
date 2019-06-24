class LoggerService {
	constructor(logHandlers) {
		this.logHandlers = logHandlers
	}

	logEvent(logLevel, object, logModes) {
		for (const logHandler of this.logHandlers) {
			if (logLevel !== logHandler.logLevel) {
				continue
			}

			if (logModes.length !== 0 && !logModes.includes(logHandler.logMode)) {
				continue
			}

			logHandler.handler.call(logHandler, object)
		}
	}

	log(logLevel, object, ...logModes) {
		this.logEvent(logLevel, object, ...logModes)
	}

	error(error, ...logModes) {
		this.log("error", error, logModes)
	}

	warn(object, ...logModes) {
		this.log("warn", object, logModes)
	}

	info(object, ...logModes) {
		this.log("info", object, logModes)
	}
}

const logHandlers = [
	{
		logLevel: "error",
		logMode: "console",
		handler(object) {
			console.error(object)
		}
	},
	{
		logLevel: "info",
		logMode: "console",
		handler(object) {
			console.info(object)
		}
	},
	{
		logLevel: "warn",
		logMode: "console",
		handler(object) {
			console.warn(object)
		}
	}
]

export const logger = new LoggerService(logHandlers)