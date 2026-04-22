import { useState, useEffect, useRef } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { justNumbers, removeWhiteSpace, getAuthorizedCodes } from "../../hooks/formHooks";
import { formatPhoneNumber, sentenceCase, titleCase } from "../../hooks/changeCase";
import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { useNavigate } from "react-router-dom"
import { useDevice } from "../../contexts/deviceTypeContext";
import { useLogo } from "../../contexts/LogoContext";
import { ItemsToggler } from "../scrambleQuestions/scrambleQuestions";
import { useAuth } from "../../contexts/authContext";

// const roleArray = [
// 	'student',
// 	'teacher'
// ]
const formHead = [
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
		name: "mobile_no",
		required: false,
		disabled: false,
		type: "tel",
		placeholder: "Mobile Number",
		width: "70%",
		case: null,
	},
	// {
	// 	name: "role",
	// 	required: false,
	// 	disabled: false,
	// 	type: "select",
	// 	placeholder: "Role",
	// 	width: "11%",
	// 	options: roleArray,
	// 	case: "title",
	// },
	{
		name: "username",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "Username",
		width: "70%",
		case: null,
	},
	{
		name: "about",
		required: false,
		disabled: false,
		type: "text",
		// type: "textarea",
		placeholder: "About me",
		width: "70%",
		case: null,
	},
]
const schoolFormHead = [
	{
		name: "name",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "School name",
		width: "70%",
		case: null,
	},
	{
		name: "acronym",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "Acronym",
		width: "70%",
		case: null,
	},
	{
		name: "school_email",
		required: false,
		disabled: false,
		type: "email",
		placeholder: "School email",
		width: "70%",
		case: null,
	},
	{
		name: "school_address",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "School address",
		width: "70%",
		case: null,
	},
]
const formPassword = [
	{
		name: "password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "New Password",
		width: "70%",
		case: null,
		password: "password",
	},
	{
		name: "confirm_password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Confirm New Password",
		width: "70%",
		case: null,
		password: "password",
	},
	{
		name: "old_password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Old Password",
		width: "70%",
		case: null,
		password: "old_password",
	},
]
const randomAvatar = [
	'😎', '🤡', '👻', '💩',
	'🐶', '🐺', '🦊', '🐻',
	'🐨', '🐼', '🐸', '🗽',
	'🗿', '🎃', '✨', '🧩',
	'🥏', '🎲',
]
// const getRandomAvatar = () => {
// 	return randomAvatar[Math.floor(Math.random() * randomAvatar.length)];
// };
// const getGender = () => {
// 	return getRandomAvatar()
// };
const notAvailable = "N/A"
const cleanFormForSubmit = (arr, formObj) => {
	return Object.keys(formObj).reduce((acc, key) => {
		// console.log(
		// 	'key:', key, ':::::and value:', formObj[key], !!formObj[key]
		// )
		if (arr.includes(key)&&!!formObj[key]) {
			acc[key] = formObj[key];
		}
		return acc;
	}, {});
};

const handleCopy = async (content, isCopied) => {
	if (!content) return;
	try {
		await navigator.clipboard.writeText(content);
		// toast.info("copied!"); // optional feedback
		isCopied(true)
	} catch (err) {
		console.error("Copy failed:", err);
	}
};
const copyDelayDuration = 800
const normalizeStringLength = (str, isMobileDev900, len=null, extra=null, fieldName=null) => {
	if (!str) return ''
	// console.log({len, extra})
	let addExtra = 10
	if (extra) {
		addExtra = extra
	}
	let nameField = isMobileDev900?8:13
	if (fieldName) {
		nameField = isMobileDev900?5:10
	}
	if (len) {
		// console.log('using len', {
		// 	strLen: str.length,
		// 	len,
		// 	gt: str.length>len,
		// 	extra,
		// })
		return str.length<len?str:
				`${isMobileDev900?str.slice(0, len):
				str.slice(0, len+addExtra)}...`
	}
	return str.length<=10?str:
			`${str.slice(0, nameField)}...` // desktop
}
const themeTogglerArray = ["blue", "dark"]

function Profile() {
	const { setUser } = useAuth()
	const { refreshLogo } = useLogo()
	// const deviceInfo = useDeviceInfo()
	const { label, width, isMobileDev900 } = useDevice();
	// const isMobileDev900 = deviceInfo.width<=900
	const navigate = useNavigate()
	const [copied, setCopied] = useState(false);
	const [isGenSchCode, setIsGenSchCode] = useState(false)
	const [theGenCode, setTheGenCode] = useState(null)
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false)
	const [activeView, setActiveView] = useState('profile')
	// const [isEditing, setIsEditing] = useState(false)
	const [selectedAvatar, setSelectedAvatar] = useState(null)
	// const [isChoosingAvatar, setIsChoosingAvatar] = useState(false)
	const { lStorage, sStorage } = useCreateStorage()
	const [updateSch, setUpdateSch] = useState(false)
	const userData = lStorage.getItem('user') || {}
	let {
		about,
		email,
		fileId,
		image_url,
		avatar_code,
		first_name,
		last_name,
		is_staff,
		is_super_admin,
		is_school_admin,
		school,
		role,
		contributor,
		gender,
		mobile_no,
		username,
		id,
		theme_mode,
		points,
	} = userData
	const {
		name:schoolName,
		acronym,
		school_address,
		school_email,
		school_logo_url,
		school_logo_fileId,
	} = school
	const [bgTheme, setBgTheme] = useState(theme_mode)
	const formValues = {
		last_name: last_name||"",
		username: username||"",
		mobile_no: mobile_no||"",
		// role: role||"",
		old_password: "",
		password: "",
		confirm_password: "",
		about: about||"",
		avatar_code: avatar_code||"",
	}
	const schoolFormValues = {
		name: schoolName||"",
		acronym: acronym||"",
		school_email: school_email||"",
		// role: role||"",
		school_address: school_address||"",
	}
	// if (username) {
	// 	username = `(${username})`
	// }
	if (gender) {
		gender = gender.toLowerCase()==='m'?'M':'F'
	}
	const uploadToCloud = useUploadToImagekit()
	const [uploadedProfileImg, setUploadedProfileImg] = useState(null)
	const [uploadedSchoolImg, setUploadedSchoolImg] = useState(null)
	const [oldPasswordCheckError, setOldPPasswordCheckError] = useState(null)
	const [passwordCheckError, setPasswordCheckError] = useState(null)
	const checkPasswords = usePasswordCheck()
	const [formData, setFormData] = useState(formValues);
	const [schoolFormData, setSchoolFormData] = useState(schoolFormValues);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	console.log({
		about,
		email,
		fileId,
		image_url,
		avatar_code,
		first_name,
		last_name,
		is_staff,
		is_super_admin,
		is_school_admin,
		school,
		role,
		gender,
		mobile_no,
		username,
		contributor,
		id,
		points,
		userData,

		isGenSchCode,
		theGenCode,

		acronym,
		school_address,
		school_email,
		school_logo_url,
		school_logo_fileId,
	})
	const profileArr = [
		{
			name: "Email",
			icon: "📧",
			content: email||notAvailable,
		},
		{
			name: "Mobile No.",
			icon: "📞",
			content: formatPhoneNumber(mobile_no)||notAvailable,
		},
	]

	useEffect(()=> {
		if (updateSch) {
			const newUserData = lStorage.getItem('user') || {}
			console.log('new'.repeat(10), {newUserData})
			const { school, rest } = newUserData
			setSchoolFormData({
				name: school.name||"",
				acronym: school.acronym||"",
				school_email: school.school_email||"",
				// role: role||"",
				school_address: school.school_address||"",
			})
			setUpdateSch(false)
		}
	}, [updateSch])
	useEffect(() => {
		if (!isGenSchCode) {
			return
		}
		const fetchCode = async () => {
			const code = await getAuthorizedCodes()
			setTheGenCode(code)
			setIsGenSchCode(false)
		}
		fetchCode()
	}, [isGenSchCode])
	useEffect(() => {
		setLoadingPage(false)
	}, []);
	const handleChange = (e) => {
		let { name, value } = e.target;
		if (name === 'mobile_no') {
			value = justNumbers(value)
		}
		setFormData((prev) => ({
			...prev,
			[name]: name!=='about'?removeWhiteSpace(value):value,
		}))
	};
	const handleSchoolChange = (e) => {
		let { name, value } = e.target;
		setSchoolFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	};
	// console.log('aaaaa')
	useEffect(()=> {
		// console.log('ccccc')
		if (formData.password || formData.confirm_password) {
			// console.log('effect p1 and p2')
			setPasswordCheckError(checkPasswords(
				formData.password,
				formData.confirm_password,
				formData,
				false,
			))
		}
		if (!formData.password && !formData.confirm_password) {
			setPasswordCheckError(null)
		}
		if (formData.old_password) {
			// console.log('effect p_old')
			setOldPPasswordCheckError(checkPasswords(
				formData.old_password,
				null, null, true
			))
		}
		if (!formData.old_password) {
			setOldPPasswordCheckError(null)
		}
	}, [formData.old_password, formData.password, formData.confirm_password])
	// console.log('bbbbb')

	const submitHandler = async (e=null, view=null, bgThemeValue=null) => {
		if (!view) {
			console.log('No view info passed')
			return
		}

		if (e) {
			e.preventDefault(); // prevent default page refresh
		} else {
			console.warn('sending theme to server')
		}

		let endpoint
		let cleanedData
		let viewSuccessText
		if (view==="theme_mode") {
			console.log('✅'.repeat(7), {bgThemeValue})
			endpoint = 'user/change-theme'
			cleanedData = {
				theme_mode: bgThemeValue
			}
			viewSuccessText = "theme change "
		} else {
			setLoading(true)
			cleanedData = structuredClone(formData);
			let pageArr = []
			endpoint = 'test-view'
			if (view==='edit') {
				pageArr = formHead
				endpoint = `user/update`
				viewSuccessText = "update "
			} else if (view==='password') {
				const password = formData.password?.trim();
				const confirmPassword = formData.confirm_password?.trim();
				const oldPassword = formData.old_password?.trim();
				if (password &&
					confirmPassword &&
					oldPassword &&
					password === confirmPassword) {
						pageArr = ["password", "old_password"]
				}
				viewSuccessText = "password update "
			} else if (view==='avatar') {
				pageArr = ["avatar_code"]
				endpoint = `user/update`
				viewSuccessText = "avatar update "
			} else if (view === 'edit-school') {
				console.log('editing school...')
				cleanedData = structuredClone(schoolFormData);
				pageArr = schoolFormHead
				endpoint = `school/update`
				lStorage.removeItem("school_logo")
				viewSuccessText = "school update "
			} else {
				console.warn('no view selected')
				return
			}
			const filterArr = pageArr.map((item, idx) => {
				return item.name||item
			})
			cleanedData = cleanFormForSubmit(filterArr, cleanedData)

			// bypassed function that removes empty fields
			if (view==='delete-image') {
				pageArr = ["image_url", "fileId"]
				pageArr.forEach(field => {
					cleanedData[field] = null
				})
				endpoint = `user/update`
				viewSuccessText = "image delete "
			}
			if (view==='delete-school-logo') {
				console.warn('deleting school logo')
				pageArr = ["school_logo_url", "school_logo_fileId"]
				pageArr.forEach(field => {
					cleanedData[field] = null
				})
				endpoint = `school/update`
				viewSuccessText = "logo delete "
			}
			console.log({
				formData,
				cleanedData,
				uploadedProfileImg,
				uploadedSchoolImg,
				selectedAvatar,
			})

			if (selectedAvatar) {
				cleanedData.avatar_code = selectedAvatar
			}

			let uploadedProfileDetails
			if (((uploadedProfileImg&&view==='edit')||(uploadedSchoolImg&&view==='edit-school'))) {
				if (view==='edit') {
					uploadedProfileDetails = await uploadToCloud({
						selectedFile: uploadedProfileImg?.compressedFile,
						fileName: 'user-profile',
						folder: 'profile',
					})
					cleanedData.image_url = uploadedProfileDetails.url
					cleanedData.fileId = uploadedProfileDetails.fileId
				} else if (view==='edit-school') {
					uploadedProfileDetails = await uploadToCloud({
						selectedFile: uploadedSchoolImg?.compressedFile,
						fileName: 'school-logo',
						folder: 'logo',
					})
					cleanedData.school_logo_url = uploadedProfileDetails.url
					cleanedData.school_logo_fileId = uploadedProfileDetails.fileId
				}
				// cleanedData.image_url = uploadedProfileDetails.url
				// cleanedData.fileId = uploadedProfileDetails.fileId
			}

			if (uploadedProfileDetails==='reload') {
				console.error('need to reload!')
				setLoading(false)
				return
			}
		}
		console.log({cleanedData})
		// setLoading(false); return
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success(sentenceCase(`${viewSuccessText}success`))
			if ((view==='edit'||
				view==='delete-image'||
				view==='edit-school'||
				view==='delete-school-logo'||
				view==='avatar')&&res?.data?.id) {
				lStorage.setItem('user', res.data)
				refreshLogo()
			}
			setFormData(formValues)
			setSchoolFormData(schoolFormValues)
			if (view!=="theme_mode") {
				setActiveView('profile')
			}
			// if (view==='edit-school') {
			// 	setUpdateSch(true)
			// }
		}
		setIsUpdating(false);
		setLoading(false)
	};

	useEffect(() => {
		if (!copied) return
		const copyDelay = setTimeout(() => {
			setCopied(false)
		}, copyDelayDuration);
		return ()=>clearTimeout(copyDelay)
	}, [copied])

	const handleThemeSet = (value) => {
		console.log({value})
		if (value===null||value===undefined) return ''
		setBgTheme(value)
		const updatedUserData = {...userData, theme_mode: value}
		lStorage.setItem('user', updatedUserData)
		submitHandler(null, 'theme_mode', value)
		setUser(updatedUserData)
	}

	const profilePageArgs = {
		activeView, image_url, first_name, last_name, username,
		acronym, schoolName, role, about, id, avatar_code, isMobileDev900,
		is_super_admin, theGenCode, setCopied, copied, profileArr,
	}

	const pickAvatarArgs = {
		activeView, setSelectedAvatar, selectedAvatar,
		submitHandler,loading,
	}

	const editProfilePageArgs = {
		submitHandler, activeView, formData, handleChange,
		image_url, loading, setUploadedProfileImg, isMobileDev900,
		isUpdating, setIsUpdating,
	}

	const editSchoolPageArgs = {
		submitHandler, activeView, schoolFormData, handleSchoolChange,
		school_logo_url, loading, setUploadedSchoolImg, isMobileDev900,
		isUpdating, setIsUpdating,
	}

	const changePasswordPageArgs = {
		submitHandler, activeView, formData, handleChange, showPassword,
		showOldPassword, showConfirmPassword, passwordCheckError,
		setShowPassword, setShowOldPassword, setShowConfirmPassword,
		oldPasswordCheckError, loading,
	}
	console.log({
		// formData,
		// selectedAvatar,
		activeView,
		schoolFormData,
		uploadedSchoolImg,
		// passwordCheckError,
		// uploadedProfileImg,
		// isEditing,
		bgTheme
	})
	return (
		<>
			{/* spinner */}
			{loadingPage && <SpinnerBarForPage />}

			<section className={`profile-page ${loadingPage?'d-none':''}`}>
				<div className={`glass
									${activeView==='edit'?'profile-form flex-column':
									(activeView==='edit-school')?'edit-school-header-info p-40px':
									'profile-info'}`}>

					{/* page header */}
					<div className="d-flex justify-content-between mobile-profile">
						<h2 className="mb-0 pl-0 pb-05">
							{activeView==='edit-school'?'Edit School':
							activeView==='edit'?'Edit Profile':
							activeView==='password'?'Change Password':
							activeView==='avatar'?'Pick Avatar':
							'Profile'}
						</h2>
						<div>
							<div className="d-flex align-items-center mobile-profile-btns">
								{selectedAvatar?<div className="avatar-beside-btn mr-05">{selectedAvatar}</div>:null}
								{(activeView!=='profile') ?
									(<>
										{/* password change button */}
										<button
										className={`cta-button first change-password ${(activeView==='avatar'||activeView==='edit-school'||activeView==='password')?'d-none':''}`}
										type="button"
										onClick={(e)=>setActiveView(prev=>{
											console.log({prev})
											if (prev==='password') return 'edit'
											else if (prev==='edit'||prev==='edit-school') return 'password'
										})}>
											{activeView==='password'?'Done':'Change Password'}
										</button>

										{/* avatar button */}
										<button
										className={`cta-button middle profile ${(activeView==='password'||activeView==='edit-school'||activeView==='avatar')?'d-none':''}`}
										type="button"
										onClick={(e)=>setActiveView(prev=>{
											console.log({prev})
											if (prev==='avatar') return 'edit'
											else if (prev==='edit') return 'avatar'
										})}>
											{activeView==='avatar'?'Done':'Avatar'}
										</button>
									</>
									):null}

								{/* get school code button */}
								<button
								className={`cta-button profile
											white-space-pre
											${(activeView==='profile'&&is_super_admin)?'':'d-none'}
											${contributor?'first':'mr-05'}`}
								type="button"
								onClick={(e)=>setIsGenSchCode(true)}>
									{isGenSchCode?
									<Spinner type={'dot'} />: // dot spinner
									`${isMobileDev900?'':'Gen '}sch code`}
								</button>

								{/* contribute button desktop */}
								<button
								className={`cta-button profile ${(activeView==='profile'&&contributor&&!isMobileDev900)?'middle':'d-none'}`}
								type="button"
								onClick={(e)=>navigate(`contribute-questions`)}>
									{`Contribute${isMobileDev900?'':' Questions'}`}
								</button>

								{/* edit school button */}
								<button
								className={`cta-button profile ${(role==='head')?(!contributor?'first':'middle'):'text-nowrap'}
											${(activeView==='edit'||activeView==='edit-school'||activeView==='password'||activeView==='avatar')?'d-none':''}`}
								type="button"
								onClick={(e)=>setActiveView(prev=>{
									console.log({prev})
									if (prev==='profile') {
										setUpdateSch(true)
										return 'edit-school';
									}
									else if (prev==='edit-school') return 'profile'
									// else if (prev==='avatar') return 'edit-school'
									// else if (prev==='password') return 'edit-school'
								})}>
								{(activeView==='edit'||activeView==='edit-school'||activeView==='avatar'||activeView==='password')?'':`Edit ${isMobileDev900?'Sch':'School'}`}
								</button>

								{/* edit and back button */}
								<button
								className={`cta-button profile ${(contributor&&(activeView!=='avatar'&&activeView!=='password'&&activeView!=='edit-school'))?'last':`text-nowrap`}
											${(!contributor&&activeView==='edit')?'last':(!contributor&&activeView==='profile')?'last':''}`}
								type="button"
								onClick={(e)=>setActiveView(prev=>{
									console.log({prev})
									if (prev==='profile') return 'edit';
									else if (prev==='edit') return 'profile'
									else if (prev==='avatar') return 'edit'
									else if (prev==='password') return 'edit'
									else if (prev==='edit-school') return 'profile'
								})}>
								{(activeView==='edit'||activeView==='edit-school'||activeView==='avatar'||activeView==='password')?'◀ Back':`Edit${isMobileDev900?'':' Profile'}`}
								</button>
							</div>
							{activeView==='edit'?
							<div className="d-flex justify-self-end align-items-center">
								<h4 className="font-14p5 white-space-pre mt-3pcent">Theme: </h4>
								<ItemsToggler
								togglerArray={themeTogglerArray}
								toggleStyle={'d-flex pt-05'}
								isMobileDev768={isMobileDev900}
								btnItem={bgTheme} stateSetter={handleThemeSet} />
							</div>:null}
						</div>
						{/* contribute button mobile */}
						{(isMobileDev900) ?
						<div className="pt-05">
							<button
							className={`cta-button profile fit ${(activeView==='profile'&&contributor)?'':'d-none'}`}
							type="button"
							onClick={(e)=>navigate(`contribute-questions`)}>
								{`Contribute${isMobileDev900?'':' Questions'}`}
							</button>
						</div>:null}
					</div>


					{/* pick avatar */}
					<PickAvatarPage {...pickAvatarArgs} />

					{/* profile page */}
					<ProfilePage {...profilePageArgs} />

					{/* edit profile */}
					<EditProfilePage {...editProfilePageArgs} />

					{/* edit school */}
					<EditSchoolPage {...editSchoolPageArgs} />

					{/* change password */}
					<ChangePasswordPage {...changePasswordPageArgs} />
				</div>
			</section>
		</>
	)
}

function ProfilePage({activeView, image_url, first_name, last_name, username, acronym, schoolName, role, about, id,
						avatar_code, isMobileDev900, is_super_admin, theGenCode, setCopied, copied,
						profileArr}) {
	return (
		<div className={`ProfilePage ${activeView==='profile'?'':'d-none'}`}>
			<div className="d-flex flex-column">
				{image_url ?
					<img
					className="profile-avatar"
					src={image_url}
					alt={first_name} />
					:
					<div className="profile-avatar">{avatar_code?avatar_code:
						<FontAwesomeIcon icon="user" color="white" />}</div>
				}
				<div className="d-flex m-auto-td gap-1">
					<h3 className="text-center profile-h3">{titleCase(normalizeStringLength(first_name||notAvailable, isMobileDev900))}</h3>
					<h3 className="text-center profile-h3">{titleCase(normalizeStringLength(last_name, isMobileDev900, null, null, "last_name"))}</h3>
					{username ? <h3 className="text-center profile-h3">({normalizeStringLength(username, isMobileDev900, null, null, "username")})</h3>:null}
				</div>
				{(schoolName)?
				<div className="d-flex align-items-baseline justify-content-center">
					<p className="role text-center text-italic m-0 white-space-pre">{titleCase(normalizeStringLength(schoolName||notAvailable, isMobileDev900, 23))} </p>
					<p className="role text-center text-italic m-0">({acronym||notAvailable})</p>
					{/* <p className="role white-space-pre font-small"> ID:{id}</p> */}
				</div>:null}
				<div className="d-flex align-items-baseline justify-content-center font-bold text-underline">
					<p className="role text-center">{titleCase(role)||notAvailable}</p>
					<p className="role white-space-pre font-small"> ID:{id}</p>
				</div>
				<p className="bio text-center">{sentenceCase(normalizeStringLength(about||notAvailable, isMobileDev900, 100, 100))}</p>
			</div>

			{(is_super_admin&&theGenCode) ?
			<div className="profile-item">
				<div className="profile-item-text">
					<h4>Generated school code</h4>
					<p
					className="white-space-pre pointer"
					onClick={()=>handleCopy(theGenCode, setCopied)}
					>{theGenCode}
					<span className="pl-05">
						<FontAwesomeIcon
							icon={copied?"check":"copy"}
							// style={{ cursor: "pointer" }}
							title="Copy school code"
						/>
					</span>
					</p>
				</div>
			</div>:null}
			{profileArr.map((profileItem, pIdx) => {
				return (
					<div key={pIdx}
					className="profile-item">
						<div className="profile-item-icon">{profileItem.icon}</div>
						<div className="profile-item-text">
							<h4>{profileItem.name}</h4>
							<p>{profileItem.content}</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function PickAvatarPage({activeView, setSelectedAvatar, selectedAvatar, submitHandler,loading}) {
	return (
		<div className={`PickAvatarPage ${activeView==='avatar'?'':'d-none'}`}>
			<div className="d-flex flex-wrap mt-2">
				{randomAvatar.map((avatarOption, aIdx) => {
					return (
						<div key={aIdx}
						onClick={(e)=>setSelectedAvatar(avatarOption)}
						className={`select-avatar ${selectedAvatar===avatarOption?'active':''}`}>
							{avatarOption}
						</div>
					)
				})}
			</div>
			<button
			type="submit"
			onClick={(e)=>submitHandler(e, 'avatar')}
			disabled={loading}
			className="cta-button profile-btn">
				{loading ?
					<Spinner type={'dot'} /> :
					'Update Avatar'}
			</button>
		</div>
	)
}

function EditProfilePage({submitHandler, activeView, formData, handleChange, image_url, loading,
							setUploadedProfileImg, isMobileDev900, isUpdating, setIsUpdating,}) {
	return (
		<form onSubmit={(e)=>submitHandler(e, 'edit')}
		className={`EditProfilePage ${activeView==='edit'?`form-column profile pt-05`:'d-none'}`}>
			{formHead.map((input, inpIdx) => {
				// console.log({form__value: formData[input.name]})
				return (
					<div key={input.name+inpIdx}
					className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}`}>
						{input.type==='select' ?
						<>
							<select
							value={formData[input.name]}
							onChange={handleChange}
							name={input.name}
							required={input.required}>
								<option value="" disabled hidden>-- {input.placeholder} --</option>
								{input.options.map((sItem, sIdx) => (
									<option key={sIdx} value={sItem}
									className="options">
										{titleCase(sItem)}
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
								if (e.key === ' ' && input.name!=='about') {
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
							<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
						</>}
					</div>
				)
			})}
			{activeView==='edit' ?
			<div className="profile-img">

				{/* upload/change images */}
				<ImageCropAndCompress
				initPreview={image_url}
				onComplete={setUploadedProfileImg}
				// imageId={qIdx}
				imgType="profile" />

				<button
				onClick={(e)=>{
					setIsUpdating(true);
					submitHandler(e, 'delete-image');
				}}
				type="button"
				disabled={loading}
				className={`cta-button question ${isMobileDev900?'':'ml-05'} ${image_url?'':'d-none'}`}>
					{loading ?
						<Spinner type={'dot'} /> :
						'Delete Profile Picture'}
				</button>
			</div>:null}
			<button
			type="submit"
			disabled={loading}
			className="cta-button profile-btn">
				{(loading&&!isUpdating) ?
					<Spinner type={'dot'} /> :
					'Update Profile'}
			</button>
		</form>
	)
}

function EditSchoolPage({submitHandler, activeView, schoolFormData, handleSchoolChange, school_logo_url,
							loading, setUploadedSchoolImg, isMobileDev900, isUpdating, setIsUpdating}) {
	// const loading = false
	return (
		<form onSubmit={(e)=>submitHandler(e, 'edit-school')}
		className={`EditSchoolPage ${activeView==='edit-school'?`form-column profile pt-05`:'d-none'}`}>
			{schoolFormHead.map((input, inpIdx) => {
			// console.log({form__value: formData[input.name]})
				return (
					<div key={input.name+inpIdx}
					className={`form-group floating-field mb-0`}>
						{input.type==='select' ?
						<>
							<select
							value={schoolFormData[input.name]}
							onChange={handleSchoolChange}
							name={input.name}
							required={input.required}>
								<option value="" disabled hidden>-- {input.placeholder} --</option>
								{input.options.map((sItem, sIdx) => (
									<option key={sIdx} value={sItem}
									className="options">
										{titleCase(sItem)}
									</option>
								))}
							</select>
							<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
						</>
						:
						<>
							<input
							className="text-center"
							value={schoolFormData[input.name]}
							onChange={handleSchoolChange}
							// onKeyDown={(e) => {
							// 	if (e.key === ' ' && input.name!=='about') {
							// 		e.preventDefault();
							// 	}
							// }}
							type={input.type}
							id={input.name}
							name={input.name}
							placeholder=" "
							required={input.required}
							disabled={input.disabled}
							/>
							<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
						</>}
					</div>
				)
			})}
			{activeView==='edit-school' ?
			<div className="profile-img">

				{/* upload/change images */}
				<ImageCropAndCompress
				initPreview={school_logo_url}
				onComplete={setUploadedSchoolImg}
				// imageId={qIdx}
				imgType="sch-logo" />

				<button
				onClick={(e)=>{
					setIsUpdating(true);
					submitHandler(e, 'delete-school-logo');
				}}
				type="button"
				disabled={loading}
				className={`cta-button question ${isMobileDev900?'':'ml-05'} ${school_logo_url?'':'d-none'}`}>
				{loading ?
					<Spinner type={'dot'} /> :
					'Delete School Logo'}
				</button>
			</div>:null}
			<button
			type="submit"
			disabled={loading}
			className="cta-button profile-btn">
			{(loading&&!isUpdating) ?
				<Spinner type={'dot'} /> :
				'Update School Details'}
			</button>
		</form>
	)
}

function ChangePasswordPage({submitHandler, activeView, formData, handleChange, showPassword,
								showOldPassword, showConfirmPassword, passwordCheckError,
								setShowPassword, setShowOldPassword, setShowConfirmPassword,
								oldPasswordCheckError, loading}) {
	return (
		<form onSubmit={(e)=>submitHandler(e, 'password')}
		className={`ChangePasswordPage ${activeView==='password'?`form-column profile pt-05`:'d-none'}`}>
			{formPassword.map((input, inpIdx) => {
				// console.log({
				// 	field: input.name,
				// 	value: formData[input.name]
				// })
				return (
					<div key={input.name+inpIdx}
					className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}`}>
						{input.type==='select' ?
						<>
							<select
							// style={{width: input.width}}
							// className="text-center"
							value={formData[input.name]}
							onChange={handleChange}
							name={input.name}
							required={input.required}>
								<option value="" disabled hidden>-- {input.placeholder} --</option>
								{input.options.map((sItem, sIdx) => (
									<option key={sIdx} value={titleCase(sItem)}
									className="options">
										{titleCase(sItem)}
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
							type={
								(input.name==='password'&&showPassword)?'text':
								(input.name==='old_password'&&showOldPassword)?'text':
								(input.name==='confirm_password'&&showConfirmPassword)?'text':
								input.type}
							id={input.name}
							name={input.name}
							placeholder=" "
							required={input.required}
							disabled={input.disabled}
							/>
							<label style={{
								...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
							}}>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
						</>}
						{/* eye toggler */}
						{(input.name==='password') &&
							<EyeToggler
							ErrStyle={{
								...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
							}}
							show={showPassword}
							passwordToggler={setShowPassword} />}
						{(input.name==='old_password') &&
							<EyeToggler
							ErrStyle={{
								...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
							}}
							show={showOldPassword}
							passwordToggler={setShowOldPassword} />}
						{(input.name==='confirm_password') &&
							<EyeToggler
							ErrStyle={{
								...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
							}}
							show={showConfirmPassword}
							passwordToggler={setShowConfirmPassword} />}
						{/* password match error texts */}
						{input.password==='password'?<small
						className="password-error">{passwordCheckError}</small>:null}
						{input.password==='old_password'?<small
						className="password-error">{oldPasswordCheckError}</small>:null}
					</div>
				)
			})}
			<button
			type="submit"
			disabled={loading}
			className="cta-button profile-btn">
				{loading ?
					<Spinner type={'dot'} /> :
					'Update Pasword'}
			</button>
		</form>
	)
}

function EyeToggler({show, passwordToggler, ErrStyle}) {
	return (
		<span
		style={ErrStyle}
		role="button"
		onClick={() => passwordToggler(prev => !prev)}
		className="eye"
		tabIndex={0}
		onKeyDown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				passwordToggler(prev => !prev);
			}
		}}
		>
		<FontAwesomeIcon
			icon={show ? "eye-slash" : "eye"}
		/>
		</span>
	)
}

function usePasswordCheck () {
	// const [checkResponse, setCheckResponse] = useState(null)
	// const checkResponseRef = useRef(null)
	const passwordCheck = (password1, password2=null, formData=null, old_password=false) => {
		// console.log({
		// 	password1,
		// 	password2,
		// })
		if (old_password) {
			// console.log('checking for old password')
			if (password1.length < 8) {
				return 'Password must be at least 8 characters long'
			} else if (!/[A-Z]/.test(password1)) {
				return 'Password must contain at least one uppercase letter'
			} else if (!/[a-z]/.test(password1)) {
				return 'Password must contain at least one lowercase letter'
			} else if (!/[0-9]/.test(password1)) {
				return 'Password must contain at least one number'
			}
			// else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
			// 	return 'Password must contain at least one special character'
			// }
			else if (password1.length > 64) {
				return 'Password must be less than 64 characters long'
			} else if (password1.includes(' ')) {
				return 'Password must not contain spaces'
			} else if (password1.toLowerCase().includes('password')) {
				return 'Password must not contain the word "password"'
			} else if (!password1) {
				return null
			}
		}

		if (!old_password) {
			// console.log('checking password and password confirmation')
			if (password1 !== password2) {
				// console.log('22222')
				return 'Passwords do not match'
			}
			// console.log('11111')
			if (password2) {
				if (password1.length < 8) {
					return 'Password must be at least 8 characters long'
				} else if (!/[A-Z]/.test(password1)) {
					return 'Password must contain at least one uppercase letter'
				} else if (!/[a-z]/.test(password1)) {
					return 'Password must contain at least one lowercase letter'
				} else if (!/[0-9]/.test(password1)) {
					return 'Password must contain at least one number'
				}
				// else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
				// 	return 'Password must contain at least one special character'
				// }
				else if (password1.length > 64) {
					return 'Password must be less than 64 characters long'
				} else if (password1.includes(' ')) {
					return 'Password must not contain spaces'
				} else if (password1.toLowerCase().includes('password')) {
					return 'Password must not contain the word "password"'
				}
				if (formData) {
					if (formData.username && (password1.toLowerCase().includes(formData.username.toLowerCase())||
						formData.username.toLowerCase().includes(password1.toLowerCase()))) {
						return 'Password must not be the same or include username'
					} else if (formData.first_name && (password1.toLowerCase().includes(formData.first_name.toLowerCase())||
						formData.first_name.toLowerCase().includes(password1.toLowerCase()))) {
						return 'Password must not contain your first name'
					} else if (formData.last_name && (password1.toLowerCase().includes(formData.last_name.toLowerCase())||
						formData.last_name.toLowerCase().includes(password1.toLowerCase()))) {
						return 'Password must not contain your last name'
					}
				}
			}
		}

		// console.log('zzzzz')
		return null
	}
	return passwordCheck
}
export { Profile, handleCopy, notAvailable, copyDelayDuration, normalizeStringLength };