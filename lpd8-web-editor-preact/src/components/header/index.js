import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-menu is-active">
			<div class="navbar-start" style="font-weight: bold;">
				<a class="navbar-item" href="/">
					LPD8 Web Editor
				</a>
			</div>
			<div class="navbar-end">
				<a class="navbar-item is-size-7" href="/protocol.txt" native>
					Protocol description
				</a>
			</div>
	  </div>
	</nav>
);

export default Header;
