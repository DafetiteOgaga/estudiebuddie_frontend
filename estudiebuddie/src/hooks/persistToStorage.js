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
