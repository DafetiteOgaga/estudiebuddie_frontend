import { Fragment, useEffect, useState, useRef } from 'react';
import { ImageCropAndCompress } from '../../hooks/imgCompressAndCrop/ImageCropAndCompress';
// import defaultImage from '../../statics/images/sample_image.png'
// import { useIsMobile } from '../../hooks/IsMobile';
// import { ConvertCase } from '../../hooks/ConvertCase';
// import { MoreInfo } from "../MoreInfo";
// import { serverOrigin } from "../../hooks/fetch/FetchFromServer";

// const generateUniqueId = () => crypto.randomUUID();
// console.log({id: generateUniqueId()})
// const imageScapeOption = ['side', 'top']
// const questionObject = {
// 	number: '',
// 	question: '',
// 	correct_answer: '',
// 	wrong_answer1: '',
// 	wrong_answer2: '',
// 	wrong_answer3: '',
// 	image: null,
// 	// previewImage: defaultImage,
// 	imageMode: 'side',
// 	uniqueId: generateUniqueId(),
// }

const formQuestions = [
	{
		name: "question",
		type: "text",
		placeholder: "Enter question",
		required: true,
		element: "textarea",
		width: "100%",
		rows: 4,
	},
	{
		name: "explanation",
		type: "text",
		placeholder: "Explain the answer",
		required: true,
		element: "textarea",
		width: "100%",
		rows: 1,
	},
	{
		name: "correct_answer",
		type: "text",
		placeholder: "Enter correct answer",
		required: true,
		element: "input",
		width: "50%",
	},
	{
		name: "wrong_answer1",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
		width: "50%",
	},
	{
		name: "wrong_answer2",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
		width: "50%",
	},
	{
		name: "wrong_answer3",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
		width: "50%",
	},
]

function QuestionsArrComp({args}) {
	const [uploadedImg, setUploadedImg] = useState(null)
	const {
		// questions,
		// totalNumberOfQuestions,
		// isImageVisible,
		// toggleImage,
		// // addRemoveQuestion,
		// removeQuestion,
		// // handleQuestionChange,
		// totalFileUploadQuestions,
		// setTotalFileUploadQuestions,
		// setFileUploadQuestions,
		// newFileUploadQuestions,
		// // questionObject,
		// setSchoolData,
		// // formData,
		// // setFormData,
		// fileQuestionsHandle,
		// showSubmitArray,
		// setShowSubmitArray,
		// type,
		// text,
		// // processedText,
		// downloadLink,
		// fileMargin,
		// removeQuestionFromArray,
		// setImageVisibility,
		// generateUniqueId,
		// setIsReload,
		// handleChange,
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
	} = args;

	// const fileInputRef = useRef(null)
	// const handleButtonClick = () => {
	// 	fileInputRef.current.click();
	// };

	// Add a new question
	const addRemoveQuestion = ({id}={}) => {
		console.log('in add remove question...')
		if (id) {
			console.log('removing...', {id})
			setFormData(prev => {
				// console.log('updating form data...')
				const updatedQuestions = prev.questions.filter(question =>
													question.uniqueId!==id)
				// console.log('updated questions:', {updatedQuestions})
				const newForm = {
					...prev,
					questions: updatedQuestions,
					totalQs: questionFormData.length - 1,
				}
				// console.log('new form data:', {newForm})
				return newForm
			})
			setQuestionFormData(prev => {
				const selectedQuestion = prev.filter(question =>
												question.uniqueId!==id)
				return selectedQuestion
			});
		} else {
			console.log('adding...', {id})
			setFormData(prev => {
				// console.log('updating form data...')
				// const updatedQuestions = questionFormData
				console.log({questionFormData})
				const newForm = {
					...prev,
					// questions: updatedQuestions,
					totalQs: questionFormData.length + 1,
				}
				// console.log('new form data:', {newForm})
				return newForm
			})
			setQuestionFormData(prev => {
				const uniqueId = generateUniqueId()
				const newQuestionObject = {...questionObject, uniqueId}
				return [...prev, newQuestionObject]
			});
		}
	};

	useEffect(() => {
		// console.log({coompressedFile})
		// const handleImages = (file, index) => [
			handleQuestionChange(
				null,
				{
					name: 'image',
					value: uploadedImg?.imgPreview,
					files: [uploadedImg?.compressedFile],
					type: 'file'
				},
			uploadedImg?.imageId)
		// ]
	}, [uploadedImg])


	// const isMobile = useIsMobile();
	const [editFileQuestions, setEditFileQuestions] = useState([questionObject]);
	// const [rerender, setRerender] = useState(false);
	// console.log({type}, {text})
	// const uploadedQuestions = text?.split?.(`Q${[Number]}`||`q${[Number]}`);
	// const uploadedQuestions = text?.split(/(?:Q|q)\d+[.:]/)  // split using Q1., Q2: etc.
	// .map(q => q.trim())       // clean up extra spaces
	// .filter(Boolean)          // remove any empty strings
	// .map((q, index) => ({
	// 	id: index,
	// 	question: q,
	// }));
	// const uploadedQuestionsLength = processedText?.length
	// const uploadedQuestionsLength = uploadedQuestions?.length
	// let questionArray = questions
	// const numberOfQuestions =
	// console.log('uploadedQuestions:', uploadedQuestions)
	let info, fileQuestions
	// if (processedText) {[info, ...fileQuestions] = processedText}
	// if (uploadedQuestions) {[info, ...fileQuestions] = uploadedQuestions}
	// useEffect(() => {
	// 	// const newQuestions = Array.from({ length: (uploadedQuestions?.length - 1) }, () => fileQuestions.map((q, index) => {
	// 	const newQuestions = fileQuestions?.map((q, index) => {
	// 		// console.log({q})
	// 		const [question, correct_answer, wrong_answer1, wrong_answer2, wrong_answer3] = q.question.split('\n').filter(Boolean);
	// 		return ({
	// 			number: q.id,
	// 			question: question.trim(),
	// 			correct_answer: correct_answer.trim(),
	// 			wrong_answer1: wrong_answer1.trim(),
	// 			wrong_answer2: wrong_answer2.trim(),
	// 			wrong_answer3: wrong_answer3.trim(),
	// 			image: null,
	// 			// previewImage: defaultImage,
	// 			imageMode: 'side', // default to 'side'
	// 			uniqueId: generateUniqueId(),
	// 		})
	// 	})
	// 	if (newQuestions) {
	// 		// console.log('newQuestions:', newQuestions)
	// 		setEditFileQuestions(newQuestions);
	// 	}
	// }, [
	// 	// text
	// ]);
	const handleFileQuestionChange = (index, e) => {
		const { name, value, files } = e.target;
		// let updatedQuestions = [...formData];
		let updatedQuestions = [...editFileQuestions];
		updatedQuestions[index]["number"] = index + 1; // auto-add/update question number
		if (name === "image") {
			const file = files && files[0];

			if (file instanceof File) {
				// updatedQuestions[index].image = null
				// updatedQuestions[index].previewImage = null
				console.log('File selected:', file);
				updatedQuestions[index].image = file; // store actual file
				updatedQuestions[index].previewImage = URL.createObjectURL(file); // store preview URL
				// console.log('image (before a):', updatedQuestions[index])
				// console.log('image (before):', updatedQuestions[index].image)
				// if (!updatedQuestions[index].image) {
				// 	console.log('image (after):', updatedQuestions[index].image)
				// 	updatedQuestions[index].image = file; // store actual file
				// 	updatedQuestions[index].previewImage = URL.createObjectURL(file); // store preview URL
				// }
			}
			// else {
			// 	console.log('No valid file selected');
			// 	console.warn("No valid file selected for image");
			// }
		} else {
			updatedQuestions[index][name] = value;
			// console.log('name:', name, 'value:', value)
		}
		// console.log({updatedQuestions})
		// console.log('newFileUploadQuestions (questions):', newFileUploadQuestions)
		// setEditFileQuestions(newFileUploadQuestions??updatedQuestions);
		// setRerender(prev => !prev); // trigger re-render
	};
	// const fileUpload = text?.length
	// if (fileUpload) {
	// 	const total = newFileUploadQuestions?(newFileUploadQuestions.length):(uploadedQuestionsLength-1)
	// 	console.log('newFileUploadQuestions (fileUpload):', newFileUploadQuestions)
	// 	questionArray = newFileUploadQuestions??editFileQuestions
	// 	setTotalFileUploadQuestions(total)
	// 	setFileUploadQuestions(questionArray)
	// 	setSchoolData(info.question)
	// }
	// useEffect(() => {
	// 	fileQuestionsHandle(editFileQuestions)
	// }, [editFileQuestions])

	// console.log('formData2:', formData)
	// if (fileUpload && !showSubmitArray[1]) {
	// 	setShowSubmitArray(prev => {
	// 		const updated = [...prev];
	// 		updated[1] = true;
	// 		return updated;
	// 	});
	// }
	// const removeUploadedImage = (index, questionID, e) => {
	// 	console.log('removeUploadedImage called')
	// 	const updatedQuestionsImages = [...editFileQuestions];
	// 	console.log('updatedQuestionsImages:', updatedQuestionsImages)
	// 	console.log(`updatedQuestionsImages.${[index]}.image:`, updatedQuestionsImages[index].image)
	// 	console.log(`updatedQuestionsImages${[index]}.previewImage:`, updatedQuestionsImages[index].previewImage)
	// 	updatedQuestionsImages[index].image = null;
	// 	// updatedQuestionsImages[index].previewImage = defaultImage; // reset to default image
	// 	console.log(`updatedQuestionsImages.${[index]}.image:`, updatedQuestionsImages[index].image)
	// 	console.log(`updatedQuestionsImages${[index]}.previewImage:`, updatedQuestionsImages[index].previewImage)
	// 	console.log('from removeUploadedImage in QuestionsArrComp:')
	// 	setEditFileQuestions(updatedQuestionsImages);
	// 	console.log(`question ${index + 1} image removed`);
	// 	// setImageVisibility(questionID)
	// 	questionArray = updatedQuestionsImages
	// 	// fileUpload?handleFileQuestionChange(index, e):handleQuestionChange(index, e)
	// }
	// console.log('editFileQuestions (final):', editFileQuestions)
	// console.log('editFileQuestions:', editFileQuestions)
	// console.log('questionArray:', questionArray)
	// questionArray = [...questionArray, editFileQuestions]
	// useEffect(() => {
	// 	console.log('Reloading questions due to questionArray change:', questionArray)
	// 	setIsReload(prev => !prev)
	console.log({
		questionFormData,
	// 	// questions
		// questionFormData
		uploadedImg,
	})
	return (
		<div
		style={{paddingTop: '1rem'}}>
			{questionFormData?.map((questionData, qIdx) => {
				const isImage = questionData?.image
				// console.log({questionData})
				// console.log({questionData,
				// 	id: questionData.uniqueId})
				return (
					<fieldset key={questionData.uniqueId}
					className="form-group mb-2 mx-5 border-top-1 pt-1">
						{/* textarea separately */}
						{formQuestions.map((field, fIdx) => {
							if (field.element !== "textarea") return null;
							return (
								<div className='floating-field'
								key={field.name+fIdx}>
									<textarea
										// className={``}
										placeholder=" "
										value={questionData[field.name]}
										onChange={(e)=>handleQuestionChange(e, null, qIdx)}
										required={field.required}
										rows={field.rows}
										style={{
											height: "auto",
											width: field.width,
											// marginTop: "2rem", // space from inputs above
										}}
										name={field.name}
									/>
									<label className={`${field.name==='question'?'top-left':''}`}>{`${field.placeholder} ${qIdx + 1}`}</label>
								</div>
							);
						})}

						{/* inputs in a flex container (2 per row) */}
						<div className=""
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							// gap: '0.5rem',
						}}>
							{/* inputs only (skip textarea) */}
							{formQuestions.map((field, fIdx) => {
								if (field.element === "textarea") return null; // skip textarea
								return (
									<div className='floating-field'
									key={field.name + fIdx}
									style={{
										width: "49%", // 2 per row roughly (45% + gap ≈ 100%)
										margin: '2px',
									}}>
										<input
											name={field.name}
											type={field.type}
											placeholder=" "
											value={questionData[field.name]}
											onChange={(e)=>handleQuestionChange(e, null, qIdx)}
											required={field.required}
										/>
										<label>{`${field.placeholder} for question ${qIdx + 1}`}</label>
									</div>
								);
							})}
						</div>

						<div className=''>
							{/* preview images */}
							{/* {isImage ?
							<>
								<img alt={`question ${qIdx + 1} preview`}
								src={questionData.previewImage}
								className='question-upload'
								/>
							</>
							:null} */}

							<div>
								{/* upload/change images */}
								<ImageCropAndCompress
								onComplete={setUploadedImg}
								imageId={qIdx}
								imgType="question" />
								{/* <button
								type='button'
								className='cta-button question'
								onClick={()=> document.getElementById(`image-upload-${qIdx}`).click()}>
									{isImage?'Change':'Upload'} Image
								</button>
								<input
								id={`image-upload-${qIdx}`}
								type="file"
								name='image'
								accept="image/*"
								onChange={(e)=>handleQuestionChange(e, null, qIdx)}
								hidden
								/> */}
								{/* remove uploaded image */}
								{/* {isImage ?
								<>
									<button
									type='button'
									className='cta-button question'
									onClick={(e)=>handleQuestionChange(e, qIdx, '-')}>
										Remove Image
									</button>
								</>
								:null} */}
								<button
								type="button"
								onClick={()=>addRemoveQuestion({id:questionData.uniqueId})}
								className="cta-button question">
									Remove Question
								</button>
							</div>
						</div>
					</fieldset>
				)
			})}
			<button
			style={{margin: '0 5rem'}}
			type="button" onClick={addRemoveQuestion}
			className={`cta-button mb-xs ${questionFormData?.length?'':'d-none'}`}>
				Add Another Question
			</button>
		</div>
	)
}

const styles = {
	previewImage: {
		width: '100%',
		height: 'auto',
		padding: 5,
		borderRadius: 10,
	},
	previewImagePC: {
		maxWidth: 300,
		maxHeight: 300,
	},
	createLayout: {
		margin: '0 5%'
	},
	addRemoveQuestionBtnPC: {
		margin: '10px 5% 0 5%',
	},
	addRemoveQuestionBtnMobile: {
		display: 'flex',
		justifyContent: 'center'
	},
	questionsCompPCwoFile: {
		margin: '5% 10% 0 10%',
	},
	questionsCompPCwFile: {
		margin: '5% -10% 0 -10%',
	},
	questionsCompMobileIndex0: {
		marginTop: '10%'
	},
	questionsCompMobileIndexX: {
		marginTop: 0,
	},
	verticalContainerPCwFile: {
		margin: '5% -10% 0 -10%'
	},
	verticalContainerPCwoFile: {
		margin: '5% 10% 0 10%'
	},
	verticalContainerMobile: {
		marginTop: 40,
	},
	imageUploadContainerPC: {
		display: 'flex',
		gap: 3,
	},
	imageUploadContainerMobile: {
		display: 'flex',
		flexDirection: 'column',
		// gap: 3,
	},
};
export { QuestionsArrComp };
