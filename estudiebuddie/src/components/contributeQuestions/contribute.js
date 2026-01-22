import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { QuestionsArrComp } from "./contributedQuestionsArr";
import { FetchFromServer, buildFormData, serverOrigin } from "../../hooks/FetchFromServer";
import { titleCase, sentenceCase, formatPhoneNumber } from "../../hooks/changeCase";
import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { useDeviceInfo } from "../../hooks/deviceType";

const formValues = {
	type: "",
	subject: "",
	class: "",
	totalQs: "",
	questions: [],
}

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
	explanation: '',
}

const termArray = ['first', 'second', 'third']
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
let formHead = [
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
		name: "type",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Type",
		width: "20%",
		options: typeArray,
		case: null,
	},
	{
		name: "class",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Class",
		width: "20%",
		options: [],
		case: "upper",
	},
	{
		name: "subject",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Subject",
		width: "30%",
		options: [],
		case: 'title',
	},
]
const dyName = ['totalQs']
// const dyNameMobile = ['totalQs']
const noType = "no type selected"
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

function ContributeQuestionsComponent() {
	const deviceInfo = useDeviceInfo()
	console.log({deviceInfo})
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const formDataRef = useRef(new FormData())
	const totalNoOfQsRef = useRef(1)
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
	const uploadToCloud = useUploadToImagekit()

	useEffect(() => {
		setLoadingPage(false)
	}, []);

	if (deviceInfo.label === "smallLaptop") {
		console.log('smallLaptop'.repeat(5))
		dyName.forEach(obj => {
			let objItem = formHead.find(item => item.name === obj)
			if (objItem) objItem.width = '17%'
		})
	} else if (deviceInfo.label === "tablet") {
		console.log('tablet'.repeat(5))
		dyName.forEach(obj => {
			let objItem = formHead.find(item => item.name === obj)
			if (objItem) {
				if (deviceInfo.width > 800) {
					objItem.width = '19%'
				} else {
					objItem.width = '22%'
				}
			}
		})
	} else if (deviceInfo.label === "mobile") {
		console.log('mobile'.repeat(5))
		formHead.forEach(obj => {
			// let objItem = formHead.find(item => item.name === obj)
			if (obj.name) {
				// if (deviceInfo.width > 800) {
				obj.width = '47%'
				// }
				// else {
				// 	objItem.width = '22%'
				// }
			}
		})
	}

	const handleQuestionChange = (e=null, data=null, index, mode='+') => {
		console.log('in handle question change fxn...', {data})
		if (!e && !data?.files?.[0]) return
		const { name, value, files, type } = e ? e.target : data
		console.log({name, value, files, type, index, questionFormData, mode})
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
				questions: updatedQuestions,
				// totalQs: updatedQuestions.length
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

		if (mode === '-') {
			const input = document.getElementById(`image-upload-${index}`);
			if (input) input.value = '';
		}
	};

	const handleChange = (e) => {
		let { name, value } = e.target;
		if (name === 'totalQs') {
			value = justNumbers(value)
			let numericValue = value === "" ? 0 : Number(value);
			if (numericValue > 10) {
				numericValue = 10;
			}
			setTotalNoOfQs(numericValue);
			totalNoOfQsRef.current = numericValue;
			value = numericValue.toString();
			// if (!Number.isNaN(value)&&Number(value)<11) {
			// 	setTotalNoOfQs(Number.isNaN(value) ? 0 : value)
			// 	totalNoOfQsRef.current = Number.isNaN(value) ? 0 : value
			// }
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	};

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

	// // let cleanedData;
	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refresh
		setLoading(true)
		const cleanedData = structuredClone(formData);
		console.log({formData})

		// map each question to a promise, keeping track of its index
		const uploadPromises = cleanedData.questions.map((question, index) => {
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
		
		// update cleanedData after all uploads
		results.forEach(({ index, uploadResult }) => {
			const question = cleanedData.questions[index];
		
			if (uploadResult) {
			question.fileId = uploadResult.fileId;
			question.image_url = uploadResult.url;
			}
		
			// group options together
			question.options = [
			question.correct_answer,
			question.wrong_answer1,
			question.wrong_answer2,
			question.wrong_answer3,
			];
		
			// clean up unused fields
			delete question.image;
			delete question.previewImage;
			delete question.wrong_answer1;
			delete question.wrong_answer2;
			delete question.wrong_answer3;
		});
		cleanedData.type_category = cleanedData.type
		cleanedData.class_category = cleanedData.class
		cleanedData.subject_category = cleanedData.subject
		delete cleanedData.type
		delete cleanedData.class
		delete cleanedData.subject

		const endpoint = 'contribute'
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log('Form submitted with data:', {cleanedData, res});
		// const alert1 = `\nResponse: \n ${JSON.stringify(res, null, 2)}`
		alert("Thank you!\nThe questions will be reviewed and updated to the db accordingly.");
		setLoading(false)
	};

	const args = {
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
	}

	const lengthOfQs = formData.questions.length
	console.log({
		formData,
		formDataQuestions: formData.questions,
	})
	return (
			<>
				{/* spinner */}
				{loadingPage && <SpinnerBarForPage />}

				<form
				onSubmit={submitHandler}
				className={`form-head scramble-question-text glass ${loadingPage?'d-none':''}`}>
					<h1 className="shuffle-question-head1">Contribute Questions</h1>
					<fieldset className="questions-header">
						{formHead.map((input, inpIdx) => {
							console.log({
								field: input.name,
								value: formData[input.name]
							})
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
									{/* term */}
									{input.type==='select' ?
									<>
										<select
										// style={{width: input.width}}
										// className="text-center"
										value={formData[input.name]}
										onChange={handleChange}
										name={input.name}
										required={input.required}>
											<option value="" disabled hidden>-- {titleCase(input.name)} --</option>
											{options.map((opt, index) => (
												<option key={index} value={titleCase(opt)}
												disabled={opt.toLowerCase()===noType}
												className="options">
													{titleCase(opt)}
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
										value={
											(input.name.toLowerCase()==='totalqs'&&
											Number(formData[input.name])===0)
											? ''
											: displayValue(formData[input.name], input.case) ?? ''
										}
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

					<QuestionsArrComp args={args} />

					<div className="">
						<div className="">
							<button
							style={{margin: '0 5rem'}}
							className="cta-button mb-xs q-mx"
							type="button"
							disabled={true}
							onClick={() => null}>
								Upload File
							</button>
						</div>
					</div>
					{/* submit button */}
					{lengthOfQs > 0 ?
					<div className="d-flex justify-content-center">
						<button
						style={{margin: '0 5rem'}}
						type="submit"
						className="cta-button contribute-submit-mobile">
							{loading ?
								<Spinner type={'dot'} /> :
								`Submit Question${lengthOfQs===1?'':'s'}`}
						</button>
					</div> : null}
				</form>
			</>
	)
}
export { ContributeQuestionsComponent };