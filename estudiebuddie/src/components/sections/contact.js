

function Contact() {
	return (
		// <div id="contact" className="page">
		// 	<div className="container">
				<>
					<section className="contact-grid">
						<div className="contact-form glass">
							<h2>Get In Touch</h2>
							<form>
								<div className="form-group">
									<label htmlFor="name">Full Name</label>
									<input type="text" id="name" name="name" placeholder="Enter your full name" required />
								</div>
								<div className="form-group">
									<label htmlFor="email">Email Address</label>
									<input type="email" id="email" name="email" placeholder="Enter your email" required />
								</div>
								<div className="form-group">
									<label htmlFor="subject">Subject</label>
									<input type="text" id="subject" name="subject" placeholder="What's this about?" />
								</div>
								<div className="form-group">
									<label htmlFor="message">Message</label>
									<textarea id="message" name="message" placeholder="Tell us about your project..." required></textarea>
								</div>
								<button type="submit" className="cta-button">Send Message</button>
							</form>
						</div>

						<div className="contact-info glass">
							<h2>Contact Information</h2>
							
							<div className="contact-item">
								<div className="contact-item-icon">📧</div>
								<div className="contact-item-text">
									<h4>Email</h4>
									<p>hello@glossytouch.com</p>
								</div>
							</div>

							<div className="contact-item">
								<div className="contact-item-icon">📞</div>
								<div className="contact-item-text">
									<h4>Phone</h4>
									<p>+1 (555) 123-4567</p>
								</div>
							</div>

							<div className="contact-item">
								<div className="contact-item-icon">📍</div>
								<div className="contact-item-text">
									<h4>Address</h4>
									<p>123 Design Street<br />Creative District, CD 12345</p>
								</div>
							</div>

							<div className="contact-item">
								<div className="contact-item-icon">🕒</div>
								<div className="contact-item-text">
									<h4>Business Hours</h4>
									<p>Mon-Fri: 9AM-6PM<br />Sat-Sun: 10AM-4PM</p>
								</div>
							</div>
						</div>
					</section>

					<section className="contact-map-section">
						<div className="contact-map glass">
							<h2>Find Us</h2>
							<div className="map-container">
								<div className="map-placeholder">
									<div className="map-placeholder-icon">🗺️</div>
									<p><strong>Interactive Map Area</strong></p>
									<p>123 Design Street</p>
									<p>Creative District, CD 12345</p>
									<p style={{
										marginTop: "15px",
										fontSize: "12px",
										opacity: "0.7",
										}}>
										Map integration can be added with<br />
										Google Maps, OpenStreetMap, or Mapbox
									</p>
								</div>
							</div>
						</div>
					</section>
				</>
		// 	</div>
		// </div>
	)
}
export { Contact };