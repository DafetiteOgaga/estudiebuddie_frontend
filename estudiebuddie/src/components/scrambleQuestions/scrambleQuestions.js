import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { QuestionsArrComp } from "./questionsArrComp";
import { FetchFromServer, buildFormData, serverOrigin } from "../../hooks/FetchFromServer";
import { titleCase, sentenceCase, formatPhoneNumber } from "../../hooks/changeCase";
import { justNumbers, generateUniqueId, spaceToHyphen } from "../../hooks/formHooks";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit";
import { imageCompression } from 'browser-image-compression';
import { useDeviceInfo } from "../../hooks/deviceType";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckBoxBtnUI } from "../sections/signUp";
import { TheoryBuilder } from "./theoryQuestions";

let formValues = {
	// school: "",
	// email: "",
	level: "",
	subject: "",
	// phone: "",
	class: "",
	term: "",
	duration: "",
	totalQs: "",
	department: "",
	// session: "",
	instruction: "",
	noOfTypes: "",
	questions: [],
}

const questionObject = {
	number: '',
	// question: '',
	question_mode: [],
	question: [
		{ type: "text", value: "" } // default block
	],
	correct_answer: '',
	wrong_answer1: '',
	wrong_answer2: '',
	wrong_answer3: '',
	image: null,
}

const levelArray = ['basic', 'jss', 'sss']
const basicClassArray = [
	"basic1",
	"basic2",
	"basic3",
	"basic4",
	"basic5",
];
const jssClassArray = [
	"jss1",
	"jss2",
	"jss3",
];
const sssClassArray = [
	"sss1",
	"sss2",
	"sss3",
];
const termArray = ['first', 'second', 'third']
const secondarySubjects = [
	"english language",
	"mathematics",
	"civic education",
];

const basicClassSubjects = [
	...secondarySubjects,
	'basic science',
	'social studies',
	'crs',
	'irs',
	'history',
	'cultural & creative arts',
	'computer studies',
	'home economics',
]
const juniorSecondarySubjects = [
	...secondarySubjects,
	"one nigerian language",
	"integrated science",
	"physical & health education",
	"digital technologies",
	"crs / irs",
	"nigerian history",
	"social & citizenship studies",
	"cultural & creative arts",

	"business studies",
	"french studies",
	"arabic studies",
];
const scienceSubjects = [
	...secondarySubjects,
	"biology",
	"chemistry",
	"physics",
	"further mathematics",
	"agricultural science",
	"technical drawing",
	"geography",
	"computer studies / ict",
	"physical / health education",
	"foods & nutrition / home economics",
];
const artsSubjects = [
	...secondarySubjects,
	"literature in english",
	"government",
	"history",
	"crs",
	"irs",
	"french / other foreign languages",
	"nigerian language(s)",
	"visual / fine arts",
	"music",
	"geography",
	"economics",
];
const commercialSubjects = [
	...secondarySubjects,
	"economics",
	"commerce",
	"financial accounting",
	"business studies",
	"marketing",
	"accounting",
	"office practice",
	"bookkeeping",
	"data processing / computer studies",
	"government",
];
const noLevel = "no level selected"
const noClass = "no class selected"
const selectDept = "Select a department"
let formHead = [
	{
		name: "totalQs",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "No. of Questions",
		width: "20%",
		case: null,
	},
	{
		name: "school",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "School Name",
		width: "50%",
		case: 'upper',
	},
	{
		name: "level",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Level",
		width: "20%",
		options: levelArray,
		case: "upper",
	},
	{
		name: "class",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Class",
		width: "20%",
		options: [noLevel],
		case: "sentence",
	},
	{
		name: "subject",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Select Subject",
		width: "25%",
		options: [noClass],
		case: 'sentence',
	},
	{
		name: "noOfTypes",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "No. of Types",
		width: "20%",
		case: null,
	},
	{
		name: "term",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Term",
		width: "15%",
		options: termArray,
		case: "title",
	},
	{
		name: "duration",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Duration (hour)",
		width: "20%",
		case: null,
	},
	{
		name: "instruction",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Instruction",
		width: "40%",
		case: "title",
	},
]
const dyName = ['totalQs']
const displayValue = (val, strCase) => {
	// console.log({val, strCase})
	if (!val) return
	if (strCase === "upper") return val.toUpperCase();
	if (strCase === "lower") return val.toLowerCase();
	if (strCase === "title") return titleCase(val);
	if (strCase === "sentence") return sentenceCase(val);
	if (strCase === "phone") return formatPhoneNumber(val);
	return val;
};

let endpoint = 'shufflequestions'

const fetchDownloadLinkss = async ({endpoint, setDownloadLink}) => {
	const subpoint = 'get-links'
	const downloadLinks = await FetchFromServer(`${endpoint}/${subpoint}`)
	if (downloadLinks.ok) {
		// console.log({data: downloadLinks?.data})
		setDownloadLink(downloadLinks?.data)
	}
}

function customFindLast(arr, predicate) {
	console.log({arr_in_customFindLast_1: arr,
				predicate_in_customFindLast_1: predicate
	})
	if (!Array.isArray(arr)) return undefined;

	for (let i = arr.length - 1; i >= 0; i--) {
		if (predicate(arr[i], i, arr)) {
			return arr[i];
		}
	}
	return undefined;
}

function normalizeTheory(data) {
	// Step 1: convert object with numeric keys to array
	const arr = Array.isArray(data)
		? data
		: Object.keys(data)
			.sort((a, b) => a - b)
			.map(key => data[key][0]); // because each key holds an array

	// Step 2: recursively fix children
	return arr.map(node => ({
		...node,
		children: node.children
			? normalizeTheory(node.children)
			: []
	}));
}

function ScrambleQuestionsComponent() {
	const levelRef = useRef('')
	const classRef = useRef('')
	const deviceTypeCheckRef = useRef(false)
	const [dept, setDept] = useState('')
	const [formHeadState, setFormHeadState] = useState(formHead);
	const [hasDiffSchool, setHasDiffSchool] = useState(false);
	// console.log({hasDiffSchool})
	const userInfoRef = useRef(false)
	const location = useLocation()
	const isFetch = !!location?.state?.fetchID
	const fetchID = location?.state?.fetchID
	const { lStorage, sStorage } = useCreateStorage()
	const userInfo = lStorage.getItem('user')
	const hasSchool = userInfo?.school
	const localSavedDetails = lStorage.getItem(`saved-detail-${fetchID}`)
	const hasLocalSavedClassRef = useRef({
		class: false,
		subject: false
	})
	const deviceInfo = useDeviceInfo()
	const isMobileDev = deviceInfo.width<=768
	const [tick, setTick] = useState(Date.now());
	const [loadingPage, setLoadingPage] = useState(true);
	const [rememberLoading, setRememberLoading] = useState(false);
	const [submittingTToSchLoading, setSubmittingTToSchLoading] = useState(false);
	const [scrambleLoading, setScrambleLoading] = useState(false);
	// const formDataRef = useRef(new FormData())
	const totalNoOfQsRef = useRef(1)
	const [totalNoOfQs, setTotalNoOfQs] = useState(Number.isNaN(formValues.totalQs) ? 1 : formValues.totalQs)
	const [questionFormData, setQuestionFormData] = useState([])
	const uploadToCloud = useUploadToImagekit()
	// const [showSubmitArray, setShowSubmitArray] = useState([false, false]);
	const [downloadLink, setDownloadLink] = useState(null);
	const [formData, setFormData] = useState(formValues);
	const hasFetched = useRef(false)
	const [isNewDownload, setIsNewDownload] = useState(false)
	const [uploadedSchLogo, setUploadedSchLogo] = useState(null)
	const [isClearUploadedLogo, setIsClearUploadedLogo] = useState(false)
	const [savedSession, setSavedSession] = useState(null)
	const [hasSubmitted, setHasSubmitted] = useState({})
	const diagramStageRefs = useRef({});
	const [removeObjectives, setRemoveObjectives] = useState(false)
	const [theory, setTheory] = useState([])
	const [addTheory, setAddTheory] = useState(false)
	const theoryQuestionsRef = useRef(null)

	const updateTheoryState = (data) => {
		setTheory(data)
	}
	useEffect(() => {
		if (!addTheory) {
			setTheory([])
			setFormData(prev => {
				const {theory, ...rest} = prev
				return rest
			})
		}
	}, [addTheory])

	useEffect(() => {
			if (addTheory) {
				setFormData(prev => {
					return { ...prev, theory: theory }
				})
			}
	}, [theory])
	// useEffect(() => {
	// 	if (!addTheory) {
	// 		updateTheoryState([])
	// 	} else {
	// 		setFormData(prev => {
	// 			return {...prev, theory: theory}
	// 		})
	// 	}
	// }, [addTheory,theory])
	const handleDeptSet = (value='') => {
		if (value===null||value===undefined) return ''
		setDept(value)
		setFormData(prev => {
			return {...prev, department: value}
		})
	}

	useEffect(() => {
		if (!isFetch) return
		if (localSavedDetails) {
			console.log('fetching from local storage')
			console.log({localSavedDetails})
			setSavedSession(localSavedDetails)
			hasLocalSavedClassRef.current = {
				class: true,
				subject: true
			}
			// console.log('setting has submitted...')
			// setHasSubmitted({[fetchID]: localSavedDetails?.has_submitted})
		} else {
			// console.log('fetching from server')
			const fetchSavedScramble = async () => {
				const response = await FetchFromServer(`school/save/${fetchID}`)
				// console.log({response})
				const data = response?.data
				if (response?.ok) {
					lStorage.setItem(`saved-detail-${fetchID}`, data)
					setSavedSession(data)
					hasLocalSavedClassRef.current = {
						class: true,
						subject: true
					}
					// console.log('setting has submitted...')
					// setHasSubmitted({[fetchID]: data?.has_submitted})
				}
			}
			fetchSavedScramble()
		}
	}, [])

	useEffect(() => {
		// console.log({userInfoRef: userInfoRef.current})
		if (!hasSchool?.name) {
			// console.log('already ran.')
			return
		}
		// console.log('running formvalues', formHeadState)
		// console.log({userInfo})
		setFormHeadState(prev=> prev.filter(fh => fh.name!=='school'))
		// console.log({formHeadState})
	}, [hasSchool?.name])

	useEffect(() => {
		// console.log({formHeadState})
		if (hasDiffSchool) {
			setFormHeadState(prev=> [
				...prev.slice(0, 1),
				{
					name: "school",
					required: true,
					disabled: false,
					type: "text",
					placeholder: "School Name",
					width: "50%",
					case: "upper",
				},
				...prev.slice(1),
			])
		} else {
			setFormHeadState(prev => prev.filter(fh => fh.name !== 'school'));
		}
		// console.log({formHeadState})
	}, [hasDiffSchool])

	useEffect(() => {
		// console.log({formHeadState})
		if (!removeObjectives) {
			// adding objectives
				setFormHeadState(prev=> {
					const totalQsExists = prev.some(fh => fh.name === 'totalQs');
					console.log({totalQsExists})
					let returnedPrev = [...prev]
					if (!totalQsExists) {
						returnedPrev =  [
							{
								name: "totalQs",
								required: true,
								disabled: false,
								type: "text",
								placeholder: "No. of Questions",
								width: deviceInfo.label === "mobile"?"40%":"20%",
								case: null,
							},
							...returnedPrev,
						]
					}
					return returnedPrev
				})
				// setFormData(prev => ({
				// 	...prev,
				// 	totalQs: 1,
				// }))
				console.log('🏆'.repeat(10))
				// setTotalNoOfQs(2)
				// console.log('❎'.repeat(10))
				// setTotalNoOfQs(prev => {
				// 	if (prev !== 1) {
				// 		console.log('❎'.repeat(10))
				// 		return 1;
				// 	}
				// 	console.log('♻'.repeat(10))
				// 	return prev;
				// });
				setTotalNoOfQs(1)
		} else {
			// removing objectives
			setFormHeadState(prev => prev.filter(fh => fh.name !== 'totalQs'));
			setQuestionFormData([])
			setFormData(prev => ({
				...prev,
				totalQs: '',
				questions: []
			}))
			setTotalNoOfQs(0)
		}
		// console.log({formHeadState})
	}, [removeObjectives])

	useEffect(() => {
		// console.log('effecting')
		setFormHeadState(prev => {
			// console.log('setting fh state')
			return prev.map(obj => {
				// console.log('mapping')
				if (obj.name.toLowerCase() === "class" && levelRef.current!==formData.level) {
					// console.log("class obj found");
					// console.log({level: formData.level})
			
					let options = obj.options;
					let lcase = obj.case
			
					if (formData.level.toLowerCase() === "basic") {
						// console.log("running for basic class");
						options = basicClassArray;
						lcase = 'upper'
					} else if (formData.level.toLowerCase() === "jss") {
						// console.log("running for jss class");
						options = jssClassArray;
						lcase = 'upper'
					} else if (formData.level.toLowerCase() === "sss") {
						// console.log("running for sss class");
						options = sssClassArray;
						lcase = 'upper'
					}
					
					if (!hasLocalSavedClassRef.current.class) {
						// console.log('clearing class and subject')
						setFormData(prev=>({
							...prev,
							class: '',
							subject: ''
						}))
						hasLocalSavedClassRef.current.class = false
					}
					levelRef.current = formData.level
					return { ...obj, options, case: lcase };
				} else if (obj.name.toLowerCase() === "subject"
				// && classRef.current!==formData.class
				) {
					// console.log("subject obj found");
					// console.log({classobj: formData.class})
			
					let options = obj.options;
					let lcase = obj.case
			
					if (formData.class.toLowerCase().includes("basic")) {
						// console.log("running for basic subjects");
						options = basicClassSubjects;
						lcase = 'title'
					} else if (formData.level.toLowerCase().includes("jss")) {
						// console.log("running for jss subjects");
						options = juniorSecondarySubjects;
						lcase = 'title'
					} else if (formData.level.toLowerCase().includes("sss")) {
						// console.log("running for sss class");
						if (!dept) {
							// console.log('no dept')
							options = [selectDept]
							lcase = 'sentence'
						} else {
							// console.log('dept valid')
							if (dept==='art') {
								// console.log({dept})
								options = artsSubjects;
							} else if (dept==='commercial') {
								// console.log({dept})
								options = commercialSubjects
							} else if (dept==='science') {
								// console.log({dept})
								options = scienceSubjects
							}
							lcase = 'title'
						}
					}
					if (!hasLocalSavedClassRef.current.subject) {
						// console.log('clearing subject only')
						setFormData(prev=>({...prev, subject: ''}))
						hasLocalSavedClassRef.current.subject = false
					}
					classRef.current = formData.class
					return { ...obj, options, case: lcase };
				}
				return obj;
			})
		});
		if (!formData.class.toLowerCase().includes('sss')) {
			handleDeptSet()
		}
	}, [formData.level, formData.class, dept]);

	useEffect(() => {
		if (deviceTypeCheckRef.current) return
		if (deviceInfo.label === "mobile") {
			// console.log('mobile'.repeat(5), formHeadState)
			setFormHeadState(prev =>
				prev.map(obj => {
					  // create a shallow copy of obj
					const updatedObj = { ...obj };

					if (obj.name === "totalQs") {
						updatedObj.width = "40%";
					} else if (obj.name === "level") {
						updatedObj.width = "28%";
					} else if (obj.name === "school") {
						updatedObj.width = "100%";
					} else if (obj.name === "subject") {
						updatedObj.width = "65%";
					} else if (obj.name === "noOfTypes") {
						updatedObj.width = "30%";
					} else if (obj.name === "class") {
						updatedObj.width = "29%";
					} else if (obj.name === "term" || obj.name === "duration") {
						updatedObj.width = "37%";
					} else if (obj.name === "instruction") {
						updatedObj.width = "100%";
					}
				
					return updatedObj;
				})
			);
			deviceTypeCheckRef.current = true
			// console.log({formHeadState})
		}
	}, [deviceInfo])

	useEffect(() => {
		if (!savedSession) return
		// console.log('updating form data')
		const scramble_session_data = savedSession?.scramble_session_data
		console.log({scramble_session_data, questions: scramble_session_data.questions})
		let savedQuestionsArr
		if (typeof scramble_session_data.questions === "object" &&
			!Array.isArray(scramble_session_data.questions)) {
				// console.log('converting from obj to arr')
				// ? Object.values(scramble_session_data.questions).flat() // flatten arrays
				savedQuestionsArr = Object.values(scramble_session_data.questions).flat()
				.map(item=>{
					if (item?.question) {
						// console.log('found: question', {question: item.question})
						item.question = Object.values(item?.question).flat()
						// console.log({typeOfItem: typeof (item.question)})
						const hasDiagram = item.question.some(dia=>dia.type==="diagram")
						// console.log({hasDiagram})
						if (hasDiagram) {
							// handle group and ungrouping here too
							const diagramIndex = item.question.findIndex(q => q.type === "diagram")
							// const diagramObject = Object.values(item.question.find(item=>item.type==="diagram")?.value.diagramShapes).flat()
							const diagramObject = Object
												.values(item.question[diagramIndex].value.diagramShapes)
												.flat()
							// console.log('found diagram', {diagramObject})
							item.question[diagramIndex].value.diagramShapes = diagramObject
							// const dObject = Object.values(diagramObject).flat()
							// console.log({dObject})
						}
						// console.log({question: item?.question})
					}
					if (item?.question_mode) {
						// console.log('found: mode')
						item.question_mode = Object.values(item?.question_mode).flat()
						// console.log({mode: item?.question_mode})
					}
					return item
				})
				// console.log({converted_savedQuestionsArr: savedQuestionsArr})
		} else {
			savedQuestionsArr = scramble_session_data.questions;
			// console.log({not_converted_savedQuestionsArr: savedQuestionsArr})
		}
		// if (scramble_session_data) {
		let theoryQuestions = scramble_session_data?.theory||[]
		if (typeof theoryQuestions === "object") {
			theoryQuestions = normalizeTheory(theoryQuestions)
		}
		console.log({theoryQuestions})
		if (theoryQuestions.length) {
			theoryQuestionsRef.current = theoryQuestions
			setAddTheory(true)
		}
		// if (scramble_session_data?.questions) {
		// 	setRemoveObjectives(false)
		// }
		const isObj = Object.keys(scramble_session_data?.questions||{})
		setRemoveObjectives(!isObj?.length)
		console.log({
			scramble_session_data,
			isObj,
			length: isObj?.length,
			bool: !isObj?.length
		})
		// }
		// console.log({savedQuestionsArr})
		setFormData(prev => {
			// console.log({prev})
			const updatedFormData = {
				...prev,
				...{
					...scramble_session_data,
					questions: savedQuestionsArr,
					theory: theoryQuestions,
				}
			}
			// console.log({updatedFormData})
			return updatedFormData
		})
		handleDeptSet(scramble_session_data?.department)
		setQuestionFormData(savedQuestionsArr||[])
		// console.log('setting has submitted...')
		setHasSubmitted({[fetchID]: savedSession?.has_submitted})
	}, [savedSession])

	useEffect(() => {
		setLoadingPage(false)
		if (!hasFetched.current) {
			fetchDownloadLinkss({endpoint, setDownloadLink})
			hasFetched.current = true
		}
	}, []);
	useEffect(() => {
		const i = setInterval(() => setTick(Date.now()), 30_000);
		return () => clearInterval(i);
	}, []);

	const handleQuestionChange = (e=null, data=null, index, mode='+') => {
		// console.log('question refs:', questionFormData.map(q => q.question))
		// console.log('in handle question change fxn...', {data, index})
		// if (!e && !data?.files?.[0]) return
		if (!e && data?.name!=='image') return
		let { name, value, files, type } = (e&&e?.target) ? e.target : data
		// console.log({name, value, files, type, index, questionFormData, mode})
		// let updatedQuestions = [...questionFormData];
		let updatedQuestions = [...questionFormData];
		let currentQuestion = structuredClone(updatedQuestions[index]); // deep copy THIS question
		if (!currentQuestion) return
		// console.log({updatedQuestions, questionFormData, currentQuestion})
		updatedQuestions[index] = currentQuestion;
		// updatedQuestions[index] = currentQuestion;
		// if (totalFileUploadQuestions) updatedQuestions = [...fileUploadQuestions]
		updatedQuestions[index]["number"] = index + 1; // auto-add/update question number
		let file;
		// console.log({name})
		if (name === "image") {
			// console.log('in image mod')
			file = files[0];
			// console.log({file})
			if (!file) {
				updatedQuestions[index].image = null; // assign image file object
				updatedQuestions[index].previewImage = null; // assign preview URL for the image
			} else {
				updatedQuestions[index].image = file; // assign image file object
				updatedQuestions[index].previewImage = URL.createObjectURL(file); // assign preview URL for the image
			}
			// console.log({updatedQuestions: updatedQuestions[index]})
		} else if (name === "question_text") {
			const textBlock = customFindLast(updatedQuestions[index].question, b => b.type === "text");
			if (textBlock) {
				name = "question"
				textBlock.value = value;
			}
		} else if (name === "question_text") {
			// console.log('question_text'.repeat(10))
			const blocks = updatedQuestions[index].question.map(b => ({ ...b }));
			let textBlock = customFindLast(blocks, b => b.type === "text");

			if (!textBlock) {
				blocks.push({ type: "text", value });
			} else {
				textBlock.value = value;
			}

			updatedQuestions[index].question = blocks;
		} else if (name === "question_math") {
			// console.log('question_math'.repeat(10))
			const blocks = updatedQuestions[index].question.map(b => ({ ...b }));
			let mathBlock = customFindLast(blocks, b => b.type === "math");

			if (!mathBlock) {
				blocks.push({ type: "math", value });
			} else {
				mathBlock.value = value;
			}

			updatedQuestions[index].question = blocks;
		} else if (name === "question_diagram") {
			// console.log('question_diagram'.repeat(10))
			const blocks = updatedQuestions[index].question.map(b => ({ ...b }));

			let diagramBlock = customFindLast(blocks, b => b.type === "diagram");

			if (!diagramBlock) {
				blocks.push({
					type: "diagram",
					value: structuredClone(value),
					// diagramInstance: value.diagramInstance,
				});
			} else {
				diagramBlock.value = structuredClone(value);
				// diagramBlock.diagramInstance = value.diagramInstance;
			}

			updatedQuestions[index].question = blocks;
		}

		else {
			updatedQuestions[index][name] = value;
		}
		// setQuestions(updatedQuestions)
		// console.log({file})
		setFormData((prev) => {
			const updated = [...updatedQuestions];
			// const updated = prev.questions.map((q, i) => i === index ? {...q} : q);
			if (mode === '-') {
				updated[index] = {
					...updated[index],
					image: null,
				};
			} else if (name === "question" || name === "question_text" || name === "question_math" || name === "question_diagram") {
				// blocks already updated in updatedQuestions[index].question above
				updated[index] = {
					...updated[index],
					question: updatedQuestions[index].question,
				};
			} else {
				updated[index] = {
					...updated[index],
					[name]: file ? file : value,
				};
			}
			return {
				...prev,
				questions: updated,
			}
		})
		setQuestionFormData(prev => {
			const updated = [...prev]
			if (mode === '-') {
				// removes uploaded image
				updated[index] = {
					...updated[index],
					image: null,
					previewImage: null,
				};
			} else if (name === "question" || name === "question_text" || name === "question_math" || name === "question_diagram") {
				updated[index] = {
					...updated[index],
					question: updatedQuestions[index].question,
				};
			} else {
				updated[index] = {
					...updated[index],
					[name]: file ? file : value,
				};
			}
			return updated
		})
		if (mode === '-') {
			const input = document.getElementById(`image-upload-${index}`);
			if (input) input.value = '';
		}
	};

	useEffect(() => {
		// console.log({uploadedSchLogo, isClearUploadedLogo})
		// const handleImages = (file, index) => [
		handleChange(
			null,
			{
				name: 'logo',
				value: isClearUploadedLogo?'':uploadedSchLogo?.imgPreview,
				files: isClearUploadedLogo?['clear']:[uploadedSchLogo?.compressedFile],
				type: 'file'
			},
			isClearUploadedLogo ? '-' : '+'
		)
	}, [uploadedSchLogo, isClearUploadedLogo])

	const handleChange = (e=null, data=null, mode='+') => {
		if (!e && !data?.files?.[0]) return
		let { name, value, files, type } = e ? e.target : data
		// console.log({name, value, files, type, mode})
		let file
		let previewLogo
		if (name === "logo") {
			file = files[0];
			previewLogo = value
			// previewLogo = URL.createObjectURL(file); // assign preview URL for the image
		} else {
			if (name === 'totalQs'||name === 'phone'||
				name === 'noOfTypes'||name === 'duration') {
				value = justNumbers(value)
				if (name === 'totalQs') {
					setTotalNoOfQs(Number.isNaN(value) ? 0 : value)
					totalNoOfQsRef.current = Number.isNaN(value) ? 0 : value
				}
			}
			if (name==='subject') {
				value = spaceToHyphen(value)
			}
		}

		setFormData((prev) => {
			// console.log({name, value, file})
			if (mode === '-') {
				return {
					...prev,
					logo: null,
					previewLogo: '',
				}
			} else {
				const updteImage = {
					[name]: file,
					previewLogo,
				}
				return {
					...prev,
					...(file ?
						updteImage:
						{[name]: value.toLowerCase()}
					)
				}
			}
		})
		setIsClearUploadedLogo(false)
	};

	useEffect(() => {
		console.log('🔥 totalNoOfQs changed:', totalNoOfQs);
			const newQuestions = []
			for (let i=0; i<totalNoOfQs; i++) {
				// console.log('adding...')
				const uniqueId = generateUniqueId()
				// console.log({uniqueId})
				// const newClonedQuestion = structuredClone(questionObject)
				// newQuestions.push({...questionObject, uniqueId, question_mode: 'text'})
				newQuestions.push({...questionObject, uniqueId, question_mode: ['text'], question: questionObject.question.map(b => ({...b}))})
			}
			// console.log({newQuestions})
			setQuestionFormData(newQuestions);
		// }
	}, [totalNoOfQs]);

	const submitHandler = async (e, isRemember=false, isSubmitToSch=false) => {
		e.preventDefault(); // prevent default page refresh

		console.log({isRemember, isSubmitToSch})
		// return
		// setLoading(true)

		console.log({formData})
		let cleanedData
		let fd = {...formData}
		let shuffleEndpoint

		// For each question with diagram, generate PNG
		fd.questions.forEach((q, idx) => {
			const stage = diagramStageRefs.current[idx];
			if (stage) {
			const dataURL = stage.toDataURL({ pixelRatio: 2 }); // optional: higher res
			if (!q.question) q.question = [];
			q.question.push({
				type: "diagram_png",
				value: dataURL,
			});
			}
		});
		console.log({updatedFormData: fd})

		if (isRemember||isSubmitToSch) {
			if (isRemember) {
				setRememberLoading(true)
				shuffleEndpoint = 'school/save/true'
			} else {
				setSubmittingTToSchLoading(true)
				shuffleEndpoint = `${endpoint}/exam-questions`
			}
			fd = structuredClone(formData);

			console.log({fd})
			// map each question to a promise, keeping track of its index
			const uploadPromises = fd.questions.map((question, index) => {
				if (question?.image) {
					return uploadToCloud({
							selectedFile: question.image,
							fileName: 'test-question',
							folder: 'questions',
						}).then(uploadResult => ({
							index,
							uploadResult,
					}));
				}
				// If no image, resolve immediately with null
				return Promise.resolve({ index, uploadResult: null });
			});

			// wait for all uploads in parallel
			const results = await Promise.all(uploadPromises);
			console.log({results})

			// update cleanedData after all uploads
			results.forEach(({ index, uploadResult }) => {
				const question = fd.questions[index];

				if (uploadResult) {
					question.fileId = uploadResult.fileId;
					question.image_url = uploadResult.url;
				}

				// clean up unused fields
				delete question.image;
				delete question.previewImage;
			});
			if (savedSession) {
				fd.savedID = savedSession?.id
			}
		} else {
			setScrambleLoading(true)
			cleanedData = {...formData}
			cleanedData.postQuestions = formData.questions
			delete cleanedData.questions
			console.log({submittedFormData: cleanedData})
			fd = buildFormData(new FormData(), cleanedData)
			shuffleEndpoint = `${endpoint}/shuffle`
		}

		console.log({fd})
		console.log({shuffleEndpoint})
		// return
		const res = await FetchFromServer(`${shuffleEndpoint}`, 'POST', fd)
		console.log('Form submitted with data:');
		// const alert1 = `\nResponse: \n ${JSON.stringify(res, null, 2)}`
		
		if (res.ok) {
			const resData = res?.data
			console.log({resData})
			if (!isRemember) {
				if (isSubmitToSch) {
					setHasSubmitted({[fetchID]: resData?.has_submitted})
				}
				alert("Success\nClick 'Download File' to download the shuffled questions");
				fetchDownloadLinkss({endpoint, setDownloadLink})
				setIsNewDownload(true)
			} else {
				lStorage.removeItem('saved-questions')
				lStorage.removeItem(`saved-detail-${fetchID}`)
				toast.success(`${res?.data?.success}!.`)
			}
		}
		setRememberLoading(false)
		setScrambleLoading(false)
		setSubmittingTToSchLoading(false)
	};

	const args = {
		// handleChange,
		addTheory,
		formData,
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
		diagramStageRefs,
		// isDuplicate,
	}

	const hasLinks = Array.isArray(downloadLink) && downloadLink.length > 0;
	const hasMultipleLinks = hasLinks && downloadLink.length > 1;
	const hasSingleLink = hasLinks && downloadLink.length === 1;

	const canRememberOrSubmit = formHeadState?.every(field=>field.required&&formData[field.name]!=='')
			&&!!formData?.questions?.length
			// &&Object.values(formData?.questions)?.[0]
			// &&Object.keys(questionObject)?.every(field=> {
			// 	if (["image", "uniqueId"].includes(field)) {
			// 		return true // skip image and uniqueid field checks
			// 	}
			// 	// console.log('aaa'.repeat(6))
			// 	// console.log({field})
			// 	return questionFormData?.every(question=> question[field]!=='')
			// })

	console.log({
		lenFH: formData?.questions?.length,
		anyQ: Object.values(formData?.questions)?.[0],
		// deviceInfo,
		// userInfo,
		// location,
		// isFetch,
		// fetchID,
		formData,
		// formHeadState,
		// uploadedSchLogo,
		// isClearUploadedLogo,
		savedSession,
		// hasSubmitted,
		// questionObject,
		questionFormData,
		canRememberOrSubmit,
		// formValues,
		// dept,
		// categoryFilled: formHead.every(field=>field.required&&formData[field.name]!==''),
		// questionsAvailable: !!formData?.questions?.length,
		// questionsFilled: Object.keys(questionObject)?.every(field=> {
		// 	if (!["image", "uniqueId"].includes(field)) {
		// 		return true // skip image and uniqueid field checks
		// 	}
		// 	return formData?.questions?.every(question=> question[field]!=='')
		// })
		addTheory,
		theory,
	})
	return (
			<>
				{/* spinner */}
				{loadingPage && <SpinnerBarForPage />}

				<form
				onSubmit={submitHandler}
				className={`form-head scramble-question-text glass ${loadingPage?'d-none':''}`}>
					<div className="d-flex justify-content-between align-items-center">
						<div>
							<h1 className="shuffle-question-head1">Shuffle Questions</h1>
							{/* mobile */}
							{(formData.level.toLowerCase().includes('sss')&&
								formData.class.toLowerCase().includes('sss') &&
								deviceInfo.width <= 768) &&
								<div className="d-flex justify-self-start">
							<ToggleDepartment
							deptStyle={'d-flex pb-01'}
							deviceInfo={deviceInfo}
							dept={dept} handleDeptSet={handleDeptSet} />
							</div>}
						</div>
						<div className="d-flex flex-row align-items-center gap-1 chk-box-pad-r">
							{/* desktop */}
							{(formData.level.toLowerCase().includes('sss')&&
								formData.class.toLowerCase().includes('sss') &&
								deviceInfo.width > 768) &&
							<ToggleDepartment
							dept={dept} handleDeptSet={handleDeptSet} />}
							<div className="d-flex flex-column">
								<CheckBoxBtnUI
								chkText="New School?"
								spanClass='pl-color got-a-code align-self-end'
								checkState={hasDiffSchool}
								setCheckState={setHasDiffSchool} />

								<CheckBoxBtnUI
								chkText="Remove Obj?"
								spanClass='pl-color got-a-code align-self-end'
								checkState={removeObjectives}
								setCheckState={setRemoveObjectives} />

								<CheckBoxBtnUI
								chkText="Add Theory?"
								spanClass='pl-color got-a-code align-self-end'
								checkState={addTheory}
								setCheckState={setAddTheory} />
							</div>
						</div>
					</div>
						{/* mobile */}
						{/* {(formData.level.toLowerCase().includes('sss')&&
							formData.class.toLowerCase().includes('sss') &&
							deviceInfo.width <= 768) &&
							<div className="d-flex justify-self-start">
						<ToggleDepartment
						deptStyle={'d-flex pb-01'}
						deviceInfo={deviceInfo}
						dept={dept} handleDeptSet={handleDeptSet} />
						</div>} */}

					<fieldset className="questions-header">
						{formHeadState?.map((input, inpIdx) => {
							if (!input.name) return
							// console.log({
							// 	name: input.name,
							// 	value: formData[input.name]
							// })
							return (
								<div key={input.name+inpIdx}
								style={{width: input.width}}
								className="form-group floating-field mb-0">
									{/* term */}
									{input.type==='select' ?
									<>
										<select
										// style={{width: input.width}}
										// className="text-center"
										value={titleCase(formData[input.name])||''}
										onChange={handleChange}
										name={input.name}
										required={input.required}>
											<option value="" disabled hidden>{input.placeholder}</option>
											{input.options.map((option, index) => (
												<option key={index} value={titleCase(option)}
												disabled={
													(input.name==='class'&&option===noLevel)?true:
													(input.name==='subject'&&(option===noClass||option===selectDept))?true:
													false
												}
												className="options">
													{displayValue(option, input.case)}
												</option>
											))}
										</select>
										<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
									</>
									:
									// other inputs
									<>
										<input
										className="text-center"
										// style={{width: input.width}}
										placeholder=" "
										value={(input.name.toLowerCase()==='totalqs'&&
											Number(formData[input.name])===0)?
												'':displayValue(formData[input.name], input.case)||''}
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
						<div className=''>
							<div className="d-flex gap-1">
								{/* upload/change images */}
								<ImageCropAndCompress
								onComplete={setUploadedSchLogo}
								onClearSelection={setIsClearUploadedLogo}
								imageId={'logo'}
								imgType="sch-logo"
								disableBtn={!hasDiffSchool} />

							</div>

							{/* <img src={formData.preview} alt="preview" /> */}
						</div>
					</fieldset>

					{/* {(totalNumberOfQuestions&&!isFile) ? */}
					{/* <div> */}
					<QuestionsArrComp args={args} />
					{(addTheory&&!removeObjectives)?
						<>
							<br/><br/><br/>
						</>:''}
					{addTheory ? <TheoryBuilder updateState={updateTheoryState} updateFromSavedTheory={theoryQuestionsRef.current} />: null}
					{/* </div> */}
						{/* : */}
						{/* <div className="">
							<div className={`${deviceInfo.width<=768?'d-flex justify-content-center':''}`}> */}

									{/* <button
									style={{margin: '0 5rem'}}
									className={`cta-button mb-xs q-mx fit ${''}`}
									type="button"
									disabled={true}
									onClick={() => null}>
										Upload File
									</button> */}

							{/* </div>
						</div> */}
					{/* download file button */}
					{/* <div className=""> */}
					{hasSingleLink ?
						<div className={`download-btn-not-dropdown mt-1`}>
							<DownloadBtn tick={tick}
							item={downloadLink?.[0]}
							single={true} />
						</div>
						:
						hasMultipleLinks ?
						(<div
							onMouseEnter={(e)=>setIsNewDownload(false)}
							// style={{margin: '0 5rem',}}
							className={`download-btn-dropdown mt-1
										${deviceInfo.width>1024?'mx-5':
										deviceInfo.width>900?'mx-3':'mx-1'}`}>
							<button
							type="button"
							className="cta-button fit no-cursor">
								<FontAwesomeIcon icon="download" />
								Download files ({downloadLink.length}) <sup
								className={`download-notification-dot ${isNewDownload?'':'d-none'}`}
								/>
							</button>
						
							<div className="download-btn-dropdown-menu">
								{downloadLink.map((item, idx) => {
									return (
										<Fragment key={idx}>
											<DownloadBtn
											tick={tick}
											item={item} />
										</Fragment>
									)
								})}
							</div>
						</div>)
					: null}

					{/* submit button */}
					<div className={`d-flex justify-content-center pt-1p5 ${isMobileDev?'scramble-btns-pt-05':'pt-05'}`}>
						{hasSchool ?
						<>
							<button
							// style={isMobileDev?{}:{margin: '0 0.5rem'}}
							onClick={(e)=>submitHandler(e, false, true)}
							type="button"
							disabled={submittingTToSchLoading
								// ||!canRememberOrSubmit
							}
							className={`cta-button scramble-submit-mobile font-gold
										${(questionFormData?.length||addTheory)?'':'d-none'}
										${hasSchool?'first':''}`}>
								{submittingTToSchLoading ?
									<Spinner type={'dot'} /> :
									(hasSubmitted?.[fetchID])?'Update Submission':`Submit to ${hasSchool?.acronym}`}
							</button>
							<button
							// style={isMobileDev?{}:{margin: '0 0.5rem'}}
							onClick={(e)=>submitHandler(e, true)}
							type="button"
							disabled={rememberLoading
								// ||!canRememberOrSubmit
							}
							className={`cta-button scramble-submit-mobile
										${(questionFormData?.length||addTheory)?'':'d-none'}
										${hasSchool?'middle':''}`}>
								{rememberLoading ?
									<Spinner type={'dot'} /> :
									isFetch?'Update Saved':'Remember'}
							</button>
						</>:null}
						<button
						// style={isMobileDev?{}:{margin: '0 0.5rem'}}
						type="submit"
						disabled={scrambleLoading
							// ||!canRememberOrSubmit
						}
						className={`cta-button scramble-submit-mobile
									${(questionFormData?.length||addTheory)?'':'d-none'}
									${hasSchool?'last':''}`}>
							{scrambleLoading ?
								<Spinner type={'dot'} /> :
								`Scramble${deviceInfo.width>768?' Questions':''}`}
						</button>
					</div>
				</form>
			</>
	)
}

function DownloadBtn({item, tick, single=false}) {
	// console.log({item, link: item.link})
	const itemName = item.link.split('/')[2].split('_')
	const subject = itemName[1].slice(0, 9)+'...'
	const uKey = (itemName[4]??itemName[3]).slice(4)
	// console.log({itemName, subject, uKey})
	const fileName = `${subject}_${uKey}`
	return (
		<a
			style={{...single?{margin: '0 5rem'}:{}}}
			role="button"

			href={`${serverOrigin}${item.link}`}
			download
			className={single?'cta-button fit':'download-btn-dropdown-item'}
		>
			{single ?
			<FontAwesomeIcon icon="download" />:null}
			{titleCase(fileName)} <span className="time-ago">({timeAgo(item.created_at)})</span>
		</a>
	)
}

function timeAgo(isoString) {
	if (!isoString) return '';

	const now = Date.now();
	const then = new Date(isoString).getTime();

	if (isNaN(then)) return '';

	const ago = 'ago'
	const diffSeconds = Math.floor((now - then) / 1000);

	if (diffSeconds < 0) return 'now';

	if (diffSeconds < 60) {
		return `${diffSeconds}s ${ago}`;
	}

	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) {
		return `${diffMinutes}m ${ago}`;
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}h ${ago}`;
	}

	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ${ago}`;
}

function ToggleDepartment ({dept, handleDeptSet, deviceInfo=1000, deptStyle=null}) {
	const isMobile = deviceInfo?.width <= 768
	return (
		<div className={`${deptStyle?deptStyle:''} ${isMobile?'':'align-self-end pr-1 pb-05'}`}>
			<button
			type="button"
			onClick={()=>handleDeptSet('art')}
			className={`cta-button btn-sm first ${dept==='art'?'active':''} ${isMobile?'px-1':''}`}>
				Art
			</button>
			<button
			type="button"
			onClick={()=>handleDeptSet('commercial')}
			className={`cta-button btn-sm middle ${dept==='commercial'?'active':''} ${isMobile?'px-1':''}`}>
				Com
			</button>
			<button
			type="button"
			onClick={()=>handleDeptSet('science')}
			className={`cta-button btn-sm last ${dept==='science'?'active':''} ${isMobile?'px-1':''}`}>
				Sci
			</button>
		</div>
	)
}

export { ScrambleQuestionsComponent, DownloadBtn, timeAgo, customFindLast };