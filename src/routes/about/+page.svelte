<svelte:head>
	<title>About</title>
	<meta name="description" content="About ApTarot" />
</svelte:head>

<div class="text-column">
	<h1>About ApTarot</h1>

	<p>
		ApTarot is a comprehensive digital tarot reference. 
		This application provides detailed information about all 78 cards in a traditional tarot deck, 
		featuring both Major and Minor Arcana, as well as Court Cards.
	</p>

	<h2>Features</h2>
	<ul>
		<li><strong>Complete Tarot Deck:</strong> Explore all 78 tarot cards with high-quality imagery</li>
		<li><strong>Interactive Carousel:</strong> Browse through cards using an elegant, animated carousel interface</li>
		<li><strong>Detailed Card Information:</strong> Each card includes meanings, original titles, astrological attributions, and esoteric correspondences</li>
		<li><strong>Hermetic Correspondences:</strong> Hebrew letters, Tree of Life paths, elemental associations, and Qabalistic attributions</li>
		<li><strong>Notable Personalities:</strong> Birth date examples for Court Cards showing famous individuals associated with each card's energy</li>
		<li><strong>Responsive Design:</strong> Optimized for both desktop and mobile viewing</li>
	</ul>

	<h2>Card System</h2>
	<p>
		The deck follows traditional Hermetic tarot structure with modern interpretations:
	</p>
	<ul>
		<li><strong>22 Major Arcana:</strong> The Fool through The World/Universe, representing major life themes and spiritual lessons</li>
		<li><strong>40 Minor Arcana:</strong> Four suits (Wands, Cups, Swords, Disks) numbered Ace through 10, representing daily experiences and practical matters</li>
		<li><strong>16 Court Cards:</strong> Princesses/Pages, Princes/Kings, Queens, and Knights for each suit, representing personality types and approaches to life</li>
	</ul>

	<h2>Astrological & Hermetic Correspondences</h2>
	<p>
		Each card includes detailed esoteric information based on Hermetic tradition:
	</p>
	<ul>
		<li>Planetary and zodiacal attributions</li>
		<li>Hebrew letter associations for Major Arcana</li>
		<li>Tree of Life pathworking connections</li>
		<li>Elemental associations and soul correspondences</li>
		<li>Qabalistic world attributions (Atziluth, Briah, Yetzirah, Assiah)</li>
	</ul>

	<h2>Technology</h2>
	<p>
		Built with modern web technologies for a smooth, responsive experience:
	</p>
	<ul>
		<li><strong>SvelteKit:</strong> Fast, reactive framework with server-side rendering</li>
		<li><strong>TypeScript:</strong> Type-safe development for reliability</li>
		<li><strong>Tailwind CSS:</strong> Responsive, utility-first styling</li>
		<li><strong>GSAP:</strong> Smooth animations and transitions</li>
		<li><strong>Vite:</strong> Lightning-fast build tool and development server</li>
	</ul>

	<p class="note">
		This application is designed as a reference tool for tarot study and should not be considered 
		a substitute for professional divination or guidance. The interpretations presented are based 
		on traditional Hermetic and Golden Dawn correspondences.
	</p>
</div>

<style>
	.text-column {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.6;
		color: #e5e7eb;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 2rem;
		color: #f3f4f6;
		text-align: center;
	}

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
		margin: 2rem 0 1rem 0;
		color: #ffc4b2;
		border-bottom: 2px solid #ffc4b2;
		padding-bottom: 0.5rem;
	}

	p {
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	ul {
		margin: 1rem 0 1.5rem 1.5rem;
		padding-left: 1rem;
	}

	li {
		margin-bottom: 0.8rem;
		font-size: 1rem;
	}

	li strong {
		color: #ffc4b2;
		font-weight: 600;
	}

	a {
		color: #60a5fa;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	a:hover {
		color: #93c5fd;
	}

	.note {
		background: rgba(255, 196, 178, 0.1);
		border: 1px solid #ffc4b2;
		border-radius: 8px;
		padding: 1.5rem;
		margin-top: 2rem;
		font-style: italic;
		color: #d1d5db;
	}

	@media (max-width: 768px) {
		.text-column {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		p, li {
			font-size: 1rem;
		}
	}
</style>
