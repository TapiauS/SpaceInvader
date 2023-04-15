const spaceship=document.querySelector("#spaceship");
const gameframe=document.querySelector(".gameframe");
const scorearea=document.querySelector(".score");
let score=0;
const scordisplayer=document.querySelector("#scoredisplayer");
const lifedisplayer=document.querySelector("#availaiblelife");
let ennemyspeed=1;
let spawpaused=false;
let lvlwave=0;
const shootdelay=200;
let keypressed=null;
let shoot=false;
let bullets=[];
let alienrows=[];
const spaceshipspeed=20;
const numberalien=10;
const spawntime=10000; 
let pv=10;
const aliensize=50;

class Alienrow{
    constructor(aliendiv){
        this.aliendiv=aliendiv;
        this.alienmove="rigth";
    };
};

gameframe.style.height=window.innerHeight;
scorearea.style.height=window.innerHeight;

document.addEventListener("keydown",event=>{
    switch(event.key){
        case "ArrowRight":
            keypressed="rigth";
            break;
        case "ArrowLeft":
            keypressed="left";
            console.log("key pressed="+keypressed)
            break;
        case " ":   
            if(!shoot){
                shoot=true;
                shooting();
            }          
            break;
        default:
            return;    
    }
})

document.addEventListener("keyup",event=>{
    switch(event.key){
        case "ArrowRight":
            keypressed=null;
            break;
        case "ArrowLeft":
            keypressed=null;
            break;
        default:
            return;    
    }
});

const gameplayloop=()=>{
    if(pv>0){
        const position=parseInt(window.getComputedStyle(spaceship).left);
        switch(keypressed){
            case "rigth":{
                if((position+1.5*parseInt(window.getComputedStyle(spaceship).width))<window.innerWidth*0.7)
                    spaceship.style.left=position+spaceshipspeed+"px";
                break;
            }
            case "left":{
                if(position>0)
                    spaceship.style.left=position-spaceshipspeed+"px";
                break;
            }
            default:
        } 
    }

    for (let index = 0; index < bullets.length; index++) {
        const element = bullets[index];
        element.style.top=parseInt(window.getComputedStyle(element).top)-10+"px";
            if(parseInt(window.getComputedStyle(element).top)<0){
                element.remove();
                bullets.splice(index,1);
            }
    }


    for(i=0;i<alienrows.length;i++){
        const row=alienrows[i].aliendiv;
        for(m=0;m<row.length;m++){
            const entity=row[m];
            const rectalien = entity.getBoundingClientRect();
            for(j=0;j<bullets.length;j++){
                const bullet=bullets[j];
                const rectbullet=bullet.getBoundingClientRect();
                    const element1X = rectalien.left + window.pageXOffset;
                    const element1Y = rectalien.top + window.pageYOffset;
                    const element2X = rectbullet.left + window.pageXOffset;
                    const element2Y = rectbullet.top + window.pageYOffset;
                    if( !(
                        element1Y + aliensize < element2Y ||
                        element1Y > element2Y + rectbullet.height ||
                        element1X + aliensize < element2X ||
                        element1X > element2X + rectbullet.width
                    ))
                    {
                        score+=ennemyspeed;
                        scordisplayer.textContent=score;
                        const expls=document.createElement("div");
                        expls.className="alien";
                        expls.innerHTML="<img src='explosion.png' width='"+aliensize+"' heigth='"+aliensize+"' >"
                        expls.style.left=entity.style.left;
                        expls.style.top=entity.style.top;
                        setTimeout(()=>expls.remove(),200);
                        gameframe.append(expls);
                        console.log(bullets);
                        bullet.remove();
                        bullets.splice(j,1);
                        entity.remove();
                        row.splice(m,1);
                        console.log(bullets);
                    }
                }
        }
    }
    

    alienrows.forEach(entity=>{
        const row=entity.aliendiv;
        row.forEach(alien=>{
            if((parseInt(alien.style.left)+1.5*aliensize)>window.innerWidth*0.7){
                entity.alienmove="left";
                return;
            }
            if((parseInt(alien.style.left)-0.5*aliensize)<0){
                entity.alienmove="rigth";
                return;
            }
        })

        for(i=0;i<row.length;i++){
            const alien=row[i];
            alien.style.top=parseInt(window.getComputedStyle(alien).top)+ennemyspeed+"px";
            if(parseInt(alien.style.top)+aliensize>window.innerHeight){
                    alien.remove();
                    row.splice(i,1);
                    pv--;
                    lifedisplayer.textContent=pv;
                    if(pv<0){
                        clearInterval(run);
                        clearInterval(difficultychanger);
                        clearInterval(spawn);
                    }
                    alienrows.splice(alienrows.indexOf(entity),1);
                    return;
                }
                switch(entity.alienmove){
                    case "rigth":
                        alien.style.left=parseInt(alien.style.left)+ennemyspeed+"px";
                        break;
                    case "left":
                        alien.style.left=parseInt(alien.style.left)-ennemyspeed+"px";
                }
            }
        });

    };


const run=setInterval(gameplayloop,100);



const spawner=()=>{
    if(pv>0&&!spawpaused){
        if(lvlwave<5){
        const alienrow=[];
        alienrows.push(new Alienrow(alienrow));
        for(i=0;i<numberalien;i++){
            const newennemy=document.createElement("div");
            newennemy.className="alien";
            alienrow.push(newennemy);
            gameframe.append(newennemy);
            newennemy.innerHTML='<img src="opponent.png" width='+aliensize+' heigth='+aliensize+'>';
            console.log(gameframe.style.width);
            newennemy.style.left=parseInt(window.getComputedStyle(gameframe).width)*i/numberalien+"px";
            newennemy.style.top=0;
        }
        lvlwave++;
    }
    else{
        lvlwave=0;
        spawpaused=true;
        ennemyspeed+=1;
        setTimeout(()=>spawpaused=false,10000);
    }
}
};

spawner();

const spawn=setInterval(spawner,spawntime);



const shooting=()=>{
    if(pv>0){
        const bullet=document.createElement("div");
        bullet.className="bullet";
        bullet.innerHTML="<img src='bullet.png' width='2'>";
        bullet.style.top=parseInt(window.getComputedStyle(spaceship).top)-10+"px";
        bullet.style.left=parseInt(window.getComputedStyle(spaceship).left)+parseInt(window.getComputedStyle(spaceship).width)/2+"px";
        bullets.push(bullet);
        gameframe.append(bullet);
        setTimeout(()=>shoot=false,shootdelay);
    }
};




