export const math = (function() {
    return {
        randRange: function(a: number, b: number) {
            return Math.random() * (b - a) + a;
        },

        randInt: function(a: number, b: number) {
            return Math.round(Math.random() * (b - a) + a);
        },
    };
})();