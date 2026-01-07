import { useState, useEffect, useRef } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/authContext";

const getOrdinal = (num) => {
	// if (typeof num !== 'number') return num;
	const val = Number(num);
	if (Number.isNaN(val)) return num;

	const mod100 = val % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return `${val}th`;
	}
	switch (val % 10) {
		case 1:
			return `${val}st`;
		case 2:
			return `${val}nd`;
		case 3:
			return `${val}rd`;
		default:
			return `${val}th`;
	}
};

const rankIcons = [
	// {
	// 	rankValue: 1,
	// 	trophy: "🏆",
	// },
	{
		rankValue: 1,
		trophy: "🥇",
	},
	{
		rankValue: 2,
		trophy: "🥈",
	},
	{
		rankValue: 3,
		trophy: "🥉",
	}
]

function Leaderboard() {
	const { loggedIn } = useAuth()
	console.log({loggedIn})
	const [loadingPage, setLoadingPage] = useState(true);
	const [leaderboardData, setLeaderboardData] = useState(null)
	useEffect(() => {
		// setLoadingPage(true)
		const FetchLeaderboardData = async () => {
			const endpoint = 'test-leaderboard'
			const res = await FetchFromServer(endpoint)
			console.log({res})
			setLeaderboardData(res?.data)
			setLoadingPage(false)
		}
		FetchLeaderboardData()
	}, [])

	console.log({
		leaderboardData,
		loadingPage
	})
	return (
		<>
			{/* spinner */}
			{loadingPage && <SpinnerBarForPage />}

			<section className={`leaderboard-page ${loadingPage?'d-none':''}`}>
				<div className={`glass leaderboard-info`}>
					{/* page header */}
					<div className="d-flex justify-content-between">
						<h3 className="mb-0">
							Leaderboard: Total: {leaderboardData?.data?.total_participants}
						</h3>
						<p className={loggedIn?'d-none':''}>
							Get your score on the board <Link to={"/signup"}
							className="register-link"
							>Register</Link>
						</p>
					</div>
					<div className={''}>
						<div className="d-flex flex-column">
							<table>
								<thead>
									<tr>
										<th className="leadership-th"></th>
										<th className="leadership-th">ID</th>
										<th className="leadership-th">Name</th>
										<th className="leadership-th">Points 🏆</th>
										<th className="leadership-th">Accuracy</th>
										<th className="leadership-th">Score</th>
										<th className="leadership-th">Questions</th>
										<th className="leadership-th">Rank</th>
									</tr>
								</thead>
								<tbody>
									{leaderboardData?.data?.leaderboard?.map((item, idx) => {
										const charLimit = 10
										const rawName = (item?.user?.username||item?.user?.first_name)
										// console.log({rawName, type: typeof(rawName), length: rawName.length})
										const leaderName = rawName.length > charLimit ? rawName.slice(0, charLimit)+'..':rawName
										// console.log({leaderName})
										return (
											<tr key={idx+'x'+item?.user?.id}>
												<td className="leadership-td">{item?.user?.avatar_code}</td>
												<td className="leadership-td">{item?.user?.id}</td>
												<td className="leadership-td">{leaderName}</td>
												<td className="leadership-td">{item?.user?.points}</td>
												<td className="leadership-td">{item?.accuracy}</td>
												<td className="leadership-td">{item?.score}</td>
												<td className="leadership-td">{item?.total_questions}</td>
												<td className="leadership-td">{rankIcons.find(rank=>rank.rankValue===item.rank)?.trophy||getOrdinal(item.rank)}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
export { Leaderboard };