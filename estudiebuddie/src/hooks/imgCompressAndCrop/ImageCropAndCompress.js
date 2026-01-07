import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import Modal from "react-modal";
import "./ImageCropAndCompress.css"

// run on terminal:
// npm install react-easy-crop browser-image-compression react-modal

// Utility: turn crop pixels into a File via canvas
const convertCroppedPixelToJPGImage = (imageSrc, cropPixels) => {
	console.log({imageSrc, cropPixels})
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = imageSrc;
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = cropPixels.width;
			canvas.height = cropPixels.height;
			const ctx = canvas.getContext("2d");

			ctx.drawImage(
				img,
				cropPixels.x,
				cropPixels.y,
				cropPixels.width,
				cropPixels.height,
				0,
				0,
				cropPixels.width,
				cropPixels.height
			);

			canvas.toBlob((blob) => {
				if (!blob) return reject("Crop failed");
				resolve(new File([blob], "cropped.jpeg", { type: "image/jpeg" }));
			}, "image/jpeg");
		};
	});
};

const ImageCropAndCompress = forwardRef(({onComplete, imgType,
											initPreview=null,
											isImagePreview = null,
											imageId=null,
											buttonText=null,
											disableBtn=false
										}, ref) => {
	// console.log('cropping image...')
	// console.log({imageId})
	const [imageSrc, setImageSrc] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [finalImageUrl, setFinalImageUrl] = useState(null);
	const [finalFile, setFinalFile] = useState(null);
	const [fileName, setFileName] = useState("No file chosen");
	// const deviceType = useDeviceType();
	// const isMobile = deviceType.width <= 576
	const [isFileSelected, setIsFileSelected] = useState(false);
	// console.log({onComplete, imgType})

	// assign target image width and height
	let targetHeight // target height
	let targetWidth // target width
	if (imgType === "question") {
		targetHeight = 450;
		targetWidth = 500;
	} else if (imgType==="profile"||
		imgType==='changeProfile') {
		targetHeight = 200;
		targetWidth = 200;
	} else {
		targetHeight = 430;
		targetWidth = 1000;
	}
	const targetAspectRatio = targetWidth / targetHeight; // aspect ratio
	// console.log({
	// 	targetHeight,
	// 	targetWidth,
	// 	targetAspectRatio,
	// })

	// handle crop response from cropper after crop is done
	const handleCropComplete = useCallback((_, croppedAreaPixels) => {
		// console.log({croppedAreaPixels})
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	// handle file upload from local machine
	const handleFileChange = (e) => {
		console.log("File input changed:", e.target.files);
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			console.log("Selected file:", file);
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = () => setImageSrc(reader.result);
			reader.readAsDataURL(file);
			console.log({reader})
		}
	};

	// Expose handleImageProcessing to parent via ref
	useImperativeHandle(ref, () => ({
		handleImageProcessing,
	}));
	
	// watcher (imageSrc separately)
	useEffect(() => {
		if (isImagePreview) {
			console.log('changing imagePreview from,', isImagePreview, 'to', !!imageSrc)
			isImagePreview(!!imageSrc);  // true if imageSrc exists, false otherwise
		}
	}, [imageSrc]);


	useEffect(() => {
		if (initPreview) {
			setFinalImageUrl(initPreview)
		}
	}, [])

  	// crop + compress in one click
	const handleImageProcessing = async () => {
		try {
			// console.log("Cropping and compressing...");

			// Step 1: crop only after user confirms crop
			const croppedFile = await convertCroppedPixelToJPGImage(imageSrc, croppedAreaPixels);

			const sizeKB = croppedFile.size / 1024;
			let compressedFile

			if (sizeKB < 40) {
				// Case 1: already within range
				compressedFile = croppedFile; // return as-is
			} else {
				// Case 2: too large → compress
				const maxSizeKB = 50; // target 200 KB
				const maxSizeMB = maxSizeKB / 1024; // convert KB to MB
				const options = {
					maxSizeMB: maxSizeMB, // target ~300KB
					maxWidthOrHeight: targetWidth, // just in case
					// initialQuality: 0.7, // start at 70% quality
					fileType: "image/jpeg", // output as JPEG
					useWebWorker: true,
				};
				// console.log('compressing with options:', options)

				// Step 2: compress
				compressedFile = await imageCompression(croppedFile, options);
			}

			// create preview & store cropped file output
			setFinalFile(compressedFile);
			const imgPreview = URL.createObjectURL(compressedFile)
			setFinalImageUrl(imgPreview);
			setImageSrc(null); // clear watcher (imageSrc) after processing

			// console.log("Final file:", compressedFile);

			// send file to parent
			if (onComplete) {
				console.log('sending to parent ...')
				onComplete({compressedFile, imageId, imgPreview});
				setIsFileSelected(true);
				console.log({compressedFile})
			}

		} catch (err) {
			console.error(err);
		}
	};

	// download the cropped and compressed file
	const handleDownload = () => {
		console.log('handle download...')
		if (!finalFile) return;

		console.log('handling download...')
		const link = document.createElement("a");
		link.href = URL.createObjectURL(finalFile);
		link.download = finalFile.name || "compressed.jpeg"; // default name
		link.click();
	};


	// console.log({imageSrc})
	// console.log({finalImageUrl})
	// console.log({finalFile})
	// console.log({fileName})
	// console.log({croppedAreaPixels})
	return (
		<>
			{(finalImageUrl&&
				!imageSrc&&
					imgType!=='changeProfile') && (
			<div className="image-preview-container">
				{/* image preview */}
				<img src={finalImageUrl}
				alt="image-preview"
				className={`image-preview ${imgType==="question"?"question":"profile"}`}
				/>
				{/* remove image button */}
				<button
				type="button"
				onClick={() => {
					setFinalImageUrl(null);
					setFinalFile(null);
					setFileName("No file chosen");
					if (isImagePreview) isImagePreview(false);
					if (onComplete) {
						onComplete(null);
						setIsFileSelected(false);
					}
				}}
				className="cta-button question remove">
					Remove
				</button>

				{/* download cropped image button */}
				{(imgType!=='profile'&&
					imgType!=='changeProfile'&&
					imgType!=="question")&&
				<button
				onClick={handleDownload}
				className="download">
					Download Cropped Image
				</button>}
			</div>)}

			{/* File input */}
			<div className="file-upload-container">
				{/* upload button */}
				<button
				type='button'
				className='cta-button question'
				onClick={()=> document.getElementById(`${imageId?`fileUpload-${imageId}`:'fileUpload'}`).click()}>
					{isFileSelected?'Change':'Upload'} Image
				</button>

				{/* actual input (hidden) */}
				<input
				id={`${imageId?`fileUpload-${imageId}`:'fileUpload'}`}
				type="file"
				name="image"
				accept="image/*" // accept images only
				// accept="video/*" // accept videos only
				hidden // hidden input
				disabled={disableBtn}
				onChange={handleFileChange} />
			</div>

			{imageSrc && (
				<>
					<Modal
					open={true}
					onClose={() => setImageSrc(null)}
					isOpen={imageSrc}
					onRequestClose={null}
					ariaHideApp={false}
					contentLabel="Crop image"
					shouldCloseOnOverlayClick={true}
					shouldCloseOnEsc={true}
					style={{
						overlay: { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 99 },
						content: {
							inset: "50% auto auto 50%",
							transform: "translate(-50%, -50%)",
							padding: 0,
							border: "none",
							borderRadius: 16,
							width: "90vw",
							maxWidth: 900,
							height: "80vh",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
							background: "transparent",
						},
					}}
					>
						<div className="modal-container">
							{(imageSrc) && (
								<div className="modal-preview">
									<button
									type="button"
									className="cta-button question"
									onClick={()=> {
										setImageSrc(null);
										setFileName("No file chosen");
									}}>
										Cancel
									</button>
									<button
									type="button"
									className="cta-button question"
									onClick={handleImageProcessing}>
										Use Image
									</button>
								</div>
							)}
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={targetAspectRatio}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={handleCropComplete}
								cropShape={
									(imgType==='profile'||
										imgType==='changeProfile')?
											'round':'rect'
								}
							/>
						</div>
					</Modal>
				</>
			)}
		</>
	);
});

export { ImageCropAndCompress }