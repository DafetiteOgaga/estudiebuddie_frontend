import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import { ProtectedRoute } from './ProtectedRoute';
// import { PublicRoute } from './PublicRoute';
import { Index } from '../components';
import { Home } from '../components/home';
// import { Blog } from '../components/old/blog';
// import { Contact } from '../components/old/contact';
// import { Courses } from '../components/old/courses';
// import { Element } from '../components/old/elements';
// import { SingleCourse } from '../components/single-course';
// import { SignUp } from '../components/dynamicPages/signup';
import { About } from '../components/sections/about'
import { Services } from '../components/sections/services';
import { Contact } from '../components/sections/contact';
import { PageNotFound } from '../components/dynamicPages/pageNotFound';
import { ScrambleQuestionsComponent } from '../components/sections/scrambleQuestions';
// import { ScrambleQuestions } from '../components/scrambleQuestions/ScrambleQUestions';

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Index />}>
				{/* This makes Home the default route */}
				<Route index element={<Home />} />

				{/* Protected routes (auth + match check) */}
				{/* <Route element={<ProtectedRoute requireMatch />}> */}
					{/* profile */}
					{/* <Route path="profile/:userID" element={<Profile />} /> */}
				{/* </Route> */}

				{/* Protected routes (auth only) */}
				{/* <Route element={<ProtectedRoute />}> */}
					{/* <Route path="profile" element={<Profile />} /> */}
				{/* </Route> */}

				{/* Public routes (login and sign up) */}
				{/* <Route element={<PublicRoute />}> */}
					{/* log in */}
					{/* <Route path="login" element={<LogIn />} /> */}
					{/* sign up */}
					{/* <Route path="signup" element={<SignUp />} /> */}
				{/* </Route> */}

				{/* other Public routes */}
				{/* products */}
				{/* <Route path="products/:productname" element={<Products />} /> */}

				{/* temporary */}
				<Route path="about" element={<About />} />
				<Route path="services" element={<Services />} />
				<Route path="contact" element={<Contact />} />
				<Route path="scramble-questions" element={<ScrambleQuestionsComponent />} />
				{/* <Route path="courses" element={<Courses />} />
				<Route path="news" element={<Blog />} />
				<Route path="contact" element={<Contact />} />
				<Route path="element" element={<Element />} />
				<Route path="single-course" element={<SingleCourse />} />
				<Route path="login" element={<SignUp />} />
				<Route path="scramble-questions" element={<ScrambleQuestions />} /> */}
				{/* page not found and unauthorised */}
				{/* <Route path="unauthorised" element={<Unauthorised />} /> */}
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
}

export {AppRoutes};
