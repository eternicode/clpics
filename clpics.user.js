// ==UserScript==
// @name        CLPics
// @version     0.8.9
// @author      Andrew Rowls <andrew@eternicode.com>
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAAEhFhW+AAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAcBJREFUOMuFkbFO60AQAOcpOhc2f0Ad6aKEgBRZub0oH0JDQ5W/Mg11+AoULJGGxlh7kfIKQCGp6fwKY2JI0JtqNR6t72wwxmAywASAPM/pGAOiQ0Vu+0qZ5xWdmYiI7DCiXQTFiHVIolDVQGSMMRGEVESkLygrOwdBuUi0Hk6HoR58bKcIj4s8z/P7lKJeM4Ys6BdBLZGm7CkFo0K4/JiyngBaC/2c9+Kt8uhuM0CFKPRbOwoPD1WbEfTS0Z5xzOeFjDHGRB3AavtgGciuLw3pLICUrZekCqJYXWUM54DUQl6vtkzWLfHMGaIt0cyN8E8nd/hiL1y1WeOqMG9E7LwldpMhotRpQz9AWt3nDYvyEUbfbv8A42+igHjc+hxpD4itEy9H8OJsDDitdkWpB5TFrlIHkQ9F+ze0D1kED0ZUBWLrvHc2hmQwSOqgfvIZOK3eNtXaw/T9fXok8OHp9OT2btjog0BUJ219JHi+oHuWgGiZHgvC6+XVx3YKEnazgQyTH4HNdLXSzILNNPzdzgdNEO1X/iQtVaDjipfr7vnogPPu9UvhgNGi+pXFCEiXvwfLFOjdFMv8KMvipsf/+PMPAX2RA5BR3zYAAAAASUVORK5CYII=
// @namespace   http://github.com/eternicode/clpics
// @description Inlines image previews with customizable zoom and text-preview.
// @license     MIT

// @noframes
// @run-at      document-end
// @match       https://*.craigslist.org/*
// @match       http://*.craigslist.org/*
// @match       https://*.craigslist.ca/*
// @match       http://*.craigslist.ca/*
// @exclude     https://*.craigslist.org/static/localstorage.html*
// @exclude     http://*.craigslist.org/static/localstorage.html*
// @exclude     https://*.craigslist.ca/static/localstorage.html*
// @exclude     http://*.craigslist.ca/static/localstorage.html*
// @require     https://www.craigslist.org/js/general-concat.min.js?v=8a1701132ee120b06085b460053658a6
// @require     https://www.craigslist.org/js/leaflet-concat.min.js?v=1218ae639adbe8ffc16f31004007113d

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==

(function() {

var images = {
        errord: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAAEhyb7BAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAfFJREFUOMuVk6+O8lAQxX8t6AUMgaQEgsItpKDW4vsMRdRisDwBppUgsGtWbBMeAwFvAAlmE1I2KAw9n2Bb/i7Z7yRX3NwzM2dmzjUkiR+YAL1e73STpCiK5LqujIRmeJ6nOI4xoihSynNdV4C63a4kyQSoVqt8fHxQqVQAMC5rARiAms0m2+2WRqNB1vM8jscjkshmsxjz+Vyz2YxisXiKGY1GiqIoPYYk9Xo9ptMptwiC4Fy53W5TLBYplUo4jsNqtQKg3++fSZPJhN1ux9fXFwDf399YloVlWQBkAfb7PZlMhuFwCEChUCAMQ8IwZDqd3jf6CGYQBKnAW6RLSIba7XZlWZZ+JpYOXJJM27bZ7XbkcjkGgwGfn5+0Wi0cxyFRYnieJ4A4jonjGEmYpkkmk2E8Hp802baNbduUy2Ukkc/neXl5oV6vM5lMzqTj8chms6HT6fD29kYul+NwOOB53kl14pz39/d0V5Lk+75835ck4bru1TIvz2g0OpESfyVR/wPf9+W6riSdPRwEAcvlktfXV2q1Go7jPFxCGIasVquUe2WU30i1Wo1qtQrAer2+e7ssdueTxWJxFwTcJW82m1dKs7fSbwnL5RLgaZKHih61Bzxt6y7R7cAvqz9qORl0mugyweXjM9zG/OlT/gX/AAHou1e9S2AQAAAAAElFTkSuQmCC',
        flagged: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASAgMAAAFcp1ZSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAxQTFRF1JI33iIi/ycn////9M3WqQAAAFRJREFUCFtj+MPwhuEPwweGBUD8/ADDfyBi0GfQZrAHwv9A3qnsAwznZwMxSAaKT4FwPgSfB8n/R+D/QPABSn5YFQ8mo/aDyGnrgeT/a2ASLItQCQD9hFHkkbViJQAAAABJRU5ErkJggg==',
        load_ad: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAAGuqymWAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAASJJREFUKM+tkr1xwlAQhL/VENAADVANLkAUQEhCKAeEJIQKzAwOKAAVgAvAmdQCmUVAbl62DiQjJNvg8fiCN/e3d7d3T7YBIAL2r3tAF1+tRU0GgG3b5/dzpdTu9fM6TdMWvMaEEEIItZHneZ7ntVEUeVEUXUzL6Ejvoh0Oh0oZDoct3DbLBFUJyUAcj1s1kyQBlsvl/X4RP0szSwgBg+j3+91YeSwB3Mx5FXs7CpBbHLZZJpsqAsA4jps50zSl6gaz2azLIUkewRdyd/jdit2QiD9J76vrdDrxSad6B4PBfVhZlkhgLGF/B6u57XYvovoNYKEmwwCWZYz0MBp1V7LZbMBGugJZloWYTCa3NrlYLDqe+Xz+2wNMp1PQavX0n3f7AGHSqDCS8xdMAAAAAElFTkSuQmCC',
        show_preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAAHT56PyAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABVQTFRFAAAAMzMzZmZmmZmZzMzM7u7u////GHb4AAAAAFxJREFUCFutirENwgAQxLxCGgb4InWkX+FFTXOpL0Bu/xEowghpLMsyMW9zvgiFMOY7JgGoYgaJJDHHkphPd2+c2uN/vwhglkdiqmo13d1mZp5G2mMk6fqTJHfbD7vKOqrMBxubAAAAAElFTkSuQmCC',
        // Map pin icon derived from http://www.easyicon.net/language.en/1147919-map_icon.html
        show_map: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAGLwHZKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABNUlEQVQoz23RsWtTURgF8N9L4muqiEg6WBAV6ihOWToLurq2U7Fr/gKRTh2K4KJb6eri5CKCFLoVcXBysENBoSB0MQQh2rzn5/DubaLm3OVyvsM557sXbtAGNbyXceIntAqc+mBsrRmEUdZcp9AxsKJPx7GO/UYTWfMsXxbVhs5UmSiFrhDuCGVDPlQJISxnXaEvhEvkrlx1TeXsvK63wrGwpWiIJaHniGmXW4beCY8bqoORKwYuuG0GE7VQ+XYeZ0MlVO5OVYVfwpecl7cMc7Dgia9psY/W/x0X2PbbDwMXdfXsCrV7iql96aYwdtnL5PTIanrqklaS1ejq2/Mdn712n+YzM1rayWPslacOhErYNLVJkZ9MUlhzXqS2M2jjMI0r4bm5KLCTZA9m9/ofK97o/k39Ad6gbZu23H5+AAAAAElFTkSuQmCC',
        grip: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAlklEQVQ4y51RwREEIQhLrAwqx85yn3UHXfVG81EIiYBARkQIIzQveS76VEgSc1BrBXMAAMwBABALdBYzAgDcHSUTEaFaK9z9FZQV8cyDfxB3ZEQsp1CzLyvSzKZ7eMm8rEyqTdXOLRkR4mi7sj+CJLVXeSok2f0Ab4VmBpJ7g52w5XgrnHZwIuw6uBHmJWpMuntXOMYZP6Jv1US6s0WlAAAAAElFTkSuQmCC',
    },
    locales = {
        'en-US': {
            flagged: "(flagged)",
            imageshosted: "(images hosted at {urls})",
            togglepreview: "Toggle preview text display",
            nofetch: "Text/image preview not available",
            loadad: "Load preview",
            flag: {
                title: "Please <a href='{info_link}'>flag</a> with care",
                prohibited: "<a href='{link}' title='Violates craigslist Terms Of Use or other posted guidelines'>prohibited</a>",
                bestof: "<a href='{link}' title='Should be considered for inclusion in the Best-Of-Craigslist'>best of craigslist</a>",
                thanks: "Thanks for flagging.",
            },
            togglemap: "Toggle map display",
            prefspane: {
                link: "clpics",
                title: "CLPics Preferences",
                enable: "Enable",

                imagepreview: "Show Image Previews",
                resizeimages: "Resize Images",
                    resizeby: "Resize by:",
                    percscale: "% Scale",
                        percscaletooltip: "Images will be scaled down to a percentage of their original size.",
                        imagescale: "Image Scale",
                    maxheight: "Max Height",
                        maxheighttooltip: "Images will be scaled down to be shorter than the given height.",
                    maxwidth: "Max Width",
                        maxwidthtooltip: "Images will be scaled down to be thinner than the given width.",
                fullsizeonhover: "Fullsize on hover",
                after: "after",

                otherimagesettings: "Other Image Settings",
                    limitimages: "Limit # images (0 for unlimited)",
                        limitimagestooltip: "Limits the number of images displayed for each listing; eg, when set to 2, each listing may show a maximum of 2 images, even if it has 4.",
                    domainlimit: "Show only craigslist.org images",
                        domainlimittooltip: "Don't display images hosted on external sites (for example, those used in many car sales listings).",

                mappreview: "Show Map Previews",

                textpreview: "Show Text Previews",
                    restrictpreviewheight: "Restrict preview height",
                        previewheight: "Max Preview Height",

                load: "Loading method",
                    loadallatonce: "All at once",
                        loadallatoncetooltip: "Load all previews on page load -- heavier on bandwidth",
                    loadonview: "When visible",
                        loadonviewtooltip: "Load preview when ad is scrolled to -- lighter on bandwidth",
                    loadselective: "Selectively",
                        loadselectivetooltip: "Load preview when download indicator is clicked -- REALLY light on bandwidth",

                willtakeeffect: "Changes will take effect next time you load a listings page",
                clear: "&times; Reset settings",
                'import': "Import settings",
                save: "Save",
            },
        },
    };

// Required for maps to work under Greasemonkey
CL.extend('maps', {
    clMapsUrl: unsafeWindow.maptileBaseUrl,});

function interpolate(string) {
    var args = Array.prototype.slice.call(arguments, 1),
        placeholder = /\{(\w+)}/;

    if (args.length === 1 && $.isPlainObject(args[0]))
        args = args[0];

    if ($.isArray(args))
        while (args.length && string.indexOf('{}') !== -1)
            string = string.replace('{}', args.shift());
    else {
        while (placeholder.test(string))
            string = string.replace(placeholder, args[RegExp.$1]);
    }

    return string;
}

function get_locale(){
    var lang = window.navigator.language;

    if (!(lang in locales))
        lang = 'en-US';

    return locales[lang];
}

function locale(key){
    var args = arguments,
        str;

    key = key.split('.');
    str = get_locale();
    for (var i=0; i<key.length; i++)
        str = str[key[i]];
    args[0] = String(str);

    return interpolate.apply(this, args);
}


// Yes, it's ugly.  But it's the prettiest multiline strings we get.
var prefs_panel = function() {/*

<blockquote class="searchform" id="clpprefs">
    <style>
        #clpprefs {
            position: fixed;
            z-index: 1010;
            top: 3em;
            left: 15%;
            width: 80%;
        }
        #clpprefs .loadmethod {
            float: right;
        }
        #clpprefs label {
            font-size: .8em;
            vertical-align: middle;
        }
        #clpprefs form > fieldset {
            box-shadow: 0 0 15px #ccc;
        }
        #clpprefs fieldset {
            vertical-align: top;
            border: #ccc solid 1px;
        }
        #clpprefs legend {
            background: #eee;
            border: #ccc solid;
            border-width: 1px 1px 0 1px;
            padding: 1px 4px;
        }
        #clpprefs legend label {
            font-size: 1em;
        }
        #clpprefs .cont {
            display: inline-block;
            width: 30%;
            margin-top: 1em;
        }
        #clpprefs small {
            font-size: .6em;
            float: left;
            margin-top: 1em;
        }
        #clpprefs button {
            float: right;
        }
        #clpprefs #import-options {
            clear: both;
        }
        #clpprefs #import-options textarea {
            width: 100%;
            height: 5em;
        }

        .search.list .result-row {
            max-height: none;
            overflow: visible;
        }
    </style>
    <form>
        <fieldset>
            <legend>
                {title}
            </legend>

            <div class="loadmethod">
                <label>{load}:</label>
                <label title="{loadallatoncetooltip}">
                    <input type="radio" name="load_when" value="allatonce">
                    {loadallatonce}
                </label>
                <label title="{loadonviewtooltip}">
                    <input type="radio" name="load_when" value="onview">
                    {loadonview}
                </label>
                <label title="{loadselectivetooltip}">
                    <input type="radio" name="load_when" value="selective">
                    {loadselective}
                </label>
            </div>
            <div>
                <label><input type="checkbox" name="enable"> {enable}</label>
                <label><input type="checkbox" name="image_preview"> {imagepreview}</label>
                <label><input type="checkbox" name="map_preview"> {mappreview}</label>
            </div>

            <fieldset class="cont resize-options">
                <legend>
                    <label>
                        <input type="checkbox" name="resize_images">
                        {resizeimages}
                    </label>
                </legend>
                <label>{resizeby}</label><br>
                <label title="{percscaletooltip}">
                    <input type="radio" name="resize_method" value="image_scale">
                    {percscale}
                </label>
                <label title="{maxheighttooltip}">
                    <input type="radio" name="resize_method" value="image_maxheight">
                    {maxheight}
                </label>
                <label title="{maxwidthtooltip}">
                    <input type="radio" name="resize_method" value="image_maxwidth">
                    {maxwidth}
                </label>

                <div id="image_scale-options">
                    <label>
                        {imagescale}
                        <input name="image_scale"
                                min="1"
                                max="100"
                                type="number"
                                increment="1">
                        %
                    </label>
                </div>
                <div id="image_maxheight-options">
                    <label>
                        {maxheight}
                        <input name="image_maxheight"
                                min="1"
                                max="10000"
                                type="number"
                                step="1">
                        px
                    </label>
                </div>
                <div id="image_maxwidth-options">
                    <label>
                        {maxwidth}
                        <input name="image_maxwidth"
                                min="1"
                                max="10000"
                                type="number"
                                step="1">
                        px
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="hover_zoom">
                        {fullsizeonhover}
                        {after}
                        <input name="hover_zoom_timeout"
                                    min="0"
                                    max="5"
                                    type="number"
                                    step=".25" />
                        sec
                    </label>
                </div>
            </fieldset>
            <fieldset class="cont image-options">
                <legend>{otherimagesettings}</legend>
                <label title="{limitimagestooltip}">
                    {limitimages}
                    <input name="image_limit" type="number" min="0", max="100">
                </label>
                <br>
                <label title="{domainlimittooltip}">
                    <input type="checkbox" name="image_domain">
                    {domainlimit}
                </label>
            </fieldset>
            <fieldset class="cont text-options">
                <legend>
                    <label>
                        <input type="checkbox" name="text_preview">
                        {textpreview}
                    </label>
                </legend>
                <label>
                    <input type="checkbox" name="restrict_preview">
                    {restrictpreviewheight}
                </label>
                <br>
                <label>
                    {previewheight}
                    <input name="preview_height"
                                type="number" min="0" max="1024" />
                    px
                </label>
            </fieldset>
            <small>{willtakeeffect}</small>
            <button class="import">{import}</button>
            <button class="clear">{clear}</button>
            <fieldset id="import-options">
                <legend>{import}</legend>
                <textarea></textarea>
                <button>{save}</button>
            </fieldset>
        </fieldset>
    </form>
</blockquote>

*/}.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

var prefs = {
    defaults: {
        enable: true,
        image_preview: true,
        resize_images: true,
        resize_method: "image_maxheight",
        image_scale: 50,
        image_maxwidth: 150,
        image_maxheight: 100,
        hover_zoom: true,
        hover_zoom_timeout: 0.25,
        image_limit: 4,
        image_domain: true,
        text_preview: true,
        restrict_preview: false,
        preview_height: 300,
        load_when: "allatonce",
        map_preview: true,
    },
    init: function() {
        this.load();
    },
    setup_panel: function() {
        var pane = prefs.pane = $($.trim(interpolate(prefs_panel, get_locale().prefspane)))
            .insertAfter('header.global-header')
            .fadeOut(0);

        $(
            '<li class="user clpics"><span>[ </span><a href="#">' +
            locale('prefspane.link') +
             '</a><span> ]</span></li>'
        )
            .insertAfter('header .userlinks .user.account')
            .click(function() {
                pane.fadeToggle('slow');
                return false;
            });

        // Populate fields
        prefs.populate_fields();

        // Setup events
        pane.change(function(e) {
            var key = e.target.name,
                def = prefs.defaults[key],
                val = e.target.value;
            switch (typeof def) {
                case 'string':
                    break;
                case 'boolean':
                    val = e.target.checked;
                    break;
                case 'number':
                    val = parseFloat(val);
                    break;
            }
            prefs.set(key, val);
        });

        function _(name){
            var result = pane.find('[name=' + name + ']');
            if (result.length > 1)
                result = result.filter(':checked');
            return result;
        }

        function toggle_resize_options(enabled) {
            if (enabled) {
                _('resize_method').val(_('resize_method').val());
            }
            pane.find('.resize-options').find('input:not(legend input), label').prop({disabled: !enabled});

            // h-z-t's disabled state depends secondarily on h-z's checked state
            if (enabled)
                _('hover_zoom_timeout').prop({disabled: !_('hover_zoom')[0].checked});
        }

        pane.find('[name=text_preview]').change(function() {
            pane.find('.text-options').find('input, label').prop({disabled: !this.checked});
        }).change();

        pane.find('[name=image_preview]').change(function() {
            var disabled = !this.checked;
            if (!disabled)
                toggle_resize_options(_('resize_images')[0].checked);
            else
                toggle_resize_options(false); // false = disabled
            _('resize_images').prop({disabled: disabled});

            pane.find('.image-options').find('input, label').prop({disabled: disabled});
        }).change();

        pane.find('[name=resize_images]').change(function() {
            if (_('image_preview')[0].checked)
                toggle_resize_options(this.checked);
        }).change();

        pane.find('[name=resize_method]').change(function(e) {
            var blocks = {
                'image_scale': pane.find('#image_scale-options'),
                'image_maxheight': pane.find('#image_maxheight-options'),
                'image_maxwidth': pane.find('#image_maxwidth-options'),
            };
            for (var ix in blocks)
                blocks[ix].hide();
            blocks[e.target.value].show();
        }).filter(':checked').change();

        _("hover_zoom").change(function() {
            _("hover_zoom_timeout")[0].disabled = !this.checked;
        }).change();

        pane.find('button.clear').click(function() {
            prefs.clear();
            prefs.populate_fields();
            return false;
        });

        pane.find('#import-options').slideUp(0);
        pane.find('button.import').click(function() {
            pane.find('#import-options').slideToggle('slow');
            return false;
        });
        pane.find('#import-options button').click(function() {
            var input = $.trim(pane.find('#import-options textarea').val()).split(/\r?\n/),
                settings = {},
                x;
            for (var i=0; i<input.length; i++) {
                x = input[i].split(' ');
                settings[x[0]] = x[1];
            }
            $.each(prefs.defaults, function(key, def) {
                if (!(key in settings))
                    return;

                var val = settings[key];
                switch (typeof def) {
                    case 'string':
                        prefs.set(key, val);
                        break;
                    case 'boolean':
                        prefs.set(key, val === 'true');
                        break;
                    case 'number':
                        prefs.set(key, parseFloat(val));
                        break;
                }
            });
            pane.find('#import-options').slideUp('slow');
            // document.location.reload();
            return false;
        });
    },
    populate_fields: function() {
        $.each(this.defaults, function(key, def) {
            var val = prefs[key];
            switch (typeof def) {
                case 'string': // Radio buttons
                    prefs.pane.find('[name=' + key + '][value=' + val + ']').prop({checked: true}).change();
                    break;
                case 'boolean': // Checkboxes
                    prefs.pane.find('[name=' + key + ']').prop({checked: val}).change();
                    break;
                default: // Numbers, mainly
                    prefs.pane.find('[name=' + key + ']').val(val).change();
                    break;
            }
        });
    },
    load: function() {
        $.each(this.defaults, function(key, val) {
            prefs[key] = GM_getValue(key, val);
        });
    },
    clear: function() {
        $.each(this.defaults, function(key, val) {
            prefs[key] = val;
            GM_deleteValue(key);
        });
    },
    set: function(key, val) {
        if (key in this.defaults) {
            this[key] = val;
            if (val === this.defaults[key])
                GM_deleteValue(key);
            else
                GM_setValue(key, prefs[key]);
        }
    }
};


var ImageUtils = {
    resize: function(image) {
        var new_dimensions = this.get_new_image_dimensions(
                image.naturalWidth,
                image.naturalHeight
            );
        $(image).css({
            height: new_dimensions.height,
            width: new_dimensions.width,
            display: 'inline'
        });
    },
    get_new_image_dimensions: function(width, height) {
        var results = {
                width: width,
                height: height
            };
        if (!prefs.resize_images)
            return results;

        switch (prefs.resize_method) {
            case "image_scale":
                results.height = parseInt(height*prefs.image_scale/100.0);
                results.width = parseInt(width*prefs.image_scale/100.0);
                break;
            case "image_maxwidth":
                results.width = Math.min(width, prefs.image_maxwidth);
                results.height = parseInt(height*(results.width/width));
                break;
            case "image_maxheight":
                results.height = Math.min(height, prefs.image_maxheight);
                results.width = parseInt(width*(results.height/height));
                break;
        }
        return results;
    },
    set_zoom: function(image) {
        image = $(image);
        image
            .css({
                top: image.position().top,
                left: image.position().left,
            })
            .data({
                proper_height: image.height(),
                proper_width: image.width(),
            })
            .on({
                mouseenter: this._zoom_mouseenter,
                mouseleave: this._zoom_mouseleave,
            });
    },
    _zoom_mouseenter: function() {
        var image = $(this);
        image
            .css({zIndex: 2})
            .animate({opacity: 1.0}, prefs.hover_zoom_timeout*1000, function() {
                image.animate({
                    height: this.naturalHeight,
                    width: this.naturalWidth
                });
            });
    },
    _zoom_mouseleave: function() {
        var image = $(this);
        image
            .stop().clearQueue()
            .animate({
                height: image.data('proper_height'),
                width: image.data('proper_width')
            }, function() {
                image.css({zIndex: 1});
            });
    },
};


function ImagesProcessor(container, images) {
    this.container = container;
    this.images = images;
    this.unloaded_images = images.length;
}
ImagesProcessor.prototype = {
    init: function() {
        this.show_sources();
        this.add_images();
    },
    process_images: function() {
        this.container.find('img').each(function() {
            ImageUtils.resize(this);
        });

        // Fix the container height
        this.container.height(this.container.height());

        if (prefs.hover_zoom)
            this.container.find('img')
                .each(function() {
                    ImageUtils.set_zoom(this);
                })
                .css({position: 'absolute'});
    },
    add_images: function() {
        $.each(this.images, $.proxy(function(i, image) {
            var img = (
                $("<img>", {
                    src: image.replace(/^http:\/\//, 'https://'),
                    'class': 'clpics-image'
                })
                .css({
                    display: 'none',
                    margin: "5px",
                    border: "#000 solid 1px",
                })
                .appendTo(this.container)
            );

            img.load($.proxy(this._on_image_load, this));
        }, this));
    },
    _on_image_load: function() {
        if (--this.unloaded_images === 0)
            this.process_images();
    },
    show_sources: function() {
        var sources = this.container.data('imagesrc');

        if (sources && sources.length) {
            sources = sources.join(', ');
            this.container.prepend('<br>');
            $('<small>', {html: locale('imageshosted', {urls: sources})})
                .prependTo(this.container);
        }
    },
};


function Map(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.id = Map.id++;

    this.el = $('<div>', {id: 'clpics-map-' + this.id});
}
Map.id = 0;
Map.prototype = {
    init: function() {
        // Mostly copied from <craigslist>/js/postings-concat.js
        var latlng = new L.LatLng(this.lat, this.lon),
            ZoomControl = L.Control.ZoomFS || L.Control.Zoom,
            tiles;

        L.Icon.Default.imagePath = '//www.craigslist.org/images/map';
        tiles = new L.TileLayer(CL.maps.clMapsUrl, {
            subdomains: "0123456789",
            setView: true,
            enableHighAccuracy: true,
            prefix: ''
        });
        this.map = new L.Map('clpics-map-' + this.id, {
            center: latlng,
            zoom: 14,
            zoomControl: false,
            maxZoom: 17,
            minZoom: 1,
            maxBounds: [[-90, -180], [90, 180]],
            layers: [tiles]
        });
        this.map.attributionControl.setPrefix('');
        L.marker(latlng, {draggable: false}).addTo(this.map);

        // add zoom controls to the desktop map
        this.map.addControl(new ZoomControl());
    },
    update: function() {
        this.map.invalidateSize({pan: false, animate: true});
    }
};


function ListingProcessor(listing) {
    this.listing = listing.addClass('cl-processed');
    this.async_process();
    this.id = ListingProcessor.id++;
}
ListingProcessor.id = 0;
ListingProcessor.prototype = {
    async_process: function() {
        // Make sure we have content to fetch
        var link = this.listing.find('a.hdrlnk')[0],
            loc;
        // Skip if there is no link or link leads to a different domain (eg,
        // different cities listed when "few local results" are found.)
        if (!link || link.host !== document.location.host)
            return;
        else
            loc = link.href;

        // Fetch page content, and send to main handling function.
        // This allows for asynchronous handling
        try {
            $.ajax({
                type: "GET",
                url: loc,
                context: this,
                success: this.ajax_success,
                error: this.ajax_error
            });
        }
        catch(e) {
            this.ajax_error();
        }
    },
    ajax_success: function(data) {
        this.images = this.extract_images(data);

        data = data.replace(/\r?\n/ig, "\n")
                    .replace(/<script.+?<\/script>/gi, "")
                    .replace(/<img.+?>/gi, "");

        this.process($("<div>", {html: data}));
    },
    ajax_error: function() {
        $("<img>", {title: locale('nofetch'), src: images.errord})
            .css({marginRight: ".5em"})
            .prependTo(this.listing);
    },
    process: function(page) {
        // If there's an h5, either 1) the posting is flagged, 2) the poster
        //  knows how to use HTML and used h5s for some reason
        if (page.find("h5").length) {
            this.mark_flagged();
            return;
        }

        if (prefs.map_preview && this.listing.find('.maptag').length)
            this.add_map_preview(page);

        if (prefs.text_preview)
            this.add_text_preview(page);

        if (prefs.image_preview && this.images.length)
            this.add_image_preview();
    },
    mark_flagged: function() {
        $("<img>", {title: locale('flagged'), src: images.flagged})
            .css({marginRight: ".5em"})
            .prependTo(this.listing);
        this.listing.find('*').css({color: "#999"});
    },
    extract_images: function(data) {
        // Text-only (no HTML) parsing, to avoid loading extra images (eg,
        // unused thumbnails)

        var pics = this.listing.find("span.result-tags:first");
        // If no <span>, or doesn't contain "pic" or "img", skip
        if (!pics.length || !pics.is(":contains(pic), :contains(img)"))
            return [];

        var all_images = data.match(/(<a [^>]+?>)?<img.+?>/gi),
            sources = this.image_sources = [],
            images = [],
            image_href = /href=(['"])(.+?\.(?:jpe?g|gif|png))\1/,
            image_src = /src=(['"])(.+?\.(?:jpe?g|gif|png))\1/;
        $.each(all_images, function(i, str) {
            var url = null;
            // Thumbnail, use link for image
            if (str.indexOf('<a') === 0 && image_href.test(str))
                url = RegExp.$2;
            // Regular image
            else if (!url && image_src.test(str))
                url = RegExp.$2;
            // No url found, fail
            else
                return;

            // Check for domain restrictions
            if (prefs.image_domain) {
                var parsed = $("<a>", {href: url})[0];
                if (!parsed.host.match(/craigslist\.(org|ca)$/)) {
                    // Note image domain, continue
                    if (sources.indexOf(parsed.host) === -1)
                        sources.push(parsed.host);
                    return;
                }
            }

            if (images.indexOf(url) === -1)
                images.push(url);
        });
        return images.slice(0, prefs.image_limit || images.length);
    },
    add_text_preview: function(page) {
        var content = page.find('#postingbody').html();
        if (!content)
            // No userbody probably means a stray link/paragraph
            return;

        var pid = this.listing.find('.hdrlnk').data('id');

        // Preview window
        var preview = (
            $("<div>", {'class': 'clpics-preview'})
                .hide()
                .css({
                    fontSize: ".8em",
                    width: "60%",
                    overflow: 'auto',
                })
                .appendTo(this.listing)
        );
        if (prefs.restrict_preview)
            preview.css({
                maxHeight: prefs.preview_height + "px",
                paddingRight: "10px",
            });

        // date
        var date = page.find("#display-date").html();
        if (date) {
            date = (
                $("<p>", {html: date})
                    .css({fontSize: ".8em"})
                    .find('time')
                        .timeago()
                        .end()
            );
        }
        else
            date = $();

        // flagger
        var flagger = (
            $('<p>', {
                html: interpolate(
                    '{}: [ {} ][ {} ]',
                    locale('flag.title', {info_link: '/about/help/flags_and_community_moderation'}),
                    locale('flag.prohibited', {link: '/flag/?async=async&flagCode=28&amp;postingID='+pid}),
                    locale('flag.bestof', {link: '/flag/?flagCode=9&amp;postingID='+pid})
                )
            })
            .css({fontSize: ".8em"})
            .find('a[href^="/flag/"]')
                .click(function() {
                    $.ajax({
                        url: this.pathname + this.search,
                        context: this,
                        success: function() {
                            $(this)
                                .closest("p")
                                .text(locale('flag.thanks'))
                                .animate({opacity: 1}, 5000)
                                .animate({opacity: 0}, 300)
                                .slideUp(300);
                        }
                    });
                    return false;
                })
                .end()
        );

        // show/hide image
        $('<img>', {title: locale('togglepreview'), src: images.show_preview})
            .css({marginRight: ".5em"})
            .click(function() {
                preview.slideToggle('slow');
            })
            .prependTo(this.listing);

        preview
            .append(flagger)
            .append(date)
            .append(content);
    },
    add_image_preview: function() {
        // Set up image container
        var container = (
                $('<div>', {id: 'clpics-div-' + this.id})
                    .css({position: 'relative'})
                    .data('unloaded_images', this.images.length)
                    .appendTo(this.listing)
            );

        this.previews = new ImagesProcessor(container, this.images);
        this.previews.init();
    },
    add_map_preview: function(page) {
        var proc = this;
        $("<img>", {title: locale("togglemap"), src: images.show_map})
            .css("margin-right", ".5em")
            .click(function() {
                if (!proc.map_container) {
                    proc.create_map(page);
                    proc.map_container.slideUp(0);
                }
                proc.map_container.slideToggle('slow');
            })
            .prependTo(this.listing);
    },
    create_map: function(page) {
        var map = page.find('#map'),
            lat = map.data('latitude'),
            lon = map.data('longitude'),
            address = page.find('.mapaddress'),
            container = this.map_container = $('<div>').css({
                padding: '.5em 0',
                overflow: 'auto',
            });

        container.insertAfter(this.listing.find('.result-meta'));

        map = new Map(lat, lon);
        map.el
            .appendTo(container)
            .css({
                width: '100%',
                height: 125,
            });
        map.init();

        address.appendTo(container);

        var grip = (
            $('<img>', {src: images.grip, draggable: false})
                .appendTo(map.el)
                .css({
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    cursor: 'se-resize',
                })
                .on({
                    mousedown: function(e) {
                        if (e.button === 0) {
                            $(this).data('dragging', true);
                            map.map.dragging.disable();
                        }
                    },
                })
        );
        $(document).on({
            mousemove: function(e) {
                if (!grip.data('dragging'))
                    return;

                var new_x = e.screenX,
                    new_y = e.screenY,
                    old_x = grip.data('x'),
                    old_y = grip.data('y'),
                    delta_x = new_x - old_x,
                    delta_y = new_y - old_y;
                if (old_x && old_y) {
                    map.el.width(map.el.width() + delta_x);
                    map.el.height(map.el.height() + delta_y);
                    map.update();
                }
                grip.data({
                    x: new_x,
                    y: new_y,
                });
            },
            mouseup: function() {
                grip.data('dragging', false);
                map.map.dragging.enable();
            }
        });
    }
};


var clpics = {
    may_run: function() {
        // craigslist has kindly given us unique body classes to work with
        //  homepage - homepage
        //  list - listings, both search and category
        //  posting - an ad
        return $('body').hasClass('list');
    },
    each_listing: (function() {
        var container = $('.content');
        return function(callback) {
            return container.find('.result-info:not(.cl-processed)').each(callback);
        };
    }()),
    init: function() {
        switch (prefs.load_when) {
            case "allatonce":
                this.each_listing(function() {
                    new ListingProcessor($(this));
                });
                break;
            case "selective":
                this.each_listing(function() {
                    var listing = $(this);
                    var loader = (
                        $("<img>", {
                            title: locale('loadad'),
                            src: images.load_ad
                        })
                            .css({marginRight: ".5em"})
                            .click(function() {
                                new ListingProcessor(listing);
                                $(this).remove();
                            })
                    );
                    listing.prepend(loader);
                });
                break;
            case "onview":
                var win = $(window);
                win.scroll(function() {
                    var bottom = win.scrollTop() + win.height();

                    clpics.each_listing(function() {
                        var listing = $(this);
                        if (listing.offset().top < bottom){
                            new ListingProcessor(listing);
                        }
                    });
                });
                win.scroll();
                break;
        }
    }
};

prefs.init();
if (clpics.may_run()) {
    prefs.setup_panel();
    if (prefs.enable) {
        clpics.init();
    }
}

}());
