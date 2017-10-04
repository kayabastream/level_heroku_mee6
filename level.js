async function level (msg, xp){
    if(xp <= 100) {
        // Le niveau 1
        console.log('1');
        return 1;
    } else if (xp <= 300 && xp >= 100){
        // niveau 2 
        console.log('2');
        return 2;
    }
    return 'erreur'
}

exports.xp = level;