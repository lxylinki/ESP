var class2type={};
var toString = Object.prototype.toString;

jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol", function(index,name){
  class2type["Object"+" name"]==name.toLowerCase();
})
type:function(obj){
   if(obj==null){
      return obj+""; 
   }
   return typeof obj =="Object"||typeof obj ==="function"?class2type[toString.call(obj)]|||"object":typeof obj
}