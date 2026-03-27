import { Fragment, useEffect, useState, useRef } from 'react';
import { ImageCropAndCompress } from '../../hooks/imgCompressAndCrop/ImageCropAndCompress';
import { useDeviceInfo } from '../../hooks/deviceType';
import { customFindLast } from './scrambleQuestions';
import {
	Stage,
	Layer,
	Rect,
	Circle,
	Ellipse,
	Line,
	RegularPolygon,
	Star,
	Ring,
	Arrow,
	Text,
	Arc,
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
	const deviceInfo = useDeviceInfo()
	const [uploadedImg, setUploadedImg] = useState(null)
	const {
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
		diagramStageRefs
	} = args;

	// Add a new question
	const addRemoveQuestion = ({id}={}) => {
		console.log('in add remove question...')
		if (id) {
			console.log('removing...', {id})
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
				const newQuestionObject = {...questionObject, uniqueId, question_mode: ['text']}
				return [...prev, newQuestionObject]
			});
		}
	};

	useEffect(() => {
		console.log({uploadedImg})
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

	console.log({
		questionFormData,
		formQuestions,
		// uploadedImg,
	})
	return (
		<div
		style={{paddingTop: '1rem'}}>
			<QuestionBlock
			diagramStageRefs={diagramStageRefs}
			questionFormData={questionFormData}
			handleQuestionChange={handleQuestionChange}
			setUploadedImg={setUploadedImg}
			setQuestionFormData={setQuestionFormData}
			generateUniqueId={generateUniqueId}
			within60Questions={within60Questions}
			addRemoveQuestion={addRemoveQuestion}
			deviceInfo={deviceInfo} />
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
						deviceInfo,}) {
	// console.log({
	// 	questionFormData
	// })
	const toggleMode = (qIdx, mode) => {
		console.log({id: qIdx, mode})
		setQuestionFormData(prev => {
			const updated = [...prev];
			const modes = [...updated[qIdx].question_mode];

			if (modes.includes(mode)) {
				// remove mode
				console.log('removing:', mode)
				updated[qIdx].question_mode = modes.filter(m => m !== mode);
				// remove question
				console.log('removing', mode, 'question')
				const questionsArr = updated[qIdx].question
				updated[qIdx].question = questionsArr.filter(q=>{
					if (q.type===mode || q.type==='diagram_png') {
						return false
					}
					return true
				})
			} else {
				// add mode
				console.log('adding:', mode)
				updated[qIdx].question_mode = [...modes, mode];
			}

			console.log({updated})
			return updated;
		});
	};
	return (
		<>
			{questionFormData?.map((questionData, qIdx) => {
				const isImage = !!questionData?.image
				console.log({
					questionData,
					isImage,
				// 	id: questionData?.uniqueId,
				// 	modes: questionData?.question_mode
				})
				const isMathSelected = questionData?.question_mode.includes('math')
				const isMathActive = !!isMathSelected
				const isDiagramSelected = questionData?.question_mode.includes('diagram')
				const isDiagramActive = !!isDiagramSelected
				// console.log({isMathSelected, isMathActive,
				// 			isDiagramActive, isDiagramSelected})
				return (
					<fieldset key={questionData?.uniqueId}
					className="form-group mb-2 q-mx border-top-1 pt-1">
						{/* textarea separately */}
						{formQuestions.map((field, fIdx) => {
							// console.log({name: field.name})
							if (field.element !== "textarea") return null;
							return (
								<div className='floating-field'
								key={field.name+fIdx}>
									<textarea
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
										rows={(questionData?.question_mode.includes('math')||
											questionData?.question_mode.includes('diagram'))?1:4}
										style={{
											height: "auto",
											width: field.width,
										}}
										// name={field.name}
										// name={questionData?.question_mode === 'math' ? 'question_text' : field.name}
										name="question_text"
									/>
									<label
									className='left-textarea'
									// style={questionData.question_mode==='text'?{}:compStyles.label}
									>{`${field.placeholder} ${qIdx + 1}`}</label>
								</div>
							);
						})}

						{/* math input */}
						{questionData?.question_mode.includes('math') &&
						formQuestions.map((field, fIdx) => {
							// console.log({name: field.name})
							if (field.element !== "textarea") return null;
							return (
								<div className='floating-field'
								key={field.name+fIdx}>
									<MathQuestionField
									// value={questionData.question}
									value={
										customFindLast(
											questionData?.question,
											block => block.type === "math"
										)?.value || ""
									}
									onChange={(latex) =>
										handleQuestionChange(
										{ target: { name: "question_math", value: latex } },
										null,
										qIdx
										)
									}
									/>
									<label
									className='left-textarea'
									style={compStyles.label}
									>{`Enter math for Q${qIdx + 1}`}</label>
								</div>
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
								console.log({diagramValue})

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
										getStageRef={(stage) => (diagramStageRefs.current[qIdx] = stage)}
										deviceInfo={deviceInfo}
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
										width: deviceInfo.label === "mobile"?"100%":"49%", // 2 per row roughly (45% + gap ≈ 100%)
										margin: '2px',
									}}>
										<input
											name={field.name}
											type={field.type}
											placeholder=" "
											value={questionData?.[field.name]}
											// value={
											// 	questionData.question.findLast(block => block.type === "math")?.value || ""
											// }
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
									{deviceInfo.width > 768 ?
									<MathAndDiagBtns
									toggleMode={toggleMode}
									isMathActive={isMathActive}
									within60Questions={within60Questions}
									isDiagramActive={isDiagramActive}
									isImage={isImage}
									qIdx={qIdx}/> :null}

									<button
									type="button"
									onClick={()=> {
										console.log('start duplicating')
										setQuestionFormData(prev => {
											// find index of the original question
											const index = prev.findIndex(
												question => question?.uniqueId === questionData?.uniqueId
											);
											console.log({index})
											if (index === -1) return prev;
											// duplicate the question with a new id
											const duplicateQuestion = {
												...prev[index],
												uniqueId: generateUniqueId(),
												number: String(prev.length + 1)
											};
											console.log({duplicateQuestion})
											// insert duplicate right after original
											const updated = [...prev];
											updated.splice(index + 1, 0, duplicateQuestion);
											console.log({updated})
											return updated;
											// return prev
										});
										console.log('end duplicating')
									}}
									className={`cta-button question ${within60Questions?'':'d-none'}`}>
										Duplicate
									</button>

									<button
									type="button"
									onClick={()=>addRemoveQuestion({id:questionData?.uniqueId})}
									className="cta-button question bg-red-warn">
										Remove {deviceInfo.width > 768 ? 'Question':''}
									</button>
								</div>
								</div>
									{deviceInfo.width <= 768 ?
										<div className='d-flex'>
											<MathAndDiagBtns
											toggleMode={toggleMode}
											isMathActive={isMathActive}
											within60Questions={within60Questions}
											isDiagramActive={isDiagramActive}
											isImage={isImage}
											qIdx={qIdx}
											deviceInfo={deviceInfo}/>
										</div> :null}
								</div>
					</fieldset>
				)
			})}
		</>
	)
}

const GRID_SIZE = 10;
function DiagramField({ value, onChange, getStageRef, deviceInfo=1000 }) {
	console.log({diagramValue: value})
	const [diagramShapes, setDiagramShapes] = useState([]);
	const [groups, setGroups] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedIds, setSelectedIds] = useState([]); // for multiple selection
	const [tool, setTool] = useState("");
	const hydratedRef = useRef(false);
	const isMobileWidth = deviceInfo.width<=768

	const shapeRefs = useRef({});
	const trRef = useRef();
	const stageRef = useRef();

	const snap = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;
	console.log({snap})

	useEffect(() => {
		if (getStageRef && stageRef.current) {
			getStageRef(stageRef.current);
		}
	}, [getStageRef, stageRef.current]);

	useEffect(() => {
		console.log({effectValue: value})
		if (!value || hydratedRef.current) return;

		console.log('value passed!')
		setDiagramShapes(value.diagramShapes || []);
		setGroups(value.groups || []);
		// setDiagramShapes(value || []);
		// setGroups(groups || []);
		hydratedRef.current = true;
	}, [value]);

	useEffect(() => {
		if (!hydratedRef.current) return;
		if (onChange) {
			onChange({ diagramShapes, groups });
		}
	}, [diagramShapes, groups]);

	// Attach transformer to selected shape or group
	useEffect(() => {
		if (selectedId) {
			const node = shapeRefs.current[selectedId];
			if (node) {
				trRef.current.nodes([node]);
				trRef.current.getLayer().batchDraw();
			}
		} else if (selectedIds.length > 0) {
			const nodes = selectedIds.map((id) => shapeRefs.current[id]).filter(Boolean);
			if (nodes.length) {
				trRef.current.nodes(nodes);
				trRef.current.getLayer().batchDraw();
			}
		}
	}, [selectedId, selectedIds]);

	// Delete selected shape or group
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Delete") {
				if (selectedId) {
					setDiagramShapes((prev) => prev.filter((s) => s.id !== selectedId));
					setGroups((prev) => prev.filter((g) => g.id !== selectedId));
					setSelectedId(null);
				}
				if (selectedIds.length) {
					setDiagramShapes((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
					setGroups((prev) => prev.filter((g) => !selectedIds.includes(g.id)));
					setSelectedIds([]);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedId, selectedIds]);

	// Add shape
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
				newShape = { id, type: "text", x: pointer.x, y: pointer.y, text: "Text", fontSize: 20 };
				break;
			case "custom":
				newShape = {
					id,
					type: "custom",
					x: pointer.x,
					y: pointer.y,
					width: 150,
					height: 100
				};
				break;
			default:
				return;
		}

		setDiagramShapes((prev) => [...prev, newShape]);
		setTool(""); // reset tool immediately
	};

	const updateShape = (id, attrs) => {
		setDiagramShapes((prev) => prev.map((s) => (s.id === id ? { ...s, ...attrs } : s)));
	};

	const handleTransformEnd = (shape) => {
		const node = shapeRefs.current[shape.id];
		if (!node) return;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		node.scaleX(1);
		node.scaleY(1);

		switch (shape.type) {
			case "rect":
			case "polygon":
			case "star":
			case "ellipse":
				updateShape(shape.id, { x: snap(node.x()), y: snap(node.y()) });
				break;
			case "circle":
				updateShape(shape.id, { x: snap(node.x()), y: snap(node.y()), radius: Math.max(5, shape.radius * scaleX) });
				break;
			case "triangle":
				updateShape(shape.id, { x: snap(node.x()), y: snap(node.y()), size: Math.max(5, shape.size * scaleX) });
				break;
			case "line":
				const points = shape.points.map((p, i) => (i % 2 === 0 ? p * scaleX : p * scaleY));
				updateShape(shape.id, { points, x: node.x(), y: node.y() });
				break;
			case "text":
				updateShape(shape.id, { x: snap(node.x()), y: snap(node.y()), fontSize: Math.max(5, shape.fontSize * scaleX) });
				break;
			case "custom":   // ADD
				updateShape(shape.id, {
					x: snap(node.x()),
					y: snap(node.y())
				});
				break;
			default:
				break;
		}
	};

	// Group selected shapes
	const handleGroup = () => {
		if (selectedIds.length < 2) return;
		const id = crypto.randomUUID();
		const groupShapes = diagramShapes.filter((s) => selectedIds.includes(s.id));
		setGroups((prev) => [...prev, { id, shapes: groupShapes }]);
		setDiagramShapes((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
		setSelectedIds([id]);
	};

	const handleUngroup = () => {
		if (selectedIds.length !== 1) return;
		const group = groups.find((g) => g.id === selectedIds[0]);
		if (!group) return;
		setDiagramShapes((prev) => [...prev, ...group.shapes]);
		setGroups((prev) => prev.filter((g) => g.id !== group.id));
		setSelectedIds([]);
	};

	const shapeBtns = [
		"rect",
		"circle",
		"triangle",
		"ellipse",
		"star",
		"pentagon",
		"hexagon",
		"heptagon",
		"octagon",
		"line",
		"text",
		// "custom" // ADD
		]
	console.log({diagramShapes})
	return (
		<div>
			<div style={{ marginBottom: 10, display: "flex", gap: 2, flexWrap: "wrap" }}>
			{shapeBtns.map((t, tIdx) => {
					// console.log({len: shapeBtns.length})
					return (
						<button
						key={t}
						type="button"
						onClick={() => {
							setTool(t);
							console.log('clicked');
						}}
						className={`cta-button btn-sm fit px-5px ${t===tool?'active':''}`}>
							{t}
						</button>
			)})}
			<button
				type="button"
				onClick={handleGroup}
				className={`cta-button btn-sm fit ${groups.length?'active':''}`}>
					Group
				</button>
				<button
				type="button"
				onClick={handleUngroup}
				className={`cta-button btn-sm fit`}>
					Ungroup
				</button>
			</div>

			<Stage
			width={isMobileWidth?315:800}
			height={isMobileWidth?200:250}
			ref={stageRef}
			style={{ border: "1px solid #ccc", borderRadius: 6 }}
			onMouseDown={(e) => {
				if (e.target === stageRef.current && tool) {
					console.log({tool})
				setSelectedId(null);
				setSelectedIds([]);
				if (!tool) return; // prevent stale shape creation

				const pointer = e.target.getStage().getPointerPosition();
				addShape(pointer);
				}
			}}
			>
			<Layer>
				{diagramShapes.map((shape) => {
				const isSelected = selectedId === shape.id || selectedIds.includes(shape.id);
				const commonProps = {
					ref: (node) => (shapeRefs.current[shape.id] = node),
					x: shape.x,
					y: shape.y,
					draggable: true,
					onClick: (e) => {
					if (e.evt.shiftKey) {
						setSelectedIds((prev) =>
						prev.includes(shape.id) ? prev.filter((i) => i !== shape.id) : [...prev, shape.id]
						);
					} else {
						setSelectedId(shape.id);
						setSelectedIds([]);
					}
					},
					onDragEnd: (e) => updateShape(shape.id, { x: snap(e.target.x()), y: snap(e.target.y()) }),
					onTransformEnd: () => handleTransformEnd(shape),
				};

				switch (shape.type) {
					case "rect":
						return <Rect key={shape.id} {...commonProps} width={shape.width} height={shape.height} stroke="white" />;
					case "circle":
						return <Circle key={shape.id} {...commonProps} radius={shape.radius} stroke="white" />;
					case "triangle":
						const triPoints = [0, 0, shape.size, 0, shape.size / 2, (shape.size * Math.sqrt(3)) / 2];
						return <Line key={shape.id} {...commonProps} points={triPoints} closed stroke="white" />;
					case "polygon":
						return <RegularPolygon key={shape.id} {...commonProps} sides={shape.sides} radius={shape.radius} stroke="white" />;
					case "star":
						return <Star key={shape.id} {...commonProps} numPoints={shape.numPoints} innerRadius={shape.innerRadius} outerRadius={shape.outerRadius} stroke="white" />;
					case "ellipse":
						return <Ellipse key={shape.id} {...commonProps} radiusX={shape.radiusX} radiusY={shape.radiusY} stroke="white" />;
					case "line":
						return <Line key={shape.id} {...commonProps} points={shape.points} stroke="white" strokeWidth={2} />;
					case "text":
						return <Text key={shape.id} {...commonProps} text={shape.text} fontSize={shape.fontSize} fill="white" />;
					case "custom":
						return (
							<Shape
								key={shape.id} {...commonProps}
								width={shape.width}
								height={shape.height}
								stroke="white"
								strokeWidth={2}
								sceneFunc={(ctx, shapeNode) => {
								const w = shape.width;
								const h = shape.height;

								ctx.beginPath();

								// Example: custom blob shape
								ctx.moveTo(0, h / 2);
								ctx.bezierCurveTo(w / 4, -20, w * 0.75, h + 20, w, h / 2);
								ctx.bezierCurveTo(w * 0.75, 0, w / 4, h, 0, h / 2);

								ctx.closePath();
								ctx.fillStrokeShape(shapeNode);
								}}
							/>
						);
					default:
						return null;
				}
				})}

				{groups.map((group) => {
				const isSelected = selectedIds.includes(group.id);
				return (
					<Group
					key={group.id}
					ref={(node) => (shapeRefs.current[group.id] = node)}
					x={0}
					y={0}
					draggable
					onClick={() => setSelectedIds([group.id])}
					>
					{group.shapes.map((shape) => {
						switch (shape.type) {
						case "rect":
							return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke="white" />;
						case "circle":
							return <Circle key={shape.id} x={shape.x} y={shape.y} radius={shape.radius} stroke="white" />;
						case "triangle":
							const triPoints = [0, 0, shape.size, 0, shape.size / 2, (shape.size * Math.sqrt(3)) / 2];
							return <Line key={shape.id} x={shape.x} y={shape.y} points={triPoints} closed stroke="white" />;
						case "polygon":
							return <RegularPolygon key={shape.id} x={shape.x} y={shape.y} sides={shape.sides} radius={shape.radius} stroke="white" />;
						case "star":
							return <Star key={shape.id} x={shape.x} y={shape.y} numPoints={shape.numPoints} innerRadius={shape.innerRadius} outerRadius={shape.outerRadius} stroke="white" />;
						case "ellipse":
							return <Ellipse key={shape.id} x={shape.x} y={shape.y} radiusX={shape.radiusX} radiusY={shape.radiusY} stroke="white" />;
						case "line":
							return <Line key={shape.id} x={shape.x} y={shape.y} points={shape.points} stroke="white" strokeWidth={2} />;
						case "text":
							return <Text key={shape.id} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize} fill="white" />;
						default:
							return null;
						}
					})}
					</Group>
				);
				})}

				{(selectedId || selectedIds.length > 0) && <Transformer ref={trRef} />}
			</Layer>
			</Stage>
		</div>
	);
}

const MAX_PER_LINE = 50;
function MathQuestionField({ value, onChange }) {
	const mathRef = useRef(null);

	useEffect(() => {
		// console.log('in effect')
		if (!mathRef.current) return;
		// console.log('running effect...')

		const mathfield = mathRef.current;

		mathfield.moveOutOf = "tab";
		mathfield.scriptDepth = 3;

		// mathfield.inlineShortcuts = {
		// 	sqrt: "\\sqrt{#?}",
		// 	frac: "\\frac{#?}{#?}",
		// 	int: "\\int_{#?}^{#?}",
		// 	pi: "\\pi",
		// 	deg: "^{\\circ}",
		// };

		// Set initial value
		if (mathfield.value !== value) {
			mathfield.value = value || "";
		}

		const inputHandler = () => {
			console.log({mvalue: mathfield.value, value})
			// onChange(mathfield.value); // LaTeX output

			const latex = mathfield.value;
			const lines = latex.split("\\\\");
			const lastLine = lines[lines.length - 1];

			// Strip LaTeX commands to get approximate visible character count
			const visibleLength = lastLine.replace(/\\[a-zA-Z]+/g, 'X').replace(/[{}]/g, '').length;
			console.log({currLen: visibleLength})

			if (visibleLength >= MAX_PER_LINE) {
				// Defer to avoid firing inside input event
				console.log({visibleLength})
				requestAnimationFrame(() => {
					mathfield.executeCommand("addRowAfter");
				});
				return; // Don't call onChange yet — wait for the next input event
			}

			onChange(latex);
		};

		// console.log('line before kh')
		const keyHandler = (e) => {
			console.log('key pressed', e.key)
			if (e.key === "Enter") {
				e.preventDefault();
				console.log('enter key pressed...')
				mathfield.executeCommand("addRowAfter");
			}
			if (e.key === "Backspace") {
				console.log("Backspace key pressed...");

				const latex = mathfield.value;

				// extract content inside \displaylines
				const match = latex.match(/\\displaylines\s*(.*)\s*}/);

				if (!match) return;

				const content = match[1];

				// split into rows
				let rows = content.split("\\\\");
				// console.log({rows})

				// trim spaces
				rows = rows.map((r) => r.trim());
				// console.log({tromrows: rows})

				const lastRow = rows[rows.length - 1];
				// console.log({rows})

				console.log({ rows, lastRow });

				// CASE 1: current row has characters → delete normally
				if (lastRow !== "") {
					console.log("deleting character normally");
					e.preventDefault();
					mathfield.executeCommand("deleteBackward");
					return;
				}

				// CASE 2: current row empty → remove the row
				if (rows.length > 1) {
					console.log("removing empty row", {latex});
					e.preventDefault();
					mathfield.executeCommand("removeRow");
				}
			}
		};

		mathfield.addEventListener("input", inputHandler);
		mathfield.addEventListener("keydown", keyHandler, { capture: true });

		return () => {
			mathfield.removeEventListener("input", inputHandler);
			mathfield.removeEventListener("keydown", keyHandler, { capture: true });
		};
	}, [value, onChange]);

	return (
		<math-field
			ref={mathRef}
			virtual-keyboard-mode="onfocus"
			// default-mode="text"
			multiline
			smart-mode
			smart-fence
			letter-shape-style="tex"
			style={{
				width: "100%",
				minHeight: "4rem",
				padding: "1rem",
				fontSize: "1.1rem",
				borderRadius: "6px",
				border: "1px solid #ccc",
				background: 'transparent',
				color: 'white',
				outline: "none", // remove default outline
				"--mathfield-outline": "none", // override internal outline
				"--caret-color": "white",
			}}
		/>
	);
}

function MathAndDiagBtns ({toggleMode, isMathActive, within60Questions, isDiagramActive, isImage, qIdx, deviceInfo=1000}) {
	const isMobile = deviceInfo.width <= 768
	return (
		<>
			<button
			type="button"
			onClick={() => toggleMode(qIdx, 'math')}
			className={`cta-button question ${isMathActive?'highlight':''} ${within60Questions?'':'d-none'} ${isMobile?'fit':''}`}>
				Math
			</button>

			<button
			type="button"
			onClick={() => toggleMode(qIdx, 'diagram')}
			// disabled={isImage}
			disabled={true}
			className={`cta-button question ${isDiagramActive?'highlight':''} ${within60Questions?'':'d-none'} ${isMobile?'fit':''}`}>
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

// used to render latex questions for mathlive
function StudentQuestion({ latex }) {
	return (
		<math-field
			read-only
			style={{
				border: "none",
				background: "transparent",
				fontSize: "1.1rem"
			}}
		>
			{latex}
		</math-field>
	);
}
