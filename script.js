let health = 100;
let gold = 50;
let xp = 0;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");

const locations = [
    {
        name: "Town",
        buttons_text: ["Go to store","Go to cave","Fight Dragon"],
        buttons_functions: [goStore,goCave,fightDragon],
        text: "You are in a town square. It has a sign that says \"Go Store\" " 
    },

    {
        name: "Store",
        buttons_text: ["Buy Health (10 Gold)","Buy Weapon (30 Gold)","Go back to town"],
        buttons_functions: [buyHealth,buyWeapon,goTown],
        text: "You just entered the store" 
    },

    {
        name: "Cave",
        buttons_text: ["Fight slime", "Fight Fanged Beasts", "Go to town sqaure"],
        buttons_functions: [fightSlime,fightBeasts,goTown],
        text: "You entered the cave. You see some monsters"
    },

    {
        name: "Fight",
        buttons_text: ["Attack","Doge","Run"],
        buttons_functions: [attack,doge,goTown],
        text: "You are now fighting the monster" 
    },

    {
        name: "Kill Monster",
        buttons_text: ["Fight slime", "Fight Fanged Beasts", "Go to town sqaure"],
        buttons_functions: [fightSlime,fightBeasts,goTown],
        text: "The monster screams \"Arg\" and dies. You've gained gold and XP"
    },

    {
        name: "Lost",
        buttons_text: ["Restart","Restart","Restart"],
        buttons_functions: [restart,restart,restart],
        text: "You've lost the game" 
    },

    {
        name: "Win Game",
        buttons_text: ["Go to town","Go to store","Go to cave","Restart"],
        buttons_functions: [goTown,goStore,goCave,restart],
        text: "You win the game, Yayyy..." 
    },
];

const weapons = [
    {
        name: "Stick",
        power: 5
    },
    {
        name: "Dagger",
        power: 30
    },
    {
        name: "Claw Hammer",
        power: 50
    },
    {
        name: "Sword",
        power: 100
    }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15
    },

    {
        name: "Fanged Beast",
        level: 8,
        health: 60
    },

    {
        name: "Dragon",
        level: 20,
        health: 300
    }
]

function update(location)
{
    button4.style.display = "none";

    button1.innerText = location.buttons_text[0];
    button2.innerText = location.buttons_text[1];
    button3.innerText = location.buttons_text[2];
    button1.onclick = location.buttons_functions[0];
    button2.onclick = location.buttons_functions[1];
    button3.onclick = location.buttons_functions[2];
    text.innerText = location.text;

    if(location.name == "Lost"){
        button2.style.display = "none";
        button3.style.display = "none";
    }
    else{
        button2.style.display = "inline";
        button3.style.display = "inline";
    }

    if(location.name == "Win Game"){
        button4.innerText = location.buttons_text[3];
        button4.onclick = location.buttons_functions[3];
        button4.style.display = "inline";
    }
}

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.style.display = "none";


function goTown(){
    monsterStats.style.display = "none";
    update(locations[0]);
}

function goStore(){
    monsterStats.style.display = "none";
    update(locations[1]);
}

function goCave(){
    monsterStats.style.display = "none";
    update(locations[2]);
}

function buyHealth(){
    if(gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else{
        text.innerText = "You don't have enough gold";
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if(gold >= 30){
            gold -= 30;
            goldText.innerText = gold;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += "\n Your Inventory now contains : " + inventory;
        }
        else{
            text.innerText = "You don't have enough gold";
        }
    }
    else{
        text.innerText = "You already have the most powerfull weapon!";
        button2.innerText = "Sell Weapon";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currwep = inventory.shift();
        text.innerText = "You just sold a " + currwep;
        text.innerText += "\n You have in your inventory " + inventory;
    }
    else{
        text.innerText = "You can't sell your only weapon";
    }
}

function fightSlime(){
    fighting = 0;
    goFight();
}

function fightBeasts(){
    fighting = 1;
    goFight();
}


function fightDragon(){
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterStats.style.display = "block";
    monsterHealth = monsters[fighting].health;
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack(){  
    text.innerText = "The monster " + monsters[fighting].name + " attacks";
    text.innerText += "\nYou attack with " + weapons[currentWeapon].name;
    health -= monsters[fighting].level;
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    health = Math.max(health,0);
    monsterHealth = Math.max(monsterHealth,0);
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if(health == 0){
        lose();
    }
    else if(monsterHealth == 0){
        if(fighting == 2){
            winGame();
        }
        else{
            monsterDefeat();
        }
    }
}

function doge(){
    text.innerText = "You doged the monster " + monsters[fighting].name;
}

function monsterDefeat(){
    gold += Math.floor(monsters[fighting].level*6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose(){
    update(locations[5]);
}

function restart(){
    monsterStats.style.display = "none";
    health = 100;
    gold = 50;
    xp = 0;
    currentWeapon = 0;
    fighting;
    monsterHealth;
    inventory = ["Stick"];

    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    update(locations[0]);
}

function winGame(){
    update(locations[6]);
}