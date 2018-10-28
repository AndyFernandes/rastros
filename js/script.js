// Funções do Scrollama
// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.90);
	step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	var graphicMargin = 16 * 4;
	var textWidth = text.node().offsetWidth;
	var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
	var graphicHeight = Math.floor(window.innerHeight)
	var graphicMarginTop = Math.floor(graphicHeight / 2)

	for (var idx = 0; idx < 5; idx++) {
		$("#scroll__graphic__img_"+idx).hide()
	}

	graphic
		.style('width', graphicWidth + 'px')
		.style('height', graphicHeight + 'px')

	$("#intro").css("height", Math.floor(window.innerHeight/2));

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step
	
	// graphic.select('img').attr("src", "res/dog"+(response.index+1)+".jpg");

	if(response.direction == 'down') {
		$("#scroll__graphic__img_"+(response.index)).stop().fadeOut(1000, function(){
			$("#scroll__graphic__img_"+(response.index+1)).fadeIn(1000);
		});

	} else if(response.direction == 'up') {
		$("#scroll__graphic__img_"+(response.index+2)).stop().fadeOut(1000, function(){
			$("#scroll__graphic__img_"+(response.index+1)).fadeIn(1000);
		});
	}

	console.log(response.element)
}

// scrollama event handlers
function handleStepExit(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step
	
	if(response.direction == 'down') {
		$("#scroll__graphic__img_"+(response.index)).stop().fadeOut(1000)

	} else if(response.direction == 'up') {
		$("#scroll__graphic__img_"+(response.index+2)).stop().fadeOut(1000)
	}

	console.log(response.element)
}

function handleContainerEnter(response) {
	// response = { direction }

	// old school
	// sticky the graphic
	graphic.classed('is-fixed', true);
	graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
	// response = { direction }

	// old school
	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}

function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// this will also initialize trigger observations

	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		container: '#scroll',
		graphic: '.scroll__graphic',
		text: '.scroll__text',
		step: '.scroll__text .step',
		debug: false,
		offset: 0.33,
	})
		.onStepEnter(handleStepEnter)
		.onStepExit(handleStepExit)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener('resize', handleResize);
}
