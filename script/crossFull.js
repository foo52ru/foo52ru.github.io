"use strict";
let cnv3  = document.getElementById('cnv_s3');
let ctx3  = cnv3.getContext('2d');
let stepButton3    = document.getElementById("step_s3");
let crossCheck3    = document.getElementById('cross_s3');
let viewSelect3    = document.getElementById('viewSelect_s3');
let mutRange3      = document.getElementById('mut_s3');
let mutLabel3      = document.getElementById("mutP_s3");
let powerRange3     = document.getElementById('power_s3');
let powerLabel3     = document.getElementById("powerP_s3");
let resetButton3   = document.getElementById("reset_s3");
let popSizeSelect3 = document.getElementById("pop_s3");
let stop9kCheck3   = document.getElementById("stop9000_s3");

ctx3.font = "18px monospace";

let alphabet3 = 100;

let lenGenom3 = 224;

let populationSize3 = Number(popSizeSelect3.value);
let halfPopSize3 = populationSize3/2;

let steps3 = 0;
let population3 = [];
let metr3 = [];  
let life3 = [];  // оставляет потомство

let view3 = 0;
let powerChoice3 = [ 0, 100, 10, 1 ] ;

let graph3 = [];
let badCount3 = [];
let goodCount3 = [];

let maxS3 , loop3 , cross3 , mutationProbility3, power3, randomStartGenom, bad3, good3;

initialization3();

//########   MAIN    ###########################           
function draw3() {  
	ctx3.clearRect(0, 0, cnv3.width, cnv3.height);	
	if(cross3) newGenerationCross3();
	else       newGeneration3();

	makeStep3();
	
	if( stop9kCheck3.checked && steps3 == 9000){
		 loop3 = false;
		 stepButton3.innerHTML  = "START";
	}

	if(loop3) window.requestAnimationFrame(draw3);
} 


//======================================================
//==============        FUNCTION       =================   
//======================================================

//-----  начальная инициализация -----------------------
//----   population3 - геном ботов
//----   metr3 - здесь храниться приспособленность ботов
//----   life3 - будет ли потомство от этого бота
function initialization3(){
	populationSize3 = Number(popSizeSelect3.value);
	halfPopSize3 = populationSize3/2;
	population3 = [];
	metr3 = [];  
	life3 = [];  // оставляет потомство
	graph3 = [];
	badCount3 = [];
	goodCount3 = [];
	steps3 = 0; 
	maxS3 = 0;
	loop3 = false;
	cross3 = crossCheck3.checked;
	view3   = Number(viewSelect3.value);
	mutationProbility3 = mutRange3.valueAsNumber;
	power3 = powerRange3.valueAsNumber;
	for(let i=0; i<populationSize3; i++){
		let	arr = [];
		for(let j=0; j<lenGenom3; j++) arr.push(Math.floor( alphabet3 * Math.random() ));
		population3.push(arr);
		metr3.push(0);
		life3.push(false);
	} 
	stepButton3.innerHTML  = "START";
	makeStep3();
}

//==================================
function makeStep3(){
	mutation3(mutationProbility3 );
	calculate3();
	steps3++;
	if( (steps3 % 10) == 0  ){
		 graph3.push(maxS3);
		 badCount3.push(bad3);
		 goodCount3.push(good3);
	}
	if( graph3.length > 900 ){
		 graph3.shift();
		 badCount3.shift();
		 goodCount3.shift();
	}
	paint3(); 
}


//------  мутация с заданной вероятность у всех ботов ---- 
function mutation3(p){
	let n,a;
	for(let i=0; i<populationSize3; i++){
		if(Math.random() < p){
			a = Math.floor(Math.random() * alphabet3);
			n = Math.floor(Math.random() * lenGenom3);
			population3[i][n] = a;
		}
	}
}

//=======================================================
//----   определяем, кто будет оставлять потомство  -----
function calculate3(){
	bad3 = 0;
	good3 = 0;
	// подсчитываем совпадения  -------------
	for(let i=0; i<populationSize3; i++){
		metr3[i] = 0; 
		for(let s=0; s<lenGenom3; s++){
			if(     population3[i][s] == 99){
				 metr3[i]++ ;
				 good3++;
			}
			else if(population3[i][s] <  90){
				 metr3[i]-- ;
				 bad3++;
			}
		}
	}	
	bad3  = Math.round( bad3  / populationSize3 );
	good3 = Math.round( good3 / populationSize3 );
	maxS3 = Math.max(...metr3);
	//--  отмаштабируем  ----------
	let minus = Math.min(...metr3) - powerChoice3[power3];
	if( power3 >  0 ){
		for(let i in metr3) metr3[i] = metr3[i]-minus;
	}else{
		for(let i in metr3) metr3[i] = 1;
	}
	// обнуляем массиа life3 -------
	for(let elem in life3) life3[elem] = false; 
	//  список победителей --------
	let temp = findWinner3( metr3, halfPopSize3 );
	for(let i = 0; i<halfPopSize3; i++) life3[temp[i]] = true;
}

//===============================================================
//--  создаётся массив с индексами тех, кто оставит потомство  --
function findWinner3( arr, count ){
	let temp = arr.slice();
	let winer = [];
	let len = temp.length;
	let sum, subSum, rand;

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
function newGeneration3(){
	let w = [];
	let u = 0;
	for(let i=0; i<populationSize3; i++){
		if( life3[i] == true){
			w[u] = population3[i].slice();
			u++;
		}
	}
	for(let i= 0; i < populationSize3; i++){
		 population3[i] = w[Math.floor(i/2)].slice();
	}
}

//========================================
//---  создание нового поколения  --------
function newGenerationCross3(){
	let s0, s1;
	let botOne = [];
	let botsTemp = [];
	for(let i=0; i<populationSize3; i++){ botsTemp[i] = population3[i].slice(); }
	let cross3 = findCross3(life3);
	for(let i=0; i<populationSize3; i++){
		botOne = [];
		for(let n=0; n<lenGenom3; n++){
			s0 = botsTemp[ cross3[0][i] ][n];
			s1 = botsTemp[ cross3[1][i] ][n];
			if(Math.random() > 0.5) botOne.push( s0 );
			else                    botOne.push( s1 );
		}
		population3[i] = botOne.slice();
	}
}



//==============================================
function findCross3(ar){
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


//===============================================================
//----------     создаём картинку на канвасе    -------------------
function paint3(){
	if(view3 == 0)      printGs3();
	else if(view3 == 1) printBar3();
	else                printGraph3();
	info3();
}

//=================================================================
function printGs3(){
	let h = 2;
	ctx3.fillStyle = '#000000';
	ctx3.fillRect(0, 0, cnv3.width, cnv3.height);
	ctx3.fillStyle = '#ffffff';
	ctx3.fillRect(2, h, 896, 600);	
	
	//-----  геном ботов  --------
	for(let i = 0; i < 600; i++){
		for(let s=0; s<lenGenom3; s++){ 
			if(population3[i][s] < 90){
				ctx3.fillStyle = '#EAAC00';
				ctx3.fillRect( 2 + s*4 , h , 4,1);
			} 
			else if(population3[i][s] == 99){
				ctx3.fillStyle = '#5209D3';
				ctx3.fillRect( 2 + s*4 , h , 4,1);
			} 			
		}
		h++;
	}
} 


//========================================================
function printBar3(){
	let h = 2;
	ctx3.fillStyle = '#000000';
	ctx3.fillRect(0, 0, cnv3.width, cnv3.height);
	ctx3.fillStyle = '#ffffff';
	ctx3.fillRect(2, h, 896, 600);	
	let cntGood, cntBad;

	for(let s=0; s<lenGenom3; s++){
		cntGood = 0;
		cntBad  = 0;
		for(let i = 0; i < populationSize3; i++){  
			if(     population3[i][s] <  90) cntBad++; 
			else if(population3[i][s] == 99) cntGood++; 
		}
		cntBad  = Math.floor( cntBad  / (populationSize3/600) );
		cntGood = Math.floor( cntGood / (populationSize3/600) );
		ctx3.fillStyle = '#5209D3';
		ctx3.fillRect( 2 + s*4 , 600+h , 4 , -cntGood);
		ctx3.fillStyle = '#EAAC00';
		ctx3.fillRect( 2 + s*4 , 600+h - cntGood, 4 , -cntBad);
	}
}

//========================================
function printGraph3(){
	let h = 2;	
	ctx3.fillStyle = '#000000';
	ctx3.fillRect(0, 0, cnv3.width, cnv3.height);
	ctx3.fillStyle = '#ffffff';
	ctx3.fillRect(2, h, 896, 600);	
	
	
	ctx3.strokeStyle = '#dddddd';
	ctx3.lineWidth = 2;
	ctx3.beginPath();
	for(let i = h; i < 600+h; i +=50){
		ctx3.moveTo(  0, i); 
		ctx3.lineTo(900, i);
	}
	ctx3.stroke();	
	
	ctx3.beginPath();
	for(let i = 50; i <= 850; i += 50){
		ctx3.moveTo(i, h); 
		ctx3.lineTo(i, 600+h);
	}
	ctx3.stroke();
	
	
	ctx3.fillStyle = '#EA9D0040';
	ctx3.beginPath();
	ctx3.moveTo(0, 600);
	for(let n in badCount3){
		ctx3.lineTo(n, 600 - badCount3[n] );
	}
	ctx3.lineTo( badCount3.length , 600  );
	ctx3.closePath();
	ctx3.fill();
	
	ctx3.fillStyle = '#0511E830';
	ctx3.beginPath();
	ctx3.moveTo(0, 600);
	for(let n in goodCount3){
		ctx3.lineTo(n, 600 - goodCount3[n] );
	}
	ctx3.lineTo( goodCount3.length , 600  );
	ctx3.closePath();
	ctx3.fill();		
	
	ctx3.strokeStyle = '#3D477C';
	ctx3.lineWidth = 4;
	ctx3.beginPath();
	ctx3.moveTo(0, graph3[0]*1.5);
	for(let n in graph3){
		ctx3.lineTo(n, 340 - graph3[n]*1.5);
	}
	ctx3.stroke();	
}

//==================  общая инфа   =====================
function info3(){
	let h = 625;
	ctx3.fillStyle = '#cccccc';
	ctx3.fillText( "step: " + steps3 ,10,h);  
	ctx3.fillText( "max: " + maxS3  + " ( " + lenGenom3 + " )" ,180,h-3); 
	ctx3.fillText( "population: " + populationSize3,180,h+18); 
	ctx3.fillText( "mut probability : " + mutationProbility3 ,400,h-3);  
	ctx3.fillText( "     cross : " + cross3,670,h-3); 
	if(power3 > 0){
		ctx3.fillText( "strength : " + power3 + "  (" + powerChoice3[power3] +")",670,h+18);
	} else { ctx3.fillText( "strength : " + power3 + "  (NO)",670,h+18); }
	ctx3.fillText( "good : " + good3, 400,h+18);
	ctx3.fillText( "bad : " + bad3,520,h+18);
	

}

//#################     LISTENER      ####################
//-----------------------
function stepButtonFunc3(){ 
	if(loop3){
		 loop3 = false;
		 stepButton3.innerHTML  = "START";
	}else{ 
		loop3 = true;
		stepButton3.innerHTML  = "STOP_";
		draw3();
	}
}
stepButton3.addEventListener("click", stepButtonFunc3);

//---------------
function resetCross3(){ 
	cross3 = crossCheck3.checked; 
}
crossCheck3.addEventListener("change", resetCross3);
//--------------
function resetView3(){ 
	view3 =  Number(viewSelect3.value);
	if(!loop3) paint3(); 
}
viewSelect3.addEventListener("change", resetView3);

//--------------
function resetPopSize3(){ 
	initialization3();
}
popSizeSelect3.addEventListener("change", resetPopSize3);

//--------------
function mutationRangeFunc3(){
	mutationProbility3   = mutRange3.valueAsNumber;
	mutLabel3.innerHTML  = mutRange3.value;
	if(!loop3) paint3(); 
}
mutRange3.addEventListener("change", mutationRangeFunc3);
//--------------
function powerRangeFunc3(){
	power3            = powerRange3.valueAsNumber;
	powerLabel3.innerHTML  = power3;
	if(!loop3) paint3(); 
}
powerRange3.addEventListener("change", powerRangeFunc3);
//------------
function resetButtonFunc3(){
	initialization3();
}
resetButton3.addEventListener("click", resetButtonFunc3);
