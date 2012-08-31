// transition logic
var directions = {
	left: 1,
	right: -1
};

var transitionInProgress = false;

function transition(wrapperEl, currentPageEl, nextPageEl, delta) {
	if (transitionInProgress) {
		return;
	}

	transitionInProgress = true;
	var transitionDistance = window.innerWidth;

	var $current = $(currentPageEl);
	var $wrapper = $(wrapperEl);
	var $next = $(nextPageEl);

	// horizontally align next page with viewport
	$next.css({
		position: 'absolute',
		top: 0,
		left: (delta*transitionDistance)+'px'
	});

	// insert into wrapper for transition
	$wrapper.append($next);

	$wrapper.anim(
		{translate: (-delta * transitionDistance)+'px,0'},

		// the animation will take 0.3 seconds
		0.3,

		// the animation will slow down towards the end
		'ease-out',

		// callback to execute when the animation's done
		function () {
			// remove the page that has been transitioned out
			$current.remove();

			// remove the CSS transition
			$wrapper.attr('style', '');

			// remove the position absoluteness
			$next.css({top: '', left: '', position: ''});

			transitionInProgress = false;
		}
	);
}

// page generation
function makePage(number) {
	return $('<div class="page">Page '+number+'</div>');
}

// overall app logic
var pageNumber = 0;
$(document).ready(function () {
	$(document).on('swipeRight', function () {
		transition($('#wrapper'), $('.page'), makePage(--pageNumber), directions.right);
	});

	$(document).on('swipeLeft', function () {
		transition($('#wrapper'), $('.page'), makePage(++pageNumber), directions.left);
	});
});