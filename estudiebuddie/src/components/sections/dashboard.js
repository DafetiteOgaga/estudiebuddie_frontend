import { useState, useEffect, useRef, useCallback } from "react";
import { titleCase, sentenceCase, formatPhoneNumber } from "../../hooks/changeCase";
import { FetchFromServer, serverOrigin } from "../../hooks/FetchFromServer";
import { shuffleArray, getAuthorizedCodes, justNumbers, removeWhiteSpace } from "../../hooks/formHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { useDeviceInfo } from "../../hooks/deviceType";
import { toast } from 'react-toastify';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { roleArray, genderArray, checkIcons, isValidEmail } from "./signUp";
import { getGender,handleCopy,notAvailable, copyDelayDuration } from "./profile";
import { DownloadBtn, timeAgo } from "../scrambleQuestions/scrambleQuestions";

const getAbbrObject = {
	subjectAbbr: {
		"english-language": "ENG",
		"mathematics": "MTH",
		"civic-education": "CVE",
		"basic-science": "BSC",
		"social-studies": "SOS",
		"crs": "CRS",
		"irs": "IRS",
		"history": "HIS",
		"cultural-&-creative-arts": "CCA",
		"computer-studies": "CST",
		"home-economics": "HME",
		"one-nigerian-language": "ONL",
		"integrated-science": "INS",
		"physical-&-health-education": "PHE",
		"digital-technologies": "DGT",
		"crs-/-irs": "CRI",
		"nigerian-history": "NHS",
		"social-&-citizenship-studies": "SCS",
		"business-studies": "BST",
		"french-studies": "FRN",
		"arabic-studies": "ARB",
		"biology": "BIO",
		"chemistry": "CHM",
		"physics": "PHY",
		"further-mathematics": "FMTH",
		"agricultural-science": "AGR",
		"technical-drawing": "TD",
		"geography": "GEO",
		"computer-studies-/-ict": "ICT",
		"physical-/-health-education": "PHE",
		"foods-&-nutrition-/-home-economics": "FNH",
		"literature-in-english": "LIT",
		"government": "GOV",
		"french-/-other-foreign-languages": "FOL",
		"nigerian-language(s)": "NLA",
		"visual-/-fine-arts": "VFA",
		"music": "MUS",
		"economics": "ECO",
		"commerce": "COM",
		"financial-accounting": "FAC",
		"marketing": "MKT",
		"accounting": "ACC",
		"office-practice": "OFP",
		"bookkeeping": "BKP",
		"data-processing-/-computer-studies": "DPC",
	},
	termAbbr: {
		"first": "1st",
		"second": "2nd",
		"third": "3rd",
	}
}
function getSubjectAbbr(subject) {
	return getAbbrObject.subjectAbbr[subject.trim().toLowerCase()] || subject;
}
function getTermAbbr(term) {
	return getAbbrObject.termAbbr[term.trim().toLowerCase()] || term;
}

const formValues = {
	first_name: "",
	last_name: "",
	email: "",
	mobile_no: "",
	role: "",
	gender: "",
}
let initFormHead = [
	{
		name: "first_name",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "First name",
		width: "70%",
		case: null,
	},
	{
		name: "last_name",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "Last name",
		width: "70%",
		case: null,
	},
	{
		name: "email",
		required: true,
		disabled: false,
		type: "email",
		placeholder: "Email Address",
		width: "70%",
		case: null,
	},
	{
		name: "mobile_no",
		required: false,
		disabled: false,
		type: "tel",
		placeholder: "Mobile Number",
		width: "70%",
		case: null,
	},
	{
		name: "role",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Role",
		width: "11%",
		options: roleArray,
		case: "title",
	},
	{
		name: "gender",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Gender",
		width: "11%",
		options: genderArray,
		case: "title",
	},
]

const barItems = [
	{
		name: 'saved questions',
		disable: false,
		index: 1,
	},
	{
		name: 'scrambled',
		disable: false,
		index: 2,
	},
	{
		name: 'quiz history',
		disable: true,
		index: 3,
	},
	{
		name: 'staffs',
		disable: false,
		index: 4,
	},
]

const fetchData = async (endpoint) => {
	if (!endpoint) return
	const response = await FetchFromServer(endpoint)
	console.log({endpoint})
	return response
}

const not_available = "Not-Provided"

function Dashboard() {
	const hasRun = useRef(false)
	const navigate = useNavigate()
	const { lStorage, sStorage } = useCreateStorage()
	const userInfo = lStorage.getItem('user')
	const [loadingPage, setLoadingPage] = useState(true);
	const [codeRole, setCodeRole] = useState('')
	const [isGenSchCode, setIsGenSchCode] = useState(false)
	const [theGenCode, setTheGenCode] = useState(null)
	const [adminCodeLoading, setAdminCodeLoading] = useState(false)
	const [teacherCodeLoading, setTeacherCodeLoading] = useState(false)
	const [staffCreationLoading, setStaffCreationLoading] = useState(false)
	const [pullStaffsLoading, setPullStaffsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState('saved questions')
	const [staffsPage, setStaffsPage] = useState('')
	const [scrambledPage, setScrambledPage] = useState('')
	const [scrambledLoading, setScrambledLoading] = useState(false)
	const [isScrambled, setIsScrambled] = useState(false)
	const [scrambledResponse, setScrambledResponse] = useState(null)
	const [savedQuestionsPage, setSavedQuestionsPage] = useState('')
	const [isSubmitAllSavedQuestions, setIsSubmitAllSavedQuestions] = useState(false)
	const [submitAllSavedQuestionsLoading, setSubmitAllSavedQuestionsLoading] = useState(false)
	const [isSubmitSavedQuestion, setIsSubmitSavedQuestion] = useState(false)
	const [submitSavedQuestionLoading, setSubmitSavedQuestionLoading] = useState([])
	const [isDeleteSaved, setIsDeleteSaved] = useState(false)
	const [savedQuestionsLoading, setSavedQuestionsLoading] = useState(false)
	const [deleteAllSavedQuestionsLoading, setDeleteAllSavedQuestionsLoading] = useState(false)
	const [isDeleteAllSaved, setIsDeleteAllSaved] = useState(false)
	const [deleteSavedQuestionLoading, setDeleteSavedQuestionLoading] = useState([])
	const [savedQuestionsResponse, setSavedQuestionsResponse] = useState(null)
	const [isSavedQuestions, setIsSavedQuestions] = useState(false)
	const [isPullStaffs, setIsPullStaffs] = useState(false)
	const [pullResponse, setPullResponse] = useState(null)
	const [backEndpoint, setBackEndpoint] = useState(null)
	const [userDetail, setUserDetail] = useState(null)
	const [isUserDetailPage, setIsUserDetailPage] = useState(false)
	const [avatar] = useState(() => getGender());
	const [copiedCode, setCopiedCode] = useState(false);
	const [copiedPassword, setCopiedPassword] = useState(false);
	const [tick, setTick] = useState(Date.now());
	const [isSubmittedQuestions, setIsSubmittedQuestions] = useState(false)
	const [submittedQuestionsResponse, setSubmittedQuestionsResponse] = useState(null)
	const [submittedQuestionsLoading, setSubmittedQuestionsLoading] = useState(false)
	const [downloadLoading, setDownloadLoading] = useState([])
	const [isDownloading, setIsDownloading] = useState(false)
	const [downloadResponse, setDownloadResponse] = useState({})
	const [downloadID, setDownloadID] = useState(null)
	const [isDownloadAll, setIsDownloadAll] = useState(false)
	const previousDownloadAllLink = useRef(null)
	const [downloadAllLoading, setDownloadAllLoading] = useState(false)
	const [downloadAllResponse, setDownloadAllResponse] = useState(null)
	const localSavedQuestions = lStorage.getItem('saved-questions')
	const localScrambledQuestionLinks = lStorage.getItem('scrambled-questions-links')
	const localPulledStaffs = lStorage.getItem('pulled-staffs')
	const deviceInfo = useDeviceInfo()
	const isMobileDev = deviceInfo.width<=900

	useEffect(() => {
		setLoadingPage(false)

		if (currentPage==='saved questions') {
			if (localSavedQuestions) {
				console.log('fetched from local storage')
				setSavedQuestionsResponse(localSavedQuestions)
			} else {
				// hasRun.current = true
				console.log('saved questions'.repeat(10))
				setSavedQuestionsLoading(true)
				setBackEndpoint('school/save/false')
				setIsSavedQuestions(true)
			}
		}

		const i = setInterval(() => setTick(Date.now()), 30_000);
		return () => clearInterval(i);
	}, []);

	useEffect(() => {
		if (!isGenSchCode) {
			return
		}
		const fetchCode = async () => {
			const code = await getAuthorizedCodes(codeRole)
			setTheGenCode(code)
			setIsGenSchCode(false)
			setAdminCodeLoading(false)
			setTeacherCodeLoading(false)
		}
		fetchCode()
	}, [isGenSchCode])

	useEffect(() => {
		// console.log('3'.repeat(10))
		// console.log({
		// 	isPullStaffs,
		// 	isSavedQuestions,
		// 	isScrambled,
		// 	isSubmittedQuestions,
		// 	isDownloading,
		// 	isDownloadAll,
		// 	isDeleteAllSaved,
		// 	isDeleteSaved,
		// 	isSubmitAllSavedQuestions,
		// 	isSubmitSavedQuestion,
		// })
		if (!isPullStaffs&&
			!isSavedQuestions&&
			!isScrambled&&
			!isSubmittedQuestions&&
			!isDownloading&&
			!isDownloadAll&&
			!isDeleteAllSaved&&
			!isDeleteSaved&&
			!isSubmitAllSavedQuestions&&
			!isSubmitSavedQuestion
		) {
			return
		}
		console.log({backEndpoint})
		console.log('4'.repeat(10))
		const fetchResponse = async () => {
			const response = await fetchData(backEndpoint)
			console.log({response})
			if (response?.ok) {
				console.log('5'.repeat(10))
				const data = response?.data
				console.log({data})
				if (isPullStaffs) {
					setPullResponse(data)
					lStorage.setItem('pulled-staffs', {...data, storedAt: Date.now()})
				} else if (isSavedQuestions) {
					setSavedQuestionsResponse(data)
					lStorage.setItem('saved-questions', data)
				} else if (isDeleteAllSaved) {
					setSavedQuestionsResponse([])
					toast.success(data.success)
				} else if (isDeleteSaved) {
					console.log('saved item deleted from server success')
					toast.success(data.success)
				} else if (isScrambled) {
					setScrambledResponse(data)
					lStorage.setItem('scrambled-questions-links', data)
				} else if (isSubmittedQuestions) {
					setSubmittedQuestionsResponse(data)
				} else if (isDownloading) {
					setDownloadResponse(prev=>{
						return {...prev, [downloadID]: data.downloadLink}
					})
				} else if (isDownloadAll) {
					setDownloadAllResponse(data)
				}
				if (isSubmitAllSavedQuestions||isSubmitSavedQuestion) {
					console.log({data})
					let toastTxt
					if (isSubmitAllSavedQuestions) {
						toastTxt = 'all questions'
						console.log(toastTxt)
					} else {
						toastTxt = 'question'
						console.log(toastTxt)
					}
					toast.success(`${sentenceCase(toastTxt)} submitted`)
				}
			}
			setIsScrambled(false)
			setScrambledLoading(false)
			setIsPullStaffs(false)
			setPullStaffsLoading(false)
			setIsSavedQuestions(false)
			setSavedQuestionsLoading(false)
			setDeleteAllSavedQuestionsLoading(false)
			setIsDeleteAllSaved(false)
			setIsDeleteSaved(false)
			setDeleteSavedQuestionLoading([])
			setIsSubmittedQuestions(false)
			setSubmittedQuestionsLoading(false)
			setIsDownloading(false)
			setDownloadLoading([])
			setDownloadID(null)
			setIsDownloadAll(false)
			setDownloadAllLoading(false)
			setIsSubmitAllSavedQuestions(false)
			setSubmitAllSavedQuestionsLoading(false)
			setIsSubmitSavedQuestion(false)
			setSubmitSavedQuestionLoading([])
			console.log('6'.repeat(10))
		}
		fetchResponse()
	}, [isPullStaffs,
		isSavedQuestions,
		isScrambled,
		isSubmittedQuestions,
		isDownloading,
		isDownloadAll,
		isDeleteAllSaved,
		isDeleteSaved,
		isSubmitAllSavedQuestions,
		isSubmitSavedQuestion,
	])

	const handlePage = (page) => {
		setCurrentPage(page)
	}
	const handleBarPage = (page, to) => {
		setStaffsPage(to)
	}

	useEffect(() => {
		// console.log({
		// 	downloadAllResponse,
		// 	previousDownloadAllLink: previousDownloadAllLink.current
		// })
		if (!downloadAllResponse?.downloadLink) return;

		if (downloadAllResponse.downloadLink === previousDownloadAllLink.current) {
			return;
		}
		console.log('downloading multiple...')
		const link = document.createElement("a");
		link.href = `${serverOrigin}${downloadAllResponse?.downloadLink}`;
		link.download = "";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		previousDownloadAllLink.current = downloadAllResponse?.downloadLink
	}, [downloadAllResponse]);

	useEffect(() => {
		if (!copiedCode&&!copiedPassword) return
		const copyDelay = setTimeout(() => {
			if (copiedCode) {
				setCopiedCode(false)
			} else if (copiedPassword) {
				setCopiedPassword(false)
			}
		}, copyDelayDuration);
		return ()=>clearTimeout(copyDelay)
	}, [copiedCode, copiedPassword])

	const profileArr = [
		{
			name: "Email",
			icon: "📧",
			content: userDetail?.email||notAvailable,
		},
		{
			name: "Mobile No.",
			icon: "📞",
			content: formatPhoneNumber(userDetail?.mobile_no)||notAvailable,
		},
	]

	const isHeadOrAdmin = userInfo?.role==='head'||userInfo?.role==='admin'

	const dashboardSidebarArgs = {
		isHeadOrAdmin, handlePage, currentPage, localPulledStaffs,
		setPullResponse, setBackEndpoint, setPullStaffsLoading,
		setIsPullStaffs, handleBarPage, setScrambledLoading, setIsScrambled,
		deviceInfo, isMobileDev,
	}
	const staffPageArgs = {
		currentPage, isUserDetailPage, theGenCode, setCopiedCode, userDetail,
		staffsPage, copiedCode, setCodeRole, setIsGenSchCode, setTeacherCodeLoading,
		teacherCodeLoading, setAdminCodeLoading,
		userInfo, adminCodeLoading, setDownloadAllLoading, setIsDownloadAll,
		setBackEndpoint, submittedQuestionsResponse, downloadAllLoading,
		setSubmittedQuestionsLoading, setIsSubmittedQuestions, setPullResponse,
		setPullStaffsLoading, setIsPullStaffs, pullStaffsLoading, submittedQuestionsLoading,
		setCopiedPassword, copiedPassword, pullResponse, handleBarPage,
		setIsUserDetailPage, setUserDetail, profileArr, downloadLoading,
		setDownloadID, setIsDownloading, downloadResponse, staffCreationLoading,
		setStaffCreationLoading, avatar, deviceInfo, isMobileDev,
	}
	const questionPageArgs = {
		currentPage, savedQuestionsPage, savedQuestionsResponse, setSubmitAllSavedQuestionsLoading,
		setIsSubmitAllSavedQuestions, setBackEndpoint, setSavedQuestionsResponse, lStorage,
		submitAllSavedQuestionsLoading, setDeleteAllSavedQuestionsLoading, setIsDeleteAllSaved,
		deleteAllSavedQuestionsLoading, setSavedQuestionsLoading, setIsSavedQuestions,
		savedQuestionsLoading, submitSavedQuestionLoading, setIsSubmitSavedQuestion,
		deleteSavedQuestionLoading, setIsDeleteSaved, isMobileDev,
	}
	const scramblePageArgs = {
		currentPage, scrambledPage, setScrambledLoading, setIsScrambled,
		setBackEndpoint, scrambledLoading, scrambledResponse, isMobileDev,
	}
	
	console.log({
		userInfo,
		currentPage,
		staffsPage,
		pullResponse,
		backEndpoint,
		userDetail,
		isUserDetailPage,
		savedQuestionsResponse,
		scrambledResponse,
		submittedQuestionsResponse,
		submittedQuestionsLoading,
		chk: !isUserDetailPage || staffsPage==='pull-submitted',
		isDownloading,
		downloadLoading,
		downloadResponse,
		downloadID,
		downloadAllResponse,
		downloadAllLoading,
		localSavedQuestions,
		deviceInfo,
	})
	return (
			<>
				{/* spinner */}
				{loadingPage && <SpinnerBarForPage />}

				<section className={`dashboard-content ${loadingPage?'d-none':''}`}>
					{/* dashboard section */}
					{/* <div className={`${(!isPreQuiz||activeSession)?'quiz':'d-none'} ${isSubmitted ? 'is-flipped' : ''}`}> */}
					<div className={`dashboard`}>

						{/* dashboard sidebar */}
						<DashboardSidebar {...dashboardSidebarArgs} />

						{/* dashboard detailed content */}
						<div className={`DashboardPage glass dashboard-details ${isMobileDev?'p-05 dashboard-p-05':'p-1'}`}>

							{/* staffs page */}
							<StaffPageComp {...staffPageArgs} />

							{/* saved questions page */}
							<SavedQuestionsPageComp {...questionPageArgs} />

							{/* scrambled page */}
							<ScramblePageComp {...scramblePageArgs} />

							{/* other page */}
							<div className={`otherPage ${(currentPage!=='staffs'&&currentPage!=='saved questions'&&currentPage!=='scrambled')?'':'d-none'}`}>
								<h1>{titleCase(currentPage)}</h1>
								
							</div>

							{/* <SpinnerBarForPage /> */}
						</div>
					</div>
				</section>
			</>
	)
}

const validateFieldsArr = ["email"]

function CreateStaff({staffCreationLoading, setStaffCreationLoading, deviceInfo}) {
	const [formHead, setFormHead] = useState(initFormHead)
	const { lStorage, sStorage } = useCreateStorage()
	const userInfo = lStorage.getItem('user')
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from?.pathname;
	const [formData, setFormData] = useState(formValues);
	const [emailCheckResponse, setEmailCheckResponse] = useState(null)
	const { checkExistence, availabilityResponse, availabilityLoading, availabilityError } = useEmailAndUsernameChecker();

	useEffect(() => {
		if (userInfo?.role==='head') {
			setFormHead(prev => {
				// console.log('prev:', prev)
				const updated = prev.map(item => {
					// console.log({item})
					if (item.name === 'role') {
						const adminExist = item.options.some(option=>option.toLowerCase()==='admin')
						if (!adminExist) {
							item.options = [...item.options, 'Admin']
						}
					}
					return item
				})
				return updated
			})
		}
	}, [])
	if (deviceInfo.label === "mobile") {
		// console.log('mobile'.repeat(5))
		formHead.forEach(obj => {
			obj.width = '40%'
		})
	}
	const handleChange = async (e) => {
		let { name, value } = e.target;
		if (name === 'mobile_no') {
			value = justNumbers(value)
		}
		setFormData((prev) => ({
			...prev,
			[name]: removeWhiteSpace(value),
		}))

		console.log({name})

		if (name==='email') {
			console.log('email'.repeat(5))
			if (value.trim()===''||!isValidEmail(value)) {
				console.log('email-empty/invalid'.repeat(5))
				setEmailCheckResponse(null)
			} else if (value) {
				setEmailCheckResponse('loading')
			}
		}
		if ((name==='email'&&isValidEmail(value))) {
			console.log('checking'.repeat(5))
			const response = await checkExistence(name, value);
			if (response) {
				console.log({
					response,       // { loading: false, data: {...}, error: null }
					availabilityResponse,  // last stored in hook state
					availabilityLoading,   // last loading state
					availabilityError,          // last error state
				});
				if (name==='email') {
					console.log('is-email'.repeat(5))
					setEmailCheckResponse(response?.availabilityResponse)
				}
			}
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refresh
		setStaffCreationLoading(true)
		const cleanedData = structuredClone(formData);

		console.log({
			formData,
			cleanedData,
		})

		const endpoint = 'user/create'
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success('Success')
			// setFormData(formValues)
		}
		setStaffCreationLoading(false)
	};

	// console.log({
	// 	formData,
	// 	formHead
	// })
	return (
		<>
			{/* <section className="contact-grid"> */}
			<div className="CreateStaffPage sign-up-form flex-column w-100">
				<div className="d-flex justify-content-between">
					<small className="pl-color">Note: Every field with * must be filled</small>
				</div>
				<form
				onSubmit={submitHandler}
				className="form-column signup">
					{formHead.map((input, inpIdx) => {
						// console.log({
						// 	field: input.name,
						// 	value: formData[input.name]
						// })
						return (
							<div key={input.name+inpIdx}
							className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}
							${input.name==='esb_code'?'code-field':input.name==='school'?'school-field':''}`}>
								
								{
								input.type==='select' ?
								<>
									<select
									// style={{width: input.width}}
									// className="text-center"
									value={formData[input.name]}
									onChange={handleChange}
									name={input.name}
									// disabled={hasCode&&input.name==='role'}
									required={input.required}>
										<option value="" disabled hidden>-- {input.placeholder} --</option>
										{input.options.map((sItem, sIdx) => (
											<option key={sIdx}
											disabled={sItem.toLowerCase()==='student'}
											value={titleCase(sItem)}
											className="options">
												{titleCase(sItem)} {sItem.toLowerCase()==='student'?'(Coming soon!)':''}
											</option>
										))}
									</select>
									<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
								</>
								:
								<>
									<input
									className="text-center"
									value={formData[input.name]}
									onChange={handleChange}
									onKeyDown={(e) => {
										if (e.key === ' ') {
											e.preventDefault();
										}
									}}
									type={input.type}
									id={input.name}
									name={input.name}
									placeholder=" "
									required={input.required}
									disabled={input.disabled}
									/>
									<label htmlFor={input.name}
									// style={{
									// 	...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
									// }}
									>
										{input.placeholder}{/* placeholder */}
										{input.required?<sup className="white-space-pre">* </sup>:null} {/* * compulsory field marker */}
										<> {/* email checker */}
										{formData[input.name] &&
										validateFieldsArr.includes(input.name) && (
											input.name === 'email'?
														(<><span className={`${emailCheckResponse==='loading'?'d-none':'checkers-style'} ${emailCheckResponse==='available'?'bg-green':emailCheckResponse==='not_available'?'bg-red':''}`}>{sentenceCase(emailCheckResponse)} {checkIcons[emailCheckResponse]}</span><span className={emailCheckResponse==='loading'?'':'d-none'}><Spinner type={'dot'}/></span></>):
															null
										)}
										</>
									</label>
								</>}
							</div>
						)
					})}

					<button
					type="submit"
					disabled={staffCreationLoading}
					className="cta-button signup-btn">
						{staffCreationLoading ?
							<Spinner type={'dot'} /> :
							`Create ${formData.role.toLowerCase()} account`}</button>
				</form>
				{/* <p className="forgot-password-new-user">Have an account? <Link to={'/login'} className="">Login</Link></p> */}
			</div>
		</>
	)
}

function DashboardSidebar({
	isHeadOrAdmin, handlePage, currentPage, localPulledStaffs,
	setPullResponse, setBackEndpoint, setPullStaffsLoading, setIsPullStaffs,
	handleBarPage, setScrambledLoading, setIsScrambled, deviceInfo, isMobileDev}) {
	return (
		<div className={`DashboardSidebar mob-dashb glass no-glass-hover dashboard-bar-text ${isMobileDev?'d-flex justify-content-center p-01':'p-1'}`}>
		{barItems.map((item, idx) => {
			if (item.name==='staffs'&&!isHeadOrAdmin) {
				return null
			}
			return (
				<div key={idx}
				className={`bar-box
							${item.name===currentPage?'active':''}
							${item.disable?'disabled':''}
							${isMobileDev?(idx===0?'first ml-5px rem-mob-margin-dashb':
											idx===(barItems.length-1)?'last mr-5px rem-mob-margin-dashb':'middle rem-mob-margin-dashb'
							):''}
							`}
				onClick={()=>{
					handlePage(item.name);
					if (item.name==='staffs') {
						if (localPulledStaffs) {
							console.log('pulled staffs from storage')
							const {storedAt, ...rest} = localPulledStaffs
							const pulledStaffArr = Object.values(rest).map(obj=>obj)
							console.log({storedAt, rest, pulledStaffArr})
							setPullResponse(pulledStaffArr)
						} else {
							setBackEndpoint('user/pull-staffs')
							setPullStaffsLoading(true)
							setIsPullStaffs(true)
							handleBarPage(item.index, '')
						}
					// } else if (item.name==='scrambled') {
					// 	if (localScrambledQuestionLinks) {
					// 		console.log('fetched links from local storage')
					// 		setScrambledResponse(localScrambledQuestionLinks)
					} else {
						setBackEndpoint('shufflequestions/get-links')
						setScrambledLoading(true)
						setIsScrambled(true)
					}
					// }
				}}>
					<button
					type="button"
					className="cta-button"
					disabled={item.disable}
					>{titleCase(item.name)}</button>
				</div>
			)
		})}
	</div>
	)
}

function StaffPageComp({currentPage, isUserDetailPage, theGenCode, setCopiedCode,
					userDetail, staffsPage, copiedCode, setCodeRole, setIsGenSchCode,
					setTeacherCodeLoading, teacherCodeLoading, setAdminCodeLoading,
					userInfo, adminCodeLoading, setDownloadAllLoading, setIsDownloadAll,
					setBackEndpoint, submittedQuestionsResponse, downloadAllLoading,
					setSubmittedQuestionsLoading, setIsSubmittedQuestions, setPullResponse,
					setPullStaffsLoading, setIsPullStaffs, pullStaffsLoading, isMobileDev,
					setCopiedPassword, copiedPassword, pullResponse, handleBarPage,
					setIsUserDetailPage, setUserDetail, profileArr, downloadLoading,
					setDownloadID, setIsDownloading, downloadResponse, staffCreationLoading,
					setStaffCreationLoading, avatar, submittedQuestionsLoading, deviceInfo,}) {
	const staffSubPageArgs = {
			staffCreationLoading,
			setStaffCreationLoading,
			deviceInfo,
		}
	return (
		<div className={`StaffPageComp ${currentPage==='staffs'?'':'d-none'}`}>

			<div className={`d-flex justify-content-between pb-1 ${isMobileDev?'flex-column':''}`}>
				<h2 className={`${isUserDetailPage?'':'d-none'}`}>{titleCase(isMobileDev?`${userDetail?.role}`:`${(userInfo?.id===userDetail?.id)?'You':userDetail?.first_name} (${userDetail?.role})`)}</h2>
				<h1 className={`${!isUserDetailPage?'':'d-none'}`}>{titleCase(currentPage)}</h1>
				<div className={`d-flex align-items-center ${isMobileDev?'justify-content-center':''}`}>

					{/* copy code to clipboard */}
					<p
					className={`white-space-pre pointer pr-1 ${(staffsPage==="create-staff"&&theGenCode)?'':'d-none'}`}
					onClick={()=>handleCopy(theGenCode, setCopiedCode)}
					>{theGenCode?.[3]==='T'?'Teacher':'Admin'} Code
					<span className={`pl-05 ${theGenCode?'':'d-none'}`}>
						<FontAwesomeIcon
							icon={copiedCode?"check":"copy"}
							// style={{ cursor: "pointer" }}
							title="Copy code"
						/>
					</span>
					</p>

					<div className={`${(staffsPage===''||staffsPage==='pull-submitted')?'d-none':'d-flex'}`}>
						<button
						onClick={(e)=> {
							setCodeRole('teacher')
							setIsGenSchCode(true)
							setTeacherCodeLoading(true)
						}}
						type="button"
						disabled={teacherCodeLoading}
						className={`cta-button fit first white-space-pre`}>
							{teacherCodeLoading ?
								<Spinner type={'dot'} /> :
								'Teacher code'}
						</button>

						{userInfo?.role==='head' ?
						<button
						onClick={(e)=> {
							setCodeRole('admin')
							setIsGenSchCode(true)
							setAdminCodeLoading(true)
						}}
						type="button"
						disabled={adminCodeLoading}
						className={`cta-button fit middle white-space-pre`}>
							{adminCodeLoading ?
								<Spinner type={'dot'} /> :
								'Admin code'}
						</button>:null}
					</div>

					<div className={`
									${(staffsPage===''||
									staffsPage==='pull-submitted')?
									'd-flex':'d-none'}`}>
						<button
						onClick={(e)=> {
							if (staffsPage==='pull-submitted') {
								const allIDs = submittedQuestionsResponse.map(item=>item.id)
								setDownloadAllLoading(true);
								setIsDownloadAll(true);
								setBackEndpoint(`shufflequestions/exam-questions/?all=True&allIDs=${allIDs}`);
							}
						}}
						type="button"
						disabled={downloadAllLoading}
						className={`cta-button first fit white-space-pre
									${(staffsPage==='pull-submitted'&&
										submittedQuestionsResponse?.length)?
										'':'d-none'}
									`}>
							{(downloadAllLoading) ?
								<Spinner type={'dot'} /> :
								<>
									<FontAwesomeIcon icon="download" />
										{titleCase(`${isMobileDev?'':'Download '} All`)}
								</>
							}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>

						<button
						onClick={(e)=> {
							if (staffsPage==='pull-submitted') {
								setSubmittedQuestionsLoading(true);
								setIsSubmittedQuestions(true);
								setBackEndpoint(`shufflequestions/check-submitted/?teacherID=${userDetail?.id}`);
							} else {
								console.log('1'.repeat(10))
								setPullResponse(null)
								setPullStaffsLoading(true)
								setIsPullStaffs(true)
								setBackEndpoint('user/pull-staffs')
								console.log('2'.repeat(10))
							}
						}}
						type="button"
						disabled={pullStaffsLoading||submittedQuestionsLoading}
						className={`cta-button
									${(!submittedQuestionsResponse?.length)?'first':
									(pullResponse?.length&&isUserDetailPage&&staffsPage==='pull-submitted')?'middle':'first'}
									${(!isUserDetailPage||staffsPage==='pull-submitted')?'':'d-none'}`}>
							{(pullStaffsLoading||submittedQuestionsLoading) ?
								<Spinner type={'dot'} /> :
								'Reload'}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>
					</div>

					{/* copy temp password to clipboard */}
					<button
					onClick={()=>handleCopy(userDetail?.temp_password, setCopiedPassword)}
					type="button"
					disabled={copiedPassword}
					className={`cta-button first fit white-space-pre
								${(userDetail?.must_change_password&&
								(pullResponse?.length&&isUserDetailPage&&
								staffsPage!=='pull-submitted'))?'':'d-none'}
								`}>
							{`${isMobileDev?'':'Copy'} Password`}
							<FontAwesomeIcon
							icon={copiedPassword?"check":"copy"}
							title="Copy password"
						/>
					</button>

					<button
					onClick={()=>{
						console.log('check submit clicked!')
						setSubmittedQuestionsLoading(true);
						setIsSubmittedQuestions(true);
						setBackEndpoint(`shufflequestions/check-submitted/?teacherID=${userDetail?.id}`);
						handleBarPage(4, 'pull-submitted')
						console.log('done with on-click')
					}}
					type="button"
					disabled={submittedQuestionsLoading}
					className={`cta-button ${userDetail?.role==='head'?'first':'middle'} fit white-space-pre
								${((pullResponse?.length&&isUserDetailPage&&
								staffsPage!=='pull-submitted'))?'':'d-none'}
								`}>
						{submittedQuestionsLoading ?
								<Spinner type={'dot'} /> :
							`Submitted${isMobileDev?'':' Questions'}`}
					</button>

					<button
					onClick={()=> {
						if (staffsPage==='pull-submitted') {
							console.log('leaving pull-submitted')
							// setIsUserDetailPage(true)
							handleBarPage(4, '')
						} else if (isUserDetailPage) {
							setIsUserDetailPage(false)
						} else {
							handleBarPage(4, staffsPage===''?'create-staff':'')
						}
					}}
					type="button"
					className={`cta-button fit last white-space-pre`}>
							{(staffsPage!==''||isUserDetailPage)?'◀ Back':'Create Staff'}
					</button>
				</div>
			</div>
			{/* initial sub page */}
			<div className={`StaffsListPage justify-content-center ${(staffsPage===''||staffsPage==='pull-submitted')?'d-flex':'d-none'}`}>
				<div className={`loader-margin-bottom ${(pullStaffsLoading)?'':'d-none'}`}>
					<SpinnerBarForPage />
				</div>
				{pullResponse===null && <h3 className="no-result">Nothing to display</h3>}
				<ul className={`${(pullResponse&&!isUserDetailPage)?'':'d-none'}`}>
					{pullResponse?.length ?
					pullResponse?.map((user, uIdx) => {
						return (
							<li key={uIdx}
							onClick={()=> {
								setUserDetail(user);
								setIsUserDetailPage(true)
							}}
							className="no-list-style glass my-05">
								<span>{uIdx+1}.</span>
								<span>{titleCase(user.first_name)||not_available}</span>
								<span>{(userInfo?.id===user?.id)?'(You)':titleCase(user.last_name)||not_available}</span>
								<span>{user.gender.toUpperCase().slice(0, 1)||not_available}</span>
								{!isMobileDev?<span>{user.mobile_no||not_available}</span>:null}
								<span className={`${user.role.toLowerCase()==='head'?'font-gold font-bold'
													:user.role.toLowerCase()==='admin'?'font-gold':''}`}>{titleCase(user.role)||not_available}</span>
							</li>
						)
					})
					:<h3  className="no-result">No staff record created yet</h3>}
				</ul>
				<div className={`${(pullResponse?.length&&isUserDetailPage&&staffsPage==='')?'w-100 very-small-mob':'d-none'}`}>
					<div className="d-flex flex-column gap-2">
						{userDetail?.image_url ?
							<img
							className="profile-avatar"
							src={userDetail.image_url}
							alt={userDetail.first_name} />
							:
							<div className="profile-avatar">{userDetail?.avatar_code?userDetail.avatar_code:avatar}</div>
						}
						<div className="d-flex m-auto-td gap-1">
							<h3 className="text-center profile-h3">{titleCase(userDetail?.first_name)||notAvailable}</h3>
							<h3 className="text-center profile-h3">{titleCase(userDetail?.last_name)}</h3>
							<h3 className="text-center profile-h3">({userDetail?.gender?.toUpperCase()?.slice(0, 1)})</h3>
						</div>
						{(userInfo?.school?.name)?
						<div className="d-flex align-items-baseline justify-content-center">
							<p className="role text-center text-italic m-0 white-space-pre">{titleCase(userInfo?.school?.name)||notAvailable} </p>
							<p className="role text-center text-italic m-0">({userInfo?.school?.acronym||notAvailable})</p>
							{/* <p className="role white-space-pre font-small"> ID:{id}</p> */}
						</div>:null}
						<div className="d-flex align-items-baseline justify-content-center">
							<p className="role text-center">{titleCase(userDetail?.role)||notAvailable}</p>
							<p className="role white-space-pre font-small"> ID:{userDetail?.id}</p>
						</div>
						<p className="bio text-center">{sentenceCase(userDetail?.about)||notAvailable}</p>
					</div>
					<div>
						{profileArr?.map((userProfileItem, uPIdx) => {
							return (
								<div key={uPIdx}
								className="profile-item">
									<div className="profile-item-icon">{userProfileItem.icon}</div>
									<div className="profile-item-text">
										<h4>{userProfileItem.name}</h4>
										<p>{userProfileItem.content}</p>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				<div className={`${(pullResponse?.length&&isUserDetailPage&&staffsPage==='pull-submitted')?'':'d-none'}`}>
					{(submittedQuestionsResponse?.length) ?
					submittedQuestionsResponse?.map((submitted, sIdx) => {
						const isDisable = downloadLoading?.length>0
						console.log({downloadLoading, id: submitted})
						return (
							<li key={submitted.id}
							onClick={()=>{
								console.log('w'.repeat(20), {id: submitted?.id})
								setDownloadID(submitted?.id)
								downloadLoading?.push(submitted?.id)
								setIsDownloading(true)
								setBackEndpoint(`shufflequestions/exam-questions/?id=${submitted?.id}`)
							}}
							className={`no-list-style ${isDisable?'disabled':''}`}>
								<span
								style={{ position: "relative" }}
								className={`no-list-style glass gap-0 align-items-center in-span ${isDisable?'disable-click':''}`}>
									<span className="white-space-pre">{sIdx+1}.</span>
									<span className="white-space-pre">{
											// titleCase(submitted?.session_subject)
											getSubjectAbbr(submitted?.session_subject)
											}</span>
									{/* <span>for</span> */}
									<span className="white-space-pre">{submitted?.session_class?.toUpperCase()}</span>
									<span className="white-space-pre">{
											// titleCase(submitted?.session_term)
											getTermAbbr(submitted?.session_term)
											}-term</span>
									<span className="time-ago font-15 white-space-pre">
										{(isMobileDev?(
										<i className="font-xsm font-bold font-white">
											{/* <FontAwesomeIcon icon="check" style={{ position: "absolute", right: 165, bottom: 13.5 }} /> */}
											<FontAwesomeIcon icon="check" />
										</i>
									):<span className="p-0">Submitted:</span>)} {timeAgo(submitted.updated_at)}</span>
									<span className="a white-space-pre py-0">
										{(downloadLoading.includes(submitted?.id)) ?
										<Spinner type={'dot'} />:
											downloadResponse[submitted?.id] ?
												<a
												role="button"
												onClick={(e)=>e.stopPropagation()}
												className="cta-button py-05"
												download
												href={`${serverOrigin}${downloadResponse[submitted?.id]}`}>
													<FontAwesomeIcon icon="download" />
													{`${deviceInfo.width<400?'':titleCase('Download')}`}
												</a>
												:
												// {/* {(!downloadLoading.includes(submitted?.id)) ?
												// <Spinner type={'dot'} />: */}
												<>
													<i
													className="font-xsm"
													>
														<FontAwesomeIcon icon="cog" />
													</i>
													{`${deviceInfo.width<400?'':titleCase('Generate')}`}
												</>
												}
									</span>
									{/* <span>{`Questions: ${saved?.questions}`}</span> */}
								</span>
							</li>
						)
					})
					:
					<h3>No Submission made yet.</h3>}
				</div>
			</div>

			{/* create staffs sub page */}
			<div className={`CreateStaff-cont justify-content-center ${staffsPage==='create-staff'?'d-flex':'d-none'}`}>
				<CreateStaff {...staffSubPageArgs}/>
			</div>
		</div>
	)
}

function SavedQuestionsPageComp({currentPage, savedQuestionsPage, savedQuestionsResponse, setSubmitAllSavedQuestionsLoading,
						setIsSubmitAllSavedQuestions, setBackEndpoint, setSavedQuestionsResponse, lStorage,
						submitAllSavedQuestionsLoading, setDeleteAllSavedQuestionsLoading, setIsDeleteAllSaved,
						deleteAllSavedQuestionsLoading, setSavedQuestionsLoading, setIsSavedQuestions,
						savedQuestionsLoading, submitSavedQuestionLoading, setIsSubmitSavedQuestion,
						deleteSavedQuestionLoading, setIsDeleteSaved, isMobileDev,}) {
	return (
		<div className={` SavedQuestionsPageComp ${currentPage==='saved questions'?'':'d-none'}`}>
			<div className={`d-flex justify-content-between pb-1`}>
				<h1>{titleCase(currentPage)}</h1>
				<div className={`d-flex align-items-center`}>

					<div className={`${savedQuestionsPage!==''?'d-none':'d-flex'}`}>
					<button
						onClick={(e)=> {
							const allIDs = savedQuestionsResponse.map(item=>item.id)
							setSubmitAllSavedQuestionsLoading(true)
							setIsSubmitAllSavedQuestions(true)
							setBackEndpoint(`shufflequestions/exam-questions/?submit_all=True&allIDs=${allIDs}`)
							setSavedQuestionsResponse(prev=>{
								const updatedSaved = prev.map(item=>{
									if (!item.has_submitted) {
										item.has_submitted = true
									}
									lStorage.removeItem(`saved-detail-${item.id}`)
									return item
								})
								lStorage.setItem('saved-questions', updatedSaved)
								return updatedSaved
							})
						}}
						type="button"
						disabled={submitAllSavedQuestionsLoading||
									!savedQuestionsResponse?.length}
						className={`cta-button first white-space-pre`}>
							{(submitAllSavedQuestionsLoading) ?
								<Spinner type={'dot'} /> :
								<>
									<i className="font-xsm">
										<FontAwesomeIcon icon="paper-plane" />
									</i>
										{`${isMobileDev?'':'Submit '}${titleCase('All')}`}
										{/* {titleCase('Submit All')} */}
								</>
							}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>
						<button
						onClick={(e)=> {
							// if (staffsPage==='pull-submitted') {
							const allIDs = savedQuestionsResponse.map(item=>item.id)
							setDeleteAllSavedQuestionsLoading(true)
							setIsDeleteAllSaved(true)
							setBackEndpoint(`school/save/false/?delete_all=True&allIDs=${allIDs}`)
							allIDs.forEach(saved=> {
								lStorage.removeItem(`saved-detail-${saved}`)
							})
						}}
						type="button"
						disabled={deleteAllSavedQuestionsLoading||
									!savedQuestionsResponse?.length}
						className={`cta-button middle bg-red-warn white-space-pre`}>
							{(deleteAllSavedQuestionsLoading) ?
								<Spinner type={'dot'} /> :
								<>
									<FontAwesomeIcon icon="trash-can" />
										{`${isMobileDev?'':'Delete '}${titleCase('All')}`}
								</>
							}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>
						<button
						onClick={(e)=> {
							console.log('1'.repeat(10))
							setSavedQuestionsLoading(true)
							setIsSavedQuestions(true)
							setBackEndpoint('school/save/false')
							lStorage.removeSavedDetailsItems()
							console.log('2'.repeat(10))
						}}
						type="button"
						disabled={savedQuestionsLoading}
						className={`cta-button last white-space-pre`}>
							{savedQuestionsLoading ?
								<Spinner type={'dot'} /> :
								'Reload'}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>
					</div>

				</div>
			</div>

			{/* initial sub page */}
			<div className={`2 justify-content-center ${savedQuestionsPage===''?'d-flex':'d-none'}`}>
				<div className={`loader-margin-bottom ${(savedQuestionsLoading)?'':'d-none'}`}>
					<SpinnerBarForPage />
				</div>
				<ul className={`${(!savedQuestionsLoading)?'':'d-none'}`}>
					{(savedQuestionsResponse?.length) ?
					savedQuestionsResponse?.map((saved, sIdx) => {
						// const item = saved?.scramble_session_data
						// console.log({saved})
						const preStyle = 'white-space-pre'
						return (
							<li key={saved.id}
							className="no-list-style justify-content-center gap-0p3">
								<Link
								to={`scramble-questions/${saved.id}`}
								state={{fetchID: saved.id}}
								className="no-list-style glass gap-05"
								style={{ position: "relative" }}>
									<span className={`${preStyle}`}>{sIdx+1}.</span>
									<span className={`${preStyle}`}>{
											// titleCase(saved?.subject)
											getSubjectAbbr(saved?.subject)
											}</span>
									<span className={`${preStyle}`}>{saved?.class?.toUpperCase()}</span>
									<span className={`${preStyle}`}>{
											// titleCase(saved?.term)
											getTermAbbr(saved?.term)
											}-term</span>
									<span className={`${preStyle}`}>{`${isMobileDev?'Q':'Questions'}: ${saved?.questions}`}</span>
									<span className={`${preStyle} time-ago font-smb`}>{(saved?.has_submitted)?(isMobileDev?(
										<i className="font-xsm font-bold font-white">
											<FontAwesomeIcon icon="check" style={{ position: "absolute", right: 3, bottom: 14.5 }} />
											<FontAwesomeIcon icon="check" />
										</i>
									):'Submitted'):''}</span>
								</Link>
								<div className="d-flex">
									<button
									onClick={(e)=> {
										// if (staffsPage==='pull-submitted') {
										// const allIDs = savedQuestionsResponse.map(item=>item.id)
										submitSavedQuestionLoading?.push(saved.id)
										setIsSubmitSavedQuestion(true)
										setBackEndpoint(`shufflequestions/exam-questions/?submit_all=True&allIDs=${[saved.id]}`);
										setSavedQuestionsResponse(prev=>{
											const updatedSaved = prev.map(item=>{
												if (item.id===saved.id) {
													item.has_submitted = true
													lStorage.removeItem(`saved-detail-${item.id}`)
												}
												return item
											})
											lStorage.setItem('saved-questions', updatedSaved)
											return updatedSaved
										})
									}}
									type="button"
									disabled={submitSavedQuestionLoading.includes(saved.id)}
									className={`cta-button first ${preStyle}`}>
										{(submitSavedQuestionLoading.includes(saved.id)) ?
											<Spinner type={'dot'} /> :
											<>
												<i className="font-xsm">
													<FontAwesomeIcon icon="paper-plane" />
												</i>
													{isMobileDev?'':titleCase('Submit')}
											</>
										}
											{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
									</button>
									<button
									onClick={(e)=> {
										// if (staffsPage==='pull-submitted') {
										// const allIDs = savedQuestionsResponse.map(item=>item.id)
										deleteSavedQuestionLoading?.push(saved.id)
										setIsDeleteSaved(true)
										setBackEndpoint(`school/save/false/?delete_all=True&allIDs=${[saved.id]}`);
										lStorage.removeItem(`saved-detail-${saved.id}`)
										setSavedQuestionsResponse(prev=>{
											const updatedSaved = prev.filter(item=>item.id!==saved.id)
											lStorage.setItem('saved-questions', updatedSaved)
											return updatedSaved
										})
									}}
									type="button"
									disabled={deleteSavedQuestionLoading.includes(saved.id)}
									className={`cta-button last ${preStyle} bg-red-warn`}>
										{(deleteSavedQuestionLoading.includes(saved.id)) ?
											<Spinner type={'dot'} /> :
											<>
												<FontAwesomeIcon icon="trash-can" />
													{isMobileDev?'':titleCase('Delete')}
											</>
										}
											{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
									</button>
								</div>
							</li>
						)
					})
					:
					<h3 className="no-result">No Saved Sessions</h3>}
				</ul>
			</div>
		</div>
	)
}

function ScramblePageComp({currentPage, scrambledPage, setScrambledLoading, setIsScrambled,
							setBackEndpoint, scrambledLoading, scrambledResponse, isMobileDev,}) {
	return (
		<div className={` ScramblePageComp-title ${currentPage==='scrambled'?'':'d-none'}`}>
			<div className={`d-flex justify-content-between pb-1`}>
				<h1>{titleCase(currentPage)}</h1>
				<div className="d-flex gap-1 align-items-center">

					<div className={`gap-1 ${scrambledPage!==''?'d-none':'d-flex'}`}>
						<button
						onClick={(e)=> {
							console.log('1'.repeat(10))
							setScrambledLoading(true)
							setIsScrambled(true)
							setBackEndpoint('shufflequestions/get-links')
							console.log('2'.repeat(10))
						}}
						type="button"
						disabled={scrambledLoading}
						className={`cta-button`}>
							{scrambledLoading ?
								<Spinner type={'dot'} /> :
								'Reload'}
								{/* <FontAwesomeIcon icon="arrows-rotate" spin={teacherCodeLoading} /> */}
						</button>
					</div>

				</div>
			</div>

			{/* initial sub page */}
			<div className={`ScramblePageComp-body justify-content-center ${scrambledPage===''?'d-flex':'d-none'}`}>
				<div className={`loader-margin-bottom ${(scrambledLoading)?'':'d-none'}`}>
					<SpinnerBarForPage />
				</div>
				<ul className={`${(!scrambledLoading)?'':'d-none'}`}>
					{(scrambledResponse?.length) ?
					scrambledResponse?.map((scrambled, sIdx) => {
						// console.log({scrambled})
						const shuffleInfo = scrambled.link.split('/')[2]
						const subject = shuffleInfo.split('_')[1].toUpperCase()
						const term = shuffleInfo.split('_')[2].toLowerCase()
						// console.log({subject, term, shuffleInfo})
						return (
							<li key={sIdx}
							// onClick={()=> {
							// 	setUserDetail(user);
							// 	setIsUserDetailPage(true)
							// }}
							style={{cursor: "none"}}
							className="no-list-style glass align-items-center my-05">
								<div className="d-flex gap-1 align-items-center">
									<span className="mob-pad d-flex gap-1 align-items-center"
									style={{cursor: "none"}}>
										{/* {subject} */}
										{getSubjectAbbr(subject)}
									</span>
									<span className="d-flex gap-1 align-items-center"
									style={{cursor: "none"}}>
										{/* {subject} */}
										{/* {getSubjectAbbr(subject)} */}
										{term||notAvailable}
										<span className="time-ago">({timeAgo(scrambled.created_at)})</span>
									</span>
								</div>
								<a
									role="button"
									href={`${serverOrigin}${scrambled.link}`}
									download
									className={'download-btn-dropdown-item'}
								>
									<span>
										<FontAwesomeIcon icon="download" />
										{titleCase('Download')}
									</span>
								</a>
								{/* <span>{titleCase(user.first_name)}</span>
								<span>{titleCase(user.last_name)}</span>
								<span>{user.gender.toUpperCase().slice(0, 1)}</span>
								<span>{user.mobile_no}</span>
								<span className={`${user.role.toLowerCase()==='admin'?'font-gold':''}`}>{titleCase(user.role)}</span> */}
							</li>
						)
					})
					:
					<h3 className="no-result">No Recent Activity</h3>}
				</ul>
			</div>
		</div>
	)
}

function useEmailAndUsernameChecker() {
	const [availabilityResponse, setAvailabilityResponse] = useState(null);
	const [availabilityLoading, setAvailabilityLoading] = useState(false);
	const [availabilityError, setAvailabilityErrorError] = useState(null);
	const debounceTimer = useRef(null);

	// This is the function you can pass around and call manually
	const checkExistence = useCallback(async (key, value) => {
		return new Promise((resolve) => {

			// debounce setup
			// clears previous timer
			if (debounceTimer.current) clearTimeout(debounceTimer.current);

			// set a new one
			debounceTimer.current = setTimeout(async () => {
				if (!key || !value) {
					resolve({
						availabilityLoading: false,
						availabilityResponse: null,
						availabilityError: null
					});
					return;
				}

				setAvailabilityLoading(true);
				setAvailabilityErrorError(null);
				setAvailabilityResponse(null)

				try {
					const queryString = new URLSearchParams({ [key]: value }).toString();
					const endpoint = `user/check-${key}?${queryString}`;

					console.log({
						queryString,
						endpoint
					})
					const response = await FetchFromServer(endpoint);
					console.log({response})

					setAvailabilityResponse(response?.data);

					resolve({
						availabilityLoading: false,
						availabilityResponse: response?.data,
						availabilityError: null
					});
				} catch (err) {
					setAvailabilityErrorError(err);
					setAvailabilityResponse(null);
					resolve({
						availabilityLoading: false,
						availabilityResponse: null,
						availabilityError: err
					});
				} finally {
					setAvailabilityLoading(false);
				}
			}, 1000);
		})
	}, []);

	return { checkExistence, availabilityResponse, availabilityLoading, availabilityError };
}

function CheckBoxBtnUI({checkState, setCheckState, spanClass='', chkText='checkbox display msg.'}) {
	return (
		<span className={spanClass}
		>{chkText}
		<input
			type="checkbox"
			checked={checkState}
			onChange={(e) => setCheckState(e.target.checked)}
		/>
		</span>
	)
}

export { Dashboard };