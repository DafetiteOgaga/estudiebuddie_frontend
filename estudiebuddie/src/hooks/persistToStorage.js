// import { useAuth } from "./allAuth/authContext";

function GroupAllKeys(storage, key, rm=false) {
	const allAppKeys = storage.getItem("sb-keys");
	if (allAppKeys) {
		// if sb-keys exists
		let parsedKeys = JSON.parse(allAppKeys);
		if (!parsedKeys.includes(key)) {
			parsedKeys.push(key);
			storage.setItem("sb-keys", JSON.stringify(parsedKeys));
		}
		if (parsedKeys.includes(key)&&rm) {
			parsedKeys = parsedKeys.filter(k => k !== key);
			storage.setItem("sb-keys", JSON.stringify(parsedKeys));
		}
	} else {
		// newly set sb-keys
		storage.setItem("sb-keys", JSON.stringify([key]));
	}
}

function useStorage(storage) {
	return {
		// set item to storage
		setItem(key, value) {
			if (storage === localStorage) {
				GroupAllKeys(storage, key);
			}
			storage.setItem(key, JSON.stringify(value));
		},

		// get item from storage
		getItem(key) {
			const item = storage.getItem(key);

			if (!item) return null;
			try {
				let data = JSON.parse(item);
				return data
			} catch {
				return null;
			}
		},

		// removes single item from storage
		removeItem(key) {
			storage.removeItem(key);
			GroupAllKeys(storage, key, true) // removes the key from sb list
			console.log('removed:', key)
		},

		// removes all saved-detail- items from local and session storages
		removeSavedDetailsItems() {
			const storages = [localStorage, sessionStorage];

			storages.forEach((storage) => {
				// Loop through storage keys
				for (let i = storage.length - 1; i >= 0; i--) {
					const key = storage.key(i);

					// Check if key starts with "saved-detail-"
					if (key && key.startsWith("saved-detail-")) {
						storage.removeItem(key);
						GroupAllKeys(storage, key, true);
					}
				}
			});
		},

		// removes all app items from local and session storages
		removeAllItems() {
			const storages = [localStorage, sessionStorage];

			storages.forEach((storage) => {
				const rawKeys = storage.getItem("sb-keys");
				if (!rawKeys) return;

				try {
					const allKeys = JSON.parse(rawKeys);
					allKeys.forEach((key) => {
						storage.removeItem(key); // remove the actual value
					});
				} catch (err) {
					console.error("Failed to parse sb-keys:", err);
				}

				storage.removeItem("sb-keys"); // finally remove the array itself
			});
		},

		// clears storage (including app and non-app items)
		clear() {
			storage.clear();
		},

		// fetches the index of the requested item
		key(index) {
			return storage.key(index);
		},

		// gets the length of the storage (inluding app and non-app items)
		getLength() {
			return storage.length;
		},

		// remove quiz session
		removeSession() {
			const rawKeys = JSON.parse(storage.getItem("sb-keys") || "[]");
			const sessionKeys = ["session-info", "selected-answers"];

			const updatedKeys = rawKeys.filter(key => {
				if (sessionKeys.includes(key)) {
					storage.removeItem(key);
					GroupAllKeys(storage, key, true);
					return false; // remove from sb-keys array
				}
				return true; // keep other keys
			});

			storage.setItem("sb-keys", JSON.stringify(updatedKeys));
			console.log('previous session cleared')
		},

		// logout
		logout() {
			const rawKeys = JSON.parse(storage.getItem("sb-keys") || "[]");
			const logoutKeys = ["access_token", "refresh_token", "user"];

			const updatedKeys = rawKeys.filter(key => {
				if (logoutKeys.includes(key)) {
					storage.removeItem(key);
					GroupAllKeys(storage, key, true);
					return false; // remove from sb-keys array
				}
				return true; // keep other keys
			});

			storage.setItem("sb-keys", JSON.stringify(updatedKeys));
			console.log('logout successful')
		},

		expiredSoRemove(key, expiryTime =1000*60*30) {
			const stored = storage.getItem(key);
			if (!stored) return null;

			let parsed;
			try {
				parsed = JSON.parse(stored);
			} catch (err) {
				// corrupted data → remove it
				console.log(`corrupted ${key} data:::removed`)
				storage.removeItem(key);
				return null;
			}

			if (!parsed?.storedAt) {
				// invalid format → remove it
				console.log(`invalid format ${key} data:::removed`)
				storage.removeItem(key);
				return null;
			}

			const now = Date.now();
			const durationElapsed = now - parsed.storedAt
			if (durationElapsed > expiryTime) {
				console.log(`${key} data expired:::::removed`)
				storage.removeItem(key);
				return null; // expired
			}
			const minutesLeft = ((expiryTime - durationElapsed) / (1000 * 60)).toFixed(1)
			console.log(`${key} data still valid for the next: ${minutesLeft} mins:::::`)
			return null; // still valid
		}
	};
}

const useCreateStorage = () => {
	// Create two versions
	const lStorage = useStorage(localStorage); // localStorage
	const sStorage = useStorage(sessionStorage); // sessionStorage
	return { lStorage, sStorage };
}
export { useCreateStorage };
