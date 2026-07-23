import { Fragment, useEffect, useState, useRef } from 'react';
import { ImageCropAndCompress } from '../../hooks/imgCompressAndCrop/ImageCropAndCompress';
import { useDevice } from '../../contexts/deviceTypeContext';
import { customFindLast } from './scrambleQuestions';
import { ItemsToggler } from './scrambleQuestions';
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

const SYMBOL_GROUPS = {
	math: [
		{ syms: ['²', '³', '⁴', '⁵', '⁻¹', '⁻²', '√', '∛', '∜'], label: 'powers & roots' },
		{ syms: ['½', '¼', '¾', '⅓', '⅔', '⅛', '⅜', '⅝', '⅞'], label: 'fractions' },
		{ syms: ['π', '∞', '°', 'e', 'φ'], label: 'constants' },
		{ syms: ['≠', '≤', '≥', '≈', '≡', '∝', '∴', '∵', '<', '>'], label: 'relations' },
		{ syms: ['×', '÷', '±', '∓', '·'], label: 'operators' },
		{ syms: ['∑', '∫', '∬', '∂', '∇', 'Δ', 'δ', 'ε', 'λ'], label: 'calculus' },
		{ syms: ['θ', 'α', 'β', 'γ', 'ω', 'σ', 'μ', 'ρ', 'η'], label: 'greek' },
		{ syms: ['∈', '∉', '∩', '∪', '⊂', '⊃', '⊆', '⊇', '∅', '∀', '∃'], label: 'sets' },
		{ syms: ['|', '‖', '⊥', '∠', '△', '□', '○', '≅', '∼'], label: 'geometry' },
		{ syms: ['ℝ', 'ℤ', 'ℕ', 'ℚ', 'ℂ', 'ℵ'], label: 'number sets' },
		{ syms: ['(', ')', '[', ']', '{', '}', '⌊', '⌋', '⌈', '⌉'], label: 'brackets' },
		{ syms: ['→', '←', '↔', '⇒', '⇐', '⇔'], label: 'logic arrows' },
	],

	science: [
		{ syms: ['→', '⇌', '↑', '↓', '⇄'], label: 'reactions' },
		{ syms: ['°C', '°F', 'K', 'Å', 'mol', 'atm', 'Pa', 'Hz', 'Ω'], label: 'units' },
		{ syms: ['α', 'β', 'γ', 'λ', 'μ', 'ν', 'σ', 'ρ', 'ω', 'τ', 'φ', 'ψ'], label: 'greek' },
		{ syms: ['²', '³', '⁻¹', '⁻²', '⁻³', '½', '¼'], label: 'powers' },
		{ syms: ['∆', '∑', '∂', '√', '≈', '≠', '≤', '≥', '×', '÷', '±'], label: 'math ops' },
		{ syms: ['⁺', '⁻', '⁰', '⁴', '⁵', '⁶', '⁷', '⁸'], label: 'superscripts' },
		{ syms: ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₀'], label: 'subscripts' },
		{ syms: ['∞', 'π', '°', '·', '×10'], label: 'constants' },
	],

	shapes: [
		{ syms: ['△', '▲', '▽', '▼', '◁', '▷', '◀', '▶'], label: 'triangles & arrows' },
		{ syms: ['□', '■', '▪', '▫', '▬', '▭', '▮', '▯'], label: 'rectangles' },
		{ syms: ['○', '●', '◉', '◎', '◯', '⬤', '◐', '◑', '◒', '◓'], label: 'circles' },
		{ syms: ['◇', '◆', '◈', '⬧', '⬨', '⬦'], label: 'diamonds' },
		{ syms: ['⬠', '⬡', '⬢', '⬣', '⎔'], label: 'hexagons & polygons' },
		{ syms: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮'], label: 'stars' },
		{ syms: ['∠', '⊾', '⊿', '∟', '⊥', '‖', '∥', '∦'], label: 'angles & lines' },
		{ syms: ['↔', '↕', '⟷', '⟵', '⟶', '⟸', '⟹', '⤡', '⤢'], label: 'line arrows' },
		{ syms: ['⌒', '⌓', '⌀', '⌁', '⌂'], label: 'arc & misc' },
	],

	geography: [
		{ syms: ['°', '′', '″', 'N', 'S', 'E', 'W'], label: 'coordinates' },
		{ syms: ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖', '↔', '↕'], label: 'directions' },
		{ syms: ['≈', '±', '×', '÷', 'km²', 'm²', 'mm'], label: 'measurement' },
		{ syms: ['△', '▲', '▽', '▼', '●', '○', '■', '□', '◆', '◇'], label: 'map symbols' },
		{ syms: ['%', '‰', '∑', '≤', '≥', '≠'], label: 'stats' },
	],

	english: [
		{ syms: ['"', '"', "'", "'", '«', '»'], label: 'quotes' },
		{ syms: ['…', '—', '–', '·', '•', '‐'], label: 'punctuation' },
		{ syms: ['à', 'á', 'â', 'ä', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï'], label: 'accents a–i' },
		{ syms: ['ò', 'ó', 'ô', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'ñ', 'ç'], label: 'accents o–z' },
		{ syms: ['©', '®', '™', '§', '¶', '†', '‡'], label: 'misc' },
	],

	economics: [
		{ syms: ['₦', '$', '€', '£', '¥', '¢', '₵', '₹', '₿'], label: 'currency' },
		{ syms: ['%', '‰', '∑', '∆', '≈', '≠', '≤', '≥', '±'], label: 'math ops' },
		{ syms: ['→', '↑', '↓', '↔'], label: 'trends' },
		{ syms: ['½', '¼', '¾', '²', '³', '⁻¹'], label: 'powers & fracs' },
		{ syms: ['∞', '∝', '∴', '∵'], label: 'relations' },
	],

	music: [
		{ syms: ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢'], label: 'notes & clefs' },
		{ syms: ['𝄐', '𝄑', '𝄏', '𝄎', '𝄒', '𝄓'], label: 'rests & repeat' },
		{ syms: ['p', 'f', 'mf', 'mp', 'ff', 'pp', 'sf'], label: 'dynamics' },
		{ syms: ['°', '×', '÷', '+', '−', '='], label: 'math' },
	],

	arts: [
		{ syms: ['°', '×', '÷', '±', '≈', '%'], label: 'math' },
		{ syms: ['→', '←', '↑', '↓', '↔', '↕', '↗', '↘'], label: 'arrows' },
		{ syms: ['△', '□', '○', '◇', '★', '●', '■', '▲', '◆'], label: 'shapes' },
		{ syms: ['α', 'β', 'γ', 'θ', 'φ', 'π'], label: 'greek' },
		{ syms: ['©', '®', '™', '§'], label: 'misc' },
	],

	computer: [
		{ syms: ['&', '|', '!', '~', '^', '<<', '>>'], label: 'bitwise/logic' },
		{ syms: ['→', '←', '⇒', '⇔', '∧', '∨', '¬', '⊕', '⊗'], label: 'logic' },
		{ syms: ['∈', '∉', '∩', '∪', '⊂', '⊃', '∅'], label: 'sets' },
		{ syms: ['²', '³', '⁻¹', '√', 'log', 'ln'], label: 'math' },
		{ syms: ['≠', '≤', '≥', '≡', '≈', '∞'], label: 'relations' },
		{ syms: ['α', 'β', 'γ', 'δ', 'ε', 'λ', 'μ', 'σ', 'τ', 'ω'], label: 'greek' },
		{ syms: ['%', '#', '@', '*', '/', '\\', '_'], label: 'special chars' },
	],

	other: [
		{ syms: ['✓', '✗', '✘', '●', '○', '■', '□', '▶', '◀'], label: 'marks' },
		{ syms: ['→', '←', '↑', '↓', '↔', '⇒', '⇐'], label: 'arrows' },
		{ syms: ['§', '¶', '†', '‡', '•', '·', '※', '★', '☆'], label: 'misc' },
		{ syms: ['(', ')', '[', ']', '{', '}', '/', '\\', '|'], label: 'brackets' },
	],
};

function SymbolToolbar({ textareaRef }) {
	const [activeTab, setActiveTab] = useState('');
	const [openGroup, setOpenGroup] = useState(null);
	const { label, width, isMobileDev768 } = useDevice();
	const _gt1200 = width > 1200
	const _1200 = width <= 1200
	const _1024 = width <= 1024
	const _800 = width <= 800
	const _600 = width <= 600
	const _530 = width <= 530
	const _450 = width <= 450
	const _430 = width <= 430
	const _360 = width <= 360
	let rowItems = _360?3:
					_450?4:
					_530?5:
					_600?6:
					_800?8:
					_1024?9:
					_1200?10:
					SYMBOL_GROUPS[activeTab]?.length||1;
	// console.log('items-'.repeat(8), rowItems)
	
	let rows = [];
	if (SYMBOL_GROUPS[activeTab]) {
		for (let i = 0; i < SYMBOL_GROUPS[activeTab].length; i += rowItems) {
			rows.push(SYMBOL_GROUPS[activeTab].slice(i, i + rowItems));
		}
	}
	// console.log('activeRows:', rows)
	// const _1200 = width <= 1200

	// reset openGroup when tab changes
	const handleTabClick = (tab) => {
		setActiveTab(prev => {
			const next = prev === tab || tab === 'close' ? '' : tab;
			setOpenGroup(null);
			return next;
		});
	};

	const insertSymbol = (sym) => {
		const ta = textareaRef.current;
		if (!ta) return;
		const start = ta.selectionStart;
		const end = ta.selectionEnd;
		const newVal = ta.value.slice(0, start) + sym + ta.value.slice(end);
		// trigger React's onChange
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
		nativeInputValueSetter.call(ta, newVal);
		ta.dispatchEvent(new Event('input', { bubbles: true }));
		// restore cursor
		requestAnimationFrame(() => {
			ta.focus();
			ta.selectionStart = ta.selectionEnd = start + sym.length;
		});
	};
	const charTabs = [
		'math',
		'science',
		'shapes',
		'geography',
		'english',
		'economics',
		'music',
		'arts',
		'computer',
		'other',
		'close',
	]
	const charTabRows = [];
	rowItems = _360?4:
				_450?5:
				_530?6:
				_800?8:
				// _1024?9:
				// _1200?10:
				charTabs?.length;

	for (let i = 0; i < charTabs.length; i += rowItems) {
		charTabRows.push(charTabs.slice(i, i + rowItems));
	}

	return (
		<div className='mb-0'>
			{/* tab row */}
			<div className={`${_800?'':'d-flex'} gap-0 mb-3px`}>
			{charTabRows.map((row, rowIdx) => (
				<div
					key={rowIdx}
					className="d-flex mb-3px"
					// style={{ gap: "0px" }}
				>
					{row.map((tab, colIdx) => {
						const isFirst = colIdx === 0;
						const isLast = colIdx === row.length - 1;

						return (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab === "close" ? "" : tab)}
								disabled={tab === "close" && activeTab === ""}
								className={`cta-button btn-sm fit radius-5
									${activeTab === tab ? "active" : ""}
									${
										_800
											? isFirst
												? isLast
													? "grid-first-last-line"
													: "grid-first"
												: isLast
												? rowIdx === charTabRows.length - 1
													? "last"
													: "grid-last"
												: "middle"
											: isFirst
											? "first"
											: isLast
											? "last"
											: "middle"
									}
									${tab === "close" ? "bg-red-warn" : ""}`}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						);
					})}
				</div>
			))}
			</div>
			{/* group accordion */}
			{activeTab && (
				<div className='border-none pb-2px'
				// style={{
				// 	display: "grid",
				// 	gridTemplateColumns: "repeat(10, max-content)",
				// }}
				>
				{rows.map((row, rowIdx) => (
					<div
						key={rowIdx}
						className="d-flex flex-wrap-no-wrap mb-3px"
						// style={{ gap: "2px" }}
					>
						{row.map((group, colIdx) => {
							const isFirst = colIdx === 0;
							const isLast = colIdx === row.length - 1;

							return (
								<div key={group.label} className="d-in-grid">
									<button
										type="button"
										onClick={() =>
											setOpenGroup(prev =>
												prev === group.label ? null : group.label
											)
										}
										className={`cta-button btn-sm fit grp px-5px radius-5
											${openGroup === group.label ? "active" : ""}
											${
												isFirst
													? isLast
														? "grid-first-last-line"
														: "grid-first"
													: isLast
													? "grid-last"
													: "middle"
											}`}
									>
										{group.label}
										{openGroup === group.label ? "▲" : "▼"}
									</button>
								</div>
							);
						})}
					</div>
				))}
				</div>
			)}
			{/* symbols row — renders below all group pills when a group is open */}
			{activeTab && openGroup && (() => {
				const syms = SYMBOL_GROUPS[activeTab].find(g => g.label === openGroup)?.syms || [];
				return (
					<div className='d-flex flex-wrap pb-5px'>
						{syms.map((sym, sIdx) => (
							<button
								key={sym}
								type="button"
								onClick={() => insertSymbol(sym)}
								className={`cta-button btn-sm fit px-5px math-tab-symbols
											${sIdx === 0 ? 'first' : sIdx === syms.length - 1 ? 'last' : 'middle'}`}
							>
								{sym}
							</button>
						))}
					</div>
				);
			})()}
		</div>
	);
}

const GRID_SIZE = 10;
function DiagramField({ value, onChange, getStageRef, isMobileDev768, width, qIdx, setQuestionFormData,
						isExporting, setIsExporting, }) {
    const [diagramShapes, setDiagramShapes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [tool, setTool] = useState("");
    const [editingText, setEditingText] = useState(null); // { id, x, y, width, text }
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeColor, setStrokeColor] = useState("#ffffff");
    const [fillColor, setFillColor] = useState("transparent");
    const hydratedRef = useRef(false);
    const shapeRefs = useRef({});
    const trRef = useRef();
    const stageRef = useRef();
    const freehandIdRef = useRef(null);
	// const [isExporting, setIsExporting] = useState(false);
	// const popUpTextareaRef = useRef(null);

    const snap = (v) => Math.round(v / GRID_SIZE) * GRID_SIZE;

	// useEffect(() => {
	// 	if (editingText && popUpTextareaRef.current) {
	// 		popUpTextareaRef.current.focus({ preventScroll: true });
	// 	}
	// }, [editingText]);
    useEffect(() => {
        if (getStageRef && stageRef.current) getStageRef(stageRef.current);
    }, [getStageRef]);

    useEffect(() => {
        if (!value || hydratedRef.current) return;
        setDiagramShapes(value.diagramShapes || []);
        setGroups(value.groups || []);
        hydratedRef.current = true;
    }, [value]);

    useEffect(() => {
        if (!hydratedRef.current) return;
        if (onChange) onChange({ diagramShapes, groups });
    }, [diagramShapes, groups]);

    // Attach transformer
    useEffect(() => {
        if (!trRef.current) return;
        const ids = selectedId ? [selectedId] : selectedIds;
        const nodes = ids.map(id => shapeRefs.current[id]).filter(Boolean);
        trRef.current.nodes(nodes);
        trRef.current.getLayer()?.batchDraw();
    }, [selectedId, selectedIds]);

    // Delete key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== "Delete") return;
            if (selectedId) {
                setDiagramShapes(prev => prev.filter(s => s.id !== selectedId));
                setGroups(prev => prev.filter(g => g.id !== selectedId));
                setSelectedId(null);
            }
            if (selectedIds.length) {
                setDiagramShapes(prev => prev.filter(s => !selectedIds.includes(s.id)));
                setGroups(prev => prev.filter(g => !selectedIds.includes(g.id)));
                setSelectedIds([]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, selectedIds]);

    const updateShape = (id, attrs) => {
        setDiagramShapes(prev => prev.map(s => s.id === id ? { ...s, ...attrs } : s));
    };

    const addShape = (pointer) => {
        const id = crypto.randomUUID();
        let newShape;
        switch (tool) {
            case "rect":
                newShape = { id, type: "rect", x: pointer.x, y: pointer.y, width: 120, height: 80 };
                break;
            case "circle":
                newShape = { id, type: "circle", x: pointer.x, y: pointer.y, radius: 50 };
                break;
            case "triangle":
                newShape = { id, type: "triangle", x: pointer.x, y: pointer.y, size: 100 };
                break;
            case "ellipse":
                newShape = { id, type: "ellipse", x: pointer.x, y: pointer.y, radiusX: 80, radiusY: 50 };
                break;
            case "star":
                newShape = { id, type: "star", x: pointer.x, y: pointer.y, numPoints: 5, innerRadius: 20, outerRadius: 50 };
                break;
            case "pentagon":
                newShape = { id, type: "polygon", x: pointer.x, y: pointer.y, sides: 5, radius: 60 };
                break;
            case "hexagon":
                newShape = { id, type: "polygon", x: pointer.x, y: pointer.y, sides: 6, radius: 60 };
                break;
            case "heptagon":
                newShape = { id, type: "polygon", x: pointer.x, y: pointer.y, sides: 7, radius: 60 };
                break;
            case "octagon":
                newShape = { id, type: "polygon", x: pointer.x, y: pointer.y, sides: 8, radius: 60 };
                break;
            case "line":
                newShape = { id, type: "line", x: pointer.x, y: pointer.y, points: [0, 0, 120, 0] };
                break;
            case "text":
                newShape = { id, type: "text", x: pointer.x, y: pointer.y, text: "Text", fontSize: 16 };
                break;
            case "arrow":
                newShape = { id, type: "arrow", x: pointer.x, y: pointer.y, points: [0, 0, 100, 0] };
                break;
            default:
                return;
        }
        setDiagramShapes(prev => [...prev, newShape]);
        setTool("");
    };

    // FIX: handleTransformEnd now saves width/height/radius for all shape types
    const handleTransformEnd = (shape) => {
        const node = shapeRefs.current[shape.id];
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        switch (shape.type) {
            case "rect":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    width: Math.max(5, shape.width * scaleX),
                    height: Math.max(5, shape.height * scaleY),
                });
                break;
            case "ellipse":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    radiusX: Math.max(5, shape.radiusX * scaleX),
                    radiusY: Math.max(5, shape.radiusY * scaleY),
                });
                break;
            case "circle":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    radius: Math.max(5, shape.radius * scaleX),
                });
                break;
            case "triangle":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    size: Math.max(5, shape.size * scaleX),
                });
                break;
            case "polygon":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    radius: Math.max(5, shape.radius * scaleX),
                });
                break;
            case "star":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    innerRadius: Math.max(5, shape.innerRadius * scaleX),
                    outerRadius: Math.max(5, shape.outerRadius * scaleX),
                });
                break;
            case "line":
            case "arrow":
                updateShape(shape.id, {
                    points: shape.points.map((p, i) => i % 2 === 0 ? p * scaleX : p * scaleY),
                    x: node.x(), y: node.y(),
                });
                break;
            case "text":
                updateShape(shape.id, {
                    x: snap(node.x()), y: snap(node.y()),
                    fontSize: Math.max(5, shape.fontSize * scaleX),
                });
                break;
            default:
                break;
        }
    };

    // Text inline editing
    const startEditingText = (shape) => {
		// console.log("before", window.scrollY);
        const node = shapeRefs.current[shape.id];
        if (!node) return;
        const stageBox = stageRef.current.container().getBoundingClientRect();
        const absPos = node.getAbsolutePosition();
        setEditingText({
            id: shape.id,
            x: stageBox.left + absPos.x + window.scrollX,
            y: stageBox.top + absPos.y + window.scrollY,
            fontSize: shape.fontSize,
            text: shape.text,
        });
        // hide the konva text while editing
        node.visible(false);
        trRef.current?.nodes([]);
		// requestAnimationFrame(() => {
		// 	console.log("after", window.scrollY);
		// });
    };

    const commitTextEdit = (id, newText) => {
        updateShape(id, { text: newText });
        const node = shapeRefs.current[id];
        if (node) node.visible(true);
        setEditingText(null);
        setSelectedId(id);
    };

    // Freehand drawing handlers
    const handleMouseDown = (e) => {
        if (tool === "freehand") {
            setIsDrawing(true);
            const pos = e.target.getStage().getPointerPosition();
            const id = crypto.randomUUID();
            freehandIdRef.current = id;
            setDiagramShapes(prev => [...prev, {
                id, type: "freehand",
                points: [pos.x, pos.y],
                stroke: strokeColor,
            }]);
            return;
        }
        // only add shape when clicking empty stage background
        if (e.target === stageRef.current) {
            setSelectedId(null);
            setSelectedIds([]);
            if (tool && tool !== "freehand") {
                const pointer = e.target.getStage().getPointerPosition();
                addShape(pointer);
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || tool !== "freehand") return;
        const pos = e.target.getStage().getPointerPosition();
        const id = freehandIdRef.current;
        setDiagramShapes(prev => prev.map(s =>
            s.id === id ? { ...s, points: [...s.points, pos.x, pos.y] } : s
        ));
    };

    const handleMouseUp = () => {
        if (tool === "freehand") {
            setIsDrawing(false);
            freehandIdRef.current = null;
            setTool("");
        }
    };

    const handleGroup = () => {
        if (selectedIds.length < 2) return;
        const id = crypto.randomUUID();
        const groupShapes = diagramShapes.filter(s => selectedIds.includes(s.id));
        setGroups(prev => [...prev, { id, shapes: groupShapes }]);
        setDiagramShapes(prev => prev.filter(s => !selectedIds.includes(s.id)));
        setSelectedIds([id]);
    };

    const handleUngroup = () => {
        if (selectedIds.length !== 1) return;
        const group = groups.find(g => g.id === selectedIds[0]);
        if (!group) return;
        setDiagramShapes(prev => [...prev, ...group.shapes]);
        setGroups(prev => prev.filter(g => g.id !== group.id));
        setSelectedIds([]);
    };

    const shapeBtns = [
        "rect", "circle", "triangle", "ellipse",
		// "star",
        "pentagon", "hexagon", "heptagon", "octagon",
		// "ring", "arc",
        "line", "arrow", "text", "freehand",
    ];

    const commonProps = (shape) => ({
        ref: (node) => (shapeRefs.current[shape.id] = node),
        x: shape.x,
        y: shape.y,
        draggable: tool === "",
        onClick: (e) => {
            if (tool) return; // don't select while placing a shape
            if (e.evt.shiftKey) {
                setSelectedIds(prev =>
                    prev.includes(shape.id) ? prev.filter(i => i !== shape.id) : [...prev, shape.id]
                );
                setSelectedId(null);
            } else {
                setSelectedId(shape.id);
                setSelectedIds([]);
            }
        },
        onDragEnd: (e) => updateShape(shape.id, { x: snap(e.target.x()), y: snap(e.target.y()) }),
        onTransformEnd: () => handleTransformEnd(shape),
    });

	// export to png handler
	// const handleExportDiagram = () => {
	// 	if (!stageRef.current) return;
	
	// 	setIsExporting(true);
	
	// 	requestAnimationFrame(() => {
	// 		const uri = stageRef.current.toDataURL({
	// 			mimeType: "image/png",
	// 			pixelRatio: 2,
	// 		});
	
	// 		const link = document.createElement("a");
	// 		link.download = "diagram.png";
	// 		link.href = uri;
	// 		link.click();
	
	// 		setIsExporting(false);
	// 	});
	// };
	// const handleExportDiagram = async (qIdx) => {
	// 	setIsExporting(true);
	
	// 	requestAnimationFrame(async () => {
	// 		stageRef.current.toBlob({
	// 			mimeType: "image/png",
	// 			callback: async (blob) => {
	// 				const formData = new FormData();
	
	// 				formData.append(
	// 					"diagram",
	// 					blob,
	// 					`diagram-${Date.now()}.png`
	// 				);
	
	// 				setQuestionFormData(prev => {
	// 					const updated = [...prev];
	// 					if (updatedAmount > 0) {
	// 						updated[qIdx] = {
	// 							...updated[qIdx],
	// 							diagramImage: updatedAmount
	// 						};
	// 					} else {
	// 						const { diagramImage, ...questionWithoutConsecutive } =
	// 							updated[qIdx];
	// 						updated[qIdx] = questionWithoutConsecutive;
	// 					}
	// 					return updated;
	// 				});
					
	// 				await fetch("/api/upload-diagram/", {
	// 					method: "POST",
	// 					body: formData,
	// 				});
	
	// 				setIsExporting(false);
	// 			},
	// 		});
	// 	});
	// };

    // const shapeStroke = strokeColor;
	const shapeStroke = isExporting
		? "#000000"
		: strokeColor;

    return (
        <div>
            {/* toolbar */}
            <div className='d-flex align-items-center flex-wrap mb-3px'>
                {shapeBtns.map((t, tIdx) => (
                    <button key={t} type="button"
                        onClick={() => setTool(prev => prev === t ? "" : t)}
                        className={`cta-button btn-sm fit px-5px ${t === tool ? 'active' : ''}
						${tIdx===0?'first':'middle'}`}>
                        {t}
                    </button>
                ))}
                <button type="button" onClick={handleGroup} className="cta-button btn-sm fit middle">Group</button>
                <button type="button" onClick={handleUngroup} className="cta-button btn-sm fit middle">Ungroup</button>
				{/* export diagram button */}
				{/* <button
					type="button"
					onClick={handleExportDiagram}
					disabled={!diagramShapes.length}
					className="cta-button btn-sm fit middle"
				>
					Export
				</button> */}
                <button type="button" onClick={() => { setDiagramShapes([]); setGroups([]); setSelectedId(null); setSelectedIds([]); }}
					disabled={!diagramShapes.length}
                    className="cta-button btn-sm fit bg-red-warn last mr-05">X</button>

                {/* color pickers */}
                <label className='color-pickers-label'>
                    Stroke
                    <input type="color" value={strokeColor}
                        onChange={e => setStrokeColor(e.target.value)}/>
					<button type="button"
                        onClick={() => setStrokeColor('#ffffff')}
                        className="cta-button btn-sm fit px-5px radius-5"
                        style={{ fontSize: 11 }}>Reset</button>
                </label>
				<span className='white-space-pre'> | </span>
                <label className='color-pickers-label'>
                    Fill
                    <input type="color" value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                        onChange={e => setFillColor(e.target.value)}/>
                    <button type="button"
                        onClick={() => setFillColor('transparent')}
                        className="cta-button btn-sm fit px-5px radius-5"
                        style={{ fontSize: 11 }}>Reset</button>
                </label>
            </div>

            {/* floating textarea for text editing */}
            {editingText && (
                <textarea
                    // autoFocus
					// ref={popUpTextareaRef}
					ref={el => el && el.focus({ preventScroll: true })}
                    defaultValue={editingText.text}
                    style={{
                        position: 'absolute',
                        top: editingText.y,
                        left: editingText.x,
                        fontSize: editingText.fontSize,
                        border: '1px dashed #aaa',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '4px',
                        zIndex: 9999,
                        minWidth: 80,
                        resize: 'none',
                        outline: 'none',
						width: editingText.fontSize * 12,
                    }}
                    onBlur={e => commitTextEdit(editingText.id, e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            commitTextEdit(editingText.id, e.target.value);
                        }
                        if (e.key === 'Escape') commitTextEdit(editingText.id, editingText.text);
                    }}
                />
            )}

            <Stage
                width={isMobileDev768 ? 315 : 800}
                height={isMobileDev768 ? 200 : 300}
                ref={stageRef}
                style={{ cursor: tool ? 'crosshair' : 'default' }}
				className='diagram-container'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
					<Rect
						x={0}
						y={0}
						width={800}   // temporary fixed size
						height={600}  // temporary fixed size
						fill={isExporting ? "#ffffff" : "transparent"}
						// fill={"transparent"}
						stroke="transparent"
						strokeWidth={0}
						listening={false}
					/>

                    {diagramShapes.map((shape) => {
                        const props = commonProps(shape);
                        // const fill = fillColor === 'transparent' ? 'transparent' : fillColor;
						const fill =
							fillColor === "transparent"
								? "transparent"
								: isExporting
									? "#ffffff"
									: fillColor;

                        switch (shape.type) {
                            case "rect":
                                return <Rect key={shape.id} {...props} width={shape.width} height={shape.height} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            case "circle":
                                return <Circle key={shape.id} {...props} radius={shape.radius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            case "triangle": {
                                const tp = [0, 0, shape.size, 0, shape.size / 2, -(shape.size * Math.sqrt(3)) / 2];
                                return <Line key={shape.id} {...props} points={tp} closed stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            }
                            case "polygon":
                                return <RegularPolygon key={shape.id} {...props} sides={shape.sides} radius={shape.radius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            case "star":
                                return <Star key={shape.id} {...props} numPoints={shape.numPoints} innerRadius={shape.innerRadius} outerRadius={shape.outerRadius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            case "ellipse":
                                return <Ellipse key={shape.id} {...props} radiusX={shape.radiusX} radiusY={shape.radiusY} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                            case "line":
                                return <Line key={shape.id} {...props} points={shape.points} stroke={shapeStroke} strokeWidth={2} />;
                            case "arrow":
                                return <Arrow key={shape.id} {...props} points={shape.points} stroke={shapeStroke} fill={shapeStroke} strokeWidth={2} />;
                            case "freehand":
                                return <Line key={shape.id}
                                    ref={(node) => (shapeRefs.current[shape.id] = node)}
                                    points={shape.points}
                                    // stroke={shape.stroke || shapeStroke}
									stroke={isExporting ? "#000000" : (shape.stroke || shapeStroke)}
                                    strokeWidth={2}
                                    tension={0.4}
                                    lineCap="round"
                                    lineJoin="round"
                                    draggable={tool === ""}
                                    onClick={(e) => {
                                        if (tool) return;
                                        setSelectedId(shape.id);
                                        setSelectedIds([]);
                                    }}
                                    onDragEnd={(e) => updateShape(shape.id, { x: snap(e.target.x()), y: snap(e.target.y()) })}
                                />;
                            case "text":
                                return <Text key={shape.id} {...props}
                                    text={shape.text}
                                    fontSize={shape.fontSize}
                                    // fill={shapeStroke}
									fill={isExporting ? "#000000" : shapeStroke}
                                    // onDblClick={() => startEditingText(shape)}
									onDblClick={(e) => {
										e.evt.preventDefault();
										startEditingText(shape);
									}}
                                    // onDblTap={() => startEditingText(shape)}
									onDblTap={(e) => {
										e.evt.preventDefault();
										startEditingText(shape);
									}}
                                />;
							// case "ring":
							// 	return (
							// 		<Ring
							// 			key={shape.id}
							// 			{...props}
							// 			innerRadius={shape.innerRadius}
							// 			outerRadius={shape.outerRadius}
							// 			stroke={shapeStroke}
							// 			fill={fill}
							// 			strokeWidth={2}
							// 		/>
							// 	);
							// case "arc":
							// 	return (
							// 		<Arc
							// 			key={shape.id}
							// 			{...props}
							// 			innerRadius={shape.innerRadius}
							// 			outerRadius={shape.outerRadius}
							// 			angle={shape.angle}
							// 			rotation={shape.rotation}
							// 			stroke={shapeStroke}
							// 			fill={fill}
							// 			strokeWidth={2}
							// 		/>
							// 	);
							// case "sector":
							// 	return (
							// 		<Sector
							// 			key={shape.id}
							// 			{...props}
							// 			radius={shape.radius}
							// 			angle={shape.angle}
							// 			stroke={shapeStroke}
							// 			fill={fill}
							// 		/>
							// 	);
                            default:
                                return null;
                        }
                    })}

                    {groups.map((group) => (
                        <Group key={group.id}
                            ref={(node) => (shapeRefs.current[group.id] = node)}
                            draggable={tool === ""}
                            onClick={() => { setSelectedIds([group.id]); setSelectedId(null); }}
                        >
                            {group.shapes.map((shape) => {
                                // const fill = fillColor === 'transparent' ? 'transparent' : fillColor;
								const fill =
									fillColor === "transparent"
										? "transparent"
										: isExporting
											? "#ffffff"
											: fillColor;
                                switch (shape.type) {
                                    case "rect": return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                                    case "circle": return <Circle key={shape.id} x={shape.x} y={shape.y} radius={shape.radius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                                    case "ellipse": return <Ellipse key={shape.id} x={shape.x} y={shape.y} radiusX={shape.radiusX} radiusY={shape.radiusY} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                                    case "polygon": return <RegularPolygon key={shape.id} x={shape.x} y={shape.y} sides={shape.sides} radius={shape.radius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                                    case "star": return <Star key={shape.id} x={shape.x} y={shape.y} numPoints={shape.numPoints} innerRadius={shape.innerRadius} outerRadius={shape.outerRadius} stroke={shapeStroke} fill={fill} strokeWidth={2} />;
                                    case "line": return <Line key={shape.id} x={shape.x} y={shape.y} points={shape.points} stroke={shapeStroke} strokeWidth={2} />;
                                    case "arrow": return <Arrow key={shape.id} x={shape.x} y={shape.y} points={shape.points} stroke={shapeStroke} fill={shapeStroke} strokeWidth={2} />;
                                    case "text": return <Text key={shape.id} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize} fill={shapeStroke} />;
                                    default: return null;
                                }
                            })}
                        </Group>
                    ))}

                    <Transformer ref={trRef} />
                </Layer>
            </Stage>
            <p style={{ fontSize: 11, opacity: 0.6, margin: '3px 0 0' }}>
                Click shape to select • drag to move • handles to resize • double-click text to edit • Delete key to remove
            </p>
        </div>
    );
}

function DiagramButton ({toggleMode, within60Questions, isDiagramActive, isImage, qIdx, isMobileDev768}) {
	// const isMobile = deviceInfo.width <= 768
	return (
		<>
			<button
			type="button"
			onClick={() => toggleMode(qIdx, 'diagram')}
			// disabled={isImage}
			// disabled={true}
			className={`cta-button question ${isDiagramActive?'highlight':''} ${within60Questions?'':'d-none'} ${isMobileDev768?'fit':''}`}>
				Diagram
			</button>
		</>
	)
}

export { QuestionsArrComp };

const compStyles = {
	label: {
		top: "0.5rem",
		left: "0.8rem",
		transform: "translateY(-50%)",
		fontSize: "0.65rem",
		color: "rgba(255, 255, 255, 0.9)",
		padding: "1rem 0.25rem",

		position: "absolute",
		whiteSpace: "nowrap",
		pointerEvents: "none",
		transition: "all 0.2s ease",
		background: "transparent",

		display: "block",
		marginBottom: "8px",
		fontWeight: "500",
	}
}
