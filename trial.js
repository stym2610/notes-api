var a = [1,2,3,4,5];
var x = a.find(num => num == 2);
var y = a.filter(num => {
    return num == 2;
});
console.log(x,y);