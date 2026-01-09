import { DafetiteFooter } from "../../hooks/dafetiteFooter/dafetiteFooter";

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