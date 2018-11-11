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
		// console.log("Leaving: " + response.direction + " " + response.index)

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

function chartLine(data, attX, attY, title, idDiv){
    let parseDate = d3.timeParse("%Y");
    console.log(parseDate("2016"));
    var div = $(idDiv);

    data.forEach(function(d) {
        //d[attX] = parseFloat(d[attX]);
        d[attX] = parseDate(d[attX]);
        d[attY] = parseFloat(d[attY]);
    });

    var margin = {top: 150, right: 100, bottom: 150, left: 100}, 
    	width = $(idDiv).width() - margin.left - margin.right, 
    	height = $(idDiv).height() - margin.top - margin.bottom;

    /*var xScale = d3.scaleLinear()
    				.domain([d3.min(data, function(d){ return d[attX];}), d3.max(data, function(d){ return d[attX];})]) 
    				.range([0, width]); // output
    
    */
    var xScale = d3.scaleTime()
    				.domain(d3.extent(data, function(d){return d[attX];}))
    				.range([0, width]);
    

	var yScale = d3.scaleLinear()
	    .domain([d3.min(data, function(d){return d[attY];}), d3.max(data, function(d){ return d[attY];})])  
	    .range([height, 0]); 

	var xAxis = d3.axisBottom()
					.scale(xScale)
					.ticks(12);

	var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(12);

	// gridlines in x axis function
	function make_x_gridlines() {		
	    return d3.axisBottom(xScale)
	        .ticks(5)
	}

	// gridlines in y axis function
	function make_y_gridlines() {		
	    return d3.axisLeft(yScale)
	        .ticks(5)
	}

	var line = d3.line()
			    .x(function(d) { return xScale(d[attX]); }) // set the x values for the line generator
			    .y(function(d) { return yScale(d[attY]); }); // set the y values for the line generator 


	// 1. Add the SVG to the page and employ #2
	var svg = d3.select(idDiv).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 2. Call the x axis in a group tag
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	// 3. Call the y axis in a group tag
	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

	// add the X gridlines
	svg.append("g")			
	      .attr("class", "grid")
	      .attr("transform", "translate(0," + height + ")")
	      .call(make_x_gridlines()
	          .tickSize(-height)
	          .tickFormat(""))

	// add the Y gridlines
	svg.append("g")			
	      .attr("class", "grid")
	      .call(make_y_gridlines()
	          .tickSize(-width)
	          .tickFormat(""))
 
	svg.append("path") 
	    .attr("class", "line") // Assign a class for styling 
	    .attr("d", line(data));  
	
	// 12. Appends a circle for each datapoint 
	svg.selectAll(".dot")
	    .data(data)
	  .enter().append("circle") // Uses the enter().append() method
	    .attr("class", "dot") // Assign a class for styling
	    .attr("cx", function(d) { return xScale(d[attX]) })
	    .attr("cy", function(d) { return yScale(d[attY]) })
	    .attr("r", 5);

	// Título do Gráfico
	svg.append("text")
		.attr("transform", "translate(" + (width/2) + ","+ (0 - 30) +")")
		.style("text-anchor", "middle")
		.attr("font-family", "Segoe UI")
		.attr("font-weight", "bold")
		.attr("font-size", "30px")
		.text(title);
 }

function scatter(dataset, x, y, labels, title, panel) {
	// Variáveis Importantes
	let margin = {top: 150, right: 100, bottom: 150, left: 100};
	let w = $(panel).width() - margin.left - margin.right;
	let h = $(panel).height() - margin.top - margin.bottom;

	// Declara as funções de escala linear
    let xScale = d3.scaleLinear()
    			   .domain([d3.min(dataset, function(d){ return +d[x] } ), d3.max(dataset, function(d){ return +d[x] } )])
    			   .range([0, w]);
	
	let yScale = d3.scaleLinear()
    			   .domain([d3.min(dataset, function(d){ return +d[y] } ), d3.max(dataset, function(d){ return +d[y] } )])
    			   .range([h, 0]);

	// Declara os eixos do gráfico
	let xAxis = d3.axisBottom()
				  .scale(xScale);

	let yAxis = d3.axisLeft()
				  .scale(yScale)

	// Cria a região onde o gráfico será desenhado
    let svg = d3.select(panel)
    			.append("svg")
        			.attr("width", w + margin.left + margin.right)
        			.attr("height", h + margin.top + margin.bottom)
        		.append("g")
        			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    // Declara e posiciona os marcadores do gráfico scatterplot
    svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("class", "marker")
		.attr("cx", function(d){
			return xScale(+d[x]);
		})
		.attr("cy", function(d){
			return yScale(+d[y]);
		})
		.attr("r", 5)
		.attr("fill", "#428bcaBB")
		.attr("stroke", "black");


	// Adiciona as labels a cada marcador no gráfico
    svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("class", "label")
		.attr("x", function(d){
			return xScale(+d[x])+3;
		})
		.attr("y", function(d){
			return yScale(+d[y])-3;
		})
		.attr("font-family", "roboto")
		.attr("font-size", "12px")
		.attr("fill", "black")
		.text(function(d) {
			return d[labels];
		});
	console.log("a")

	// Adiciona a animação das labels para o Hover nos marcadores
	d3.selectAll(".label")
		.each(function (d, i) { 
			d3.select(this).attr("id", "label_"+i)
			$(this).hide()
		})

	d3.selectAll(".marker")
		.each(function (d, i) { 
			d3.select(this).attr("id", "marker_"+i)
				
				$(this).mouseover(function() {
			    $("#label_" + $(this).attr("id").split("_")[1]).stop().fadeIn();
			});
			$(this).mouseleave(function() {
			    $("#label_" + $(this).attr("id").split("_")[1]).stop().fadeOut();
			});
		})         	
	
	// Adiciona os eixos à região do gráfico
    svg.append("g")
            .attr("transform", "translate(0,"+ h + ")")
            .attr("class", "axis")
            .call(xAxis)	

	svg.append("text")
			.attr("transform", "translate(" + (w/2) + "," + (h+50) + ")")
			.style("text-anchor", "middle")
			.attr("font-family", "roboto")
			.attr("font-size", "14px")
			.text(x);

    svg.append("g")
    		.attr("class", "axis")
    		.call(yAxis)

    svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - 50)
			.attr("x", 0 - (h / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.attr("font-family", "roboto")
			.attr("font-size", "14px")
			.text(y);
			
	// Título do Gráfico
	svg.append("text")
		.attr("transform", "translate(" + (w/2) + ","+ (0 - 30) +")")
		.style("text-anchor", "middle")
		.attr("font-family", "roboto")
		.attr("font-weight", "bold")
		.attr("font-size", "24px")
		.text(title);
}
