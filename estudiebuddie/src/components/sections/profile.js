import { useState, useEffect, useRef } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { justNumbers, removeWhiteSpace } from "../../hooks/formHooks";
import { formatPhoneNumber, sentenceCase, titleCase } from "../../hooks/changeCase";
import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { useNavigate } from "react-router-dom"

const roleArray = [
	'student',
	'teacher'
]
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
	{
		name: "role",
		required: false,
		disabled: false,
		type: "select",
		placeholder: "Role",
		width: "11%",
		options: roleArray,
		case: "title",
	},
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
const getRandomAvatar = () => {
	return randomAvatar[Math.floor(Math.random() * randomAvatar.length)];
};
const getGender = (gender, role) => {
	if (!gender) return getRandomAvatar()
	if (role === 'teacher') {
		return gender === 'm' ? '👨‍💼' : '👩‍💼';
	}
	// non-teacher (student / others)
	return getRandomAvatar()
};
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

function Profile() {
	const navigate = useNavigate()
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const [activeView, setActiveView] = useState('profile')
	const [isEditing, setIsEditing] = useState(false)
	const [selectedAvatar, setSelectedAvatar] = useState(null)
	const [isChoosingAvatar, setIsChoosingAvatar] = useState(false)
	const { lStorage, sStorage } = useCreateStorage()
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
		is_superuser,
		role,
		contributor,
		gender,
		mobile_no,
		username,
		id,
		points,
	} = userData
	const formValues = {
		last_name: last_name||"",
		username: username||"",
		mobile_no: mobile_no||"",
		role: role||"",
		old_password: "",
		password: "",
		confirm_password: "",
		about: about||"",
		avatar_code: avatar_code||"",
	}
	if (username) {
		username = `(${username})`
	}
	if (gender) {
		gender = gender.toLowerCase()==='m'?'M':'F'
	}
	const notAvailable = "N/A"
	const [avatar] = useState(() => getGender(gender, role));
	
	const uploadToCloud = useUploadToImagekit()
	const [uploadedProfileImg, setUploadedProfileImg] = useState(null)
	const [oldPasswordCheckError, setOldPPasswordCheckError] = useState(null)
	const [passwordCheckError, setPasswordCheckError] = useState(null)
	const checkPasswords = usePasswordCheck()
	const [formData, setFormData] = useState(formValues);
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
		is_superuser,
		role,
		gender,
		mobile_no,
		username,
		contributor,
		id,
		points,
		userData
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

	const submitHandler = async (e, view) => {
		e.preventDefault(); // prevent default page refresh

		setLoading(true)
		let cleanedData = structuredClone(formData);
		let pageArr = []
		let endpoint = 'test-view'
		if (view==='edit') {
			pageArr = formHead
			endpoint = `user/update`
		}
		if (view==='password') {
			const password = formData.password?.trim();
			const confirmPassword = formData.confirm_password?.trim();
			const oldPassword = formData.old_password?.trim();
			if (password &&
				confirmPassword &&
				oldPassword &&
				password === confirmPassword) {
					pageArr = ["password", "old_password"]
			}
		}
		if (view==='avatar') {
			pageArr = ["avatar_code"]
			endpoint = `user/update`
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
		}
		console.log({
			formData,
			cleanedData,
			uploadedProfileImg,
			selectedAvatar,
		})

		if (selectedAvatar) {
			cleanedData.avatar_code = selectedAvatar
		}

		let uploadedProfileDetails
		if ((uploadedProfileImg&&view==='edit')) {
			uploadedProfileDetails = await uploadToCloud({
				selectedFile: uploadedProfileImg?.compressedFile,
				fileName: 'test-profile',
				folder: 'profile',
			})
			cleanedData.image_url = uploadedProfileDetails.url
			cleanedData.fileId = uploadedProfileDetails.fileId
		}

		if (uploadedProfileDetails==='reload') {
			console.error('need to reload!')
			setLoading(false)
			return
		}
		// console.log({uploadedProfileDetails})

		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success('Success')
			if ((view==='edit'||
				view==='avatar'||
				view==='delete-image')&&res?.data?.id) {
				lStorage.setItem('user', res.data)
			}
			setFormData(formValues)
			setActiveView('profile')
		}
		setLoading(false)
	};

	console.log({
		formData,
		selectedAvatar,
		activeView,
		// passwordCheckError,
		// uploadedProfileImg,
		// isEditing,
	})
	return (
		<>
			{/* spinner */}
			{loadingPage && <SpinnerBarForPage />}

			<section className={`profile-page ${loadingPage?'d-none':''}`}>
				<div className={`glass ${activeView==='edit'?'profile-form flex-column':'profile-info'}`}>

					{/* page header */}
					<div className="d-flex justify-content-between">
						<h2 className="mb-0">
							{activeView==='edit'?'Edit Profile':
							activeView==='password'?'Change Password':
							activeView==='avatar'?'Pick Avatar':
							'Profile'}
						</h2>
						<div className="d-flex align-items-center">
							{selectedAvatar?<div className="avatar-beside-btn mr-05">{selectedAvatar}</div>:null}
							{(activeView!=='profile') ?
								(<>
									{/* password change button */}
									<button
									className={`cta-button change-password mr-05 ${(activeView==='avatar'||activeView==='password')?'d-none':''}`}
									type="button"
									onClick={(e)=>setActiveView(prev=>{
										console.log({prev})
										if (prev==='password') return 'edit'
										else if (prev==='edit') return 'password'
									})}>
										{activeView==='password'?'Done':'Change Password'}
									</button>

									{/* avatar button */}
									<button
									className={`cta-button profile mr-05 ${(activeView==='password'||activeView==='avatar')?'d-none':''}`}
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

							{/* contribute button */}
							<button
							className={`cta-button profile mr-05 ${(activeView==='profile'&&contributor)?'':'d-none'}`}
							type="button"
							onClick={(e)=>navigate(`${id}/contribute-questions`)}>
								{'Contribute Questions'}
							</button>

							{/* edit and back button */}
							<button
							className="cta-button profile"
							type="button"
							onClick={(e)=>setActiveView(prev=>{
								console.log({prev})
								if (prev==='profile') return 'edit';
								else if (prev==='edit') return 'profile'
								else if (prev==='avatar') return 'edit'
								else if (prev==='password') return 'edit'
							})}>
								{(activeView==='edit'||activeView==='avatar'||activeView==='password')?'◀ Back':'Edit Profile'}
							</button>
						</div>
					</div>


					{/* pick avatar */}
					<div className={activeView==='avatar'?'':'d-none'}>
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
						className="cta-button profile-btn">
							{loading ?
								<Spinner type={'dot'} /> :
								'Update Avatar'}
						</button>
					</div>

					{/* profile page */}
					<div className={activeView==='profile'?'':'d-none'}>
						<div className="d-flex flex-column">
							{image_url ?
								<img
								className="profile-avatar"
								src={image_url}
								alt={first_name} />
								:
								<div className="profile-avatar">{avatar_code?avatar_code:avatar}</div>
							}
							<div className="d-flex m-auto-td gap-1">
								<h3 className="text-center">{titleCase(first_name)||notAvailable}</h3>
								<h3 className="text-center">{titleCase(last_name)}</h3>
								<h3 className="text-center">{username}</h3>
							</div>
							<div className="d-flex align-items-baseline justify-content-center">
								<p className="role text-center">{titleCase(role)||notAvailable}</p>
								<p className="role white-space-pre font-small"> ID:{id}</p>
							</div>
							<p className="bio text-center">{sentenceCase(about)||notAvailable}</p>
						</div>

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

					{/* edit profile */}
					<form onSubmit={(e)=>submitHandler(e, 'edit')}
					className={activeView==='edit'?`form-column profile pt-05`:'d-none'}>
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
						<div className="profile-img">

							{/* upload/change images */}
							<ImageCropAndCompress
							initPreview={image_url}
							onComplete={setUploadedProfileImg}
							// imageId={qIdx}
							imgType="profile" />

							<button
							onClick={(e)=>submitHandler(e, 'delete-image')}
							type="button"
							className={`cta-button question ml-05 ${image_url?'':'d-none'}`}>
								{loading ?
									<Spinner type={'dot'} /> :
									'Delete Profile Picture'}
							</button>
						</div>
						<button
						type="submit"
						className="cta-button profile-btn">
							{loading ?
								<Spinner type={'dot'} /> :
								'Update Profile'}
						</button>
					</form>

					{/* change password */}
					<form onSubmit={(e)=>submitHandler(e, 'password')}
					className={activeView==='password'?`form-column profile pt-05`:'d-none'}>
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
						className="cta-button profile-btn">
							{loading ?
								<Spinner type={'dot'} /> :
								'Update Pasword'}
						</button>
					</form>
				</div>
			</section>
		</>
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
		// 	formData,
		// 	old_password,
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
export { Profile };