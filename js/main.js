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

// data retrieval
var flickrData = null;

function jsonFlickrFeed(data) {
	flickrData = data;
}

function fetchPhotos() {
	var script = document.createElement('script');
	script.src="http://api.flickr.com/services/feeds/photos_public.gne?format=json";
	document.getElementsByTagName('head')[0].appendChild(script);
}

// page generation
var spinnerOptions = {
	lines: 13, // The number of lines to draw
	length: 7, // The length of each line
	width: 4, // The line thickness
	radius: 10, // The radius of the inner circle
	corners: 1, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	color: '#000', // #rgb or #rrggbb
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 'auto', // Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};

function makePhotoPage(index) {
	var photo = flickrData.items[index];
	var $page = $(
		'<div class="page">'+
		'  <div class="picture-area">'+
		'    <div class="picture"></div>'+
		'  </div>'+
		'  <div class="title">'+photo.title+'</div>'+
		'</div>'
	);

	// show spinner until image has loaded
	var spinner = new Spinner(spinnerOptions).spin($page.find('.picture').get(0));
	var img = new Image();
	img.onload = function () {
		spinner.stop();
		$('.picture', $page).html('<img src="'+photo.media.m+'">');
	};
	img.src = photo.media.m;

	return $page;
}

// overall app logic
var pictureNumber = 0;
fetchPhotos();

$(document).ready(function () {
	$(document).on('swipeRight', function () {
		if (flickrData) {
			pictureNumber--;
			pictureNumber = (pictureNumber === -1) ? (flickrData.items.length - 1) : pictureNumber;
			transition($('#wrapper'), $('.page'), makePhotoPage(pictureNumber), directions.right);
		}
	});

	$(document).on('swipeLeft', function () {
		if (flickrData) {
			pictureNumber++;
			pictureNumber = (pictureNumber === flickrData.items.length) ? 0 : pictureNumber;
			transition($('#wrapper'), $('.page'), makePhotoPage(pictureNumber), directions.left);
		}
	});
});