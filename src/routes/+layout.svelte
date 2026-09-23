<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/images/Tutwuri_3.png" />
</svelte:head>

<!-- Mobile Portrait Orientation Warning Overlay (Sesuai Kriteria 1) -->
<div class="portrait-warning-overlay" aria-live="polite">
	<div class="rotate-phone-card">
		<div class="phone-icon-wrapper">
			<svg
				class="phone-svg animate-rotate-phone"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" stroke-width="2" />
				<circle cx="12" cy="18" r="1" fill="currentColor" />
				<path d="M9 5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			<span class="rotation-arrow-badge">🔄</span>
		</div>

		<div class="rotate-badges">
			<span class="rotate-badge">Rasio Standar 16:9</span>
			<span class="rotate-badge-sub">Mode Lanskap</span>
		</div>

		<h2 class="rotate-title">Putar Perangkat Anda</h2>
		<p class="rotate-message">
			Silakan putar perangkat Anda ke <strong>mode Lanskap (Landscape / 16:9)</strong> untuk pengalaman belajar interaktif yang optimal.
		</p>

		<div class="rotate-hint-box">
			<span>💡 Pastikan fitur <strong>Kunci Rotasi Layar (Auto-Rotate)</strong> pada ponsel Anda aktif.</span>
		</div>
	</div>
</div>

<!-- MAIN FULL CONTAINER: Full screen layout adaptif dengan latar bersih seperti web umum -->
<div class="app-full-container">
	<div class="app-content-wrapper">
		{@render children()}
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #ffffff; /* Latar belakang putih bersih seperti web pada umumnya */
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Plus Jakarta Sans', sans-serif;
		color: #0f172a;
		-webkit-tap-highlight-color: transparent;
	}

	/* Utilitas standar target sentuh minimal 45 x 45 px */
	:global(.touch-target) {
		min-height: 45px;
		min-width: 45px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	/* Container utama memenuhi seluruh browser window secara penuh (full screen) */
	.app-full-container {
		width: 100%;
		height: 100%;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		overflow: hidden;
		position: relative;
	}

	/* Wrapper konten utama tetap full screen 100%, adaptif terhadap berbagai rasio layar */
	.app-content-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
	}

	/* Mobile Portrait Warning Overlay */
	.portrait-warning-overlay {
		display: none;
	}

	@media (orientation: portrait) {
		.portrait-warning-overlay {
			display: flex;
			position: fixed;
			inset: 0;
			z-index: 999999;
			background: rgba(2, 6, 23, 0.96);
			backdrop-filter: blur(20px);
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 24px;
			text-align: center;
			color: #ffffff;
			pointer-events: auto;
		}
	}

	.rotate-phone-card {
		max-width: 380px;
		width: 100%;
		background: rgba(15, 23, 42, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 32px 24px;
		border-radius: 28px;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	.phone-icon-wrapper {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 4px;
	}

	.phone-svg {
		width: 58px;
		height: 58px;
		color: #38bdf8;
		filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.5));
	}

	.rotation-arrow-badge {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 1.4rem;
		animation: pulseBadge 1.5s infinite;
	}

	@keyframes pulseBadge {
		0%, 100% { transform: scale(1); opacity: 0.9; }
		50% { transform: scale(1.15); opacity: 1; }
	}

	/* Phone Rotate Animation */
	@keyframes rotatePhoneAnimation {
		0% {
			transform: rotate(0deg) scale(1);
		}
		25% {
			transform: rotate(0deg) scale(1.06);
		}
		55% {
			transform: rotate(90deg) scale(1.06);
		}
		80% {
			transform: rotate(90deg) scale(1);
		}
		100% {
			transform: rotate(0deg) scale(1);
		}
	}

	.animate-rotate-phone {
		animation: rotatePhoneAnimation 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		transform-origin: center center;
	}

	.rotate-badges {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.rotate-badge {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: rgba(56, 189, 248, 0.2);
		color: #38bdf8;
		border: 1px solid rgba(56, 189, 248, 0.4);
		padding: 3px 10px;
		border-radius: 9999px;
	}

	.rotate-badge-sub {
		font-size: 0.72rem;
		font-weight: 700;
		background: rgba(255, 255, 255, 0.1);
		color: #e2e8f0;
		padding: 3px 10px;
		border-radius: 9999px;
	}

	.rotate-title {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		color: #ffffff;
	}

	.rotate-message {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: #cbd5e1;
	}

	.rotate-hint-box {
		margin-top: 6px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		font-size: 0.75rem;
		color: #94a3b8;
		line-height: 1.4;
	}
</style>
