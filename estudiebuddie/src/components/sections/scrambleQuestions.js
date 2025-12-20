import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { QuestionsArrComp } from "../scrambleQuestions/questionsArrComp";
import { FetchFromServer, buildFormData, serverOrigin } from "../../hooks/FetchFromServer";
import { titleCase, sentenceCase, formatPhoneNumber } from "../../hooks/changeCase";

const formValues = {
	school: "",
	email: "",
	subject: "",
	phone: "",
	class: "",
	term: "",
	duration: "",
	totalQs: "",
	session: "",
	instruction: "",
	noOfTypes: "",
	questions: [],
}
// const formValues = {
// 	school: "totalman",
// 	email: "chasisdrex@yahoo.com",
// 	subject: "english",
// 	phone: "8038091572",
// 	class: "ss2",
// 	term: "Second",
// 	duration: "1",
// 	totalQs: "3",
// 	session: "2025/26",
// 	instruction: "answer all",
// 	noOfTypes: "2",
// 	questions: [],
// }
const generateUniqueId = () => crypto.randomUUID();
// console.log({id: generateUniqueId()})
const questionObject = {
	number: '',
	question: '',
	correct_answer: '',
	wrong_answer1: '',
	wrong_answer2: '',
	wrong_answer3: '',
	image: null,
}

const termArray = ['first', 'second', 'third']
const formHead = [
	{
		name: "totalQs",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "No. of Questions",
		width: "15%",
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
		name: "email",
		required: true,
		disabled: false,
		type: "email",
		placeholder: "Email Address",
		width: "30%",
		case: null,
	},
	{
		name: "phone",
		required: false,
		disabled: false,
		type: "tel",
		placeholder: "Phone Number",
		width: "25%",
		case: 'phone',
	},
	{
		name: "subject",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Subject",
		width: "25%",
		case: 'title',
	},
	{
		name: "noOfTypes",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "No. of Types",
		width: "15%",
		case: null,
	},
	{
		name: "class",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Class",
		width: "20%",
		case: "upper",
	},
	{
		name: "session",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Session",
		width: "20%",
		case: null,
	},
	{
		name: "term",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Term",
		width: "11%",
		options: termArray,
		case: "title",
	},
	{
		name: "duration",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "Duration (hour)",
		width: "15%",
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
const displayValue = (val, strCase) => {
	if (strCase === "upper") return val.toUpperCase();
	if (strCase === "lower") return val.toLowerCase();
	if (strCase === "title") return titleCase(val);
	if (strCase === "sentence") return sentenceCase(val);
	if (strCase === "phone") return formatPhoneNumber(val);
	return val;
};
const justNumbers = (str) => {
	if (!str) return '';
	return str.replace(/\D+/g, '');
};

function ScrambleQuestionsComponent() {
	const formDataRef = useRef(new FormData())
	const [totalNoOfQs, setTotalNoOfQs] = useState(Number.isNaN(formValues.totalQs) ? 1 : formValues.totalQs)
	const [questionFormData, setQuestionFormData] = useState(null)
	
	const [showSubmitArray, setShowSubmitArray] = useState([false, false]);
	const [downloadLink, setDownloadLink] = useState(null);
	const [totalNumberOfQuestions, setTotalNumberOfQuestions] = useState(0)
	const [questions, setQuestions] = useState([questionObject]);
	const [fileUploadQuestions, setFileUploadQuestions] = useState([questionObject]);
	const [newFileUploadQuestions, setNewFileUploadQuestions] = useState(null);
	const [schoolData, setSchoolData] = useState(null);
	const [formData, setFormData] = useState(formValues);
	const [totalFileUploadQuestions, setTotalFileUploadQuestions] = useState(0)
	const [isImageVisible, setIsImageVisible] = useState([Array(totalFileUploadQuestions?totalFileUploadQuestions:totalNumberOfQuestions).fill(false)]);
	const [isFile, setIsFile] = useState(false)
	// const [isReload, setIsReload] = useState(false);
	// const [UploadedContent, setUploadedContent] = useState(null)

	// let deleteIndexArray = useRef([])
	// // const { text, processedText, handleFileChange } = useHandleFileUpload();
	// let infoItems
	// const toggleFile = () => {
	// 	setIsFile((prev) => {
	// 		if (prev===true) {
	// 			infoItems = null
	// 		} else {
	// 			setTotalFileUploadQuestions(0)
	// 		}
	// 		setFormData(formValues)
	// 		return !prev
	// 	})
	// }
	const handleQuestionChange = (e, index, mode='+') => {
		// console.log('in handle question change fxn...')
		const { name, value, files, type } = e.target;
		// console.log({name, value, files, type, index, questionFormData, mode})
		let updatedQuestions = [...questionFormData];
		// if (totalFileUploadQuestions) updatedQuestions = [...fileUploadQuestions]
		updatedQuestions[index]["number"] = index + 1; // auto-add/update question number
		let file;
		if (name === "image") {
			file = files[0];
			updatedQuestions[index].image = file; // assign image file object
			updatedQuestions[index].previewImage = URL.createObjectURL(file); // assign preview URL for the image
		} else {
			updatedQuestions[index][name] = value;
		}
		// setQuestions(updatedQuestions)
		// console.log({file})
		setFormData((prev) => {
			// console.log({prev})
			// const updatedQuestions = [...prev.questions];
			// console.log(
			// 	'updating form',
			// {
			// 	updatedQuestions,
			// 	index,
			// 	name, value,
			// 	prevQs: prev.questions,
			// 	prevQsWidx: prev.questions[index]
			// })
			if (mode === '-') {
				updatedQuestions[index] = {
					...updatedQuestions[index],
					image: null,
				};
			} else {
				updatedQuestions[index] = {
					...updatedQuestions[index],
					...(file?
						{[name]: file}:
						{[name]: value}),
				};
			}
			return {
				...prev,
				questions: updatedQuestions
			}}
		)
		setQuestionFormData(prev => {
			const updated = [...prev]
			// console.log({
			// 	updated,
			// 	index,
			// 	atIndex: updated[index],
			// 	name, value
			// })
			if (mode === '-') {
				// removes uploaded image
				updated[index] = {
					...updated[index],
					image: null,
					previewImage: null,
				};
			} else {
				updated[index] = {
					...updated[index],
					...(file?
						{[name]: file}:
						{[name]: value})}
			}
			return updated
		})
		// setShowSubmitArray(prev => {
		// 	const updated = [...prev];
		// 	updated[1] = true;
		// 	return updated;
		// });
		if (mode === '-') {
			const input = document.getElementById(`image-upload-${index}`);
			if (input) input.value = '';
		}
	};

	const handleChange = (e) => {
		let { name, value } = e.target;
		if (name === 'totalQs'||name === 'phone'||
			name === 'noOfTypes'||name === 'duration') {
			value = justNumbers(value)
			if (name === 'totalQs') {
				setTotalNoOfQs(Number.isNaN(value) ? 0 : value)
			}
			// setTotalNumberOfQuestions(!isNaN(Number(value))?Number(value):0)
			// setTotalFileUploadQuestions(Number(0))
			// setFormData(formValues)
			// if (!value) {
			// 	setShowSubmitArray(prev => {
			// 		const updated = [...prev];
			// 		updated[0] = false;
			// 		return updated;
			// 	});
			// } else if (value) {
			// 	setShowSubmitArray(prev => {
			// 		const updated = [...prev];
			// 		updated[0] = true;
			// 		return updated;
			// 	});
			// }

		}
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

	// useEffect(() => {
	// 	console.log('0'.repeat(20), {formData})
	// 	const updatedFormData = {...formData}
	// 	console.log('1'.repeat(20), {formData})
	// 	updatedFormData.postQuestions = updatedFormData.questions
	// 	console.log('2'.repeat(20), {formData})
	// 	delete updatedFormData.questions
	// 	console.log('3'.repeat(20), {formData})
	// 	formDataRef.current = buildFormData(formDataRef.current, updatedFormData)
	// 	console.log('4'.repeat(20), {formData})
	// }, [formData])

	// const addQuestion = () => {
	// 	console.log('addQuestion')
	// 	console.log('fileUploadQuestions:', fileUploadQuestions)
	// 	const newQuestionObject = [
	// 		// ...questions,
	// 		{
	// 			number: '',
	// 			question: '',
	// 			correct_answer: '',
	// 			wrong_answer1: '',
	// 			wrong_answer2: '',
	// 			wrong_answer3: '',
	// 			image: null,
	// 			// previewImage: defaultImage,
	// 			imageMode: 'side',
	// 			// uniqueId: generateUniqueId(),
	// 		}
	// 	]
	// 	// setQuestions();
	// 	if (totalFileUploadQuestions) {
	// 		setNewFileUploadQuestions((prev)=>(prev?[...prev, newQuestionObject]:[...fileUploadQuestions, newQuestionObject]))
	// 		// setTotalFileUploadQuestions(prev=>prev+1)
	// 	} else {
	// 		setQuestions((prev)=>[...prev, newQuestionObject[0]])
	// 		setFormData((prev) => ({
	// 			...prev,
	// 			totalQs: Number(prev.totalQs)+1
	// 		}));
	// 	}
	// };
	useEffect(() => {
		const newQuestions = []
		for (let i=0; i<totalNoOfQs; i++) {
			// console.log('adding...')
			const uniqueId = generateUniqueId()
			// console.log({uniqueId})
			newQuestions.push({...questionObject, uniqueId})
		}
		// console.log({newQuestions})
		setQuestionFormData(newQuestions);
	}, [totalNoOfQs]);

	// const removeQuestion = (index, questionID) => {
	// 	console.log('removeQuestion called with\nindex:', index, '\nquestionID:', questionID)
	// 	// console.log('removeQuestion:', index)
	// 	const updatedQuestions = totalFileUploadQuestions?[...fileUploadQuestions]:[...questions];
	// 	// console.log({questions})
	// 	// console.log({fileUploadQuestions})
	// 	// updatedQuestions.splice(index, 1);
	// 	console.log('updatedQuestions1:', updatedQuestions)
	// 	const filteredQuestions = updatedQuestions.filter((item, i) => {
	// 		if (item.uniqueId === questionID) {
	// 			console.log(`removing question with ${item.uniqueId}`)
	// 			console.log(`removing ${item.question} from questions`)
	// 			return false;
	// 		}
	// 		return item.uniqueId !== questionID});
	// 	setImageVisibility(questionID);
	// 	console.log('filteredQuestions:', filteredQuestions)
	// 	// console.log({updatedQuestions})
	// 	// if (totalFileUploadQuestions) {updatedQuestions = [...fileUploadQuestions]}
		
	// 	// if (totalFileUploadQuestions) {
	// 	if (totalFileUploadQuestions) {
	// 		// console.log('totalFileUploadQuestions:')
	// 		setNewFileUploadQuestions(filteredQuestions)
	// 	} else {
	// 		setQuestions(filteredQuestions)
	// 		setFormData((prev) => ({
	// 			...prev,
	// 			totalQs: Number(prev.totalQs)-1
	// 		}));
	// 	}
	// };

	// const toggleImage = (index, questionID, remove=false) => {
	// 	console.log('image toggled to:', isImageVisible)
	// 	console.log('index:', index)
	// 	if (remove) {
	// 		console.warn('may not need to use toggleImage fxn in remove image button')
	// 	} else {
	// 		console.log('questionID:', questionID)
	// 		setIsImageVisible((prev) => prev.map((visible, i) => (i === index ? questionID : visible)))
	// 	}
	// };

	// const setImageVisibility = (questionID=null) => {
	// 	console.log('questionID:', questionID)
	// 	console.log('isImageVisible:', isImageVisible)
	// 	const numberOfQuestions = totalFileUploadQuestions || totalNumberOfQuestions;
	// 	const visibleItems = (isImageVisible).filter(item => {
	// 		if (item === false) return false;
	// 		if (questionID&&item.includes(questionID)) {
	// 			return false
	// 		}
	// 		return true});
	// 	let visibleItemsLength = questionID?visibleItems.length:visibleItems.length-1;
	// 	console.log('initial visibleItemsLength:', visibleItemsLength)
	// 	if (visibleItemsLength < 0) visibleItemsLength = 0;
	// 	const remainingCount = numberOfQuestions - visibleItemsLength;
	// 	console.log(
	// 		'\nvisibleItems:', visibleItems,
	// 		'\nnumberOfQuestions:', numberOfQuestions,
	// 		'\nvisibleItemsLength:', visibleItemsLength,
	// 		'\nremainingCount:', remainingCount,
	// 	)
	// 	const falseArray = Array(remainingCount).fill(false);
	// 	setIsImageVisible(visibleItemsLength?[...visibleItems, ...falseArray]:[...falseArray]);
	// 	// console.log('\nReloading app'.repeat(5))
	// 	// setIsReload(prev => !prev)
	// }
	// useEffect(() => {
	// 	console.log('from useeffect:')
	// 	setImageVisibility()
	// }, [totalFileUploadQuestions, totalNumberOfQuestions]);

	// useEffect(() => {
	// 	if (downloadLink) {
	// 		const delay = setTimeout(() => {
	// 			setDownloadLink(null);
	// 		}, 1000*60*60*5); // 5 hours
	// 		return () => clearTimeout(delay);
	// 	}
	// }, [downloadLink])

	// // let cleanedData;
	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refresh
		const cleanedData = {...formData}
		// console.log({formData})
		// const questions = []
		// Object.entries(cleanedData).forEach(([key, value]) => {
		// 	// console.log('\n', {key}, {value}, typeof(value))
		// 	if (!isNaN(Number(key))) {
		// 		// console.log('checking value:', value.question)
		// 		if (deleteIndexArray.current.includes(value.uniqueId)) {
		// 			console.log(`removing ${value.question} from cleanedData`)
		// 			delete cleanedData[key]
		// 		} else {
		// 			// console.log('key1:', Number(key))
		// 			questions.push({
		// 				...value,
		// 				index: Number(key)+1,
		// 			})
		// 			delete cleanedData[key]
		// 		}
		// 	}
		// 	if (typeof(value) === 'object'&&!value.question) {
		// 		delete cleanedData[key]
		// 	}})
		cleanedData.postQuestions = formData.questions
		// console.log({
		// 	fquetions: formData.questions,
		// 	cfquestions: cleanedData.questions,
		// 	cquestions: cleanedData.postQuestions
		// })
		delete cleanedData.questions
		const fd = buildFormData(new FormData(), cleanedData)
		// console.log(cleanedData);
		// return;
		const endpoint = 'shufflequestions/shuffle'
		const res = await FetchFromServer(endpoint, 'POST', fd)
		console.log('Form submitted with data:');
		// const alert1 = `\nResponse: \n ${JSON.stringify(res, null, 2)}`
		alert("Success\nClick 'Download File' to download the shuffled questions");
		if (res?.success) {
			setDownloadLink(res.downloadLink)
			// deleteIndexArray.current = [];
		}
	};
	const fileQuestionsHandle = (fileQuestions) => {
		// console.log('updating formData with fileQuestions:')
		setFormData((prev) => ({...prev, ...fileQuestions}))
	}
	
	// const removeQuestionFromArray = (questionID) => {
	// 	console.log('removeQuestionFromArray called')
	// 	deleteIndexArray.current.push(questionID);
	// 	console.log(`added ${questionID} to be delete array removed`);
	// }
	const args = {
		// questions,
		// totalNumberOfQuestions,
		// isImageVisible,
		// toggleImage,
		// addQuestion,
		// removeQuestion,
		// handleQuestionChange,
		// totalFileUploadQuestions,
		// setTotalFileUploadQuestions,
		// setFileUploadQuestions,
		// newFileUploadQuestions,
		// questionObject,
		// setSchoolData,
		// formData,
		// setFormData,
		// fileQuestionsHandle,
		// showSubmitArray,
		// setShowSubmitArray,
		// type: 'create',
		// text: null,
		// // processedText,
		// downloadLink,
		// removeQuestionFromArray,
		// setImageVisibility,
		// // generateUniqueId,
		// // setIsReload,

		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
	}
	// infoItems = useMemo(() => {
	// 	if (!schoolData) return null;

	// 	const lines = schoolData.split('\n').filter(Boolean);
	// 	return Object.assign({}, ...lines.map((item, index) => {
	// 		const [key, value] = item.includes(':') ? item.split(':') : [null, item.trim()];
	// 		return {...(key?{[key.toLowerCase().trim()]: value.trim()}:{[index]: item})}
	// 	}));
	// }, [schoolData]);

	// useEffect(() => {
	// 	if (!infoItems) return;

	// 	setFormData((prev) => ({
	// 	...prev,
	// 	school: infoItems.school || "",
	// 	email: infoItems.email || "",
	// 	subject: infoItems.subject || "",
	// 	phone: infoItems.phone || "",
	// 	class: infoItems.class || "",
	// 	term: infoItems.term.toLowerCase().includes('first')?'first':infoItems.term.toLowerCase().includes('second')?'second':infoItems.term.toLowerCase().includes('third')?'third':'none',
	// 	duration: infoItems.duration || "",
	// 	totalQs: "",
	// 	session: infoItems.session || "",
	// 	instruction: infoItems.instruction || "",
	// 	}));
	// 	setShowSubmitArray(prev => {
	// 		const updated = [...prev];
	// 		updated[0] = true;
	// 		return updated;
	// 	});
	// }, [infoItems]);
	console.log({
		formData,
		formDataQuestions: formData.questions
	// 	formQs: formData.questions,
	// 	totalNoOfQs,
	// 	questionFormData,
	// 	downloadLink,
	})
	return (
		// <div id="about" className="page">
		// 	<div className="container">
				<>

					<form
					onSubmit={submitHandler}
					className="form-head scramble-question-text glass">
						<fieldset className="questions-header">
							{formHead.map((input, inpIdx) => {
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
											value={formData.term}
											onChange={handleChange}
											name={input.name}
											required={input.required}>
												<option value="" disabled hidden>-- Term --</option>
												{input.options.map((term, index) => (
													<option key={index} value={titleCase(term)}
													className="options">
														{titleCase(term)}
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
											value={displayValue(formData[input.name], input.case)}
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
						</fieldset>

						{/* {(totalNumberOfQuestions&&!isFile) ? */}
						{/* <div> */}
						<QuestionsArrComp args={args} />
						{/* </div> */}
							{/* : */}
							<div className="">
								<div className="">
									{/* <div style={{
											display: 'flex',
											alignItems: 'center',
											gap: 3,
										}}> */}
										{/* <MoreInfo info="Upload information ..." /> */}
										<button
										style={{margin: '0 5rem'}}
										className="cta-button mb-xs"
										type="button"
										onClick={() => null}>
											Upload File
										</button>
									{/* </div> */}
									{/* {isFile ?
										<div>
											<input className="" type="file" accept=".txt,.docx" onChange={handleFileChange}/>
										</div>
										:
										null} */}
								</div>
								{/* {isFile ?
									<>
										<div>
											<ShuffleQuestions {...args} fileMargin={{margin: 'auto'}} type="file" text={text} />
										</div>
									</>
									:
									null} */}
							</div>
						{/* download file button */}
						{/* <div className=""> */}
						{downloadLink?
						<a
						href={`${serverOrigin}${downloadLink}`}
						download
						style={{margin: '0 5rem'}}
						role="button"
						className="cta-button">
							Download files
						</a>:null}
						{/* </div> */}
						{/* submit button */}
						<div className="d-flex justify-content-center">
							<button
							style={{margin: '0 5rem'}}
							type="submit"
							className="cta-button">
								Scramble Questions
							</button>
						</div>
					</form>
				</>
		// 	</div>
		// </div>
	)
}
export { ScrambleQuestionsComponent };