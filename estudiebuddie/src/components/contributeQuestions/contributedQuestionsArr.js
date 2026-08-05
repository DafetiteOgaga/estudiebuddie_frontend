import { Fragment, useEffect, useState, useRef } from 'react';
import { ImageCropAndCompress } from '../../hooks/imgCompressAndCrop/ImageCropAndCompress';
import { useDevice } from '../../contexts/deviceTypeContext';
import { ItemsToggler, customFindLast } from '../../hooks/formHooks';
import { DiagramButton, DiagramField, SymbolToolbar } from '../scrambleQuestions/diagramSetup';
// import { useConfirm } from '../../hooks/overlayContext';
import {
	Stage,
	Layer,
	Rect,
	Circle,
	Ellipse,
	Line,
	RegularPolygon,
	Star,
	// Ring,
	// Sector,
	Arrow,
	Text,
	// Arc,
	Group,
	Transformer,
	Shape,
} from "react-konva";

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
	const { label, width, isMobileDev768 } = useDevice();
	const [uploadedImg, setUploadedImg] = useState(null)
	// const { confirm } = useConfirm();
	const {
		confirm,
		addTheory,
		formData,
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
		diagramStageRefs,
		isExporting,
		setIsExporting,
	} = args;

	// Add a new question
	const addRemoveQuestion = ({id}={}) => {
		// console.log('in add remove question...')
		if (id) {
			// console.log('removing...', {id})
			setFormData(prev => {
				// console.log('updating form data...')
				const updatedQuestions = prev.questions.filter(question =>
													question?.uniqueId!==id)
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
												question?.uniqueId!==id)
				return selectedQuestion
			});
		} else {
			// console.log('adding...', {id})
			setFormData(prev => {
				// console.log('updating form data...')
				// const updatedQuestions = questionFormData
				// console.log({questionFormData})
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
				const newQuestionObject = {...questionObject, uniqueId, question_mode: ['text']}
				return [...prev, newQuestionObject]
			});
		}
	};

	useEffect(() => {
		// console.log({uploadedImg})
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
			// if (!uploadedImg?.compressedFile && uploadedImg?.imageId) {
			// 	setUploadedImg(null)
			// }
		// ]
	}, [uploadedImg])

	useEffect(() => {
		if (!questionFormData?.length) return
		setFormData(prev => ({
			...prev,
			questions: questionFormData,
			totalQs: String(questionFormData?.length)
		}));
	}, [questionFormData]);

	const within60Questions = (questionFormData?.length > 0 && questionFormData?.length < 60)

	// console.log({
	// 	questionFormData,
	// 	// formQuestions,
	// 	// // uploadedImg,
	// 	addTheory
	// })
	return (
		<div
		style={{paddingTop: '1rem'}}>
			{(formData?.totalQs&&addTheory)?<h3 className='mx-5 q-mx'>Objective Questions</h3>:null}
			<QuestionBlock
			diagramStageRefs={diagramStageRefs}
			questionFormData={questionFormData}
			handleQuestionChange={handleQuestionChange}
			setUploadedImg={setUploadedImg}
			setQuestionFormData={setQuestionFormData}
			generateUniqueId={generateUniqueId}
			within60Questions={within60Questions}
			addRemoveQuestion={addRemoveQuestion}
			label={label}
			width={width}
			isMobileDev768={isMobileDev768}
			confirm={confirm}
			isExporting={isExporting}
			setIsExporting={setIsExporting} />
			<button
			style={{margin: '0 5rem'}}
			type="button" onClick={addRemoveQuestion}
			className={`cta-button mb-xs q-mx ${within60Questions?'':'d-none'}`}>
				Add Another Question
			</button>
		</div>
	)
}

function QuestionBlock ({diagramStageRefs,
						questionFormData,
						handleQuestionChange,
						setUploadedImg,
						setQuestionFormData,
						generateUniqueId,
						within60Questions,
						addRemoveQuestion,
						label, width, isMobileDev768,
						confirm,
						isExporting,
						setIsExporting,}) {
	// console.log({
	// 	questionFormData
	// })
	const _768 = width <= 768
	const [consecutiveAmount, setConsecutiveAmount] = useState({})
	const textareaRefs = useRef({});
	const toggleMode = (qIdx, mode) => {
		// console.log({id: qIdx, mode})
		setQuestionFormData(prev => {
			const updated = [...prev];
			const modes = [...updated[qIdx].question_mode];

			if (modes.includes(mode)) {
				// remove mode
				// console.log('removing:', mode)
				updated[qIdx].question_mode = modes.filter(m => m !== mode);
				// remove question
				// console.log('removing', mode, 'question')
				const questionsArr = updated[qIdx].question
				updated[qIdx].question = questionsArr.filter(q=>{
					if (q.type===mode || q.type==='diagram_png') {
						return false
					}
					return true
				})
			} else {
				// add mode
				// console.log('adding:', mode)
				updated[qIdx].question_mode = [...modes, mode];
			}

			// console.log({updated})
			return updated;
		});
	};
	const getLockedQuestions = () => {
		const locked = {};
		Object.entries(consecutiveAmount).forEach(
			([startIdx, amount]) => {
				const start = Number(startIdx);
				for (
					let i = 1;
					i <= amount;
					i++
				) {
					locked[start + i] = start;
				}
			}
		);
		return locked;
	};
	const lockedQuestions = getLockedQuestions();
	const handleConsecutive = (qIdx, value='', totalSubQuetions) => {
		// console.log({value, consecutiveAmount})
		if (value===null||value===undefined) {
			// console.log('returned empty')
			return ''
		}
		if (lockedQuestions[qIdx] !== undefined) {
			return;
		}
		const currentAmount = consecutiveAmount[qIdx] || 0;
		// console.log({currentAmount})
		// console.log('g'.repeat(10))
		setConsecutiveAmount(prev => {
			let updatedAmount = currentAmount;
	
			// console.log('h'.repeat(10), {cons: value === 'consecutive'})
			if (value === "consecutive:" && currentAmount <= 0) {
				// console.log("consecutive clicked")
				updatedAmount = currentAmount + 1;
			}
			else if (value === '+') {
				// console.log("+ clicked")
				updatedAmount = currentAmount + 1;
			}
			else if (value === '─') {
				// console.log("─ clicked")
				updatedAmount = Math.max(0, currentAmount - 1);
			}
			// console.log('i'.repeat(10))
			updatedAmount = Math.min(
				updatedAmount,
				totalSubQuetions
			);
			// console.log({updatedAmount})
			setQuestionFormData(prev => {
				const updated = [...prev];
				if (updatedAmount > 0) {
					updated[qIdx] = {
						...updated[qIdx],
						q_consecutive: updatedAmount
					};
				} else {
					const { q_consecutive, ...questionWithoutConsecutive } =
						updated[qIdx];
					updated[qIdx] = questionWithoutConsecutive;
				}
				return updated;
			});
			return {
				...prev,
				[qIdx]: updatedAmount
			};
		});
	}
	const totalQuestions = questionFormData.length

	// console.log("xxx".repeat(5), {
	// 	questionFormData,
	// 	consecutiveAmount,
	// 	totalQuestions,
	// })
	return (
		<>
			{questionFormData?.map((questionData, qIdx) => {
				const isImage = !!questionData?.image
				const isLocked = lockedQuestions[qIdx] !== undefined;
				// console.log({
				// 	questionData,
				// 	isLocked,
				// })

				const isDiagramSelected = questionData?.question_mode.includes('diagram')
				const isDiagramActive = !!isDiagramSelected
				const questionIndex = questionFormData.findIndex(q=>q.uniqueId===questionData.uniqueId)
				return (
					<fieldset key={questionData?.uniqueId}
					className="form-group mb-05 q-mx pt-1">
						{/* textarea separately */}
						{formQuestions.map((field, fIdx) => {
							// console.log({name: field.name})
							const currentAmount = consecutiveAmount[qIdx] || 0;
							const totalSubQuetions = questionFormData.slice(questionIndex).length - 1
							// console.log({totalSubQuetions})
							const consecutive = [
								"consecutive:",
								`${currentAmount}`,
								"─",
								"+",
								// "─",
							];
							if (field.element !== "textarea") return null;
							return (
								<Fragment key={fIdx}>
									{/* math, science, other tabs */}
									<SymbolToolbar textareaRef={{ current: textareaRefs.current[qIdx] }} />

									{/* consecutives setter */}
									{!isLocked &&
									<div>
										<ItemsToggler
										togglerArray={consecutive}
										toggleStyle={_768?'d-flex':null}
										// isMobileDev768={isMobileDev768}
										isConsecutive={!currentAmount}
										btnItem={currentAmount} stateSetter={(value)=>handleConsecutive(qIdx, value, totalSubQuetions)} />
									</div>}

									{/* consecutive instructions setter */}
									{!isLocked && currentAmount ?
										<div className='floating-field'
										key={`q_instruction-${qIdx + 1}`}
										style={{
											// width: label === "mobile"?"100%":"49%", // 2 per row roughly (45% + gap ≈ 100%)
											marginBottom: '2px',
										}}>
											<input
												name={`q_instruction`}
												type={field.type}
												placeholder=" "
												value={questionData?.q_instruction||''}
												// value={
												// 	questionData.question.findLast(block => block.type === "math")?.value || ""
												// }
												onChange={(e)=>handleQuestionChange(e, null, qIdx)}
												required={field.required}
											/>
											<label>{`Instructions for questions ${qIdx + 1} to ${qIdx + currentAmount + 1}`}</label>
										</div>
									:null}

									<div className='floating-field'
									key={field.name+fIdx}>
										<textarea
											ref={(el) => (textareaRefs.current[qIdx] = el)}
											placeholder=" "
											// value={questionData[field.name]}
											// value={
											// 	questionData.question.findLast(block => block.type === "text")?.value || ""
											// }
											value={
												customFindLast(
													questionData?.question,
													block => block.type === "text"
												)?.value || ""
											}
											onChange={(e)=>handleQuestionChange(e, null, qIdx)}
											required={field.required}
											rows={(questionData?.question_mode.includes('diagram'))?1:4}
											style={{
												height: "auto",
												width: field.width,
											}}
											// name={field.name}
											name="question_text"
										/>
										<label
										className='left-textarea'
										// style={questionData.question_mode==='text'?{}:compStyles.label}
										>{`${field.placeholder} ${qIdx + 1}`}</label>
									</div>
								</Fragment>
							);
						})}

						{/* diagram input */}
						{questionData?.question_mode.includes('diagram') &&
							formQuestions.map((field, fIdx) => {
								// console.log({field})
								if (field.element !== "textarea") return null; // or skip if not textarea
								// console.log({field})
								const diagramValue = customFindLast(
								questionData?.question,
								b => b.type === "diagram"
								)?.value || { diagramShapes: [] };
								// console.log({diagramValue})

								return (
									<div key={`diagram-${qIdx}-${fIdx}`} style={{ margin: '0.3rem 0' }}>
										<DiagramField
										value={diagramValue}
										onChange={(updatedDiagram) =>
											handleQuestionChange(
											true,
											{ name: 'question_diagram', value: updatedDiagram },
											qIdx
											)
										}
										// getStageRef={(stage) => (diagramStageRefs.current[qIdx] = stage)}
										getStageRef={(stage) => (diagramStageRefs.current[questionData.uniqueId] = stage)}
										isMobileDev768={isMobileDev768}
										width={width}
										qIdx={qIdx}
										setQuestionFormData={setQuestionFormData}
										isExporting={isExporting}
										setIsExporting={setIsExporting}
										/>
									</div>
								);
							})
						}

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
										width: label === "mobile"?"100%":"49%", // 2 per row roughly (45% + gap ≈ 100%)
										margin: '2px',
									}}>
										<input
											name={field.name}
											type={field.type}
											placeholder=" "
											value={questionData?.[field.name]}
											onChange={(e)=>handleQuestionChange(e, null, qIdx)}
											required={field.required}
										/>
										<label className='left-45-mobile'>{`${field.placeholder} for question ${qIdx + 1}`}</label>
									</div>
								);
							})}
						</div>

						<div className=''>
							<div className='d-inflex gap-p15'>
								<div>
									{/* upload/change images */}
									<ImageCropAndCompress
									onComplete={setUploadedImg}
									imageId={qIdx}
									btnStyle='rm-fuc'
									imgType="question"
									// disableBtn={isDiagramActive}
									disableBtn={true} />
								</div>

								<div className='d-flex'>
									{width > 768 ?
									<DiagramButton
									toggleMode={toggleMode}
									within60Questions={within60Questions}
									isDiagramActive={isDiagramActive}
									isImage={isImage}
									isMobileDev768={isMobileDev768}
									qIdx={qIdx}/> :null}

									<button
									type="button"
									onClick={()=> {
										// console.log('start duplicating')
										setQuestionFormData(prev => {
											// find index of the original question
											const index = prev.findIndex(
												question => question?.uniqueId === questionData?.uniqueId
											);
											// console.log({index})
											if (index === -1) return prev;
											// duplicate the question with a new id
											const duplicateQuestion = {
												...prev[index],
												uniqueId: generateUniqueId(),
												number: String(prev.length + 1)
											};
											// console.log({duplicateQuestion})
											// insert duplicate right after original
											const updated = [...prev];
											updated.splice(index + 1, 0, duplicateQuestion);
											// console.log({updated})
											return updated;
											// return prev
										});
										// console.log('end duplicating')
									}}
									className={`cta-button question ${within60Questions?'':'d-none'}`}>
										Duplicate
									</button>

									<button
									type="button"
									onClick={()=> {
										confirm({
											title: `Delete question ${qIdx + 1}?`,
											// message: "This action cannot be undone.",
											buttonText: "Yes, delete",
											onConfirm: () => {
												addRemoveQuestion({id:questionData?.uniqueId})
											}})
									}}
									className="cta-button question bg-red-warn">
										Remove {width > 768 ? 'Question':''}
									</button>
								</div>
								</div>
									{width <= 768 ?
										<div className='d-flex'>
											<DiagramButton
											toggleMode={toggleMode}
											within60Questions={within60Questions}
											isDiagramActive={isDiagramActive}
											isImage={isImage}
											qIdx={qIdx}
											isMobileDev768={isMobileDev768}/>
										</div> :null}
								</div>
					</fieldset>
				)
			})}
		</>
	)
}

export { QuestionsArrComp };
