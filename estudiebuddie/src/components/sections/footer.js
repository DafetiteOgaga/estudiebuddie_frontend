import { DafetiteFooter } from "../../hooks/dafetiteFooter/dafetiteFooter";
// import { useLocation } from "react-router-dom";

function Footer() {
	return (
		<div id="footer">
			<div className="container">
				<footer className="glass">
					<div className="footer-content">
						<div className="copyright">
							<DafetiteFooter />
						</div>
					</div>
				</footer>
			</div>
		</div>
	)
}
export { Footer };