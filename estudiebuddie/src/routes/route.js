import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { Index } from '../components';
import { Home } from '../components/home';
import { About } from '../components/sections/about'
import { Services } from '../components/sections/services';
import { Contact } from '../components/sections/contact';
import { PageNotFound } from '../components/sections/pageNotFound';
import { Unauthorized } from '../components/sections/Unauthorised';
import { ScrambleQuestionsComponent } from '../components/scrambleQuestions/scrambleQuestions';
import { ContributeQuestionsComponent } from '../components/contributeQuestions/contribute';
import { Quiz } from '../components/quiz/quiz';
import { Login } from '../components/authentication/login';
import { SignUp } from '../components/sections/signUp';
import { Leaderboard } from '../components/sections/leaderboard';
import { Profile } from '../components/sections/profile';
import { Dashboard } from '../components/sections/dashboard';

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Index />}>
				{/* This makes Home the default route */}
				<Route index element={<Home />} />

				{/* every other routes are from Outlet in Index */}
				{/* Protected routes (auth + match check) */}
				<Route element={<ProtectedRoute requireMatch />}>
					{/* scramble quetions */}
					<Route path="scramble-questions/:id" element={<ScrambleQuestionsComponent />} />
					<Route path="dashboard/:id/scramble-questions/:scrambleID" element={<ScrambleQuestionsComponent />} />
					{/* profile */}
					<Route path="profile/:id/contribute-questions" element={<ContributeQuestionsComponent />} />
					<Route path="profile/:id" element={<Profile />} />
					<Route path="dashboard/:id" element={<Dashboard />} />
					{/* <Route path="dashboard/:id" element={<Dashboard />} /> */}
				</Route>

				{/* Protected routes (auth only) */}
				<Route element={<ProtectedRoute />}>
					{/* <Route path="profile" element={<Profile />} /> */}
				</Route>

				{/* Public routes (login and sign up) */}
				<Route element={<PublicRoute />}>
					{/* log in */}
					<Route path="login" element={<Login />} />
					{/* sign up */}
					<Route path="signup" element={<SignUp />} />
					{/* quiz */}
					<Route path="quiz" element={<Quiz />} />
					{/* leaderboard */}
					<Route path="leaderboard" element={<Leaderboard />} />
					{/* unauthorised */}
					<Route path="unauthorised" element={<Unauthorized />} />
					{/* page not found */}
					<Route path="*" element={<PageNotFound />} />
				</Route>
			</Route>
		</Routes>
	);
}

export {AppRoutes};
