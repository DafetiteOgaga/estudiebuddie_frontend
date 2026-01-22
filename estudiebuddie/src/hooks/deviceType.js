import { useState, useEffect } from "react";

const deviceLabels = {
	mobile: false,
	smallTablet: false,
	tablet: false,
	smallLaptop: false,
	laptop: false,
	desktop: false,
};

const useDeviceState = () => {
	const [deviceType, setDeviceType] = useState(() => ({ ...deviceLabels }));

	useEffect(() => {
		const getType = () => {
			// Reset all values to false
			let resetAndcleanTypes = Object.fromEntries(
				Object.keys(deviceLabels).map(key => [key, false])
			);

			const width = window.innerWidth;

			if (width < 576) {
				resetAndcleanTypes = { ...resetAndcleanTypes, mobile: true };
			} else if (width < 768) {
				resetAndcleanTypes = { ...resetAndcleanTypes, smallTablet: true };
			} else if (width < 901) {
				resetAndcleanTypes = { ...resetAndcleanTypes, tablet: true };
			} else if (width < 1025) {
				resetAndcleanTypes = { ...resetAndcleanTypes, smallLaptop: true };
			} else if (width < 1201) {
				resetAndcleanTypes = { ...resetAndcleanTypes, laptop: true };
			} else {
				resetAndcleanTypes = { ...resetAndcleanTypes, desktop: true };
			}
			resetAndcleanTypes = { ...resetAndcleanTypes, width: width };
			const label = Object.keys(deviceLabels).find(key => resetAndcleanTypes[key]) || "Unknown";
			console.log(`${label}: ${width}px`);
			setDeviceType(resetAndcleanTypes);
		};

		// Run once on mount
		getType();

		// Listen for resizes
		window.addEventListener("resize", getType);

		// Cleanup listener on unmount
		return () => window.removeEventListener("resize", getType);
	}, []);
	return deviceType;
};

// const useDeviceType = () => useDeviceState();
const useDeviceInfo = () => {
	// extract the width
	const { width, ...flags } = useDeviceState();
	// extract the device with value true (the current device used by the client)
	const label = Object.keys(flags).find(k => flags[k]) || "unknown";
	return { label, width };
};

export { useDeviceInfo };
