/**
 * @author paulirish / http://paulirish.com/
 * @author Josh Gibbs – uPaymeiFixit@gmail.com
 * Source: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
 * Description:
 *  Uses the official defines requestAnimationFrame as the official RequestAnimationFrame for the current browser
 *  The official RequestAnimationFrame is used to sync a callback function with the screen refresh rate
 *
 * Usage:
 *  ExampleLoop()
 *  function ExampleLoop() {
 *    requestAnimationFrame( ExampleLoop )
 *    //do stuff
 *  }
 *
 * @param {function} - The function you want to call for the next animation frame
 */

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame   ||
    window.mozRequestAnimationFrame      ||
    window.oRequestAnimationFrame        ||
    window.msRequestAnimationFrame       ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
