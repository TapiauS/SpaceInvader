const spaceship=document.querySelector("#spaceship");
let ennemyspeed=5;
let keypressed=null;
let shoot=false;
let bullets=[];
let aliens=[];
let alienrows=[];
let spawntime=1000; 
let pv=10;
const aliensize=30;

class Alienrow{
    constructor(aliendiv){
        this.aliendiv=aliendiv;
        this.alienmove="rigth";
    };
};







document.addEventListener("keydown",event=>{
    switch(event.key){
        case "ArrowRight":
            keypressed="rigth";
            break;
        case "ArrowLeft":
            keypressed="left";
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
    switch(keypressed){
        case "rigth":{
            const position=spaceship.offsetLeft;
            spaceship.style.left=position+10+"px";
            break;
        }
        case "left":{
            const position=spaceship.offsetLeft;
            spaceship.style.left=position-10+"px";
            break;
        }
        default:
    } 

    bullets.forEach(entity=>{
            entity.style.top=parseInt(window.getComputedStyle(entity).top)-10+"px";
            if(parseInt(window.getComputedStyle(entity).top)<0){
                entity.remove();
                bullets.pop(entity);
            }
        }
    );

    aliens.forEach(entity=>{
            bullets.forEach(bullet=>{
                const alientopleftx=parseInt(entity.style.left);
                const alientoplefty=parseInt(entity.style.top);
                const bullettopleftx=parseInt(bullet.style.left);
                const bullettoplefty=parseInt(bullet.style.top);



                const alienwidth=parseInt(entity.offsetWidth);
                const alienheigth=parseInt(entity.innerHTML.height);
                const bulletwidth=parseInt(bullet.offsetWidth);
                const bulletheigth=parseInt(bullet.offsetHeight);


                const alienbottomrigthx=alientopleftx+alienwidth;
                const alienbottomrigthy=alientoplefty+alienheigth;
                const bulletbottomrigthx=bullettopleftx+bulletwidth;
                const bulletbottomrigthy=bullettoplefty+bulletheigth;


                
                console.log("alienwidth= "+alienwidth);
                console.log("alienheigth= "+alienheigth);


                if( !(alientopleftx  >  bulletbottomrigthx )&&!(  alienbottomrigthx  <  bullettopleftx  )&&!(alientoplefty<bulletbottomrigthy)&&!(alienbottomrigthy  >  bullettoplefty))
                {
                    // bullet.remove();
                    // bullets.pop(bullet);
                    // entity.remove();
                    // aliens.pop(entity);
                }
            })
        });

    alienrows.forEach(entity=>{
        const row=entity.aliendiv;
        row.style.top=parseInt(window.getComputedStyle(row).top)+10+"px";
        switch(entity.alienmove){
            case "rigth":
                row.style.left=parseInt(window.getComputedStyle(row).left)+5+"px";
                if((parseInt(window.getComputedStyle(row).left)+parseInt(row.offsetWidth))>window.innerWidth){
                    entity.alienmove="left";
                }
                break;
            case "left":
                row.style.left=parseInt(window.getComputedStyle(row).left)-5+"px";
                if(parseInt(window.getComputedStyle(row).left)<0){
                    entity.alienmove="rigth";
                }    
        }



        if(parseInt(window.getComputedStyle(row).top)+parseInt(window.getComputedStyle(row).height)>window.innerHeight){
            const childs=row.childNodes;
            childs.forEach(alien=>{
                    alien.remove();
                    pv--;
                if(pv<0){
                    clearInterval(run);
                    clearInterval(difficultychanger);
                    clearInterval(spawn);
                }
            });
            row.remove();
            alienrows.pop(entity);
        }
    });


};

const run=setInterval(gameplayloop,100);
const difficultychanger=setInterval(()=>spawntime=spawntime*0.9,1000);


const spawner=()=>{
    const alienrow=document.createElement("div");
    alienrow.className="alienrow";
    document.body.append(alienrow);
    alienrows.push(new Alienrow(alienrow));
    for(i=0;i<20;i++){
        const newennemy=document.createElement("div");
        newennemy.className="alien";
        alienrow.append(newennemy);
        newennemy.innerHTML='<img src="opponent.png" width='+aliensize+' heigth='+aliensize+'>';
        newennemy.style.left=window.innerWidth*i/20+"px";
        aliens.push(newennemy);    
    }
    
};

const spawn=setInterval(spawner,spawntime);




const shooting=()=>{
    const bullet=document.createElement("div");
    bullet.className="bullet";
    bullet.style.top=parseInt(window.getComputedStyle(spaceship).top)+"px";
    bullet.style.left=parseInt(window.getComputedStyle(spaceship).left)+parseInt(window.getComputedStyle(spaceship).width)/2+"px";
    bullets.push(bullet);
    document.body.append(bullet);
    setTimeout(()=>shoot=false,500);
};




