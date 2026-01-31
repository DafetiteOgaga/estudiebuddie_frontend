import { useState, useEffect, useRef } from "react";
import { titleCase } from "../../hooks/changeCase";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { shuffleArray } from "../../hooks/formHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { useDeviceInfo } from "../../hooks/deviceType";
import { toast } from 'react-toastify';

const formValues = {
	name: "",
	email: "",
	type: "",
	class: "",
	subject: "",
	duration: "",
	noOfQs: "",
}
const typeArray = ["basic", "jss", "sss"]
const basicClassArray = [
	"basic-1", "basic-2",
	"basic-3", "basic-4",
	"basic-5",]
const jssArray = ["jss-1", "jss-2", "jss-3"]
const sssArray = ["sss-1", "sss-2", "sss-3"]

const basicSubjectArray = ["mathematics", "english"]
const jssSubjectArrar = ["science", "computer"]
const sssSubjectArray = ["physics", "chemistry"]
const departmentArray = ["art", "commercial", "science"]

// const durationArray = ["1hr"]
const durationArray = Array.from({length: 5}).map((_, idx) => {
	const fraction = 0.5
	// const fraction = 0.003
	return fraction * (idx + 1)
})
const noOfQsArray = [0, 30, 70].map((increment, idx) => {
	const initNumber = 30
	return initNumber + increment
})
// console.log({noOfQsArray, durationArray})

const preHeadForm = [
	{
		name: "name",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Name (or fullname)",
		width: "45%",
		case: 'title',
	},
	{
		name: "email",
		required: true,
		disabled: false,
		type: "email",
		placeholder: "Email Address",
		width: "45%",
		case: null,
	},
	{
		name: "type",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Type",
		width: "15%",
		options: typeArray,
		case: null,
	},
	{
		name: "class",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Class",
		width: "11%",
		options: [],
		case: "upper",
	},
	{
		name: "subject",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Subject",
		width: "25%",
		options: [],
		case: 'title',
	},
	{
		name: "duration",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Duration",
		width: "13%",
		options: durationArray,
		case: null,
	},
	{
		name: "noOfQs",
		required: false,
		disabled: false,
		type: "select",
		placeholder: "Number of questions",
		width: "14%",
		options: noOfQsArray,
		case: null,
	},
]
const dyName = ['class', 'duration', 'noOfQs']

const blankSession = {
	quizQuestions: [],
	duration: null,
	sessionID: null,
	quizAnswers: [],
	quizScore: null,
	quizAttempted: null,
	quizDuration: null,
	submitted: false,
	formDetails: {}
}
const noType = "no type selected"
const STORAGE_KEY = "countdown_seconds_left";

// feedback can be:
// - "warning"
// - "timeup"
// - "correct"
// - "wrong"
// - "coin"
function Quiz() {
	const [isFirstRender, setIsFirstRender] = useState(false)
	const [statePreHeadForm, setStatePreHeadForm] = useState(preHeadForm)
	const deviceInfo = useDeviceInfo()
	// console.log({deviceInfo})
	const [isTimeUp, setIsTimeUp] = useState(false);
	const startButtonRef = useRef(null);
	const modalRef = useRef(null);
	const [quizStarting, setQuizStarting] = useState(null)
	const [userStartTime, setUserStartTime] = useState(null)
	const fetchStartTime = useGetStartTime()
	const [showReadyModal, setShowReadyModal] = useState(false);
	const [feedback, setFeedback] = useState(null)
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const { lStorage, sStorage } = useCreateStorage()
	const [session, setSession] = useState(blankSession)
	const [temporaryResponse, setTemporaryResponse] = useState(null)
	// const [quizQuestions, setQuizQuestions] = useState([])
	// const [duration, setDuration] = useState(null)
	const [isNotQuiz, setIsNotQuiz] = useState(null);
	const [isPreQuiz, setIsPreQuiz] = useState(true)
	const [formData, setFormData] = useState(formValues)
	const selectedQuestionNumberSerialsRef = useRef([])
	const selectedAnswersRef = useRef([])
	// check session storage for existing isFirstRender data
	const isFirstRenderExist = sStorage.getItem('isFirstRender')
	if (deviceInfo.label === "smallLaptop") {
		// console.log('smallTablet'.repeat(5))
		dyName.forEach(obj => {
			let objItem = statePreHeadForm.find(item => item.name === obj)
			if (objItem) objItem.width = '17%'
		})
	} else if (deviceInfo.label === "tablet") {
		// console.log('smallTablet'.repeat(5))
		dyName.forEach(obj => {
			let objItem = statePreHeadForm.find(item => item.name === obj)
			if (objItem) {
				if (deviceInfo.width > 800) {
					objItem.width = '19%'
				} else {
					objItem.width = '22%'
				}
			}
		})
	} else if (deviceInfo.label === "mobile") {
		// console.log('mobile'.repeat(5))
		statePreHeadForm.forEach(obj => {
			// let objItem = formHead.find(item => item.name === obj)
			if (obj.name==="name"||obj.name==="email") {
				obj.width = '100%'
			} else if (obj.name==="type"||obj.name==="class") {
				obj.width = '40%'
			} else if (obj.name==="subject") {
				obj.width = '70%'
			} else if (obj.name==="duration") {
				obj.width = '40%'
			} else if (obj.name==="noOfQs") {
				obj.width = '40%'
			}
		})
	}
	useEffect(() => {
		if (formData.type.toLowerCase()==="basic") {
			console.log('removing department')
			setStatePreHeadForm(prev => {
				let  updatedPreForm = [...prev]
				console.log({updatedPreForm})
				updatedPreForm = updatedPreForm.filter(obj=>obj.name.toLowerCase()!=="department")
				return updatedPreForm
			})
			setFormData(prev => {
				return {
					...prev,
					class: "",
					duration: "",
					noOfQs: "",
					subject: "",
					department: "",
				}
			})
		} else if (formData.type.toLowerCase()==="jss"||formData.type.toLowerCase()==="sss") {
			console.log('ading department')
			setStatePreHeadForm(prev => {
				let updatedPreForm = [...prev]
				const deptExist = updatedPreForm.find(obj=>obj.name.toLowerCase()==="department")
				if (deptExist) {
					return updatedPreForm
				} else {
					const insertIndex = 4;
					const width = deviceInfo.label === "mobile"?"70%":"15%"
					updatedPreForm = [
						...updatedPreForm.slice(0, insertIndex),
						{
							name: "department",
							required: true,
							disabled: false,
							type: "select",
							placeholder: "Department",
							width: width,
							options: departmentArray,
							case: "title",
						},
						...updatedPreForm.slice(insertIndex),
					]
					return updatedPreForm
				}
			})
			setFormData(prev => {
				return {
					...prev,
					class: "",
					duration: "",
					noOfQs: "",
					subject: "",
					department: "",
				}
			})
		}
	}, [formData.type])
	// console.log(statePreHeadForm)
	useEffect(() => {
		// console.log('isFirstRender'.repeat(10), isFirstRenderExist)
		if (!isFirstRenderExist) setIsFirstRender(true)
		setLoadingPage(false)
	}, []);
	useEffect(() => {
		if (!showReadyModal || !modalRef.current) return;
	  
		const focusableElements = modalRef.current.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const firstEl = focusableElements[0];
		const lastEl = focusableElements[focusableElements.length - 1];
	  
		// Focus first element on open
		firstEl.focus();
	  
		const handleTab = (e) => {
			if (e.key !== "Tab") return;
		
			if (e.shiftKey) { // Shift + Tab
				if (document.activeElement === firstEl) {
					e.preventDefault();
					lastEl.focus();
				}
			} else { // Tab
				if (document.activeElement === lastEl) {
					e.preventDefault();
					firstEl.focus();
				}
			}
		};
	  
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				// Optional: close modal on Esc
				// setShowReadyModal(false);
			}
		};
	  
		document.addEventListener("keydown", handleTab);
		document.addEventListener("keydown", handleEscape);
	  
		// Optional: prevent background scroll
		document.body.style.overflow = "hidden";
	  
		return () => {
			document.removeEventListener("keydown", handleTab);
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = ""; // restore scroll
		};
	}, [showReadyModal]);

	const handleChange = (e) => {
		let { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	const submitHandler = async (e=null, isQuiz=false) => {
		if (e) {
			e.preventDefault(); // prevent default page refresh
		} else {
			console.warn('tiime up, forcefully submitting')
		}
		console.log({isQuiz, formData})
		setLoading(true)
		let res
		let cleanedData
		let endpoint
		if (isQuiz) {
			// submitting quiz to the server for grading
			// console.log({selectedAnswers})
			cleanedData = {
				answers: selectedAnswersRef.current,
				session_id: session.sessionID
			}
			// console.log({cleanedData})
			endpoint = 'take-quiz/grade-quiz'
			res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
			if (res.ok) {
				console.log({res})
				const answerUpdate = {
					quizAnswers: res?.data?.quiz_result,
					quizScore: res?.data?.quiz_score,
					quizAttempted: res?.data?.quiz_attempted,
					quizDuration: res?.data?.quiz_duration,
					submitted: true
				}
				setSession(prev => ({
					...prev,
					...answerUpdate
				}))
				const updatedSessionWithAnswers = {
					...localSession,
					...answerUpdate
				}
				lStorage.setItem('session-info', updatedSessionWithAnswers)
				setTemporaryResponse(res?.data)
			}
			setQuizStarting(null)
			setLoading(false)
			return
		}

		// sending pre-quiz data to server

		// populate cleandata with formdata (new quiz) or form details (continue quiz)
		cleanedData = (formData?.selectedAnswers?.length) ?
						{...session?.formDetails}:
						{...formData}

		// clear previous session
		lStorage.removeSession()
		setSession(blankSession)
		setSelectedAnswers([])
		isSubmitted = false

		endpoint = 'take-quiz/pre-quiz'
		res = await FetchFromServer(endpoint, 'POST', cleanedData)
		// console.log('Form submitted with data:', {cleanedData});
		// console.log('responded with', {res})


		if (res.ok) {
			// console.log(
			// 	'\ngoto:', res.data.goto,
			// 	'\ninfo:', res.data.info
			// )

			setLoading(true)
			// fetching quiz to be taken
			const getQuestions = await FetchFromServer(res.data.goto, 'POST', res.data.info)
			// console.log('getQuestions:', getQuestions)
			if (getQuestions.ok) {
				// alert("Quiz questions are ready!\nClick 'ok' to start.");
				setShowReadyModal(true);
				// console.log('getQuestions ok')
				let shuffledQuestions = getQuestions?.data?.questions
				// shuffle the options first
				shuffledQuestions = shuffledQuestions.map((question) => {
					// shuffle options
					const shuffledOptions = shuffleArray(question.options);
					return {
						...question,
						options: shuffledOptions,
					};
				});
				// now shuffle the questions
				shuffledQuestions = shuffleArray(shuffledQuestions);
				// console.log(
				// 	'\noriginalQuestions:', getQuestions?.data?.questions,
				// 	'\nshuffledQuestions:', shuffledQuestions
				// )
				// setQuizQuestions(shuffledQuestions)
				setSession(prev=>({
					...prev,
					quizQuestions: shuffledQuestions,
					duration: getQuestions?.data?.duration,
					sessionID: getQuestions?.data?.session_id,
					formDetails: {
						class: formData.class,
						duration: formData.duration,
						email: formData.email,
						name: formData.name,
						subject: formData.subject,
						type: formData.type,
					}
				}))
				// console.log('getQuestions.duration:', getQuestions?.data?.duration)
				// // setDuration(getQuestions?.data?.duration)
				// // console.log('getQuestions:', getQuestions.questions)
				// // setIsPreQuiz(false)
			}
			else if (getQuestions?.error) {
				setIsNotQuiz(getQuestions.error)
			}
		}
		setLoading(false)
	};

	const handleClearSession = () => {
		// clear session
		lStorage.removeSession();
		setSession(blankSession);
		setSelectedAnswers([]);
		setIsPreQuiz(true)
		setUserStartTime(null)
	}

	const handleRePopulateFormData = () => {
		setFormData(prev => {
			const updatedFormData = {
				...prev,
				...session?.formDetails,
				selectedAnswers: [],
			}
			return updatedFormData
		})
	}



	// /////////////////////////////////////
	const sessionHasHydratedRef = useRef(false)
	const questionTimeRef = useRef({});
	const localSelectedAnswers = lStorage.getItem('selected-answers')||[]
	const localSession = lStorage.getItem('session-info')
	const activeSession = !!localSession?.sessionID
	const answerOptionsArray = ['a', 'b', 'c', 'd'];
	const [QuestionNumber, setQuestionNumber] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const selectedAnswerHandler = (questionId, answer) => {
		setSelectedAnswers((prevSelected) => {
			// console.log({prevSelected})
			const exists = prevSelected.some(item => item.questionId === questionId);
			// console.log({exists})

			if (!exists) {
				const timing = questionTimeRef.current[questionId];
	
				if (timing && !timing.answeredAt) {
					const answeredAt = Date.now();
	
					timing.answeredAt = answeredAt;
					timing.duration = (answeredAt - timing.renderedAt) / 1000;
				}
			}

			if (exists) {
				// console.log('question has been answered before')
				return prevSelected.map(item =>
					item.questionId === questionId
						? {
							...item,
							answer: answer,
							response_duration: null,
						}
						: item
				);
			} else {
				// console.log('question was just answered')

				const timing = questionTimeRef.current[questionId] || {};

				return [
					...prevSelected,
					{
						number: QuestionNumber,
						questionId: questionId,
						answer: answer,

						// renderedAt: timing.renderedAt ?? null,
						// answeredAt: timing.answeredAt ?? null,
						response_duration: timing.duration ?? null,
					}
				];
			}
		});
	};
	useEffect(() => {
		if (selectedAnswers.length) {
			lStorage.setItem('selected-answers', selectedAnswers)
		}
	}, [selectedAnswers])

	useEffect(() => {
		// console.log('aaaaa')
		if (session?.quizQuestions?.length) {
			lStorage.setItem('session-info', session)
		}
		if (sessionHasHydratedRef.current) {
			// console.log('has hydrated')
			return
		}
		if (activeSession) {
			setSession(prev => ({
				...prev,
				...localSession
			}))
			setSelectedAnswers(prev => ([
				...prev,
				...localSelectedAnswers
			]))
			loadStartTime(localSession?.sessionID)
		}
		sessionHasHydratedRef.current = true
	}, [session])
	// console.log('selectedAnswers', selectedAnswers);
	useEffect(() => {
		if (selectedAnswers.length > 0) {
			setFormData(prev => ({
				...prev,
				selectedAnswers,
			}));
		}
		selectedAnswersRef.current = selectedAnswers
		selectedQuestionNumberSerialsRef.current = selectedAnswers.map((answers, aIdx) => {
			return answers.number
		})
	}, [selectedAnswers])

	const loadStartTime = async (sessionID) => {
		if (!sessionID) return
		const queryString = new URLSearchParams({ session: !activeSession }).toString();
		// console.log('getting user start time')
		// console.log({activeSession})

		// const actualStartTime = Date.now(); // or Date.now()
		const endpoint = `${sessionID}?${queryString}`
		const actualStartTime = await fetchStartTime(endpoint);

		setUserStartTime(actualStartTime);
		setShowReadyModal(false);
		setIsPreQuiz(false); // SAME action alert was guarding
		// console.log('setting beginning time')
		const startTime = new Date(actualStartTime).getTime(); // ms
		setQuizStarting(startTime)
	};
	// console.log({QuestionNumber})
	// console.log({selectedAnswers})
	const userChoice = selectedAnswers.find(item => item.questionId === session.quizQuestions[QuestionNumber]?.id)?.answer
	const choiceLetterIndex = session.quizQuestions[QuestionNumber]?.options.findIndex(option => option === userChoice);
	// /////////////////////////////////////


	// this should execute upon submission
	// const totalPointsScored = selectedAnswers.reduce((sum, current) => {
	// 	console.log({current, point: current?.point||0})
	// 	return sum + Number(current?.point||0)
	// }, 0)
	const sessionLength = session.quizQuestions.length
	const totalQuestionsAnswered = selectedAnswers.length
	const totalQuestions = sessionLength
	let isSubmitted = session?.submitted
	const currentQuestionId = session?.quizQuestions?.[QuestionNumber]?.id
	const answerObject = {
		correct_answer: session?.quizAnswers?.find(ans=>ans.question_id===currentQuestionId)?.correct_answer,
		gradeQuestion: session?.quizAnswers?.find(ans=>ans.question_id===currentQuestionId)?.correct,
		answerExplanation: session?.quizAnswers?.find(ans=>ans.question_id===currentQuestionId)?.explanation,
		responseDuration: session?.quizAnswers?.find(ans=>ans.question_id===currentQuestionId)?.response_duration,
	}

	// // resize into columns of 5s for side display
	// const chunkSize = 2;
	// const questionColumns = quizQuestions.reduce((cols, question, index) => {
	// if (index % chunkSize === 0) cols.push([]);
	// cols[cols.length - 1].push(question);
	// return cols;
	// }, []);

	console.log({
		formData,
		ans: session?.quizAnswers,
		isSubmitted,
		// // duration,
		// isPreQuiz,
		// selectedAnswers,
		// // quizQuestions,
		// session,
	})
	// console.log({
	// 	// totalPointsScored,
	// 	totalQuestionsAnswered,
	// 	totalQuestions,
	// 	selectedQuestionNumberSerialsRef: selectedQuestionNumberSerialsRef.current,
	// })
	// console.log({selectedAnswers})
	// console.log({answers: session.quizAnswers})
	// console.log({
	// 	userChoice,
	// 	// sIndex,
	// 	QuestionNumber,
	// 	question: session?.quizQuestions?.[QuestionNumber]?.question,
	// 	questionId: currentQuestionId,
		
	// 	ansObject: session?.quizAnswers?.find(ans=>ans.question_id===currentQuestionId),
	// 	answerObject
	// })
	// console.log({
	// 	isSubmitted,
	// 	localSelectedAnswers,
	// 	activeSession,
	// 	localSession,
	// 	feedback,
	// 	userStartTime,
	// 	isTimeUp,
	// })

	useEffect(() => {
		const question = session?.quizQuestions?.[QuestionNumber];
		if (!question) return;
	
		// Guard: only track first-ever render
		if (!questionTimeRef.current[question.id]) {
			questionTimeRef.current[question.id] = {
				renderedAt: Date.now(),
				// answeredAt: null,
				// duration: null,
			};
		}
	}, [QuestionNumber, session]);

	// console.log({
	// 	selectedAnswers,
	// 	session,
	// 	isSubmitted,
	// 	showReadyModal,
	// 	isTimeUp,
	// 	formData,
	// })

	return (
			<>
				{/* spinner */}
				{loadingPage && <SpinnerBarForPage />}

				{/* start quiz modal */}
				{(showReadyModal) && (
				<ModalOverlay
				isOpen={showReadyModal}
				title="Quiz Ready"
				message="Questions are ready."
				buttonText="Start Quiz"
				modalRef={modalRef}
				buttonRef={startButtonRef}
				onConfirm={() => loadStartTime(session?.sessionID)}
				/>
				)}
				{(isTimeUp) && (
				<ModalOverlay
				isOpen={isTimeUp}
				title="Oopsy!"
				message={
					<>
					Time up
					<br />
					Review your answers
					</>
				}
				buttonText="Review Answers"
				onConfirm={() => setIsTimeUp(false)}
				/>
				)}
				{(isFirstRender) && (
				<ModalOverlay
				isOpen={isFirstRender}
				title="COMING SOON!"
				message={
					<>
					In development
					<br />
					But there is a mock quiz available.
					</>}
				// buttonText="Review Answers"
				onConfirm={() => {
					setIsFirstRender(false)
					sStorage.setItem('isFirstRender', 1)
				}}
				/>
				)}

				<section className={`quiz-content ${loadingPage?'d-none':''}`}>
					<form
					onSubmit={submitHandler}
					// handles pre-quiz
					className={`quiz-text glass ${(isPreQuiz&&!activeSession)?'':'d-none'}`}>
						<h1 className="quiz-head1">Quiz</h1>
						<fieldset className="questions-header">
						{statePreHeadForm.map((input, inpIdx) => {
							// console.log({input})
							const isClass = input.name.toLowerCase()==="class"
							const isSubject = input.name.toLowerCase()==="subject"
							let options = input.options;

							if (isClass) {
								if (formData.type?.toLowerCase() === "basic") {
									options = basicClassArray;
								} else if (formData.type?.toLowerCase() === "jss") {
									options = jssArray;
								} else if (formData.type?.toLowerCase() === "sss") {
									options = sssArray;
								} else {
									options = [noType];
								}
							} else if (isSubject) {
								if (formData.type?.toLowerCase() === "basic") {
									options = basicSubjectArray;
								} else if (formData.type?.toLowerCase() === "jss") {
									options = jssSubjectArrar;
								} else if (formData.type?.toLowerCase() === "sss") {
									options = sssSubjectArray;
								} else {
									options = [noType];
								}
							}
							return (
								<div key={input.name+inpIdx}
								style={{width: input.width}}
								className="form-group floating-field mb-0">
									{input.type==='select' ?
										<>
											<select
											// style={{width: input.width}}
											// className="text-center"
											value={formData[input.name]||''}
											onChange={handleChange}
											name={input.name}
											required={input.required}>
												<option value="" disabled hidden>-- {titleCase(input.name)} --</option>
												{options.map((opt, index) => {
													// console.log({opt, disable: opt.toLowerCase()===noType})
													const string_opt = String(opt)
													return (
													<option key={index} value={string_opt}
													disabled={string_opt.toLowerCase()===noType}
													className="options">
														{titleCase(input.name==='duration'?
															`${Number(string_opt)<1?(Number(string_opt)*60):string_opt}${Number(string_opt)<1?'mins':(Number(string_opt)===1?'hr':'hrs')}`:
																string_opt)}
													</option>
												)})}
											</select>
											<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
										</>
										:
									<>
										<input
										className="text-center"
										// style={{width: input.width}}
										placeholder=" "
										// value={displayValue(formData[input.name], input.case)}
										onChange={handleChange}
										required={input.required}
										disabled={input.disabled}
										type={input.type}
										name={input.name} />
										<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
									</>}
								</div>
							)
						})}
						{/* <h2>Take Quiz Page</h2> */}
						{/* <p>We believe in creating digital experiences that feel natural and intuitive. Our glass morphism design philosophy combines transparency, depth, and subtle animations to create interfaces that users love to interact with.</p> */}
						{/* <p>Founded in 2024, our team of designers and developers are passionate about pushing the boundaries of web design while maintaining accessibility and performance standards.</p> */}
						{/* <p>Every project we undertake is crafted with attention to detail, ensuring that form follows function while never compromising on aesthetic beauty.</p> */}
						</fieldset>
						<div className="d-flex justify-content-center">
							<button
							style={{margin: '1rem 5rem 0 5rem'}}
							type="submit"
							className="cta-button">
								{loading ?
									<Spinner type={'dot'} /> :
									'Take Quiz'}
							</button>
						</div>
					</form>


					{/* quiz section */}
					{/* <div className={`${(!isPreQuiz||activeSession)?'quiz':'d-none'} ${isSubmitted ? 'is-flipped' : ''}`}> */}
					<div className={`${(!isPreQuiz||activeSession)?'quiz':'d-none'}`}>
						{/* handles quiz test */}
						<form
						onSubmit={(e)=>submitHandler(e, !isSubmitted)}
						// handles pretest
						className={`quiz-text glass ultra-small-devices`}>
							{/* <h2>Tests Page</h2>
							<p>Tests Page</p> */}
							<fieldset className="questions-header quiz-questions">
							
								{/* <div className=""> */}
									<>
										{/* <div className=''> */}
											{/* question counter */}
											<div className="d-flex">
												<h5>
													Question {sessionLength?(QuestionNumber + 1):0} of {sessionLength}
												</h5>
												{deviceInfo.label === "mobile" ?
												<div className="mr-05 auto-left">
													<QuizTimer
													isStartTime={quizStarting}
													setIsStarting={setQuizStarting}
													start={userStartTime}
													duration={Number(session?.duration) * 60 * 60} // 2 hrs in seconds
													onWarning={() => setFeedback("warning")}
													onTimeUp={() => setFeedback("timeup")}
													onTabLeave={() => setFeedback("warning")}
													onTimeUpChange={setIsTimeUp}
													isSubmitted={isSubmitted}
													submitHandler={submitHandler}
												/>
												</div>:null}
											</div>
											{/* <div style={styles.rowed}> */}
											{/* navigation buttons */}
											<div className="mb-1">
												{/* previous button */}
												{(QuestionNumber!==0) &&
												<button
												style={{marginRight: 10}}
												className="cta-button prev mb-xs keep-btn-width fit"
												type="button"
												onClick={(e)=>setQuestionNumber(prev => prev - 1)}>
													◀ Previous
												</button>}
												{/* next button */}
												{(QuestionNumber!==sessionLength-1) &&
												<button
												className="cta-button next mb-xs keep-btn-width fit"
												type="button"
												onClick={(e)=>setQuestionNumber(prev => prev + 1)}>
													Next ▶
												</button>}
											</div>
												{/* <Countdown targetDate={countdownHandler(Number(duration))} /> */}
											{/* </div> */}
										{/* </div> */}
										{/* image preview */}
										{session.quizQuestions[QuestionNumber]?.image_url &&
										<div>
											<img
											src={session.quizQuestions[QuestionNumber].image_url}
											alt={`Preview`}
											className="quiz-image-preview"
											// style={{
											// 	width: '350px',
											// 	height: '250px'
											// }}
											/>
										</div>}
										<div>
											<div className="">
												{/* renders questions */}
												<h5 className="no-copy"
												// onCopy={'return false'}
												// onCut={'return false'}
												// onContextMenu={'return false'}
												>
													{session.quizQuestions[QuestionNumber]?.question}
												</h5>
												{/* renders choices */}
												{session.quizQuestions[QuestionNumber]?.options.map((selectedOption, sIndex) => {
													return (
													<div key={sIndex} className="">
														{/* selectable option with hover and active effects */}
														<div className={`selected_choice px-1 radius-5 ${userChoice===selectedOption?'active':''} ${isSubmitted?'submitted':''} ${(isSubmitted&&answerObject.correct_answer===selectedOption)?'correct-answer':''}`}
														onClick={(e)=> {
															selectedAnswerHandler(
																session.quizQuestions[QuestionNumber].id,
																selectedOption)
																if (QuestionNumber!==sessionLength-1) {
																	setQuestionNumber(prev => prev + 1)
																}
														}}>
															{/* option texts */}
															<p className="d-flex align-items-center no-copy">
																{/* option choices (A, B, C, D) then gold highlights for submitted events */}
																<span
																className="choices white-space-pre">
																		{answerOptionsArray[sIndex]}: </span> {selectedOption} {(userChoice===answerObject.correct_answer&&isSubmitted&&answerObject.correct_answer===selectedOption)?<span
																className="d-flex align-items-center">
																	{/* green check (pass) */}
																	<FontAwesomeIcon
																		icon="check"
																		className="font-green"
																	/>
																	<span className="response-time">
																		RT: <DurationDisplay seconds={answerObject?.responseDuration} />
																	</span>
																</span>:
																(userChoice===selectedOption&&isSubmitted)?<span
																className="">
																	{/* red check (fail) */}
																	<FontAwesomeIcon
																		icon="times"
																		className="font-red"
																	/>
																</span>:null}
															</p>
														</div>
													</div>
												)})}
											</div>
										</div>
										<div className="show-choice">
											<p className="choices no-copy">
												{userChoice ?
												isSubmitted?(<><span className="font-white text-underline">Reason:</span>{' '+answerObject?.answerExplanation}</>):
												`Selected choice: ${userChoice} (${answerOptionsArray[choiceLetterIndex]?.toUpperCase()})`:
												null}
											</p>
										</div>
									</>
								{/* </div> */}

							{/* <h2>Take Tests Page</h2> */}
							{/* <p>We believe in creating digital experiences that feel natural and intuitive. Our glass morphism design philosophy combines transparency, depth, and subtle animations to create interfaces that users love to interact with.</p> */}
							{/* <p>Founded in 2024, our team of designers and developers are passionate about pushing the boundaries of web design while maintaining accessibility and performance standards.</p> */}
							{/* <p>Every project we undertake is crafted with attention to detail, ensuring that form follows function while never compromising on aesthetic beauty.</p> */}
							</fieldset>
							<div className="d-flex justify-content-center">
								<button
									style={{margin: deviceInfo.label === "mobile"?'1rem 1rem 0 3rem':'1rem 1rem 0 5rem'}}
									type="submit"
									disabled={(!isSubmitted&&!selectedAnswers.length)}
									className="cta-button text-nowrap">
										{loading ?
											<Spinner type={'dot'} /> :
											isSubmitted?'Retake Quiz':'Submit'}
								</button>
								<button
									style={{margin: deviceInfo.label === "mobile"?'1rem 3rem 0 1rem':'1rem 5rem 0 1rem'}}
									onClick={(e)=>{
										if (isSubmitted) {
											handleRePopulateFormData()
										}
										handleClearSession()
									}}
									type="button"
									// disabled={(!isSubmitted&&!selectedAnswers.length)}
									className={`cta-button text-nowrap`}>
										{isSubmitted?'New Quiz':'Cancel Test'}
								</button>
							</div>
						</form>

						{/* timer and question list section */}
						<div className="align-self-baseline mb-0 ultra-small-devices-ans">
							<div className="stat-card glass">
								{/* <div className="stat-number">150+</div> */}
								{deviceInfo.label !== "mobile" ?
								<QuizTimer
									isStartTime={quizStarting}
									setIsStarting={setQuizStarting}
									start={userStartTime}
									duration={Number(session?.duration) * 60 * 60} // 2 hrs in seconds
									onWarning={() => setFeedback("warning")}
									onTimeUp={() => setFeedback("timeup")}
									onTabLeave={() => setFeedback("warning")}
									onTimeUpChange={setIsTimeUp}
									isSubmitted={isSubmitted}
									submitHandler={submitHandler}
								/>:null}
								<div className="stats-grid">
									{session.quizQuestions.map((question, qIdx) => {
										const isCorrect = session?.quizAnswers?.find(answer=>answer.question_id===question.id)?.correct
										// console.log({
										// 	question,
										// 	qIdx,
										// 	qID: question.id,
										// 	isCorrect,
										// })
										return (
										<div
										key={question.question + qIdx}
										onClick={(e)=>setQuestionNumber(qIdx)}
										className={`stat-label number-hover overflow-hidden ${selectedQuestionNumberSerialsRef.current.includes(qIdx)?'glass choices':''} ${isSubmitted?(isCorrect?'question-box-green':isCorrect===false?'question-box-red':''):''}`}>
										{`${String(qIdx + 1).padStart(2, "0")}`}
										</div>
									)})}
								</div>
								<div className="pt-1">
									{session?.quizAnswers?.length ?
										<>
											<p className="quiz-score">Score: {session?.quizScore}/{session?.quizQuestions?.length}</p>
											<p className="quiz-score attempts">Questions Attempted: {session?.quizAttempted}</p>
											<p className="quiz-score duration">Duration: <DurationDisplay seconds={session?.quizDuration} /></p>
										</> : null}
								</div>
							</div>
						</div>
					</div>
				</section>
			</>
	)
}



function QuizTimer({
	start, duration, isStartTime, setIsStarting, onTimeUp,
	onWarning, onTabLeave, onTimeUpChange, isSubmitted, submitHandler } = {}) {
	const [timeLeft, setTimeLeft] = useState(0); // seconds
	const warnedRef = useRef(false);
	const _10percent = Math.ceil(0.1 * duration)
	const isTimeUp = timeLeft <= 0;
	const expiredReportedRef = useRef(false);
	const hasStartedRef = useRef(false);
	const intervalRef = useRef(null);

	// expose isTimeUp to parent
	// console.log('outside', {
	// 	// isSubmitted,
	// 	// start,
	// 	// duration,
	// 	// timeLeft,
	// 	// isStartTime,
	// 	// expiredReportedRef: expiredReportedRef.current,
	// 	// hasStartedRef: hasStartedRef.current,
	// })
	useEffect(() => {
		// console.log('yyyyy')
		// console.log('in effect', {
		// 	isSubmitted,
		// 	// start,
		// 	// duration,
		// 	// timeLeft,
		// 	// isStartTime,
		// 	// expiredReportedRef: expiredReportedRef.current,
		// 	// hasStartedRef: hasStartedRef.current,
		// })
		if (!start) {
			// console.log('no start')
			setTimeLeft(0);
			warnedRef.current = false;
			hasStartedRef.current = false;
			expiredReportedRef.current = false;
		}
		if (!duration||!isStartTime) {
			const durationErr = "Error: Duration not set properly"
			console.warn(durationErr)
			// toast.error(durationErr)
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			setTimeLeft(0);
			return;
		}

		const startTime = new Date(start).getTime(); // ms
		const endTime = startTime + duration * 1000;

		const tick = () => {
			const now = Date.now();
			const diff = Math.floor((endTime - now) / 1000);

			// console.log({
			// 	diff,
			// 	isSubmitted,
			// 	// gt0: diff>0,
			// 	// ltm1: diff<-1,
			// 	// start,
			// 	// duration,
			// 	// timeLeft,
			// 	// startTime,
			// 	// expiredReportedRef: expiredReportedRef.current,
			// 	// hasStartedRef: hasStartedRef.current,
			// })
			// gt0 and start
			if (diff > 0 || (start && diff < -1)) {
				// console.log('setting has started to true')
				hasStartedRef.current = true;
				if (diff > 0) {
					expiredReportedRef.current = false
				}
			}

			if (diff <= 0) {
				// console.log('time may be up or just starting')
				if (!expiredReportedRef.current
					&& hasStartedRef.current
				) {
					// console.log('bulls eye'.repeat(5))
					expiredReportedRef.current = true;
					// STOP tick interval
					if (intervalRef.current) {
						// console.log('clearing interval triggered')
						clearInterval(intervalRef.current);
						intervalRef.current = null;
						// setIsStarting(null)
					}
					if (!isSubmitted) {
						// console.log('trigger time up overlay')
						onTimeUpChange?.(true);
						submitHandler?.(null, true) // forcefully submit current progress
					}
					setIsStarting(null)
					onTimeUp?.();
				}
				setTimeLeft(0);
				// setIsExpired(hasExpired)
				// onTimeUp?.();
				return;
			}
	
			setTimeLeft(diff);
	
			if (diff <= _10percent && !warnedRef.current) {
				// console.log('warning phase')
				warnedRef.current = true;
				onWarning?.();
			}
		};
	
		// tick(); // sync immediately
		if (!intervalRef.current) {
			// console.log('ticking started')
			// setIsStarting(true)
			intervalRef.current = setInterval(tick, 1000);
		}

		return () => {
			// console.log('in clearing interval return')
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		};
	}, [start, duration, isStartTime]);

	// detect tab switching (kids cheating)
	useEffect(() => {
		const handleVisibility = () => {
			if (document.hidden) {
				onTabLeave?.();
			}
		};

		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, [onTabLeave]);

	// time breakdown
	const hours = Math.floor(timeLeft / 3600);
	const minutes = Math.floor((timeLeft % 3600) / 60);
	const seconds = timeLeft % 60;

	return (
		<div className="timer-wrapper">
			<div
				className={`timer-display ${
					(!isTimeUp && timeLeft <= _10percent) ?
						"timer-danger" : ""}`}>
				{/* {hours.toString().padStart(2, "0")}:
				{minutes.toString().padStart(2, "0")}:
				{seconds.toString().padStart(2, "0")} */}
				{isTimeUp ?
					<span className="timer-dash">--:--:--</span> :
					<>
						{hours.toString().padStart(2, "0")}:
						{minutes.toString().padStart(2, "0")}:
						{seconds.toString().padStart(2, "0")}
					</>
				}
			</div>
		</div>
	);
}

function useGetStartTime () {
	// console.log('in use get time')
	const fetchTime = async (sessionID) => {
		// console.log('in fetch time', {sessionID})
		if (!sessionID) return
		const endpoint = `take-quiz/quiz-attempt/${sessionID}`
		const responseStartTime = await FetchFromServer(endpoint)
		// console.log({responseStartTime})
		if (responseStartTime?.ok) {
			// console.log({startTime: responseStartTime.data})
			return responseStartTime.data
		}
		return null
	}
	return fetchTime
}

function DurationDisplay({ seconds }) {
	if (seconds == null || isNaN(seconds)) return null;

	const totalSeconds = Math.floor(seconds);

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;

	return (
		<span className="text-nowrap">
			{hours > 0 && `${hours}h `}
			{minutes > 0 && `${minutes}m `}
			{(secs > 0 || (hours === 0 && minutes === 0)) && `${secs}s`}
		</span>
	);
}

function ModalOverlay({
	isOpen,
	title,
	message,
	buttonText = "Continue",
	onConfirm,
	modalRef = null,
	buttonRef = null,
}) {
	if (!isOpen) return null;
  
	return (
		<div className="ready-backdrop" aria-hidden={!isOpen}>
			<div
			className="ready-modal"
			ref={modalRef}
			role="dialog"
			aria-modal="true"
			aria-labelledby="ready-title"
			>
			<h3 id="ready-title">{title}</h3>
	
			<p>{message}</p>
	
			<button
				className="cta-button modal"
				ref={buttonRef}
				onClick={onConfirm}
			>
				{buttonText}
			</button>
			</div>
		</div>
	);
}

export { Quiz };