function init(selector) {
	// using d3 for convenience
	var container = d3.selectAll(selector);

	var graphic = container.select('.scroll__graphic');
	var text = container.select('.scroll__text');
	var step = text.selectAll('.step');

	// initialize the scrollama
	var scroller = scrollama();

	// initially hide everything
	container.selectAll(".scroll__graphic__img")._groups
		 .forEach(function(d, i) {
		  $(d).hide()
	   })

	step.selectAll("p")._groups
	   .forEach(function(d, i) {
		$(d).hide()
	})

	// scrollama event handlers
	function handleStepEnter(response) {
		// response = { element, direction, index }
		// console.log(response.element)
		// console.log("Entering: " + response.direction + " " + response.index)

		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})

		// # UPDATE GRAPHIC BASED ON STEP #
		var graph = $(".scroll__graphic");
		var textbox = $(".scroll__text");

		// Get the working text panels for the current step
		var actText = $("#step_"+(response.index)+ " > p");
		var prevText = (response.direction == 'down') ? 
						$("#step_"+(Math.max(0,response.index-1))+ " > p") 
						: $("#step_"+(response.index+1)+ " > p");

		// Get the working graphics for the current step
		var actGraph = $("#scroll__graphic__img_"+(response.index));
		var prevGraph = (response.direction == 'down') ? 
						 $("#scroll__graphic__img_"+(Math.max(0,response.index-1))) 
						 : $("#scroll__graphic__img_"+(response.index+1));


		if(actGraph.hasClass("left_panel")) {
			graph.stop().animate({left: "0%"})
			textbox.stop().animate({left: "65%"})
		}
		else if(actGraph.hasClass("right_panel")) {
			graph.stop().animate({left: "35%"})
			textbox.stop().animate({left: "0%"})
		}

		// Fade-out the previous graphic and fade-in the actual one
		$(prevGraph[0]).stop().fadeOut(500, function() {
			$(actGraph[0]).fadeIn(500);
		})

		for (var i = prevText.length - 1; i >= 0; i--) {
			$(prevText[i]).stop().fadeOut(500)
		}
		for (var i = actText.length - 1; i >= 0; i--) {
			$(actText[i]).fadeIn(1500)
		}
	}

	function handleStepExit(response) {
		// response = { element, direction, index }
		console.log("Leaving: " + response.direction + " " + response.index)

		// update graphic based on step
		var prevGraph = (response.direction == 'down') ? 
						 $("#scroll__graphic__img_"+(Math.max(0,response.index-1))) 
						 : $("#scroll__graphic__img_"+(response.index+1));

		prevGraph.stop().fadeOut(100);

	}

	function handleContainerEnter(response) {
		// response = { direction }

		// old school
		// sticky the graphic
		// graphic.classed('is-fixed', true);
		// graphic.classed('is-bottom', false);
	}

	function handleContainerExit(response) {
		// response = { direction }

		// old school
		// un-sticky the graphic, and pin to top/bottom of container
		// graphic.classed('is-fixed', false);
		// graphic.classed('is-bottom', response.direction === 'down');
	}

	(function setupStickyfill() {
		d3.selectAll(".sticky").each(function() {
			  Stickyfill.add(this);
		});
	})();

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.90);
		step.style("height", stepHeight + "px");

		// 2. update width/height of graphic element
		var bodyWidth = d3.select("body").node().offsetWidth;

		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;
		var graphicWidth = container.node().offsetWidth - textWidth;
		var graphicHeight = Math.floor(window.innerHeight);
		var graphicMarginTop = Math.floor(graphicHeight / 2);

		graphic
			.style("width", graphicWidth + "px")
			.style("height", graphicHeight + "px")
			.style("top", 0);

		$("#ajuste").css("height", Math.floor(window.innerHeight/2));
		$("#about_us").css("height", Math.floor(window.innerHeight/3));
		$("#teste").css("height", Math.floor(window.innerHeight/3));
		// $("#intro").css("height", Math.floor(window.innerHeight)/4);
	
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}

	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
		  container: selector,
		  graphic: ".scroll__graphic",
		  text: ".scroll__text",
		  step: ".scroll__text .step",
		  debug: false,
		  offset: 0.5
		})
		.onStepEnter(handleStepEnter)
		.onStepExit(handleStepExit)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener("resize", handleResize);
	handleResize();
}


/////////////////////////////////////////////// Início dos gráficos


