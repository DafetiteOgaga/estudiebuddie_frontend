import { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { QuestionsArrComp } from "./questionsArrComp";
import { FetchFromServer, buildFormData, serverOrigin } from "../../hooks/FetchFromServer";
import { titleCase, sentenceCase, formatPhoneNumber } from "../../hooks/changeCase";
import { justNumbers, generateUniqueId, spaceToHyphen } from "../../hooks/formHooks";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
import { imageCompression } from 'browser-image-compression';

const formValues = {
	school: "",
	// email: "",
	subject: "",
	// phone: "",
	class: "",
	term: "",
	duration: "",
	totalQs: "",
	// session: "",
	instruction: "",
	noOfTypes: "",
	questions: [],
}

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
	// {
	// 	name: "email",
	// 	required: true,
	// 	disabled: false,
	// 	type: "email",
	// 	placeholder: "Email Address",
	// 	width: "30%",
	// 	case: null,
	// },
	// {
	// 	name: "phone",
	// 	required: false,
	// 	disabled: false,
	// 	type: "tel",
	// 	placeholder: "Phone Number",
	// 	width: "25%",
	// 	case: 'phone',
	// },
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
	// {
	// 	name: "session",
	// 	required: true,
	// 	disabled: false,
	// 	type: "text",
	// 	placeholder: "Session",
	// 	width: "20%",
	// 	case: null,
	// },
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

const endpoint = 'shufflequestions'

const fetchDownloadLinkss = async ({endpoint, setDownloadLink}) => {
	const subpoint = 'get-links'
	const downloadLinks = await FetchFromServer(`${endpoint}/${subpoint}`)
	if (downloadLinks.ok) {
		console.log({data: downloadLinks?.data})
		setDownloadLink(downloadLinks?.data)
	}
}

function ScrambleQuestionsComponent() {
	const [tick, setTick] = useState(Date.now());
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
	const hasFetched = useRef(false)
	const [isNewDownload, setIsNewDownload] = useState(false)
	const [uploadedSchLogo, setUploadedSchLogo] = useState(null)
	const [isClearUploadedLogo, setIsClearUploadedLogo] = useState(false)

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
		console.log({name, value, files, type, mode})
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
						{[name]: value}
					)
				}
			}
		})
		setIsClearUploadedLogo(false)
	};

	// ({
	// 	...prev,
	// 	[name]: value,
	// })

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
		const cleanedData = {...formData}

		cleanedData.postQuestions = formData.questions

		delete cleanedData.questions
		const fd = buildFormData(new FormData(), cleanedData)
		// console.log(cleanedData);
		// return;
		const subpoint = 'shuffle'
		const res = await FetchFromServer(`${endpoint}/${subpoint}`, 'POST', fd)
		console.log('Form submitted with data:');
		// const alert1 = `\nResponse: \n ${JSON.stringify(res, null, 2)}`
		alert("Success\nClick 'Download File' to download the shuffled questions");
		if (res.ok) {
			fetchDownloadLinkss({endpoint, setDownloadLink})
			setIsNewDownload(true)
			// subpoint = 'get-links'
			// const downloadLinks = await FetchFromServer(`${endpoint}/${subpoint}`)
			// if (downloadLinks.ok) {
			// 	console.log({data: downloadLinks?.data})
			// 	setDownloadLink(downloadLinks?.data)
			// }
			
			// deleteIndexArray.current = [];
		}
		setLoading(false)
	};

	const args = {
		// handleChange,
		setFormData,
		questionObject,
		generateUniqueId,
		handleQuestionChange,
		questionFormData,
		setQuestionFormData,
	}

	const hasLinks = Array.isArray(downloadLink) && downloadLink.length > 0;
	const hasMultipleLinks = hasLinks && downloadLink.length > 1;
	const hasSingleLink = hasLinks && downloadLink.length === 1;

	console.log({
		formData,
	// 	formDataQuestions: formData.questions,
	// 	// newTQs: totalQsInFD.current,
	// // 	formQs: formData.questions,
	// // 	totalNoOfQs,
	// // 	questionFormData,
	// 	downloadLink,
	// 	hasMultipleLinks,
	// 	hasSingleLink,
	// 	isNewDownload,
	uploadedSchLogo,
	isClearUploadedLogo
	})
	return (
			<>
				{/* spinner */}
				{loadingPage && <SpinnerBarForPage />}

				<form
				onSubmit={submitHandler}
				className={`form-head scramble-question-text glass ${loadingPage?'d-none':''}`}>
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
								imgType="sch-logo" />

								{/* <button
								type="button"
								onClick={()=>addRemoveQuestion({id:questionData.uniqueId})}
								className="cta-button question">
									Remove Question
								</button> */}
							</div>

							{/* <img src={formData.preview} alt="preview" /> */}
						</div>
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
									disabled={true}
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
					{hasSingleLink ?
					(<DownloadBtn tick={tick}
					item={downloadLink?.[0]}
					single={true} />)
					// (<a
					// 	href={`${serverOrigin}${downloadLink?.[0]?.link}`}
					// 	// href="##"
					// 	download
					// 	style={{margin: '0 5rem',}}
					// 	role="button"
					// 	className="cta-button">
					// 		Download file
					// 	</a>)
					:
					hasMultipleLinks ?
					(<div
						onMouseEnter={(e)=>setIsNewDownload(false)}
						style={{margin: '0 5rem',}}
						className="download-btn-dropdown">
						<button className="cta-button no-cursor">
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
					<div className="d-flex justify-content-center">
						<button
						style={{margin: '0 5rem'}}
						type="submit"
						className={`cta-button ${questionFormData?.length?'':'d-none'}`}>
							{loading ?
								<Spinner type={'dot'} /> :
								'Scramble Questions'}
						</button>
					</div>
				</form>
			</>
	)
}

function DownloadBtn({item, tick, single=false}) {
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
			className={single?'cta-button':'download-btn-dropdown-item'}
		>
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
export { ScrambleQuestionsComponent };