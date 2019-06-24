import { createUserRuntime, createAdminRuntime } from "./components/runtime.js"

export function startApplication(entryPoint) {
	if (entryPoint === "admin") {
		return createAdminRuntime()
	} else if (entryPoint === "user") {
		return createUserRuntime()
	} else {
		throw new Error("Could not start application. Entered invalid entry point option!")
	}
}