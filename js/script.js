// ###########################
//     FUNÇÕES DO SCROLLAMA
// ###########################
function init(selector) {
	// Seletores importantes
	var container = d3.selectAll(selector);
	var graphic = container.select('.scroll__graphic');
	var text = container.select('.scroll__text');
	var step = text.selectAll('.step');

	// Inicializa o Scrollama
	var scroller = scrollama();

	// Inicialmente esconde todas os gráficos no scrollytelling
	container.selectAll(".scroll__graphic__chart")._groups
		 .forEach(function(d, i) {
		  $(d).hide()
	   })

	step.selectAll("p")._groups
	   .forEach(function(d, i) {
		$(d).hide()
	})

	step.selectAll("ul")._groups
		.forEach(function(d, i) {
		$(d).hide()
	})

	// TRATAMENTO DE EVENTOS DO SCROLLAMA
	// Função ativada quando o scroll entra em um step
	function handleStepEnter(response) {
		// response = { element, direction, index }
		// console.log("Entering: " + response.index)

		// Ativa o step que o usuário entrou
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})

		// Armazena a área dos gráficos e a caixa de texto
		var graph = $(".scroll__graphic");
		var textbox = $(".scroll__text");

		// Armazena os textos específicos do step atual e anterior
		var actText = $("#step_"+(response.index)).children();
		var prevText = (response.direction == 'down') ? 
						$("#step_"+(Math.max(0,response.index-1))).children()
						: $("#step_"+(response.index+1)).children();

		// Armazena os gráficos específicos do step atual e anterior
		var actGraph = $("#scroll__graphic__chart_"+(response.index));
		var prevGraph = (response.direction == 'down') ? 
						 $("#scroll__graphic__chart_"+(Math.max(0,response.index-1))) 
						 : $("#scroll__graphic__chart_"+(response.index+1));

		// Posiciona os gráficos e a caixa de texto de acordo com a classe do painel
		if(actGraph.hasClass("left_panel")) {
			graph.stop().animate({left: "0%"})
			textbox.stop().animate({left: "65%"})
		}
		else if(actGraph.hasClass("right_panel")) {
			graph.stop().animate({left: "35%"})
			textbox.stop().animate({left: "0%"})
		}

		// Realiza o fade-out do gráfico anterior e fade-in do gráfico atual
		$(prevGraph[0]).stop().fadeOut(500, function() {
			$(actGraph[0]).fadeIn(500);
		})

		// Realiza o fade-out da caixa de texto anterior e fade-in da caixa de texto atual
		for (var i = actText.length - 1; i >= 0; i--) {
			$(actText[i]).fadeIn(1500)
		}
	}

	// Função ativada quando o scroll sai de um step
	function handleStepExit(response) {
		// response = { element, direction, index }
		// console.log("Exiting: " + response.index)
	
		// Armazena os gráficos específicos do step anterior
		var prevGraph = (response.direction == 'down') ? 
						 $("#scroll__graphic__chart_"+(Math.max(0,response.index-1))) 
						 : $("#scroll__graphic__chart_"+(response.index+1));

		// Armazena os textos específicos do step atual e anterior
		var prevText = (response.direction == 'down') ? 
						$("#step_"+(Math.max(0,response.index-1))).children() 
						: $("#step_"+(response.index+1)).children();

		// Realiza o fade-out do gráfico anterior
		prevGraph.stop().fadeOut(100);

		// Realiza o fade-out da caixa de texto anterior e fade-in da caixa de texto atual
		for (var i = prevText.length - 1; i >= 0; i--) {
			$(prevText[i]).stop().fadeOut(500)
		}
	}

	// Função ativada quando o scroll entra no container
	function handleContainerEnter(response) {
		// response = { direction }

		// old school
		// sticky the graphic
		// graphic.classed('is-fixed', true);
		// graphic.classed('is-bottom', false);
	}

	// Função ativada quando o scroll sai do container
	function handleContainerExit(response) {
		// response = { direction }

		// old school
		// un-sticky the graphic, and pin to top/bottom of container
		// graphic.classed('is-fixed', false);
		// graphic.classed('is-bottom', response.direction === 'down');
	}

	// Função para o posicionamento "sticky" dos containers
	(function setupStickyfill() {
		d3.selectAll(".sticky").each(function() {
			  Stickyfill.add(this);
		});
	})();

	// Função de tratamento para o evento de redimensionamento da janela
	function handleResize() {
		// Atualiza o tamanho das caixas de step
		var stepHeight = Math.floor(window.innerHeight * 0.99);
		step.style("height", stepHeight + "px");

		// Atualiza as informações de largura e altura da área dos gráfico
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

		text.style("margin-top", -graphicHeight+"px")

		// Atualiza as dimensões de outros componentes do site
		$("#ajuste").css("height", Math.floor(window.innerHeight/2));
		$(".section_header").css("height", Math.floor(window.innerHeight));
		$("#about_us").css("height", Math.floor(window.innerHeight/2)-80);
		$("#teste").css("height", Math.floor(window.innerHeight/2)-80);
		 // $("#intro").css("height", Math.floor(window.innerHeight)/4);
	
		// Aciona função do Scrollama para redimensionar os seus elementos
		scroller.resize();
	}

	// Associa as funções de tratamento de evento com os listeners do Scrollama
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

	// Associa a função de redimensionamento com o listener da janela
	window.addEventListener("resize", handleResize);
	handleResize();
}



// ###############################
//     FUNÇÕES DE VISUALIZAÇÃO
// ###############################

// Função CHARTLINE: gera um gráfico de linhas para determinado conjunto de dados.
// @data 		Conjunto de dados de entrada 
// @attX		Nome do atributo a ser projeto no eixo X 
// @attY		Nome do atributo a ser projeto no eixo Y 
// @title 		Título do gráfico a ser exibido
// @idDiv 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options		Contém as informações utilizadas para o layout do gráfico
function chartLine(data, attX, attY, title, idDiv, options){
	let parseDate = d3.timeParse("%Y");
	var div = $(idDiv);

	data.forEach(function(d) {
		d[attX] = parseDate(d[attX]);
		d[attY] = parseFloat(d[attY]);
	});

	var margin = {top: 150, right: 100, bottom: 150, left: 100}, 
		width = options['width'] - margin.left - margin.right, 
		height = options['height'] - margin.top - margin.bottom;

	var xScale = d3.scaleTime()
					.domain(d3.extent(data, function(d){return d[attX];}))
					.range([0, width]);

	var yScale = d3.scaleLinear()
		.domain([d3.min(data, function(d){return d[attY];})-50, d3.max(data, function(d){ return d[attY];})+50])  
		.range([height, 0]); 

	var xAxis = d3.axisBottom()
					.scale(xScale)
					.ticks(12);

	var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(12);

	// Line function
	var line = d3.line()
				.x(function(d) { return xScale(d[attX]); }) 
				.y(function(d) { return yScale(d[attY]); }); 


	var div = d3.select("body").append("div")	
	.attr("class", "stickerr")				
	.style("opacity", 0);

	// Add the SVG to the page and employ #2
	var svg = d3.select(idDiv).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Adiciona linhas de grade no gráfico
	if("grid" in options && options.grid == true) {
		make_grid(svg, xScale, yScale, width, height)
	}

	// Adiciona linhas horizontais ao gráfico
	if("hline" in options) {
		make_hline(svg, width, xScale, yScale, options.hline)

		// Fundo Colorido de Separação das linhas horizontais
		if("hline_bg" in options && options.hline_bg.length == options.hline.length+1) {
			make_hline_background(svg, width, height, yScale, options.hline, options.hline_bg)
		}
	}

	// Call the x axis in a group tag
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("text")
			.attr("transform", "translate(" + (width/2) + "," + (height+50) + ")")
			.style("text-anchor", "middle")
			.attr("font-family", "Roboto")
			.attr("font-size", "14px")
			.text(options["xlabel"]);

	// Call the y axis in a group tag
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - 50)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.attr("font-family", "Roboto")
			.attr("font-size", "14px")
			.text(options["ylabel"]);
	
	svg.append("path") 
		.attr("class", "line") 
		.attr("d", line(data))
		.style("stroke", options['color'])
		.style("fill", "none")
		.style("stroke-width","2px");  
	
	// Appends a circle for each datapoint 
	svg.selectAll(".dot")
		.data(data)
	  .enter().append("circle") // Uses the enter().append() method
		.attr("class", "dot") // Assign a class for styling
		.attr("cx", function(d) { return xScale(d[attX]) })
		.attr("cy", function(d) { return yScale(d[attY]) })
		.attr("r", 5)
		.on("mouseover", function(d) {		
			div.transition()		
				.duration(200)		
				.style("opacity", .9);		
			div	.html("<b>Precipitação: </b>" + Number(d[attY].toPrecision(3)) + "<br><b>Ano: </b>" + d[attX].getFullYear())	
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 28) + "px");	
			})					
		.on("mouseout", function(d) {		
			div.transition()		
				.duration(500)		
				.style("opacity", 0);	
		})
		.style("fill", options['color']);

	// Title
	svg.append("text")
		.attr("transform", "translate(" + (width/2) + ","+ (0 - 30) +")")
		.style("text-anchor", "middle")
		.attr("font-family", "Roboto")
		.attr("font-weight", "bold")
		.attr("font-size", "30px")
		.text(title);


 }

// Função SCATTER: gera um gráfico de pontos (scatterplot) bivariados para determinado conjunto de dados.
// @dataset 	Conjunto de dados de entrada 
// @x 			Nome do atributo a ser projeto no eixo X 
// @y 			Nome do atributo a ser projeto no eixo Y 
// @labels 		Nome do atributo a ser extraído como título de cada ponto 
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function scatter(dataset, x, y, labels, title, panel, options) {
	// Variáveis Importantes
	let margin = {top: 150, right: 100, bottom: 150, left: 100};
	let w = options["width"] - margin.left - margin.right;
	let h = options["height"] - margin.top - margin.bottom;

	dataset.sort((a,b) => parseFloat(a[x]) - parseFloat(b[x]));

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
				  .scale(yScale);

	// Declara a região onde os gráficos serão desenhados
	let svg = d3.select(panel)
				.append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Adiciona linhas de grade no gráfico
	if("grid" in options && options.grid == true) {
		make_grid(svg, xScale, yScale, w, h)
	}

	// Adiciona linhas horizontais ao gráfico
	if("hline" in options) {
		make_hline(svg, w, xScale, yScale, options.hline)

		// Fundo Colorido de Separação das linhas horizontais
		if("hline_bg" in options && options.hline_bg.length == options.hline.length+1) {
			make_hline_background(svg, w, h, yScale, options.hline, options.hline_bg)
		}
	}

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
		.attr("r", options["marker-size"])
		.attr("fill", options["color"])
		.attr("stroke", "black");

	// Adiciona as labels a cada marcador no gráfico
	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("class", "label")
		.attr("x", function(d){
			return xScale(+d[x])+5;
		})
		.attr("y", function(d){
			return yScale(+d[y])-5;
		})
		.attr("font-family", "Roboto")
		.attr("font-size", "14px")
		.attr("fill", "black")
		.text(function(d) {
			return d[labels];
		});

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
			.attr("font-family", "Roboto")
			.attr("font-size", "14px")
			.text(options["xlabel"]);

	svg.append("g")
			.attr("class", "axis")
			.call(yAxis)

	svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - 60)
			.attr("x", 0 - (h / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.attr("font-family", "Roboto")
			.attr("font-size", "14px")
			.text(options["ylabel"]);
			
	// Título do Gráfico
	svg.append("text")
		.attr("transform", "translate(" + (w/2) + ","+ (0 - 30) +")")
		.style("text-anchor", "middle")
		.attr("font-family", "Roboto")
		.attr("font-weight", "bold")
		.attr("font-size", "24px")
		.text(title);


	// Adiciona uma linha de tendência ao Scatterplot
	if("trendline" in options && options.trendline == true) {
		// Ordena as regiões e recebe a série dos atributos
		var xSeries = d3.range(1, dataset.length+1);
		var ySeries = dataset.map(function(d){ return parseFloat(d[y]); });
		
		// Calcula um modelo linear por Least Squares
		var leastSquaresCoeff = leastSquares(xSeries,ySeries);

		// Cria as coordenadas da linha
		var x1 = d3.min(dataset, function(d){return d[x];});
		var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
		var x2 = d3.max(dataset, function(d){ return d[x];});
		var y2 = leastSquaresCoeff[0]*xSeries.length + leastSquaresCoeff[1];
		var trendData = [[x1,y1,x2,y2]];

		// Adiciona a linha de tendência ao gráfico
		var trendline = svg.selectAll(".trendline")
							.data(trendData);

		trendline.enter()
					.append("line")
					.attr("class","trendline")
					.attr("x1", function(d) { return xScale(d[0]);})
					.attr("y1", function(d) { return yScale(d[1]);})
					.attr("x2", function(d) { return xScale(d[2]);})
					.attr("y2", function(d) { return yScale(d[3]);})
					.attr("stroke","black")
					.style("stroke-dasharray", ("3, 3"))
					.attr("stroke-width",2);
	}
}

// Função BAR CHART: gera um gráfico de barras para determinado conjunto de dados.
// @dataset 	Conjunto de dados de entrada 
// @x 			Nome do atributo a ser projeto no eixo X 
// @y 			Nome do atributo a ser projeto no eixo Y 
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function barChart(dataset, x, y, title, panel, options) {
	let parseDate = d3.timeParse("%Y");
	let label = []
	let values = []

	dataset.forEach(function(d) {
		d[x] = +d[x];
		label.push(d[x])

		d[y] = parseFloat(d[y]);
		values.push(d[y])
	});
	
	var margin = {top: 150, right: 100, bottom: 150, left: 100}, 
		w = 800 - margin.left - margin.right, 
		h = 600 - margin.top - margin.bottom;

	var bar_size = (w / dataset.length)

	var xScale = d3.scaleBand()
					.range([0,w])            
					.domain(label)
					.padding(0.2);

	//var yScale = d3.scaleLinear()
	  //  .domain([d3.min(dataset, function(d){return d[y];}), d3.max(dataset, function(d){ return d[y];})])  
		//.range([h, 0]); 
	let yScale = d3.scaleLinear()
					.domain([0, d3.max(values)])
					.range([h,0]);	

	let xAxis = d3.axisBottom()
					.scale(xScale);
	
	let yAxis = d3.axisLeft()
					.scale(yScale).ticks(5);
	
	// 1. Add the SVG to the page and employ #2
	var svg = d3.select(panel).append("svg")
								.attr("width", w + margin.left + margin.right)
								.attr("height", h + margin.top + margin.bottom)
							.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
	// add the Y gridlines
	svg.append('g')
	   .attr('class', 'grid')
	   .call(d3.axisLeft()
	   .scale(yScale)
	   .tickSize(-w, 0, 0)
	   .tickFormat(''))

	barChart = svg.selectAll()
					.data(dataset)
					  .enter()
					  .append("rect")
					  .attr("y",(d) => yScale(d[y]))
					  .attr("height", (d) => h - yScale(d[y]))
						  .attr("width", bar_size -10)
					  .attr("transform", function (d, i) {
								var translate = [ bar_size * i, 0];
								return "translate("+ translate +")";
					  })
					.attr("fill",function (d,i){ return options[i]} )
					  .on('mouseenter', function (a, i) {
						d3.select(this)
							.transition()
							.duration(100)
							.attr('opacity', 0.5)
							.attr('width', xScale.bandwidth()-5)	

						svg.append('line')
							.attr('id','line')
							.attr('x1', 0)
							.attr('y1', yScale(a[y]))
							.attr('x2', w)
							.attr('y2', yScale(a[y]))
							.attr('stroke', 'red')
					  })
					  .on('mouseleave', function (a, i) {
							d3.select(this)
								.transition()
								.duration(100)
								.attr('opacity', 1)
								.attr('width', xScale.bandwidth() -10)

							svg.selectAll('#line').remove()
					  })

	svg.append("g").attr("transform", "translate(0," + h + ")")
					.call(xAxis);

	svg.append("g").attr("transform", "translate(0," + 0 + ")")
					.call(yAxis);

	// Título do Gráfico e nome dos eixos
	svg.append("text")
	   .attr("transform", "translate(" + (w/2) + ","+ (0 - 30) +")")
	   .style("text-anchor", "middle")
	   .attr("font-family", "Segoe UI")
	   .attr("font-weight", "bold")
	   .attr("font-size", "30px")
	   .text(title);

	svg.append("text")
		   .attr("transform", "translate(" + (w/2) + "," + (h + margin.bottom) + ")")
		   .style("text-anchor", "middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "12px")
		   .text(x);
	
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - margin.left)
	   .attr("x",0 - (h / 2))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "12px")
	   .text(y);
 }

// Função GROUPED BAR CHART: gera um gráfico de barras agrupado para determinado conjunto de dados.
// @dataset 	Conjunto de dados de entrada 
// @x 			Nome do atributo a ser projeto no eixo X 
// @classes 	Nome dos atributos a serem agrupados no eixo Y 
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function groupedBarChart(dataset, x, classes, title, panel, options) {

	// Realiza o primeiro "slice" dos dados para exibição
	var newDataset = dataset.filter(function(d) { return +d[x] > d3.max(dataset, function(d) { return +d[x] - options.barNumber; }); })
	let categories = newDataset.map(function(d) { return d[x]; })

	// Variáveis Gerais
	var margin = {top: 150, right: 100, bottom: 150, left: 100}, 
		w = options.width - margin.left - margin.right, 
		h = options.height - margin.top - margin.bottom;

	// Funções de Escala 
	var x0Scale = d3.scaleBand()
					.range([0, w])            
					.domain(categories)
					.padding(0.1);

	var x1Scale = d3.scaleBand()
					.range([0, x0Scale.bandwidth()])            
					.domain(classes);

	let yScale = d3.scaleLinear()
					.domain([0, d3.max(dataset, function(d) { return d3.max(classes, function(labels) { return +d[labels]; }); }) ]).nice()
					.range([h,0]);	

	var legendColorScale = d3.scaleOrdinal()
			 .range(options.colorRange.map(function(d) { return d[0]; }))

	var colorScales = {}
	for (var i = 0; i < classes.length; i++) {
		var colScale_aux = d3.scaleLinear()
					.domain([0, d3.max(dataset, function(d) { return +d[classes[0]]; }) ])
					.range(options.colorRange[i])

		colorScales[classes[i]] = colScale_aux
	}

	// Declaração dos Eixos do Gráfico
	let xAxis = d3.axisBottom()
					.scale(x0Scale).tickSize(0);
	
	let yAxis = d3.axisLeft()
					.scale(yScale).ticks(10);
	
	
	// Declaração da Variável SVG que contém todo o gráfico
	var svg = d3.select(panel).append("svg")
								.attr("width", w + margin.left + margin.right)
								.attr("height", h + margin.top + margin.bottom)
							.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
	// Adiciona linhas de grade no gráfico
	if("grid" in options && options.grid == true) {
		make_grid(svg, x0Scale, yScale, w, h)
	}

	// Adiciona linhas horizontais ao gráfico
	if("hline" in options) {
		make_hline(svg, w, xScale, yScale, options.hline)

		// Fundo Colorido de Separação das linhas horizontais
		if("hline_bg" in options && options.hline_bg.length == options.hline.length+1) {
			make_hline_background(svg, w, h, yScale, options.hline, options.hline_bg)
		}
	}


	// Criação dos 'slice's (elementos que contém o grupo de barras)
	var slice = svg.selectAll(".slice")
				.data(newDataset)
				.enter()
				.append("g")
					.attr("class", "slice")
					.attr("transform", function(d) { return "translate(" + x0Scale(d[x]) + ",0)"; });

	// Criação das Barras Agrupadas
	slice.selectAll("rect")
		.data(function(d) { return classes.map(function(key) { return {key: key, value: +d[key]}; }); })
		.enter()
		.append("rect")
			.attr("width", x1Scale.bandwidth())
			.attr("x", function(d) { return x1Scale(d.key); })
			.attr("y", function(d) { return yScale(d.value); })
			.attr("height", function(d) { return h - yScale(d.value) })
			.style("fill", function(d) { return colorScales[d.key](d.value) })
			.on('mouseover', function(d) {
				d3.select(this).style("fill", d3.rgb(colorScales[d.key](d.value)).darker(1))
			})
			.on('mouseout', function(d) {
				d3.select(this).style("fill", colorScales[d.key](d.value))
			})

	// Declaração da Caixa de Legenda
	var legend = svg.append("g")
					.attr("font-family", "Roboto")
					.attr("font-size", 12)
					.attr("text-anchor", "end")
					.selectAll("g")
					.data(classes)
					.enter().append("g")
					.attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

	legend.append("rect")
			.attr("x", w - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", legendColorScale);

	legend.append("text")
			.attr("x", w - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function(d) { return d; });

	// Título do Gráfico e nome dos eixos
	svg.append("g").attr("transform", "translate(0," + h + ")")
					.attr("class", 'x_axis')
					.call(xAxis);

	svg.append("g").attr("transform", "translate(0," + 0 + ")")
					.attr("class", 'y_axis')
					.call(yAxis);

	svg.append("text")
	   .attr("transform", "translate(" + (w/2) + ","+ (0 - 30) +")")
	   .style("text-anchor", "middle")
	   .attr("font-family", "Roboto")
	   .attr("font-weight", "bold")
	   .attr("font-size", "30px")
	   .text(title);

	svg.append("text")
	   .attr("transform", "translate(" + (w/2) + "," + (h+35) + ")")
	   .style("text-anchor", "middle")
	   .attr("font-family", "Roboto")
	   .attr("font-size", "14px")
	   .text(options.xlabel);
	
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - 55)
	   .attr("x",0 - (h / 2))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .attr("font-family", "Roboto")
	   .attr("font-size", "14px")
	   .text(options.ylabel);

	// Button
	d3.select(options.button_next)
		.on("click", function() {
			var max = Math.min(2018, +d3.max(categories)+10)

			newDataset = dataset.filter(function(d) { return (+d[x] <= max) && (+d[x] > max - options.barNumber); })
			update(newDataset)
		})

	d3.select(options.button_prev)
		.on("click", function() {
			var max = Math.max(1988, +d3.max(categories)-10)

			newDataset = dataset.filter(function(d) { return (+d[x] <= max) && (+d[x] > max - options.barNumber); })
			update(newDataset)
		})

	// Função de Atualização do Gráfico por Transição
	function update(newDataset) {
		categories = newDataset.map(function(d) { return d[x]; })

		d3.select(options.span_inf).text(d3.min(categories, function(d) { return +d} ))
		d3.select(options.span_sup).text(d3.max(categories, function(d) { return +d} ))

		x0Scale.domain(categories)
		x1Scale.range([0, x0Scale.bandwidth()])            

		svg.selectAll(".slice")
			.data([])
			.exit()
			.remove()

		slice = svg.selectAll(".slice")
			.data(newDataset)
			.enter()
			.append("g")
				.attr("class", "slice")
				.attr("transform", function(d) { return "translate(" + x0Scale(d[x]) + ",0)"; });

		slice.selectAll("rect")
			.data(function(d) { return classes.map(function(key) { return {key: key, value: +d[key]}; }); })
			.enter()
			.append("rect")
				.attr("width", x1Scale.bandwidth())
				.attr("x", function(d) { return x1Scale(d.key); })
				.attr("y", function(d) { return yScale(0); })
				.attr("height", function(d) { return h - yScale(0) })
				.style("fill", function(d) { return colorScales[d.key](d.value) })

		slice.selectAll("rect")
				.data(function(d) { return classes.map(function(key) { return {key: key, value: +d[key]}; }); })
				.transition()
				.delay(100)
				.duration(500)
				.attr("y", function(d) { return yScale(d.value); })
				.attr("height", function(d) { return h - yScale(d.value) })

		svg.select(".x_axis")
			.transition()
			.duration(100)
			.call(xAxis)
	}

 }

// Função STACKED BAR CHART: gera um gráfico de barras empilhadas
// @dataset 	Caminho para o arquivo de dados de entrada para os pontos
// @x 			Nome do atributo a ser projeto como tamanho dos pontos
// @y 			Nome do atributo a ser projeto como tamanho dos pontos
// @labels 		Nome do atributo contendo os identificadores de cada ponto
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function stackBarChart(dataset, x, y, labels, title, panel, options) {
	var opt = {
		"renderer": "svg", 
		"actions": { "export":false, "source":false, "compiled":false, "editor":false } 
	}

	d3.json("../vega/stackBarChart.json").then(function(spec) { 
		// General properties
		spec["width"] = options.width
		spec["height"] = options.height

		// Bar configuration
		spec["data"]["url"] = dataset
		spec["encoding"]["x"]["field"] = x
		spec["encoding"]["y"]["field"] = y
		spec["encoding"]["color"]["field"] = labels
		spec["encoding"]["color"]["scale"]["range"] = options.colors
		spec["encoding"]["color"]["legend"]["title"] = options.legendTitle

		vegaEmbed(panel, spec, opt).then(function(view) {}) 
	});
}

// Função DOTTED MAP: gera um mapa com conjunto de pontos sobrepostos.
// @dataset 	Caminho para o arquivo de dados de entrada para os pontos
// @x 			Nome do atributo a ser projeto como tamanho dos pontos
// @labels 		Nome do atributo contendo os identificadores de cada ponto
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function dottedMap(dataset, x, labels, title, panel, options) {
	var opt = {
		"renderer": "svg", 
		"actions": { "export":false, "source":false, "compiled":false, "editor":false } 
	}

	d3.json("../vega/overDotMap.json").then(function(spec) { 
		// General properties
		spec["width"] = options.width
		spec["height"] = options.height

		// // Map configuration
		spec["layer"][0]["mark"]["fill"] = options.mapFill
		spec["layer"][0]["mark"]["stroke"] = options.mapStroke

		// // Points configuration
		spec["layer"][1]["data"]["url"] = dataset
		spec["layer"][1]["encoding"]["tooltip"][0]["field"] = labels
		spec["layer"][1]["encoding"]["tooltip"][1]["field"] = x
		spec["layer"][1]["encoding"]["size"]["field"] = x
		spec["layer"][1]["encoding"]["size"]["scale"]["range"] = [0, options.sizeScale]
		spec["layer"][1]["encoding"]["size"]["legend"]["title"] = options.legendTitle
		spec["layer"][1]["encoding"]["color"]["value"] = options.color

		vegaEmbed(panel, spec, opt).then(function(view) {}) 
	});
}




// Função CHOROPLETH MAP: gera um mapa colorido de acordo com determinado dado.
// @dataset 	Caminho para o arquivo de dados de entrada para as cores
// @x 			Nome do atributo a ser projeto como gradiente da cor
// @labels 		Nome do atributo contendo os identificadores de cada marca
// @title 		Título do gráfico a ser exibido
// @panel 		Identificador da <div> na qual o gráfico deve ser renderizado
// @options 	Conjunto de opções gráficas (cor, dimensões, labels, etc.)
function choroplethMap(dataset, x, labels, title, panel, options) {
	var opt = {
		"renderer": "svg", 
		"actions": { "export":false, "source":false, "compiled":false, "editor":false } 
	}

	d3.json("../vega/choropleth.json").then(function(spec) { 
		// General properties
		spec["width"] = options.width
		spec["height"] = options.height

		// Map configuration
		spec["mark"]["stroke"] = options.mapStroke

		// Color configuration
		spec["transform"][0]["from"]["data"]["url"] = dataset
		spec["transform"][0]["from"]["fields"] = [labels, x]
		spec["encoding"]["color"]["field"] = x
		spec["encoding"]["tooltip"][0]["field"] = labels
		spec["encoding"]["tooltip"][1]["field"] = x

		// Rendering
		vegaEmbed(panel, spec, opt).then(function(view) {
			
			// Embed the input objects if the options.input is different from "none"
			if(options.input != "none") {
				var loader = vega.loader(); 	

				// Load data based on the initial position of the slider 
				loader.load(options.path + $(options.input).val() + ".csv").then(function(data) {        
					data = vega.read(data, {type: 'csv', parse: 'auto'})
					var changeSet = vega.changeset().insert(data).remove();
					
					view.view.change('dataset', changeSet).run();
				})

				// Embed a listener to the input to change the dataset accordingly
				$(options.input).on("change mousemove", function(event) {
					loader.load(options.path + $(this).val() + ".csv").then(function(data) {        
						data = vega.read(data, {type: 'csv', parse: 'auto'})
						var changeSet = vega.changeset().insert(data).remove();

						view.view.change('dataset', changeSet).run();
					})
				});
			}

		}) 
	});
}

function choroplethMapNominal(dataset, x, labels, title, panel, options) {
	var opt = {
		"renderer": "svg", 
		"actions": { "export":false, "source":false, "compiled":false, "editor":false } 
	}

	d3.json("../vega/cloroplethNominal.json").then(function(spec) { 
		// General properties
		spec["width"] = options.width
		spec["height"] = options.height

		// Map configuration
		spec["mark"]["stroke"] = options.mapStroke

		// Color configuration
		spec["transform"][0]["from"]["data"]["url"] = dataset
		spec["transform"][0]["from"]["fields"] = [labels, x]
		spec["encoding"]["color"]["field"] = x
		spec["encoding"]["color"]["scale"]["domain"] = options.domain
		spec["encoding"]["color"]["scale"]["range"] = options.color
		spec["encoding"]["tooltip"][0]["field"] = labels
		console.log(x)
		console.log(dataset[x])
		spec["encoding"]["tooltip"][1]["field"] = x

		// Rendering
		vegaEmbed(panel, spec, opt).then(function(view) {

		}) 
	});
}


// ######################
//     FUNÇÕES GERAIS
// ######################
function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function(prev, cur){ return prev+cur;};

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d){ return Math.pow(d - xBar, 2);})
						.reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d){ return Math.pow(d - yBar, 2);})
						.reduce(reduceSumFunc);

	var ssXY = xSeries.map(function(d,i){ return (d - xBar)*(ySeries[i] - yBar);})
						.reduce(reduceSumFunc);
	var slope = ssXY/ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY,2)/(ssXX*ssYY);
	return [slope,intercept,rSquare];
};

function make_hline(svg, w, xScale, yScale, hline) {
	var hlineData = []
	for (var i = 0; i < hline.length; i++) {
		hlineData.push([xScale.invert(0), xScale.invert(w), hline[i].v, hline[i].name])
	}

	// Adiciona a linha de tendência ao gráfico
	var trendline = svg.selectAll(".hline")
						.data(hlineData);

	trendline.enter()
				.append("line")
				.attr("class","hline")
				.attr("x1", function(d) { return xScale(d[0]);})
				.attr("x2", function(d) { return xScale(d[1]);})
				.attr("y1", function(d) { return yScale(d[2]);})
				.attr("y2", function(d) { return yScale(d[2]);})
				.attr("stroke","black")
				.style("stroke-dasharray", ("3, 3"))
				.attr("stroke-width",2);

	trendline.enter()
				.append("text")
				.attr("transform", function(d) { 
					return "translate(" + (w - d[3].length*4) + "," + (yScale(d[2])-5) +")"
				})
				.style("text-anchor", "middle")
				.attr("font-family", "Roboto")
				.attr("font-size", "11px")
				.text(function(d) { return ""+d[3] });
}

function make_hline_background(svg, w, h, yScale, hline, hline_bg) {
	var hlineBGData = [[yScale.invert(h), hline[0].v, hline_bg[0]]]

	for (var i = 1; i < hline.length; i++) {
		hlineBGData.push([hline[i-1].v, 
							hline[i].v, 
							hline_bg[i]])
	}

	hlineBGData.push([hline[hline.length-1].v, 
						yScale.invert(0), 
						hline_bg[hline.length]])

	var background = svg.selectAll(".hbackground")
						.data(hlineBGData)
	background.enter()
				.append("rect")
				.attr("class","hbackground")
				.attr("x", 0)
				.attr("y", function(d) { return yScale(d[1]) })
				.attr("height", function(d) { return yScale(d[0]) - yScale(d[1]) } )
				.attr("width", w)
				.attr("fill", function(d) { return d[2] })
}

function make_vline(svg, w, xScale, yScale, vline) {
	var vlineData = []
	for (var i = 0; i < vline.length; i++) {
		vlineData.push([yScale.invert(0), yScale.invert(h), vline[i].v, vline[i].name])
	}

	// Adiciona a linha de tendência ao gráfico
	var trendline = svg.selectAll(".vline")
						.data(vlineData);

	trendline.enter()
				.append("line")
				.attr("class","vline")
				.attr("x1", function(d) { return xScale(d[2]);})
				.attr("x2", function(d) { return xScale(d[2]);})
				.attr("y1", function(d) { return yScale(d[1]);})
				.attr("y2", function(d) { return yScale(d[2]);})
				.attr("stroke","black")
				.style("stroke-dasharray", ("3, 3"))
				.attr("stroke-width",2);

	trendline.enter()
				.append("text")
				.attr("transform", function(d) { 
					return "translate(" + (xScale(d[2])+5) + "," + (5) +")"
				})
				.style("text-anchor", "middle")
				.attr("font-family", "Roboto")
				.attr("font-size", "11px")
				.text(function(d) { return ""+d[3] });
}

function make_vline_background(svg, w, h, yScale, vline, vline_bg) {
	var vlineBGData = [[xScale.invert(0), vline[0].v, vline_bg[0]]]

	for (var i = 1; i < vline.length; i++) {
		vlineBGData.push([vline[i-1].v, 
							vline[i].v, 
							vline_bg[i]])
	}

	vlineBGData.push([vline[vline.length-1].v, 
						xScale.invert(w), 
						vline_bg[vline.length]])

	var background = svg.selectAll(".vbackground")
						.data(vlineBGData)
	background.enter()
				.append("rect")
				.attr("class","hbackground")
				.attr("y", 0)
				.attr("x", function(d) { return xScale(d[1]) })
				.attr("width", function(d) { return xScale(d[0]) - xScale(d[1]) } )
				.attr("height", h)
				.attr("fill", function(d) { return d[2] })
}

function make_grid(svg, xScale, yScale, width, height) {
	svg.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale)
				.ticks(5)
				.tickSize(-height)
				.tickFormat(""))

	svg.append("g")			
		.attr("class", "grid")
		.call(d3.axisLeft(yScale)
				.ticks(5)
				.tickSize(-width)
				.tickFormat(""))
}

// ######################
//     TIMELINE
// ######################
jQuery(document).ready(function($){
		var timelines = $('.cd-horizontal-timeline'),
		  eventsMinDistance = 2;

		(timelines.length > 0) && initTimeline(timelines);

		function initTimeline(timelines) {
		  timelines.each(function(){
			var timeline = $(this),
			  timelineComponents = {};
			//cache timeline components 
			timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
			timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
			timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
			timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
			timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
			timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
			timelineComponents['eventsContent'] = timeline.children('.events-content');

			//assign a left postion to the single events along the timeline
			setDatePosition(timelineComponents, eventsMinDistance);
			//assign a width to the timeline
			var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
			//the timeline has been initialize - show it
			timeline.addClass('loaded');

			//detect click on the next arrow
			timelineComponents['timelineNavigation'].on('click', '.next', function(event){
			  event.preventDefault();
			  updateSlide(timelineComponents, timelineTotWidth, 'next');
			});
			//detect click on the prev arrow
			timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
			  event.preventDefault();
			  updateSlide(timelineComponents, timelineTotWidth, 'prev');
			});
			//detect click on the a single event - show new event content
			timelineComponents['eventsWrapper'].on('click', 'a', function(event){
			  event.preventDefault();
			  timelineComponents['timelineEvents'].removeClass('selected');
			  $(this).addClass('selected');
			  updateOlderEvents($(this));
			  updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
			  updateVisibleContent($(this), timelineComponents['eventsContent']);
			});

			//on swipe, show next/prev event content
			timelineComponents['eventsContent'].on('swipeleft', function(){
			  var mq = checkMQ();
			  ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
			});
			timelineComponents['eventsContent'].on('swiperight', function(){
			  var mq = checkMQ();
			  ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
			});

			//keyboard navigation
			$(document).keyup(function(event){
			  if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
				showNewContent(timelineComponents, timelineTotWidth, 'prev');
			  } else if( event.which=='39' && elementInViewport(timeline.get(0))) {
				showNewContent(timelineComponents, timelineTotWidth, 'next');
			  }
			});
		  });
		}

		function updateSlide(timelineComponents, timelineTotWidth, string) {
		  //retrieve translateX value of timelineComponents['eventsWrapper']
		  var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
			wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
		  //translate the timeline to the left('next')/right('prev') 
		  (string == 'next') 
			? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
			: translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
		}

		function showNewContent(timelineComponents, timelineTotWidth, string) {
		  //go from one event to the next/previous one
		  var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
			newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

		  if ( newContent.length > 0 ) { //if there's a next/prev event - show it
			var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
			  newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
			
			updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
			updateVisibleContent(newEvent, timelineComponents['eventsContent']);
			newEvent.addClass('selected');
			selectedDate.removeClass('selected');
			updateOlderEvents(newEvent);
			updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
		  }
		}

		function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
		  //translate timeline to the left/right according to the position of the selected event
		  var eventStyle = window.getComputedStyle(event.get(0), null),
			eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
			timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
			timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
		  var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

			  if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
				translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
			  }
		}

		function translateTimeline(timelineComponents, value, totWidth) {
		  var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
		  value = (value > 0) ? 0 : value; //only negative translate value
		  value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
		  setTransformValue(eventsWrapper, 'translateX', value+'px');
		  //update navigation arrows visibility
		  (value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
		  (value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
		}

		function updateFilling(selectedEvent, filling, totWidth) {
		  //change .filling-line length according to the selected event
		  var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
			eventLeft = eventStyle.getPropertyValue("left"),
			eventWidth = eventStyle.getPropertyValue("width");
		  eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
		  var scaleValue = eventLeft/totWidth;
		  setTransformValue(filling.get(0), 'scaleX', scaleValue);
		}

		function setDatePosition(timelineComponents, min) {
		  for (i = 0; i < timelineComponents['timelineDates'].length; i++) { 
			  var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
				distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
			  timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
		  }
		}

		function setTimelineWidth(timelineComponents, width) {
		  var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
			timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
			timeSpanNorm = Math.round(timeSpanNorm) + 4,
			totalWidth = timeSpanNorm*width;
		  timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
		  updateFilling(timelineComponents['timelineEvents'].eq(0), timelineComponents['fillingLine'], totalWidth);
		
		  return totalWidth;
		}

		function updateVisibleContent(event, eventsContent) {
		  var eventDate = event.data('date'),
			visibleContent = eventsContent.find('.selected'),
			selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
			selectedContentHeight = selectedContent.height();

		  if (selectedContent.index() > visibleContent.index()) {
			var classEnetering = 'selected enter-right',
			  classLeaving = 'leave-left';
		  } else {
			var classEnetering = 'selected enter-left',
			  classLeaving = 'leave-right';
		  }

		  selectedContent.attr('class', classEnetering);
		  visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
			visibleContent.removeClass('leave-right leave-left');
			selectedContent.removeClass('enter-left enter-right');
		  });
		  eventsContent.css('height', selectedContentHeight+'px');
		}

		function updateOlderEvents(event) {
		  event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
		}

		function getTranslateValue(timeline) {
		  var timelineStyle = window.getComputedStyle(timeline.get(0), null),
			timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
				  timelineStyle.getPropertyValue("-moz-transform") ||
				  timelineStyle.getPropertyValue("-ms-transform") ||
				  timelineStyle.getPropertyValue("-o-transform") ||
				  timelineStyle.getPropertyValue("transform");

			  if( timelineTranslate.indexOf('(') >=0 ) {
				var timelineTranslate = timelineTranslate.split('(')[1];
			  timelineTranslate = timelineTranslate.split(')')[0];
			  timelineTranslate = timelineTranslate.split(',');
			  var translateValue = timelineTranslate[4];
			  } else {
				var translateValue = 0;
			  }

			  return Number(translateValue);
		}

		function setTransformValue(element, property, value) {
		  element.style["-webkit-transform"] = property+"("+value+")";
		  element.style["-moz-transform"] = property+"("+value+")";
		  element.style["-ms-transform"] = property+"("+value+")";
		  element.style["-o-transform"] = property+"("+value+")";
		  element.style["transform"] = property+"("+value+")";
		}

		//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
		function parseDate(events) {
		  var dateArrays = [];
		  events.each(function(){
			var dateComp = $(this).data('date').split('/'),
			  newDate = new Date(dateComp[2], dateComp[1]-1, dateComp[0]);
			dateArrays.push(newDate);
		  });
			return dateArrays;
		}

		function parseDate2(events) {
		  var dateArrays = [];
		  events.each(function(){
			var singleDate = $(this),
			  dateComp = singleDate.data('date').split('T');
			if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
			  var dayComp = dateComp[0].split('/'),
				timeComp = dateComp[1].split(':');
			} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
			  var dayComp = ["2000", "0", "0"],
				timeComp = dateComp[0].split(':');
			} else { //only DD/MM/YEAR
			  var dayComp = dateComp[0].split('/'),
				timeComp = ["0", "0"];
			}
			var newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
			dateArrays.push(newDate);
		  });
			return dateArrays;
		}

		function daydiff(first, second) {
			return Math.round((second-first));
		}

		function minLapse(dates) {
		  //determine the minimum distance among events
		  var dateDistances = [];
		  for (i = 1; i < dates.length; i++) { 
			  var distance = daydiff(dates[i-1], dates[i]);
			  dateDistances.push(distance);
		  }
		  return Math.min.apply(null, dateDistances);
		}

		/*
		  How to tell if a DOM element is visible in the current viewport?
		  http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		*/
		function elementInViewport(el) {
		  var top = el.offsetTop;
		  var left = el.offsetLeft;
		  var width = el.offsetWidth;
		  var height = el.offsetHeight;

		  while(el.offsetParent) {
			  el = el.offsetParent;
			  top += el.offsetTop;
			  left += el.offsetLeft;
		  }

		  return (
			  top < (window.pageYOffset + window.innerHeight) &&
			  left < (window.pageXOffset + window.innerWidth) &&
			  (top + height) > window.pageYOffset &&
			  (left + width) > window.pageXOffset
		  );
		}

		function checkMQ() {
		  //check if mobile or desktop device
		  return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}
	  });




