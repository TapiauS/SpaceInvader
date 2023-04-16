//html element accessor

const spaceship=document.querySelector("#spaceship");
const gameframe=document.querySelector(".gameframe");
gameframe.style.height=window.innerHeight+"px";
const scorearea=document.querySelector(".score");
scorearea.style.height=window.innerHeight+"px";
const scordisplayer=document.querySelector("#scoredisplayer");
const pausediv=document.createElement("div");
pausediv.style.position="absolute";
pausediv.style.fontSize="20px";
pausediv.style.color="red";
pausediv.style.top="45%";
pausediv.style.left="35%";
pausediv.innerText="Jeu en pause";
const lifedisplayer=document.querySelector("#availaiblelife");
const audioboum=document.querySelector("#boum");
const themeplayer=document.querySelector('#music');
const shootaudio=document.querySelector("#shoot");
const bonusaudio=document.querySelector('#bonus');

//game variable

let score=0;
let bulletspeed=10;
let bulletsize=2;
let ennemyspeed=1;
let spawpaused=false;
let lvlwave=0;
const shootdelay=200;
let keypressed=null;
let shoot=false;
let bullets=[];
const bonustypes=["larger","faster","life"];
let alienrows=[];
let bonuss=[];
let activbonuss=[];
let ennemybullets=[];
let startedplaying=false;
const spaceshipspeed=20;
const numberalien=10;
const spawntime=10000; 
let pv=10;
const aliensize=50;
let paused=false;
let opponentshootrate=100;



document.addEventListener('keydown', event=> {
    if(event.code === 'Space'){
        if(startedplaying)
            event.preventDefault();
        else{
            startedplaying=true;
            themeplayer.play();
        }   
    }
});

const intersect=(entity1,entity2)=>{
    const rect1 = entity1.getBoundingClientRect();
    const rect2=entity2.getBoundingClientRect();
    const element1X = rect1.left + window.pageXOffset;
    const element1Y = rect1.top + window.pageYOffset;
    const element2X = rect2.left + window.pageXOffset;
    const element2Y = rect2.top + window.pageYOffset;
    return !(
        element1Y + rect1.width < element2Y ||
        element1Y > element2Y + rect2.height ||
        element1X + rect1.width < element2X ||
        element1X > element2X + rect2.width
    );
}



class Alienrow{
    constructor(aliendiv){
        this.aliendiv=aliendiv;
        this.alienmove="rigth";
    };
};


class Bonus{
    constructor(bonustype,destroyedalien){
        this.bonusdiv=document.createElement("div");
        this.bonusdiv.className="bonus";
        this.bonusdiv.style.top=destroyedalien.style.top;
        this.bonusdiv.style.left=destroyedalien.style.left;
        this.bonusdiv.innerHTML="<img src='life.png' width='"+10+"' >";
        gameframe.append(this.bonusdiv);
        this.type=bonustype;
        bonuss.push(this);
    }
}



document.addEventListener("keydown",event=>{
    switch(event.key){
        case "d":
            keypressed="rigth";
            break;
        case "q":
            keypressed="left";
            break;
        case " ":   
            if(!shoot&&!paused){
                shoot=true;
                shooting();
            }          
            break;
        case "p":
            paused=!paused;
            if(paused){
                scorearea.append(pausediv);
            }
            else{
                pausediv.remove();
            }
            break;
        default:
            return;   

    }
})

document.addEventListener("keyup",event=>{
    switch(event.key){
        case "d":
            keypressed=null;
            break;
        case "q":
            keypressed=null;
            break;
        default:
            return;    
    }
});



const gameplayloop=()=>{
    if(!paused){
        if(pv>0){
            alienrows.forEach(alienrow=>{
                const row=alienrow.aliendiv;
                row.forEach(alien=>{
                    const shootingproba=Math.random();
                    if(shootingproba<1/opponentshootrate){
                        console.log("alien shoot");
                        const alienbullet=document.createElement("div");
                        alienbullet.className="bullet";
                        alienbullet.style.top=alien.style.top;
                        alienbullet.style.left=alien.style.left;
                        alienbullet.innerHTML="<img src='ennemybullet.png' width=2>";
                        ennemybullets.push(alienbullet);
                        gameframe.append(alienbullet);
                    }
                })
            })

            for (let index = 0; index < ennemybullets.length; index++) {
                const bullet = ennemybullets[index];
                bullet.style.top=parseInt(bullet.style.top)+ennemyspeed*5+"px";
                if(parseInt(bullet.style.top)>gameframe.innerHeight){
                    ennemybullets.splice(index,1);
                    bullet.remove();
                }
                if(intersect(bullet,spaceship)){
                    pv--;
                    lifedisplayer.textContent=pv;
                    ennemybullets.splice(index,1);
                    bullet.remove();
                }
            }



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


            for (let index = 0; index < bullets.length; index++) {
                const element = bullets[index];
                element.style.top=parseInt(window.getComputedStyle(element).top)-bulletspeed+"px";
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
                               if(intersect(entity,bullet) )
                            {
                                score+=ennemyspeed;
                                const givebonus=Math.random();
                                console.log(givebonus);
                                if(givebonus>0.9){
                                    const bonusindex=Math.floor(Math.random()*bonustypes.length);
                                    const bonustype=bonustypes[bonusindex];
                                    new Bonus(bonustype,entity);
                                }
                                scordisplayer.textContent=score;
                                const expls=document.createElement("div");
                                expls.className="alien";
                                expls.innerHTML="<img src='explosion.png' width='"+aliensize+"' heigth='"+aliensize+"' >"
                                audioboum.play();
                                expls.style.left=entity.style.left;
                                expls.style.top=entity.style.top;
                                setTimeout(()=>expls.remove(),200);
                                gameframe.append(expls);
                                bullet.remove();
                                bullets.splice(j,1);
                                entity.remove();
                                row.splice(m,1);
                            }
                        }
                }
            }    const rectbullet=bullet.getBoundingClientRect();
                 
            for(i=0;i<bonuss.length;i++){
                const bonustype=bonuss[i].type;
                const bonusdiv=bonuss[i].bonusdiv;
                if(intersect(bonusdiv,spaceship)){
                    console.log("bonus= "+bonustype);
                    switch(bonustype){
                        case "life":{
                            console.log("found life");
                            if(pv<10){
                                pv++;
                                lifedisplayer.textContent=pv;
                            }
                            break;
                        }
                        case "faster":{
                            if(!activbonuss.includes("faster")){
                                console.log("faster");
                                activbonuss.push(bonustype);
                                bulletspeed=2*bulletspeed;
                                setTimeout(()=>{
                                    bulletspeed=bulletspeed*0.5;
                                    activbonuss.splice(activbonuss.indexOf("faster"),1);
                                },10000);
                            }
                        }
                        case "larger":{
                            if(!activbonuss.includes("larger")){
                                console.log("larger");
                                activbonuss.push(bonustype);
                                bulletsize=4*bulletsize;
                                setTimeout(()=>{
                                    bulletsize=bulletsize*0.25;
                                    activbonuss.splice(activbonuss.indexOf("larger"),1);
                                },10000);
                            }    
                        }
                    }
                    bonuss.splice(i,1);
                    bonusdiv.remove();
                    bonusaudio.play();
                }
                bonusdiv.style.top=parseInt(bonusdiv.style.top)+15+"px";
                if(parseInt(bonusdiv.style.top)>gameframe.offsetHeight)
                {
                    bonuss.splice(i,1);
                    bonusdiv.remove();
                }
            }
            

            for (let index = 0; index < alienrows.length; index++) {
                const entity = alienrows[index];
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
                let toolow=false;
                for(i=0;i<row.length;i++){
                    const alien=row[i];
                    switch(entity.alienmove){
                        case "rigth":
                            alien.style.left=parseInt(alien.style.left)+ennemyspeed+"px";
                            break;
                        case "left":
                            alien.style.left=parseInt(alien.style.left)-ennemyspeed+"px";
                    }
                    alien.style.top=parseInt(window.getComputedStyle(alien).top)+ennemyspeed+"px";
                    if(parseInt(alien.style.top)+aliensize>gameframe.offsetHeight){
                            alien.remove();
                            row.splice(i,1);
                            pv--;
                            lifedisplayer.textContent=pv;
                            if(pv<0){
                                clearInterval(run);
                                clearInterval(difficultychanger);
                                clearInterval(spawn);
                            }
                            toolow=true;
                            
                            
                        }
                        if(toolow)
                            alienrows.splice(index,1);

                }
            };
        }                
    }
};


const run=setInterval(gameplayloop,100);



const spawner=()=>{
    if(pv>0&&!spawpaused&&!paused){
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
        
        setTimeout(()=>{
            spawpaused=false
            ennemyspeed+=1;
        },10000);
    }
}
};

spawner();

const spawn=setInterval(spawner,spawntime);



const shooting=()=>{
    if(pv>0&&!paused){
        shootaudio.pause();
        shootaudio.currentTime = 0;
        const bullet=document.createElement("div");
        bullet.className="bullet";
        bullet.innerHTML="<img src='bullet.png' width='"+bulletsize+"'>";
        bullet.style.top=parseInt(window.getComputedStyle(spaceship).top)-10+"px";
        bullet.style.left=parseInt(window.getComputedStyle(spaceship).left)+parseInt(window.getComputedStyle(spaceship).width)/2+"px";
        shootaudio.play();
        bullets.push(bullet);
        gameframe.append(bullet);
        setTimeout(()=>shoot=false,shootdelay);
    }
};




