const fs = require('fs');
const path = require('path');

var auth_module = {};
var content_module ={};
var modules = [];
var users = [];
var user_module = [];

problems(); 

function problems(){
    solveProblemA();
    saveResultA();

    var solution = solveProblemB();
    saveResultB(solution);

}


function solveProblemA(){

    for (var i = 0; i < 20; i++) {
        filename = '../data/u'+i+'.json';
        var str = JSON.parse(fs.readFileSync(filename).toString());
        var provider = str.provider;
        var am = provider.auth_module;
        var cm = provider.content_module;
        var user = "./u"+i+".json";
    
        addAuthModule(am, user);
        addContentModule(cm, user);
        
        addToList(modules, am);
        addToList(modules, cm);
        addToList(users, user);

        user_am = [user, am];
        user_cm = [user, cm];
        user_module.push(user_am);
        user_module.push(user_cm);
    }
}

function addAuthModule(am, user){
    var exists = auth_module[am];
    if(!exists){
        auth_module[am] = [user];
    }
    else{
        auth_module[am].push(user);
    }
}

function addContentModule(cm, user){
    var exists = content_module[cm];
    if(!exists){
        content_module[cm] = [user];
    }
    else{
        content_module[cm].push(user);
    }
}
function addToList(list, elem){
    if (list.indexOf(elem)==-1) list.push(elem);
}

function saveResultA(){
    let data = { 
        auth_module: auth_module,
        content_module: content_module
    };
    fs.writeFileSync(path.resolve(__dirname, 'resultPartA.json'), JSON.stringify(data));
}

function solveProblemB(){

    var actualSol = []; 
    var bestSol = users; 
    var pos = 0;
    var sol = bt(modules, users, actualSol, bestSol, pos);

    return sol;

}

function bt(modules, users, actualSol, bestSol, pos){

    if(modules.length == 0){
        if(actualSol.length < bestSol.length){
            bestSol = actualSol;            
        }
    }
    else{
        var user = users[pos];
        addToList(actualSol, user);
        var modulesToDelete = getModulesToDelete(user);
        deleteModule(modules, modulesToDelete);
        pos = pos+1;
        bt(modules, users, actualSol, bestSol, pos);   
    }
    return actualSol;
}

function getModulesToDelete(user){
    var result = [];
    for(var i = 0; i < user_module.length; i++){

        var elem = user_module[i][0];

        if(elem == user){
            result.push(user_module[i][1]);
        }
    }
    return result;
}

function deleteModule(modules, modulesToDelete){

    for(var i = 0; i < modulesToDelete.length; i++){
        var m = modulesToDelete[i];
        var index = modules.indexOf(m);
        if(index > -1 )modules.splice(index, 1);
    }

}

function saveResultB(solution){
    let data = { 
        users: solution,
    };
    fs.writeFileSync(path.resolve(__dirname, 'resultPartB.json'), JSON.stringify(data));
}


