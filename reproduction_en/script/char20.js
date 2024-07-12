"use strict";
//##########   SETUP   ###########################
let cnv1  = document.getElementById('cnv_s1');
let ctx1  = cnv1.getContext('2d');
let stepButton1  = document.getElementById("step_s1");
let loopCheck1   = document.getElementById('loop_s1');
let crossCheck1  = document.getElementById('cross_s1');
let graphCheck1  = document.getElementById('graph_s1');
let mut_select1  = document.getElementById("mut_select_s1");
let resetButton1  = document.getElementById("reset_s1");

ctx1.font = "18px monospace";

let alph1 = [...' abcdefghijklmnopqrstuvwxyz'];
let alphabetSize1 = alph1.length;
let goal1 = [...' it is the best genom for this environment try to fit it ']
let genomSize1 = goal1.length;
let populationSize1 = 20;

let bots1 = [];
let metr1 = [];  // совпадений
let life1 = [];  // оставляет потомство
let graph1 = [];
let steps1, maxS1, loop1, cross1, graphView1, mutationProbility1, looping1;

initialization1();


//########   MAIN    ###########################           
function draw1() {  
	if(cross1) newGeneration1Cross1();
	else       newGeneration1();
	makeStep1(); 
	if(looping1 && loop1 && steps1 < 900) window.requestAnimationFrame(draw1); 
} 


//======================================================
//==============        FUNCTION       =================   
//======================================================

//-----  начальная инициализация -----------------------
function initialization1(){
	bots1 = [];	// геном ботов
	metr1 = [];  // совпадений
	life1 = [];  // оставляет потомство
	graph1 = [];
	maxS1 = 0;
	loop1 = loopCheck1.checked;
	cross1 = crossCheck1.checked;
	graphView1 = graphCheck1.checked;
	mutationProbility1 = Number(mut_select1.value);
	looping1 = false;
	for(let i=0; i<populationSize1; i++){
		let	arr = [];
		for(let j=0; j<genomSize1; j++) arr.push(' ');
		bots1.push(arr);
		metr1.push(0);
		life1.push(false);
	} 
	steps1 = 0;
	makeStep1();
}

//================================
function makeStep1(){
	mutation1(mutationProbility1);
	calculate1();
	steps1++;
	maxS1 = Math.max(...metr1);
	graph1.push(maxS1);
	if(graphView1) printGraph1();
	else          printGs1(); 
}

//------  мутация с заданной вероятность у всех ботов ---- 
function mutation1(p){
	let n,a;
	for(let i=0; i<populationSize1; i++){
		if(Math.random() < p){
			a = Math.floor(Math.random() * alphabetSize1);
			n = Math.floor(Math.random() * genomSize1);
			bots1[i][n] = alph1[a];
		}
	}
}

//=======================================================
//----   определяем, кто будет оставлять потомство  -----
function calculate1(){
	// подсчитываем совпадения  -------------
	for(let i=0; i<populationSize1; i++){
		metr1[i] = 0; 
		for(let s=0; s<genomSize1; s++){
			if(goal1[s] == bots1[i][s]) metr1[i]++ ;
		}
	}	
	// обнуляем массиа life1 -------
	for(let elem in life1) life1[elem] = false; 
	//  список победителей --------
	let temp = findWinner1( metr1, 16, Math.min(...metr1)-1 );
	for(let i = 0; i<10; i++) life1[temp[i]] = true;
}

//===============================================================
//--  создаётся массив с индексами тех, кто оставит потомство  --
function findWinner1( arr, count, minus){
	let temp = arr.slice();
	let winer = [];
	let len = temp.length;
	let sum, subSum, rand;
	//--- уменьшим все значения в массиве  ------
	for(let i in temp){
		temp[i] = temp[i] - minus;
		if( temp[i] < 0 ) temp[i] = 0;
	}
	//-----  найдём победителей  -------
	for( let cur = 0; cur < count; cur++){
		sum = 0;  // сумма всех элементов массива -------
		for(let elem of temp) sum += elem;
		//--  случайное число от 0 до суммы элементов  ----
		rand = sum * Math.random();
		//---- поиск на кого выпал выбор  -------
		subSum = 0
		for(let i = 0; i < len; i++){
			subSum += temp[i];
			if(subSum > rand){ 
				winer.push(i);
				temp[i] = 0;
				break;
			}
		}
	}
	return winer;
}

//========================================
//---  создание нового поколения  --------
function newGeneration1(){
	let w = [];
	let u = 0;
	for(let i=0; i<populationSize1; i++){
		if( life1[i] == true){
			w[u] = bots1[i].slice()
			u++;
		}
	}
	for(let i= 0; i < populationSize1; i++){
		 bots1[i] = w[Math.floor(i/2)].slice();
	}
}

//========================================
//---  создание нового поколения  --------
function newGeneration1Cross1(){
	let s0, s1;
	let botOne = [];
	let botsTemp = [];
	for(let i=0; i<populationSize1; i++){ botsTemp[i] = bots1[i].slice(); }
	let cross = findCross1(life1);
	for(let i=0; i<populationSize1; i++){
		botOne = [];
		for(let n=0; n<genomSize1; n++){
			s0 = botsTemp[ cross[0][i] ][n];
			s1 = botsTemp[ cross[1][i] ][n];
			if(Math.random() > 0.5) botOne.push( s0 );
			else                    botOne.push( s1 );
		}
		bots1[i] = botOne.slice();
	}
}



//==============================================
function findCross1(ar){
	let len = ar.length;
	let rn,  temp1 = [], temp2 = [];
	for(let i in ar){ if(ar[i]) { temp1.push(i); temp1.push(i); } }
	
	for(let elem of temp1){
		do {
			rn = temp1[ Math.floor( len * Math.random() )]
		} while ( elem == rn )
		temp2.push(rn);
	}
	return [temp1 , temp2]
}


//=================================================================
//----------     создаём картинку на канвасе    -------------------
function printGs1(){
	ctx1.fillStyle = '#EBEEF2';
	ctx1.fillRect(0, 0, cnv1.width, cnv1.height);	
	let h = 34;
	//----   целевая строка  ---
	ctx1.fillStyle = '#0000ff';
    for(let s=0; s<genomSize1; s++) ctx1.fillText( goal1[s] , 90 + s*14 ,20);
	//-----  геном ботов  --------
	h = 50;
	for(let i = 0; i < populationSize1; i++){
		for(let s=0; s<genomSize1; s++){ 
			if(goal1[s] == bots1[i][s]){
				 ctx1.fillStyle = '#70cc70';
				 ctx1.fillRect( 90 + s*14 , h-12 , 12,16);
				 ctx1.fillStyle = '#000000';
				 ctx1.fillText( bots1[i][s] , 90 + s*14 ,h); 
			}else{                      
				ctx1.fillStyle = '#ffffff';
				ctx1.fillRect( 90 + s*14 , h-12 , 12,16);
				ctx1.fillStyle = '#999999';
				ctx1.fillText( bots1[i][s] , 90 + s*14 ,h); 
			}		
		}
		//--  совпадений и кто оставит потомство -----		
		ctx1.fillStyle = '#555555'; ctx1.fillText( metr1[i] , 10 , h); 
		if(life1[i]) ctx1.fillText( '#' , 50  ,h); 
		h +=20;
	}
	info1();
}

//========================================
function printGraph1(){
	ctx1.fillStyle = '#C2C3C6';
	ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
	ctx1.fillStyle = '#ffffff';
	ctx1.fillRect(0, 50, cnv1.width, 400);	
	
	ctx1.strokeStyle = '#eeeeee';
	ctx1.lineWidth = 1;
	ctx1.beginPath();
	for(let i = 450; i > 50; i -= 7){
		ctx1.moveTo(0, i); 
		ctx1.lineTo(cnv1.width , i);
	}
	ctx1.stroke();
	
	ctx1.strokeStyle = '#dddddd';
	ctx1.lineWidth = 1;
	ctx1.beginPath();
	for(let i = 100; i < cnv1.width; i += 100){
		ctx1.moveTo(i, 0); 
		ctx1.lineTo(i, cnv1.height );
	}
	ctx1.stroke();
	
	ctx1.strokeStyle = '#3D477C';
	ctx1.lineWidth = 4;
	ctx1.beginPath();
	ctx1.moveTo(0, 450-graph1[0]*7);
	for(let n in graph1){
		ctx1.lineTo(n, 450 - graph1[n]*7);
	}
	ctx1.stroke();	
	info1();
}

//=====================================================
function info1(){
	//---  общая инфа  -------
	ctx1.fillStyle = '#303550';
	ctx1.fillText( "step: " + steps1 ,10, cnv1.height -15);  
	ctx1.fillText( "max: " + maxS1  + "  ( " + genomSize1 + " )" ,190, cnv1.height -15);  
	ctx1.fillText( "mut probility: " + mutationProbility1 ,400, cnv1.height -15);  
	ctx1.fillText( "cross: " + cross1, 700, cnv1.height -15); 
}

//######################################
//-----------------------
function stepButtonFunc1(){ 
	if(looping1) looping1 = false;
	else{ 
		if(loop1) looping1 = true;
		draw1();
	}
}
stepButton1.addEventListener("click", stepButtonFunc1);
//---------------
function resetLoop1(){ 
	loop1 = loopCheck1.checked; 
	looping1 = false;
}
loopCheck1.addEventListener("change", resetLoop1);
//---------------
function resetCross1(){ cross1 = crossCheck1.checked; }
crossCheck1.addEventListener("change", resetCross1);
//---------------
function resetView1(){ 
	graphView1 = graphCheck1.checked; 
	if(graphView1) printGraph1();
	else          printGs1();
}
graphCheck1.addEventListener("change", resetView1);
//----------------
function resetMutProbality1(){ mutationProbility1 = Number(mut_select1.value); }
mut_select1.addEventListener("change", resetMutProbality1);
//---------------
resetButton1.addEventListener("click", initialization1);
