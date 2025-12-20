import { Fragment, useEffect, useState } from 'react';
// import defaultImage from '../../statics/images/sample_image.png'
// import { useIsMobile } from '../../hooks/IsMobile';
// import { ConvertCase } from '../../hooks/ConvertCase';
// import { MoreInfo } from "../MoreInfo";
// import { serverOrigin } from "../../hooks/fetch/FetchFromServer";

const imageScapeOption = ['side', 'top']
const questionObject = {
	number: '',
	question: '',
	correct_answer: '',
	wrong_answer1: '',
	wrong_answer2: '',
	wrong_answer3: '',
	image: null,
	// previewImage: defaultImage,
	imageMode: 'side',
	// uniqueId: generateUniqueId(),
}

const formQuestions = [
	{
		name: "question",
		type: "text",
		placeholder: "Enter question",
		required: true,
		element: "textarea",
	},
	{
		name: "correct_answer",
		type: "text",
		placeholder: "Enter correct answer",
		required: true,
		element: "input",
	},
	{
		name: "wrong_answer1",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
	},
	{
		name: "wrong_answer2",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
	},
	{
		name: "wrong_answer3",
		type: "text",
		placeholder: "Enter wrong answer",
		required: true,
		element: "input",
	},
]

function QuestionsArrComp(args) {
	const [formData, setFormData] = useState(questionObject)
	const {
		questions,
		totalNumberOfQuestions,
		isImageVisible,
		toggleImage,
		addQuestion,
		removeQuestion,
		// handleQuestionChange,
		totalFileUploadQuestions,
		setTotalFileUploadQuestions,
		setFileUploadQuestions,
		newFileUploadQuestions,
		// questionObject,
		setSchoolData,
		// formData,
		// setFormData,
		fileQuestionsHandle,
		showSubmitArray,
		setShowSubmitArray,
		type,
		text,
		// processedText,
		downloadLink,
		fileMargin,
		removeQuestionFromArray,
		setImageVisibility,
		generateUniqueId,
		setIsReload,
	} = args;

	const handleQuestionChange = (e) => {
		const { name, value } = e.target;
		// if (name === 'totalQs') {
		// 	setTotalNumberOfQuestions(!isNaN(Number(value))?Number(value):0)
		// 	setTotalFileUploadQuestions(Number(0))
		// 	setFormData(formValues)
		// 	if (!value) {
		// 		setShowSubmitArray(prev => {
		// 			const updated = [...prev];
		// 			updated[0] = false;
		// 			return updated;
		// 		});
		// 	} else if (value) {
		// 		setShowSubmitArray(prev => {
		// 			const updated = [...prev];
		// 			updated[0] = true;
		// 			return updated;
		// 		});
		// 	}
		// }
		// if (name === 'totalQs') {
		// 	setFormData((prev) => ({
		// 		...prev,
		// 		[name]: !isNaN(Number(value))?Number(value):0,
		// 	}))
		// }
		// else if (name === 'noOfTypes') {
		// 		setFormData((prev) => ({
		// 			...prev,
		// 			[name]: (!isNaN(Number(value))&&value!==''&&Number(value)>0&&Number(value)<=26)?Number(value):'',
		// 		}))
		// } else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}))
		// }
	};
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
	let questionArray = questions
	// const numberOfQuestions =
	// console.log('uploadedQuestions:', uploadedQuestions)
	let info, fileQuestions
	// if (processedText) {[info, ...fileQuestions] = processedText}
	// if (uploadedQuestions) {[info, ...fileQuestions] = uploadedQuestions}
	useEffect(() => {
		// const newQuestions = Array.from({ length: (uploadedQuestions?.length - 1) }, () => fileQuestions.map((q, index) => {
		const newQuestions = fileQuestions?.map((q, index) => {
			// console.log({q})
			const [question, correct_answer, wrong_answer1, wrong_answer2, wrong_answer3] = q.question.split('\n').filter(Boolean);
			return ({
				number: q.id,
				question: question.trim(),
				correct_answer: correct_answer.trim(),
				wrong_answer1: wrong_answer1.trim(),
				wrong_answer2: wrong_answer2.trim(),
				wrong_answer3: wrong_answer3.trim(),
				image: null,
				// previewImage: defaultImage,
				imageMode: 'side', // default to 'side'
				uniqueId: generateUniqueId(),
			})
		})
		if (newQuestions) {
			// console.log('newQuestions:', newQuestions)
			setEditFileQuestions(newQuestions);
		}
	}, [text]);
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
		setEditFileQuestions(newFileUploadQuestions??updatedQuestions);
		// setRerender(prev => !prev); // trigger re-render
	};
	const fileUpload = text?.length
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
	if (fileUpload && !showSubmitArray[1]) {
		setShowSubmitArray(prev => {
			const updated = [...prev];
			updated[1] = true;
			return updated;
		});
	}
	const removeUploadedImage = (index, questionID, e) => {
		console.log('removeUploadedImage called')
		const updatedQuestionsImages = [...editFileQuestions];
		console.log('updatedQuestionsImages:', updatedQuestionsImages)
		console.log(`updatedQuestionsImages.${[index]}.image:`, updatedQuestionsImages[index].image)
		console.log(`updatedQuestionsImages${[index]}.previewImage:`, updatedQuestionsImages[index].previewImage)
		updatedQuestionsImages[index].image = null;
		// updatedQuestionsImages[index].previewImage = defaultImage; // reset to default image
		console.log(`updatedQuestionsImages.${[index]}.image:`, updatedQuestionsImages[index].image)
		console.log(`updatedQuestionsImages${[index]}.previewImage:`, updatedQuestionsImages[index].previewImage)
		console.log('from removeUploadedImage in QuestionsArrComp:')
		setEditFileQuestions(updatedQuestionsImages);
		console.log(`question ${index + 1} image removed`);
		setImageVisibility(questionID)
		questionArray = updatedQuestionsImages
		// fileUpload?handleFileQuestionChange(index, e):handleQuestionChange(index, e)
	}
	// console.log('editFileQuestions (final):', editFileQuestions)
	// console.log('editFileQuestions:', editFileQuestions)
	// console.log('questionArray:', questionArray)
	// questionArray = [...questionArray, editFileQuestions]
	// useEffect(() => {
	// 	console.log('Reloading questions due to questionArray change:', questionArray)
	// 	setIsReload(prev => !prev)
	return (
		<div
		// style={isMobile?styles.verticalContainerMobile:fileUpload?styles.verticalContainerPCwFile:styles.verticalContainerPCwoFile}
		className="">
			{/* <div className=""> */}
				{/* className="" key={index}> */}
					<fieldset>
						{formQuestions.map((field, fIdx) => {
							return (
								<Fragment key={field.name+fIdx}>
									{field.element === "textarea" ?
									(<textarea
										className=""
										placeholder={field.placeholder}
										value={formData[field.name]}
										onChange={handleQuestionChange}
										required={field.required}
										// style={{background: !q.question?'#f3f3f3':null}}
										name={field.name} />)
										:
									(<input
										className=""
										name={field.name}
										type={field.type}
										placeholder={field.placeholder}
										value={formData[field.name]}
										onChange={handleQuestionChange}
										required={field.required} />)}
								</Fragment>
							)
						})}
						<div className="">
							{/* questions */}
							<textarea
							className=""
							placeholder={`Question ${'index' + 1}`}
							// value={q.question}
							onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
							required
							// style={{background: !q.question?'#f3f3f3':null}}
							name="question" />

							{/* correct answers */}
							<input
							className=""
							name="correct_answer" type="text"
							placeholder="Correct Answer"
							// value={q.correct_answer}
							onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
							required/>

							{/* wrong answer1 */}
							<input
							className=""
							name="wrong_answer1" type="text"
							placeholder="Wrong Answer"
							// value={q.wrong_answer1}
							onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
							required />

							{/* wrong answer2 */}
							<input
							className=""
							name="wrong_answer2" type="text"
							placeholder="Wrong Answer"
							// value={q.wrong_answer2}
							onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
							required />

							{/* wrong answer3 */}
							<input
							className=""
							name="wrong_answer3" type="text"
							placeholder="Wrong Answer"
							// value={q.wrong_answer3}
							onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
							required />

							{/* images and switch buttons */}
							<div>
								{/* {(showImagePreview||isImagePreviewNotDefault) ? ( */}
									<>
										<div>
											{/* image preview */}
											<img
												// src={fileUpload?editFileQuestions['index'].previewImage:questions['index'].previewImage}
												alt={`Preview ${'index' + 1}`}
												// style={{...styles.previewImage, ...(!isMobile?styles.previewImagePC:{})}}
											/>
										</div>
										<div
										// style={!isMobile?styles.imageUploadContainerPC:styles.imageUploadContainerMobile}
										>
											{/* image input */}
											<input
											className=""
											type="file" accept="image/*"
											name="image"
											onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
											/>
											<div
											style={{display: 'flex', gap: 3,
											// marginTop: isMobile?5:undefined
											}}>
												{/* image mode options */}
												<select
												className=""
												// value={q.imageMode}
												onChange={(e)=>fileUpload?handleFileQuestionChange('index', e):handleQuestionChange('index', e)}
												style={{
													// background: q.imageMode ? '#f3f3f3':null,
													// margin: isMobile?0:undefined
												}}
												name="imageMode">
													{imageScapeOption.map((option, i) => (
														<option key={i} value={option}>
															{
															// ConvertCase(
																option
																// )
																}
														</option>
													))}
												</select>
												{/* remove image button */}
												<button
												className=""
												type="button"
												onClick={() => {
													toggleImage('index', 'q.uniqueId', true);
													removeUploadedImage('index', 'q.uniqueId');
												}}
												>
													Remove Image
												</button>
											</div>
										</div>
									</>
								) : (
									{/* // add image button */}
									<button
									className=""
									type="button"
									onClick={() => toggleImage('index', 'q.uniqueId')}
									>
										Add Image
									</button>
								)
								{/* } */}
							</div>
							{/* remove question button */}
							<button
							style={{margin: '5px 0 50px 0'}}
							className=""
							type="button"
							onClick={() => {
								removeQuestion('index, q.uniqueId');
								removeQuestionFromArray('q.uniqueId');
							}}
							>
								Remove Question {'index' + 1}
							</button>
						</div>
					</fieldset>
				</div>
			// </div>
			// // {
			// 	(totalNumberOfQuestions||totalFileUploadQuestions) ?
			// <div className=""
			// style={!isMobile?(fileUpload?undefined:styles.addQuestionBtnPC):styles.addQuestionBtnMobile}
			// >
			// 	<button
			// 	className=""
			// 	type="button" onClick={addQuestion}>
			// 		Add New Question
			// 	</button>
			// </div>
		// 	// :null}
		// 	// {
		// 		downloadLink &&
		// 		<div className=""
		// 		// style={!isMobile?(fileUpload?undefined:styles.addQuestionBtnPC):styles.addQuestionBtnMobile}
		// 		>
		// 			<div className=""
		// 			style={{
		// 				display: 'flex',
		// 				alignItems: 'center',
		// 				gap: 3,
		// 			}}>
		// 				{/* <MoreInfo info="Download information ..." /> */}
		// 				<a
		// 				// href={`${serverOrigin}${downloadLink}`}
		// 				download
		// 				className=""
		// 				role="button"
		// 				>
		// 					Download File
		// 				</a>
		// 			</div>
		// 		</div>
		// 	// }
		// </div>
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
	addQuestionBtnPC: {
		margin: '10px 5% 0 5%',
	},
	addQuestionBtnMobile: {
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
