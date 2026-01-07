import { Fragment, useEffect, useState, useRef } from 'react';
import { ImageCropAndCompress } from '../../hooks/imgCompressAndCrop/ImageCropAndCompress';

const formQuestions = [
	{
		name: "question",
		type: "text",
		placeholder: "Enter question",
		required: true,
		element: "textarea",
		width: "100%",
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
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
	} = args;

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
										placeholder=" "
										value={questionData[field.name]}
										onChange={(e)=>handleQuestionChange(e, null, qIdx)}
										required={field.required}
										rows={4}
										style={{
											height: "auto",
											width: field.width,
											// marginTop: "2rem", // space from inputs above
										}}
										name={field.name}
									/>
									<label className='textarea'>{`${field.placeholder} ${qIdx + 1}`}</label>
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
							<div>
								{/* upload/change images */}
								<ImageCropAndCompress
								onComplete={setUploadedImg}
								imageId={qIdx}
								imgType="question" />

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
export { QuestionsArrComp };
