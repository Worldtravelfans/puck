(function(window, $, undefined) {
// ## jquery/lang/json/json.js

    /**
     * @page jQuery.toJSON jQuery.toJSON
     * @parent jquerymx.lang
     * 
     *     jQuery.toJSON( json-serializble )
     * 
     * Converts the given argument into a JSON respresentation.
     * 
     * If an object has a "toJSON" function, that will 
     * be used to get the representation.
     * Non-integer/string keys are skipped in the 
     * object, as are keys that point to a function.
     * 
     * json-serializble:
     * The *thing* to be converted.
     */
    $.toJSON = function(o, replacer, space, recurse)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o, replacer, space);

        if (!recurse && $.isFunction(replacer))
            o = replacer("", o);

        if (typeof space == "number")
            space = "          ".substring(0, space);
        space = (typeof space == "string") ? space.substring(0, 10) : "";
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined" || type == "function")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON(), replacer, space, true );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            var process = ($.isFunction(replacer)) ?
                function (k, v) { return replacer(k, v); } :
                function (k, v) { return v; },
                nl = (space) ? "\n" : "",
                sp = (space) ? " " : "";

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(( $.toJSON( process(i, o[i]), replacer, space, true ) || "null" ).replace(/^/gm, space));

                return "[" + nl + ret.join("," + nl) + nl + "]";
            }
        
            var pairs = [], proplist;
            if ($.isArray(replacer)) {
                proplist = $.map(replacer, function (v) {
                    return (typeof v == "string" || typeof v == "number") ?
                        v + "" :
                        null;
                });
            }
            for (var k in o) {
                var name, val, type = typeof k;

                if (proplist && $.inArray(k + "", proplist) == -1)
                    continue;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                val = $.toJSON( process(k, o[k]), replacer, space, true );
            
                if (typeof val == "undefined")
                    continue;  //skip pairs where the value is a function.
            
                pairs.push((name + ":" + sp + val).replace(/^/gm, space));
            }

            return "{" + nl + pairs.join("," + nl) + nl + "}";
        }
    };

    /** 
     * @function jQuery.evalJSON
     * Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** 
     * @function jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** 
     * @function jQuery.quoteString
     * 
     * Returns a string-repr of a string, escaping quotes intelligently.  
     * Mostly a support function for toJSON.
     * 
     * Examples:
     * 
     *      jQuery.quoteString("apple") //-> "apple"
     * 
     *      jQuery.quoteString('"Where are we going?", she asked.')
     *        // -> "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };

 // ## jquery/dom/cookie/cookie.js

    /**
     * @function jQuery.cookie
     * @parent jquerypp
     * @plugin jquery/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     * `jQuery.cookie(name, [value], [options])` lets you create, read and remove cookies. It is the
     * [jQuery cookie plugin](https://github.com/carhartl/jquery-cookie) written by [Klaus Hartl](stilbuero.de)
     * and dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php)
     * and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
     *
     * ## Examples
     * 
     * Set the value of a cookie.
     *  
     *      $.cookie('the_cookie', 'the_value');
     * 
     * Create a cookie with all available options.
     *
     *      $.cookie('the_cookie', 'the_value', {
     *          expires: 7,
     *          path: '/',
     *          domain: 'jquery.com',
     *          secure: true
     *      });
     *
     * Create a session cookie.
     *
     *      $.cookie('the_cookie', 'the_value');
     *
     * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
     * used when the cookie was set.
     *
     *      $.cookie('the_cookie', null);
     *
     * Get the value of a cookie.
     *
     *      $.cookie('the_cookie');
     *
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {Object} [options] An object literal containing key/value pairs to provide optional cookie attributes. Values can be:
     *
     * - `expires` - Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
     * - `domain` - The domain name
     * - `path` - The value of the path atribute of the cookie (default: path of page that created the cookie).
     * - `secure` - If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
     *
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     */
    $.cookie = function(name, value, options) {
        if (typeof value != 'undefined') {
            // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            // convert value to JSON string
            if (typeof value == 'object' && $.toJSON) {
                value = $.toJSON(value);
            }
            var expires = '';
            // Set expiry
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            // Set the cookie name=value;expires=;path=;domain=;secure-
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        // Get the cookie value
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            // Parse JSON from the cookie into an object
            if ($.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = $.evalJSON(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };

    // ## jquery/dom/styles/styles.js

    var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
        // The following variables are used to convert camelcased attribute names
        // into dashed names, e.g. borderWidth to border-width
        rupper = /([A-Z])/g,
        rdashAlpha = /-([a-z])/ig,
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        },
        // Returns the computed style for an elementn
        getStyle = function( elem ) {
            if ( getComputedStyle ) {
                return getComputedStyle(elem, null);
            }
            else if ( elem.currentStyle ) {
                return elem.currentStyle;
            }
        },
        // Checks for float px and numeric values
        rfloat = /float/i,
        rnumpx = /^-?\d+(?:px)?$/i,
        rnum = /^-?\d/;

    // Returns a list of styles for a given element
    $.styles = function( el, styles ) {
        if (!el ) {
            return null;
        }
        var  currentS = getStyle(el),
            oldName, val, style = el.style,
            results = {},
            i = 0,
            left, rsLeft, camelCase, name;

        // Go through each style
        for (; i < styles.length; i++ ) {
            name = styles[i];
            oldName = name.replace(rdashAlpha, fcamelCase);

            if ( rfloat.test(name) ) {
                name = $.support.cssFloat ? "float" : "styleFloat";
                oldName = "cssFloat";
            }

            // If we have getComputedStyle available
            if ( getComputedStyle ) {
                // convert camelcased property names to dashed name
                name = name.replace(rupper, "-$1").toLowerCase();
                // use getPropertyValue of the current style object
                val = currentS.getPropertyValue(name);
                // default opacity is 1
                if ( name === "opacity" && val === "" ) {
                    val = "1";
                }
                results[oldName] = val;
            } else {
                // Without getComputedStyles
                camelCase = name.replace(rdashAlpha, fcamelCase);
                results[oldName] = currentS[name] || currentS[camelCase];

                // convert to px
                if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) {
                    // Remember the original values
                    left = style.left;
                    rsLeft = el.runtimeStyle.left;

                    // Put in the new values to get a computed value out
                    el.runtimeStyle.left = el.currentStyle.left;
                    style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
                    results[oldName] = style.pixelLeft + "px";

                    // Revert the changed values
                    style.left = left;
                    el.runtimeStyle.left = rsLeft;
                }

            }
        }

        return results;
    };

    /**
     * @function jQuery.fn.styles
     * @parent jQuery.styles
     * @plugin jQuery.styles
     *
     * Returns a set of computed styles. Pass the names of the styles you want to
     * retrieve as arguments:
     *
     *      $("div").styles('float','display')
     *      // -> { cssFloat: "left", display: "block" }
     *
     * @param {String} style pass the names of the styles to retrieve as the argument list
     * @return {Object} an object of `style` : `value` pairs
     */
    $.fn.styles = function() {
        // Pass the arguments as an array to $.styles
        return $.styles(this[0], $.makeArray(arguments));
    };

    // ## jquery/dom/dimensions/dimensions.js


var
    //margin is inside border
    weird = /button|select/i,
    getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    },
    supportsSetter = $.fn.jquery >= '1.8.0';

$.each({ 

/**
 * @function jQuery.fn.outerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerWidth([value], [includeMargins])` lets you set
 * the outer width of an object where:
 *
 *      outerWidth = width + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerWidth(100); //sets outer width
 *      $("#foo").outerWidth(100, true); // uses margins
 *      $("#foo").outerWidth(); //returns outer width
 *      $("#foo").outerWidth(true); //returns outer width + margins
 *
 * When setting the outerWidth, it adjusts the width of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer width:
 * 
 *      $('#foo').animate({ outerWidth: 200 });
 *
 * @param {Number} [width] The width to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerWidth adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer width or the jQuery wrapped elements
 * if you are setting the outer width.
 */
width: 
/**
 * @function jQuery.fn.innerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerWidth([value])` lets you set the inner width of an element where
 * 
 *      innerWidth = width + padding
 *      
 * Use it like:
 *
 *      $("#foo").innerWidth(100); //sets inner width
 *      $("#foo").outerWidth(); // returns inner width
 *      
 * Or in an animation like:
 * 
 *      $('#foo').animate({ innerWidth : 200 });
 *
 * Setting inner width adjusts the width of the element.
 *
 * @param {Number} [width] The inner width to set
 * @return {jQuery|Number} Returns the inner width or the jQuery wrapped elements
 * if you are setting the inner width.
 */
"Width", 
/**
 * @function jQuery.fn.outerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerHeight([value], [includeMargins])` lets
 * you set the outer height of an object where:
 *
 *      outerHeight = height + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerHeight(100); //sets outer height
 *      $("#foo").outerHeight(100, true); // uses margins
 *      $("#foo").outerHeight(); //returns outer height
 *      $("#foo").outerHeight(true); //returns outer height + margins
 *
 * When setting the outerHeight, it adjusts the height of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer heihgt:
 *
 *      $('#foo').animate({ outerHeight : 200 });
 *
 * @param {Number} [height] The height to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerHeight adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer height or the jQuery wrapped elements
 * if you are setting the outer height.
 */
height: 
/**
 * @function jQuery.fn.innerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerHeight([value])` lets you set the inner height of an element where
 *
 *      innerHeight = height + padding
 *
 * Use it like:
 *
 *      $("#foo").innerHeight(100); //sets inner height
 *      $("#foo").outerHeight(); // returns inner height
 *
 * Or in an animation like:
 *
 *      $('#foo').animate({ innerHeight : 200 });
 *
 * Setting inner height adjusts the height of the element.
 *
 * @param {Number} [height] The inner height to set
 * @return {jQuery|Number} Returns the inner height or the jQuery wrapped elements
 * if you are setting the inner height.
 */
// for each 'height' and 'width'
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.styles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
    if(!supportsSetter) {
        $.fn["outer" + Upper] = function(v, margin) {
            var first = this[0];
            if (typeof v == 'number') {
                // Setting the value
                first && this[lower](v - getBoxes[lower](first, {padding: true, border: true, margin: margin}))
                return this;
            } else {
                // Return the old value
                return first ? checks["oldOuter" + Upper].apply(this, arguments) : null;
            }
        }
        $.fn["inner" + Upper] = function(v) {
            var first = this[0];
            if (typeof v == 'number') {
                // Setting the value
                first&& this[lower](v - getBoxes[lower](first, { padding: true }))
                return this;
            } else {
                // Return the old value
                return first ? checks["oldInner" + Upper].apply(this, arguments) : null;
            }
        }
    }

    //provides animations
    var animate = function(boxes){
        // Return the animation function
        return function(fx){
            if (fx[supportsSetter ? 'pos' : 'state'] == 0) {
                fx.start = $(fx.elem)[lower]();
                fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
            }
            fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
        }
    }
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
    $.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
    $.fx.step["inner" + Upper] = animate({padding: true})

})

// ## jquery/dom/form_params/form_params.js

    var
        // use to parse bracket notation like my[name][attribute]
        keyBreaker = /[^\[\]]+/g,
        // converts values that look like numbers and booleans and removes empty strings
        convertValue = function( value ) {
            if ( $.isNumeric( value )) {
                return parseFloat( value );
            } else if ( value === 'true') {
                return true;
            } else if ( value === 'false' ) {
                return false;
            } else if ( value === '' || value === null ) {
                return undefined;
            }
            return value;
        },
        // Access nested data
        nestData = function( elem, type, data, parts, value, seen, fullName ) {
            var name = parts.shift();
            // Keep track of the dot separated fullname. Used to uniquely track seen values
            // and if they should be converted to an array or not
            fullName = fullName ? fullName + '.' + name : name;

            if (parts.length ) {
                if ( ! data[ name ] ) {
                    data[ name ] = {};
                }

                // Recursive call
                nestData( elem, type, data[ name ], parts, value, seen, fullName);
            } else {

                // Handle same name case, as well as "last checkbox checked"
                // case
                if ( fullName in seen && type != "radio" && ! $.isArray( data[ name ] )) {
                    if ( name in data ) {
                        data[ name ] = [ data[name] ];
                    } else {
                        data[ name ] = [];
                    }
                } else {
                    seen[ fullName ] = true;
                }

                // Finally, assign data
                if ( ( type == "radio" || type == "checkbox" ) && ! elem.is(":checked") ) {
                    return
                }

                if ( ! data[ name ] ) {
                    data[ name ] = value;
                } else {
                    data[ name ].push( value );
                }
                

            }

        };

    /**
     * @function jQuery.fn.formParams
     * @parent jQuery.formParams
     * @plugin jquery/dom/form_params
     * @test jquery/dom/form_params/qunit.html
     *
     * Returns a JavaScript object for values in a form.
     * It creates nested objects by using bracket notation in the form element name.
     *
     * @param {Object} [params] If an object is passed, the form will be repopulated
     * with the values of the object based on the name of the inputs within
     * the form
     * @param {Boolean} [convert=false] True if strings that look like numbers
     * and booleans should be converted and if empty string should not be added
     * to the result.
     * @return {Object} An object of name-value pairs.
     */
    $.fn.extend({
        formParams: function( params ) {

            var convert;

            // Quick way to determine if something is a boolean
            if ( !! params === params ) {
                convert = params;
                params = null;
            }

            if ( params ) {
                return this.setParams( params );
            } else {
                return this.getParams( convert );
            }
        },
        setParams: function( params ) {

            // Find all the inputs
            this.find("[name]").each(function() {
                var $this = $(this),
                    value = params[ $this.attr("name") ];
                
                // Don't do all this work if there's no value
                if ( value !== undefined ) {
                    
                    // Nested these if statements for performance
                    if ( $this.is(":radio") ) {
                        if ( $this.val() == value ) {
                            $this.attr("checked", true);
                        }
                    } else if ( $this.is(":checkbox") ) {
                        // Convert single value to an array to reduce
                        // complexity
                        value = $.isArray( value ) ? value : [value];
                        if ( $.inArray( $this.val(), value ) > -1) {
                            $this.attr("checked", true);
                        }
                    } else {
                        $this.val( value );
                    }
                }
            });
        },
        getParams: function( convert ) {
            var data = {},
                // This is used to keep track of the checkbox names that we've
                // already seen, so we know that we should return an array if
                // we see it multiple times. Fixes last checkbox checked bug.
                seen = {},
                current;

            this.find("[name]:not(:disabled)").each(function() {
                var $this    = $(this),
                    type     = $this.attr("type"),
                    name     = $this.attr("name"),
                    value    = $this.val(),
                    parts;

                // Don't accumulate submit buttons and nameless elements
                if ( type == "submit" || ! name ) {
                    return;
                }

                // Figure out name parts
                parts = name.match( keyBreaker );
                if ( ! parts.length ) {
                    parts = [name];
                }

                // Convert the value
                if ( convert ) {
                    value = convertValue( value );
                }

                // Assign data recursively
                nestData( $this, type, data, parts, value, seen );

            });

            return data;
        }
    });

    // ## jquery/dom/within/within.js

    // Checks if x and y coordinates are within a box with left, top, width and height
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function jQuery.fn.within
 * @parent jQuery.within
 * @plugin jquery/dom/within
 * 
 * Returns all elements matching the selector that touch a given point:
 * 
 *     // get all elements that touch 200x200.
 *     $('*').within(200, 200);
 * 
 * @param {Number} left the position from the left of the page 
 * @param {Number} top the position from the top of the page
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.within= function(left, top, useOffsetCache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if (this == document.documentElement) {
            return ret.push(this);
        }

        // uses either the cached offset or .offset()
        var offset = useOffsetCache ? 
                        $.data(this,"offsetCache") || $.data(this,"offsetCache", q.offset()) :
                        q.offset();

        // Check if the given coordinates are within the area of the current element
        var res =  withinBox(left, top,  offset.left, offset.top,
                                    this.offsetWidth, this.offsetHeight );

        if (res) {
            // Add it to the results
            ret.push(this);
        }
    });
    
    return this.pushStack( $.unique( ret ), "within", left+","+top );
}


/**
 * @function jQuery.fn.withinBox
 * @parent jQuery.within
 *
 * Returns all elements matching the selector that have a given area in common:
 *
 *      $('*').withinBox(200, 200, 100, 100)
 *
 * @param {Number} left the position from the left of the page
 * @param {Number} top the position from the top of the page
 * @param {Number} width the width of the area
 * @param {Number} height the height of the area
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.withinBox = function(left, top, width, height, useOffsetCache){
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  ret.push(this);

        // use cached offset or .offset()
        var offset = useOffsetCache ? 
            $.data(this,"offset") ||
            $.data(this,"offset", q.offset()) :
            q.offset();


        var ew = q.width(), eh = q.height(),
            // Checks if the element offset is within the given box
            res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( $.unique( ret ), "withinBox", $.makeArray(arguments).join(",") );
}


})(this, jQuery);