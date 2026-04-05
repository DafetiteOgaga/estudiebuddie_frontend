import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
	const [modal, setModal] = useState({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	console.log('ConfirmProvider')
	const confirm = ({ title, message, onConfirm, buttonText }) => {
		setModal({
			isOpen: true,
			title,
			message: "This action cannot be undone.",
			onConfirm,
			buttonText
		});
	};

	const handleConfirm = () => {
		console.log('handleConfirm')
		modal.onConfirm?.();
		setModal(prev => ({ ...prev, isOpen: false }));
	};

	const handleCancel = () => {
		console.log('handleCancel')
		setModal(prev => ({ ...prev, isOpen: false }));
	};

	return (
		<ConfirmContext.Provider value={{ confirm }}>
			{children}

		<AreYouSureModalOverlay
			isOpen={modal.isOpen}
			title={modal.title}
			message={modal.message}
			buttonText={modal.buttonText || "Continue"}
			onConfirm={handleConfirm}
			onCancel={handleCancel}
		/>
		</ConfirmContext.Provider>
	);
}

function AreYouSureModalOverlay({
	isOpen,
	title,
	message,
	buttonText = "Continue",
	onConfirm,
	onCancel,
	modalRef = null,
	buttonRef = null,
}) {
	console.log({isOpen})
	if (!isOpen) return null;
	console.log('proceeding')
	return (
		<div className="ready-backdrop" aria-hidden={!isOpen}>
			<div
			className="ready-modal white-space-pre"
			ref={modalRef}
			role="dialog"
			aria-modal="true"
			aria-labelledby="ready-title"
			>
			<h3 id="ready-title">{title}</h3>

			<p>{message}</p>

			<div className="modal-actions">
				<button
				type="button"
				className="cta-button modal cancel first fit"
				onClick={onCancel}
				>
				Cancel
				</button>

				<button
				type="button"
				className="cta-button modal last fit"
				ref={buttonRef}
				onClick={onConfirm}
				>
				{buttonText}
				</button>
			</div>
			</div>
		</div>
	);
}