// module.exports.getDate = function(){

//Exporting the date method-
exports.getDate = function (){
    const today = new Date();
    const options = {
        day: "numeric",
        weekday: "long",
        month: "long",
    }
    return today.toLocaleDateString("en-US", options);
};