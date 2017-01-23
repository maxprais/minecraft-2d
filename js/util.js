// Create 'deep' copy of an object
function cloneObject(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneObject(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Couldn't clone object!");
}

// Returns random integer between a and b (inclusive). If b not provided, between 0 and a
function randNumber(a, b) {
    if (b == null || b == undefined) {
        b = a;
        a = 0;
    }
    return Math.floor(Math.random() * (b-a+1)) + a;
}