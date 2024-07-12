"use strict";
//##########   SETUP   ###########################
let cnv2    = document.getElementById('cnv_s2');
let ctx2    = cnv2.getContext('2d');
let resetButton2  = document.getElementById("rbtn_s2");
let population_select2 = document.getElementById("popul_select_s2");
let advantage_select2  = document.getElementById("advan_select_s2");
let proportion_select2 = document.getElementById("prop_select_s2");


let population2 = Number(population_select2.value);
let advantage2 = Number( 1+(advantage_select2.value)/100 );
let startProportion2 = Number(proportion_select2.value);


let gen2 = [0,0,0,0];
let genold2 = [0,0,0,0];
let col2 = ['#3333ffaa', '#00bb00aa', '#ff5500aa', '#aa00aaaa'];
ctx2.font = "18px monospace";
let step2, temp12, temp22;

reset2();

//=================================          
window.requestAnimationFrame(draw2);
//=================================  

//########   MAIN    ###########################           
function draw2() {  
	//ctx.clearRect(0, 0, cnv.width, cnv.height);	
	for(let i = 0; i<4; i++){
		temp12 = remap2(gen2[i],    0, population2, 490, 90);
	    temp22 = remap2(genold2[i], 0, population2, 490, 90);
	    line2(step2-1,temp22,step2,temp12, col2[i]);
	     genold2[i] = gen2[i];
	     newCount2(i)
    }
    step2++;
    if(step2 < cnv2.width) window.requestAnimationFrame(draw2); 
} 




//############################################

//=======================================
function reset2(){
	population2 = Number(population_select2.value);
	startProportion2 = Number(proportion_select2.value);
	advantage2 = Number( 1+(advantage_select2.value)/100 );
	
	let pp2 = population2 * startProportion2;
	for(let i = 0; i<4; i++){
		gen2[i] = pp2;
		genold2[i] = pp2;
	}
	step2 = 0;
	paintBack2(90);
}

//===================================
function paintBack2(h){
	ctx2.fillStyle = '#eeeeee';
	ctx2.fillRect(0, 0, cnv2.width, cnv2.height);
	ctx2.fillStyle = '#ffffff';
	ctx2.fillRect(0, h, cnv2.width, 400);

	ctx2.strokeStyle = '#cccccc';
	ctx2.lineWidth = 2;
    
	ctx2.beginPath()
	for(let i = 0; i<=400; i+=40){
		ctx2.moveTo(0, h + i);
		ctx2.lineTo(cnv2.width, h + i);
	}
	for(let i = 100; i<900; i+=100){
		ctx2.moveTo(i, h );
		ctx2.lineTo(i, h + 400);
	}    
	ctx2.stroke();	
    
    ctx2.fillStyle = '#4444aa';
	ctx2.fillText( 'population size    :', 10, 20 );
	ctx2.fillText( 'adaptive advantage :',10, 45 );
	ctx2.fillText( 'start proportion   :', 10, 70 );
	

	ctx2.fillStyle = '#000000';
	ctx2.fillText( population2, 250, 20 );
	ctx2.fillText( ((advantage2 - 1)*100).toFixed(1) + ' %',250, 45 );
	ctx2.fillText( startProportion2, 250, 70 );

	
	ctx2.fillStyle = '#999999';
	ctx2.fillText( '( '+ advantage2 +' )', 350, 45 );

}


//===============================
function remap2(pos, start1, end1, start2, end2){
	let prop = (pos - start1)/(end1 - start1);
	return start2 + (end2 - start2)*prop;
}

//==============================
function line2(x1,y1,x2,y2,col){
    ctx2.strokeStyle = col;
    ctx2.lineWidth = 3;
    ctx2.beginPath();
    ctx2.moveTo(x1,y1);
    ctx2.lineTo(x2,y2);
    ctx2.stroke();
}

//===================================
function newCount2(num){
  let fitOneGen = gen2[num] * advantage2;
  let fitPopSize = fitOneGen + (population2 - gen2[num]);
  let res = 0;
  let popul = population2/2;
  for(let i = 0; i < popul; i++){
    if( (Math.random() * fitPopSize) < fitOneGen){ res += 2; }
  }
  gen2[num] = res;
}


//######################################
//-----------------------
function reset_button_func2(){ reset2(); draw2();}
resetButton2.addEventListener("click", reset_button_func2);
