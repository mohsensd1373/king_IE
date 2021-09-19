/* global ajaxurl, Konva, parseInt, datajs, ctx, _ */

jQuery(function ($) {

    // on upload button click
    jQuery('body').on('click', '.misha-upl', function (e) {

        e.preventDefault();

        var button = $(this),
            custom_uploader = wp.media({
                title: 'Insert image',
                library: {
                    // uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
                    type: 'image'
                },
                button: {
                    text: 'Use this image' // button label text
                },
                multiple: false
            }).on('select', function () { // it also has "open" and "close" events
                var attachment = custom_uploader.state().get('selection').first().toJSON();
                button.html('<input value="' + attachment.url + '">').next().val(attachment.id).next().show();
                jQuery(".image").val(attachment.url);
                jQuery(".imagecurrentSrc").val(attachment.url);
                change_image_att('imagecurrentSrc');
            }).open();

    });


    // on remove button click
    jQuery('body').on('click', '.misha-rmv', function (e) {

        e.preventDefault();

        var button = $(this);
        button.next().val(''); // emptying the hidden field
        button.hide().prev().html('Upload image');
    });

});
jQuery(window).load(function () {

   jQuery(".splash_screen").css("display","none");
   jQuery(".startpanel").css("display","");

});

// Ajax request to refresh the image preview
function Refresh_Image(the_id) {
    var data = {
        action: 'myprefix_get_image',
        id: the_id
    };

    jQuery.get(ajaxurl, data, function (response) {

        if (response.success === true) {
            jQuery('#myprefix-preview-image').replaceWith(response.data.image);
        }
    });
}

function svg_selector() {
    //e.preventDefault();

    var button = jQuery(".svgselector"),
        custom_uploader = wp.media({
            title: 'Insert image',
            library: {
                // uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
                type: 'image/svg+xml'
            },
            button: {
                text: 'Use this image' // button label text
            },
            multiple: false
        }).on('select', function () { // it also has "open" and "close" events
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            jQuery('.loadedsvg').attr("src", attachment.url);
            jQuery.get(attachment.url, null, function (data) {
                var s = new XMLSerializer();
                var str = s.serializeToString(data);
                //console.log(str);
                xmlDoc = jQuery.parseXML(str), $xml = jQuery(xmlDoc);
                //var xmlDoc = jQuery.parseXML( str );
                var myhtml = getXMLToArray((str));
                //console.log(myhtml);
                //convert_form_to_xml(myArray,formarray);
                insert_svg(attachment.url);

            }, 'xml');


        }).open();
}

function img_selector(resitem,type_ret) {
    //e.preventDefault();

    var button = jQuery(".img_selector"),
        custom_uploader = wp.media({
            title: 'Insert image',
            library: {
                // uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
                type: ['image/png', 'image/jpeg']
            },
            button: {
                text: 'Use this image' // button label text
            },
            multiple: false
        }).on('select', function () { // it also has "open" and "close" eventsvar text_id = localStorage.getItem("itemid");
            var current_layer_id = localStorage.getItem("current_layer_id");
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            jQuery(resitem).val(attachment.url);
            
            if(type_ret=="layer"){
               // console.log("layer");
                jQuery(".layeroption "+resitem).trigger("onchange");
                change_layer_att("fillPatternRepeat");
            }
            if(type_ret=="text"){
                //console.log("text");
                jQuery(".text_editor "+resitem).trigger("onchange");
                change_text_att("fillPatternRepeat");
            }
            
            stage.children[current_layer_id].draw();
        }).open();
}

function convert_from_to_xml() {
    var ret = "";
    var get_all = jQuery(".svgeform");

    doc = document.getElementsByClassName("svgeform");
    //console.log(doc);
    const boxes = [...document.getElementsByClassName('svgeform')];
    //console.log(boxes[0].childNodes[0]);
    var currentitem = boxes[0].childNodes[0];
    var att_item = "";
    var node_item = "";

    for (var i = 0; i < currentitem.childNodes.length; i++) {
        var classname_parrent = currentitem.className;
        if (currentitem.childNodes[i].tagName == "INPUT") {
            var classname_item = currentitem.childNodes[i].className;
            var val_item = currentitem.childNodes[i].value;
            //console.log(classname_item);
            att_item = att_item + " " + classname_item + '=' + '"' + val_item + '" ';
        }
        if (currentitem.childNodes[i].tagName == "DIV") {
            if (currentitem.childNodes[i].childElementCount > 0) {
                node_item = node_item + convert_from_to_xml_child(currentitem.childNodes[i].childNodes);
            } else {
                node_item = node_item + '<' + currentitem.childNodes[i].className + '>';
                node_item = node_item + currentitem.childNodes[i].getAttribute("textContent");
                node_item = node_item + '</' + currentitem.childNodes[i].className + '>';
            }
            //console.log(currentitem.childNodes[i].childElementCount);

            //console.log(currentitem.childNodes[i]);

        }


    }

    ret = ret + '<' + classname_parrent + att_item + ">";
    if (node_item != "") {
        ret = ret + node_item;
    }

    ret = ret + '</' + classname_parrent + ">";
    //console.log(ret);
    replace_xml(ret);
}

function convert_from_to_xml_child(childnode) {
    var ret = "";

    var currentitem = childnode;
    //console.log(currentitem);
    var att_item = "";
    var node_item = "";
    //console.log(currentitem); 
    for (var i = 0; i < currentitem.length; i++) {

        if (currentitem[i].tagName == "INPUT") {
            var classname_parrent = currentitem[i].parentNode.className;
            var classname_item = currentitem[i].className;
            var val_item = currentitem[i].value;

            att_item = att_item + " " + classname_item + '=' + '"' + val_item + '" ';
        }
        if (currentitem[i].tagName == "DIV") {
            var classname_parrent = currentitem[i].parentNode.className;
            if (currentitem[i].childElementCount > 0) {
                node_item = node_item + convert_from_to_xml_child(currentitem[i].childNodes);
            }
            //console.log(currentitem.childNodes[i]);

        }




    }

    ret = ret + '<' + classname_parrent + att_item + ">";
    if (node_item != "") {
        ret = ret + node_item;
    }
    ret = ret + '</' + classname_parrent + ">";
    return ret;
}



function getXMLToArray(xmlstring) {
    var ret = "";
    var parser, xmlDoc;
    var text = xmlstring;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "image/svg+xml");
    //console.log(xmlstring);
    //xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;


    var itmes = xmlDoc.getElementsByTagName("svg");
	
    for (var i = 0; i < itmes.length; i++) {
        ret = ret + '<div class="' + itmes[i].nodeName + '">';

        for (var e = 0; e < itmes[i].attributes.length; e++) {
            var attr = itmes[i].attributes[e];
            var block_attr = ["id", "xmlns:xlink", "xmlns", "viewBox", "version", "viewBox"];
            var color_attr = ["stroke", "fill","stop-color"];
            var if_find_in_block_array = (block_attr.indexOf(attr.name) > -1);
            var if_find_in_color_array = (color_attr.indexOf(attr.name) > -1);
            var oncilck="";
            var styleinput="";
            if (if_find_in_color_array) {
                ret = ret + '<div class="input_label">' + attr.name + '</div>';
                 oncilck="open_panell_color(this)";
                var type_input = "text";
                styleinput=styleinput+" "+"background-color:"+attr.value;
            } else if (if_find_in_block_array) {
                var type_input = "hidden";
            } else {
                //ret = ret + '<div class="input_label">' + attr.name + '</div>';
                var type_input = "hidden";
            }

            ret = ret + '<input type="' + type_input + '" class="' + attr.name + '" style="'+styleinput+'"  value="' + attr.value + '" oninput="convert_from_to_xml()" onclick="'+oncilck+'" >';
            //console.log(attr.name + " = " + attr.value);
        }

        var childcount = itmes[i].hasChildNodes();
        //console.log(childcount);
        //console.log(itmes[i].children);
        if (childcount == true) {
            ret = ret + getXMLToArray_child(itmes[i].children);
        }


        ret = ret + "</div>";
    }
    // console.log( itmes[0]);
    return ret;
}

function getXMLToArray_child(child_node) {
    var ret = "";

    var itmes = child_node;
    for (var i = 0; i < itmes.length; i++) {
        ret = ret + '<div class="' + itmes[i].nodeName + '"';
        //console.log(jQuery.trim(itmes[i].textContent));
        if (jQuery.trim(itmes[i].textContent) != "") {
            ret = ret + ' textContent="' + jQuery.trim(itmes[i].textContent) + '" >';
        } else {
            ret = ret + ' >';
        }

        for (var e = 0; e < itmes[i].attributes.length; e++) {
            var attr = itmes[i].attributes[e];
            var block_attr = ["id", "xmlns:xlink", "xmlns", "viewBox", "version", "viewBox"];
            var color_attr = ["stroke", "fill","stop-color"];
            var if_find_in_block_array = (block_attr.indexOf(attr.name) > -1);
            var if_find_in_color_array = (color_attr.indexOf(attr.name) > -1);
            var oncilck="";
            var styleinput="";
            if (if_find_in_color_array) {
                ret = ret + '<div class="input_label">' + attr.name + '</div>';
                var type_input = "text";
                var oncilck="open_panell_color(this)";
                styleinput=styleinput+" "+"background-color:"+attr.value;
            } else if (if_find_in_block_array) {
                var type_input = "hidden";
            } else {
                //ret = ret + '<div class="input_label">' + attr.name + '</div>';
                var type_input = "hidden";
            }
            ret = ret + '<input type="' + type_input + '" class="' + attr.name + '" style="'+styleinput+'" value="' + attr.value + '" oninput="convert_from_to_xml()" onclick="'+oncilck+'" >';

        }


        var childcount = itmes[i].hasChildNodes();
        //console.log(childcount);
        //console.log(itmes[i].childNodes);
        if (childcount == true) {
            ret = ret + getXMLToArray_child(itmes[i].children);
        }
        ret = ret + "</div>";

    }

    return ret;
}

function insert_svg(image) {

    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var color = jQuery(".svg_color").val();
    if (current_itemid != "" && stage.children[current_layer_id].children[current_itemid].attrs.typerect == 'svg') {
        console.log(stage.children[current_layer_id].children[current_itemid]);
        jQuery.get(image).success(function (data) {

            localStorage.setItem("select_svg", xmlToString(data, color));
            var SVG = localStorage.getItem("select_svg");
            var imageObj2 = new Image();
            imageObj2.onload = function () {
                //card.image(imageObj2);



                var x2js = new X2JS();
				var svgjson=x2js.xml_str2json(xmlToString2(data));
				stage.children[current_layer_id].children[current_itemid].setImage(imageObj2);
                stage.children[current_layer_id].children[current_itemid].getLayer().draw();
				 stage.children[current_layer_id].children[current_itemid].attrs['svgorg'] = data;
				 stage.children[current_layer_id].children[current_itemid].attrs['svgjosn'] = svgjson;
				stage.children[current_layer_id].children[current_itemid].setAttr('image_url', image);
                stage.children[current_layer_id].batchDraw();
            };
            imageObj2.src = image;
            var center_x = stage.children[current_layer_id].canvas.width / 2;
            var center_y = stage.children[current_layer_id].canvas.height / 2;
            stage.children[current_layer_id].children[current_itemid].setAttr("svgorg", data);
            stage.children[current_layer_id].children[current_itemid].setAttr("x", center_x - 100);
            stage.children[current_layer_id].children[current_itemid].setAttr("y", center_y - 100);
            stage.children[current_layer_id].children[current_itemid].height(100);
            stage.children[current_layer_id].children[current_itemid].width(100);

            //alert("selected");
console.log(stage.children[current_layer_id].children[current_itemid]);
        });
        //console.log(stage);
    } else {

        //console.log(stage);
        jQuery.get(image).success(function (data) {

            localStorage.setItem("select_svg", xmlToString(data, color));
            var SVG = localStorage.getItem("select_svg");
			var x2js = new X2JS();


            Konva.Image.fromURL(SVG, image => {
	//		console.log(data);
	//		console.log(xmlToString2(data));
//console.log(x2js.xml_str2json(xmlToString2(data)));
var svgjson=x2js.xml_str2json(xmlToString2(data));
                image.draggable(true);
                image.name('rect');
                image.height(100);
                image.width(100);
                image.attrs['typerect'] = 'svg';
                image.attrs['svgorg'] = data;
				 image.attrs['svgjson'] = svgjson;
                stage.children[current_layer_id].add(image);
                stage.children[current_layer_id].draw();
				
				console.log(image);

            });
            //alert("selected");

        });
    }

    //console.log(stage);
    //console.log(stage.children[current_layer_id].children.hasName('rect'));

    get_all_layers();
}
function xmlToString2(xmlData) 
{
 var s = new XMLSerializer();
var str = s.serializeToString(xmlData);
//console.log(str);
xmlDoc = jQuery.parseXML(str), $xml = jQuery(xmlDoc);
//console.log(xmlDoc);
//var xmlDoc = jQuery.parseXML( str );
var text = str;
parser = new DOMParser();
xmlDoc = parser.parseFromString(text, "image/svg+xml");
//console.log(xmlDoc);
return  str;
} 
function checkValue(value, arr) {
    var status = false;

    for (var i = 0; i < arr.length; i++) {
        var name = arr[i];
        if (name == value) {
            status = true;
            break;
        }
    }

    return status;
}

function isColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    var test1 = s.color == strColor;
    var test2 = /^#[0-9A-F]{6}$/i.test(strColor);
    console.log(s.color + ":::" + strColor);
    if (test1 == true || test2 == true) {
        return true;
    } else {
        return false;
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function new_button() {
    jQuery(".kie_editor").children("*").css('display', "none");
    jQuery(".startpanel").css('display', '');
    jQuery(".wstage").val("");
    jQuery(".hstage").val("");
    stage.destroy();
}

function close_msg() {
    jQuery(".kie_msg").css('display', 'none');
}

function open_msg(hstr, mstr, bgc, textc) {
    jQuery(".kie_msg").css('display', 'block');
    jQuery(".kie_msg > .kie_msg_header > b").text(hstr);
    jQuery(".kie_msg > .kie_msg_mtn").text(mstr);
    jQuery(".kie_msg ").css("background-color", bgc);
    jQuery(".kie_msg > .kie_msg_header ").css("background-color", bgc);
    jQuery(".kie_msg > .kie_msg_header ").css("color", textc);
}

function splitToDigit(n) {
    return (n + '').split('').map((i) => {
        return Number(i);
    });
}

function setdivsize() {

    



    jQuery(".startpanel").css('display', ' none');
    jQuery("#container").css('display', '');
    jQuery(".panel").css('display', '');
    if (jQuery(".nameimage").val() != "") {
        localStorage.setItem("namefile", jQuery(".nameimage").val());
    } else {
        localStorage.setItem("namefile", makeid(7));
    }
    if (jQuery(".wstage").val() != "" && jQuery(".hstage").val() != "") {
        var get_userrw = parseInt(jQuery(".wstage").val());
        var real_w = get_userrw;
        //get_userrw=((get_userrw/100)*30)+get_userrw;
        var get_userrh = parseInt(jQuery(".hstage").val());
        var real_h = get_userrh;
    } else {
        var get_userrw = 500;
        var real_w = get_userrw;
        //get_userrw=((get_userrw/100)*30)+get_userrw;
        var get_userrh = 500;
        var real_h = get_userrh;
    }

    localStorage.setItem("rwidth", real_w);
    localStorage.setItem("rheight", real_h);
    var clientHeight = document.getElementById('kie_editor').clientHeight;
    var clientWidth = document.getElementById('kie_editor').clientWidth;
    var padding_px = parseInt(jQuery(".kie_editor").css('padding-top')) * 2;
    clientHeight = clientHeight - padding_px;
    clientWidth = clientWidth - padding_px;

    jQuery(".wstage").val(clientWidth);
    jQuery(".hstage").val(clientHeight);
    //console.log(get_userrw+":::"+get_userrh);

  
    if (get_userrw > get_userrh) {
        var drasad_100 = get_userrw / 100;
        var drasad_75 = get_userrh / drasad_100;
        var w_wpcontent = 500;
        var h_wpcontent = drasad_75 * 5;
        var max_width = get_userrw / 500;
        var max_height = get_userrw / 500;
    } else if (get_userrw < get_userrh) {
        var drasad_100 = get_userrh / 100;
        var drasad_75 = get_userrw / drasad_100;
        var w_wpcontent = drasad_75 * 5;
        var h_wpcontent = 500;
        var max_width = get_userrh / 500;
        var max_height = get_userrh / 500;
    } else if (get_userrw == get_userrh) {
//        get_userrw = get_userrw;
//        get_userrh = get_userrh;
        var w_wpcontent = 500;
        var h_wpcontent = 500;
        var max_width = get_userrw / 500;
        var max_height = get_userrh / 500;
    }


    get_userrw = parseFloat(w_wpcontent);
    get_userrh = parseFloat(h_wpcontent);
    localStorage.setItem("width", get_userrw);
    localStorage.setItem("height", get_userrh);
    localStorage.setItem("max_width", parseFloat(max_width));
    localStorage.setItem("max_height", parseFloat(max_height));
var kie_editor_width=get_userrw + parseInt(jQuery(".panelr").width())+parseInt(jQuery(".panel_left").width());
    jQuery(".kie_editor").css("width",kie_editor_width);
    jQuery(".kie_editor").css("height", get_userrh + parseInt(jQuery(".panel").height()));
   
    starteditor(get_userrw, get_userrh);
    //console.log(datajs.rtl_lang);
    if(datajs.rtl_lang==1){
             jQuery(".konvajs-content").css("margin-right", jQuery(".panelr").width());
       jQuery(".konvajs-content").css("margin-left:", jQuery(".panel_left").width());
       }else{
             jQuery(".konvajs-content").css("margin-left", jQuery(".panelr").width());
       jQuery(".konvajs-content").css("margin-right:", jQuery(".panel_left").width());
       }
}
var stage;
var layer;
var all_layer = {};
all_layer["background"] = null;
var tr ;
function starteditor(width, height,jsonnode=null) {
     jQuery(".kie_editor > .kie_blackscreen").css('display', ' ');
   jQuery(".panel_left").css("display","");  
    if(jsonnode==null){
    //            var width = 500;
    //      var height = 500;
    var stageWidth = width;
    var stageHeight = height;
    //console.log(stageWidth+":::"+stageHeight);
    var rwidth = parseInt(localStorage.getItem("rwidth"));
    var rheight = parseInt(localStorage.getItem("rheight"));
    var max_width = localStorage.getItem("max_width");
    var max_height = localStorage.getItem("max_height");

    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
        scaleX: parseInt(1),
        scaleY: parseInt(1),
        filename:localStorage.getItem("namefile")
    });
//console.log(stage);

    all_layer["background"] = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: "#000000",
        name: "bgcolor",
        fillPriority: 'color',
        fillPatternRepeat: 'repeat',
        fillPatternX:0,
        fillPatternY:0,
        fillPatternOffsetX:0,
        fillPatternOffsetY:0,
        fillPatternScaleX:1,
        fillPatternScaleY:1,
        fillPatternRotation: 0,
        image_url: "",
        opacity: 1,
        typerect: "bgcolor"

    });


    layer = new Konva.Layer({
        name: "background",
        id: "background"
    });
    layer.add(all_layer["background"]);
    localStorage.setItem("current_layer", "background");
    localStorage.setItem("current_layer_id", 0);
    localStorage.setItem("isPaint", false);
    localStorage.setItem("Paint", false);
    localStorage.setItem("itemid", 0);
    localStorage.setItem("line_type", "brush");
    localStorage.setItem("line_color", "#000000");
    localStorage.setItem("line_width", "20");
    localStorage.setItem("itemid", "");
	localStorage.setItem("number_group", 0);
    stage.add(layer);

}else{
    stage = Konva.Node.create(jsonnode, 'container');
  
    for ( var i = 0; i < stage.children.length; i++ ) {
        for ( var e = 0; e < stage.children[i].children.length; e++ ) { 
		 if(stage.children[i].children[e].getAttr('svgjson')!=null){
			 // Create x2js instance with default config
			 var x2js = new X2JS();
			 var jsonObj =stage.children[i].children[e].getAttr('svgjson');
			 var xmlAsStr = x2js.json2xml_str( jsonObj );
			 var parser = new DOMParser();
			 var doc = parser.parseFromString(xmlAsStr, "image/svg+xml");
			 //console.log(doc);
			   
			/*const url =  'data:image/svg+xml;base64,' + window.btoa(xmlAsStr);
			Konva.Image.fromURL(url, image => {
			reload_node_image(i,e,image,"svg");
			});*/
			image_url= 'data:image/svg+xml;base64,' + window.btoa(xmlAsStr);
			jQuery.ajax({
                    url:  image_url,
                    async :false,
                    success: function(data) {
//                        console.log(data);
                        var imageObj = new Image();
                             imageObj.src = image_url;
                        stage.children[i].children[e].setAttr('svgorg',data);
                            reload_node_image(i,e,imageObj,"svg");
                       
                    },
                    error: function() {
                      alert('failure');
                    }
                  }).done(function() {
                 
                      
                });
                
				
			 }
            if(stage.children[i].children[e].getAttr('image_url')!=null){
                
                var image_url=stage.children[i].children[e].getAttr('image_url');
                var typerect=stage.children[i].children[e].getAttr('typerect');
                //console.log(typerect);
                

                jQuery.ajax({
                    url: image_url,
                    async :false,
                    success: function(data) {
                        //console.log(data);
                        var imageObj = new Image();
                             imageObj.src = image_url;
                        if(typerect=="bgcolor"){
                            reload_node_image(i,e,imageObj,"bg");
                        }
                        if(typerect=="image"){
                            reload_node_image(i,e,imageObj,"image");
                        }
						if(typerect=="svg"){
                            reload_node_image(i,e,imageObj,"svg");
                        }
                        if(typerect=="text"){
                            reload_node_image(i,e,imageObj,"text");
                        }
                    },
                    error: function() {
                      alert('failure');
                    }
                  }).done(function() {
                 
                      
                });
                
                    
                    
                       

                
            }
         
        }
        
    }
    stage.batchDraw();  
}


  tr = new Konva.Transformer({
            name: 'rected',
            typerect: "transform"
        });
var group1 = new Konva.Group({draggable: true});
	
// console.log(tr);
    stage.on('click tap', function (e) {
        //transformers_remover();
        get_all_layers();
        // if click on empty area - remove all transformers
        //console.log(e.target );
        var current_layer_id = localStorage.getItem("current_layer_id");
        if (e.target === stage || e.target.attrs.name == "bgcolor") {
            localStorage.setItem("itemid", "");
            jQuery(".svgeditor_form").css("display", "none");
            jQuery(".kie_editor > .panelr").children("*").css('display', "none");
            jQuery(".kie_editor > .panelr").css('display', '');
            jQuery(".kie_editor > .panelr > .layeroption").css('display', '');
            jQuery(".kie_editor > .panelr > .layers").css('display', '');
            //stage.find('Transformer').destroy();
           
            localStorage.setItem("itemid", 0);
            set_layer_att_html();
            stage.children[current_layer_id].draw();
            return;
        }
        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName('rect')) {
            localStorage.setItem("Paint", false);

            return;
        } else {
            localStorage.setItem("Paint", false);
            jQuery(".kie_editor > .panelr  .pen_editor").css('display', 'none');
			jQuery(".kie_editor > .panelr  > div").css('display', 'none');
            if (e.target.attrs.typerect == "text") {
                localStorage.setItem("itemid", e.target.index);
                jQuery(".panelr").css('display', '');
                jQuery(".svgeditor_form").css("display", "none");
                jQuery(".kie_editor > .panelr").children("*").css('display', "none");
                jQuery(".kie_editor > .panelr > .text_editor").css('display', '');
                jQuery(".kie_editor > .panelr > .layers").css('display', '');
                set_text_att_html(e.target.attrs);
                document.getElementById("defOtext").click();
            }
            if (e.target.attrs.typerect == "image") {
                jQuery(".svgeditor_form").css("display", "none");
                localStorage.setItem("itemid", e.target.index);
                jQuery(".panelr").css('display', '');
                jQuery(".kie_editor > .panelr").children("*").css('display', "none");
                jQuery(".kie_editor > .panelr > .image_editor").css('display', '');
                jQuery(".kie_editor > .panelr > .layers").css('display', '');
                set_img_att_html(e.target.attrs);
                document.getElementById("defOimg").click();
            }

            if (e.target.attrs.typerect == "svg") {
		
                localStorage.setItem("itemid", e.target.index);
                jQuery(".panelr").css('display', '');
                jQuery(".kie_editor > .panelr").children("*").css('display', "none");
                jQuery(".kie_editor > .panelr > .shape_editor").css('display', '');
                jQuery(".kie_editor > .panelr > .layers").css('display', '');
					if( e.target.attrs.svgorg==null){
					 jQuery.get(e.target.attrs.image_url).success(function (data) {
					 e.target.attrs.svgorg=data;
					var svgorg = e.target.attrs.svgorg;
					});
					}else{
					var svgorg = e.target.attrs.svgorg;
					}
                
                //console.log(svgorg);
                var s = new XMLSerializer();
                var str = s.serializeToString(svgorg);

                var myhtml = getXMLToArray((str));
                jQuery("#svgeditor_form").html(myhtml);
                jQuery(".svgeditor_form").css("display", "");


            }
            if (e.target.attrs.typerect == "line") {
                jQuery(".svgeditor_form").css("display", "none");

                localStorage.setItem("itemid", e.target.index);

                localStorage.setItem("line_width", e.target.attrs.strokeWidth);
                localStorage.setItem("line_color", e.target.attrs.stroke);
                var mode = e.target.attrs.globalCompositeOperation === 'source-over' ? 'brush' : 'eraser';
                //console.log(e.target.attrs.globalCompositeOperation+"::"+mode);
                localStorage.setItem("line_type", mode);
                //localStorage.setItem("Paint", true);
                set_pen_att_html();
                jQuery(".kie_editor > .panelr  .pen_editor").css('display', '');
                jQuery(".kie_editor > .panelr  .layers").css('display', '');



            }

        }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected


        //transformers_remover();
        
		
//		console.log(e);
        if (e.target.parent.nodeType == "Group") {
			localStorage.setItem("current_layer", e.target.parent.parent.attrs.name);
        localStorage.setItem("current_layer_id", e.target.parent.parent.index);
			stage.children[e.target.parent.parent.index].add(tr);
			  stage.children[e.target.parent.parent.index].draw();
		}else{
			localStorage.setItem("current_layer", e.target.parent.attrs.name);
        localStorage.setItem("current_layer_id", e.target.parent.index);
		stage.children[e.target.parent.index].add(tr);	
			  stage.children[e.target.parent.index].draw();
		}
        
        

        //tr.nodes([e.target]);
        
      

    });



    stage.on('mousedown', function (e) {
        var current_layer_id = localStorage.getItem("current_layer_id");
        var ctx = stage.children[current_layer_id].getCanvas()._canvas.getContext("2d");
        var layer =stage.children[current_layer_id];
        var canvasOffset = jQuery(layer.getCanvas()._canvas).offset();

        var canvasX = Math.floor(e.evt.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.evt.pageY - canvasOffset.top);
        var eyedropperIsActive = false;
        var myObj = e.target;

        if (e.target.className == "Text") {

            jQuery(".eyedroper").val(e.target.attrs.fill);
            jQuery(".eyedroper").css("background-color", e.target.attrs.fill);
            color_code();
        } else {
            var pxData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var get_rgb = "rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")";
            jQuery(".eyedroper").val(rgb2hex(get_rgb));
            jQuery(".eyedroper").css("background-color", rgb2hex(get_rgb));
            color_code();
        }





    });





    var isPaint = localStorage.getItem("isPaint");
    var mode = 'brush';
    var lastLine;



    stage.on('mousedown touchstart', function (e) {
		
        if (e.evt.button === 2) {
            if (localStorage.getItem("Paint") == "true") {
                jQuery(".kie_editor > .panelr  .pen_editor").css('display', '');
                var mode = localStorage.getItem("line_type");
                var line_color = localStorage.getItem("line_color");
                var current_layer_id = localStorage.getItem("current_layer_id");
                localStorage.setItem("isPaint", true);
                var pos = stage.getPointerPosition();
                lastLine = new Konva.Line({
                    name: "rect",
                    typerect: "line",
                    draggable: true,
                    stroke: line_color,
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: parseInt(localStorage.getItem("line_width")),
                    globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
                    points: [pos.x, pos.y],
                });
                //currentShape = e.target;
                stage.children[current_layer_id].add(lastLine);
                get_all_layers();
            }
        }

    });

    stage.on('mouseup touchend', function () {
        localStorage.setItem("isPaint", false);
    });
    // and core function - drawing
    stage.on('mousemove touchmove', function () {
        if (localStorage.getItem("isPaint") == "false") {
            return;
        }
        var current_layer_id = localStorage.getItem("current_layer_id");
        const pos = stage.getPointerPosition();
        var newPoints = lastLine.points().concat([pos.x, pos.y]);
        lastLine.points(newPoints);
        stage.children[current_layer_id].batchDraw();
    });

// selection rect 
	var selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
		name:"selection",
      });
      stage.children[0].add(selectionRectangle);

      var x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
		  if (localStorage.getItem("Paint") == "true") {
			return;  
		  }
		  var current_layer_id = localStorage.getItem("current_layer_id");
        // do nothing if we mousedown on eny shape
        if (e.target.attrs.name != "bgcolor") {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        stage.children[current_layer_id].draw();
      });
	
	stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: convet_nan_to_zero(Math.min(x1, x2)),
          y: convet_nan_to_zero(Math.min(y1, y2)),
          width: convet_nan_to_zero(Math.abs(x2 - x1)),
          height: convet_nan_to_zero(Math.abs(y2 - y1)),
        });
        stage.batchDraw();
      });
	
	  stage.on('mouseup touchend', () => {
		  var current_layer_id = localStorage.getItem("current_layer_id");
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          stage.batchDraw();
        });

        var shapes = stage.find('.rect').toArray();
        var box = selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
		  
        tr.nodes(selected);
		  stage.children[current_layer_id].add(tr);
        stage.batchDraw();
      });

	  // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
       var current_layer_id = localStorage.getItem("current_layer_id");
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target.attrs.name == "bgcolor") {
          tr.nodes([]);
          stage.children[current_layer_id].draw();
          return;
        }

        // do nothing if clicked NOT on our rectangles
		  
        if (!e.target.hasName('rect')) {
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;
         if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
        stage.children[current_layer_id].draw();
      });
	
	//right menu
	// setup menu
      let currentShape;
      var menuNode = document.getElementById('menu');
      document.getElementById('new-group').addEventListener('click', () => {
		  var number_group=localStorage.getItem("number_group");
       var group = new Konva.Group({
		 name: "rect",
        name_group: "group"+number_group,
		draggable: true,
        typerect: "group"
    });
		  localStorage.setItem("number_group",parseInt(number_group)+1);
		  var nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
		   for ( var i = 0; i < nodes.length; i++ ) {
		 //  console.log(nodes[i]);
			   nodes[i].draggable(false);
			   if(nodes[i].attrs.typerect=="group"){
				  var group_remove = stage.find(node => {return node.attrs.name_group === nodes[i].attrs.name_group;});
			   unpack_group(nodes[i].parent.index,nodes[i].index);
			   //group_remove.destroy();
			  // stage.children[id_remove_item].remove();
			   }else{
			   
				   group.add(nodes[i]); 
				   }
			  
		   }
//          console.log(nodes);
		  var layerid = localStorage.getItem("current_layer_id");
		  stage.children[layerid].add(group);
		  stage.children[layerid].draw();
		  
		  
		  //console.log(stage);
		  get_all_layers();
		  
      });
	document.getElementById('unpack-group').addEventListener('click', () => {
        //removeitem();
		var itemid = localStorage.getItem("itemid");
		var current_layer_id = localStorage.getItem("current_layer_id");
		
		unpack_group(current_layer_id,itemid);
		  get_all_layers();
      });
	  document.getElementById('unpack-from-group').addEventListener('click', () => {
        
		var itemid = localStorage.getItem("itemid");
		var current_layer_id = localStorage.getItem("current_layer_id");
		var nodes = tr.nodes().slice();

for ( var i = 0; i < nodes.length; i++ ) {
		   //console.log(nodes[i]);
			   nodes[i].draggable(false);
			   if(nodes[i].attrs.typerect=="group"){
				 
			   }else{
			   var back_layer;
			   if(nodes[i].parent.attrs.typerect=="group"){
				   back_layer=nodes[i].parent.parent.index;
				   }else{
				   back_layer=nodes[i].parent.index;
				   }
				   nodes[i].draggable(true);
				   stage.children[back_layer].add(nodes[i]);
				   }
			  
		   }

		  get_all_layers();
      });
      document.getElementById('delete-button').addEventListener('click', () => {
        removeitem();
		  get_all_layers();
      });

      window.addEventListener('click', () => {
        // hide menu
        menuNode.style.display = 'none';
      });

      stage.on('contextmenu', function (e) {
		  
        //console.log(e);
        e.evt.preventDefault();
		  if (localStorage.getItem("Paint") == "true") {
			return;  
		  }
        if (e.target.attrs.name == "bgcolor") {
          // if we are on empty place of the stage we will do nothing
          return;
        }
		jQuery("#menu > div  button").css("display","none");
		//  console.log(e);
		  if (e.target.parent.getType() == "Group") {
		localStorage.setItem("current_layer", e.target.parent.parent.attrs.name);
		  localStorage.setItem("current_layer_id",e.target.parent.parent.index);
		  localStorage.setItem("itemid",e.target.parent.index);
		  jQuery("#menu > div  #unpack-from-group").css("display","");
		  jQuery("#menu > div  #unpack-group").css("display","");
		  jQuery("#menu > div  #delete-button").css("display","");
		  
		
		}else{
		localStorage.setItem("current_layer", e.target.parent.attrs.name);
		  localStorage.setItem("current_layer_id",e.target.parent.index);
		  localStorage.setItem("itemid",e.target.index);
		  
		  jQuery("#menu > div  #new-group").css("display","");
		  jQuery("#menu > div  #delete-button").css("display","");
		}
		  
		  
        currentShape = e.target;
        // show menu
        menuNode.style.display = 'initial';
        var containerRect = stage.container().getBoundingClientRect();
        menuNode.style.top =
          containerRect.top + stage.getPointerPosition().y + 4 + 'px';
        menuNode.style.left =
          containerRect.left + stage.getPointerPosition().x + 4 + 'px';
      });
	  
	  //dragging item 
	  
	  stage.on('dragmove', (t) => {
	  if(t.target.attrs.typerect=="text"){
		  set_text_att_html( t.target.attrs);
		  }
		  if(t.target.attrs.typerect=="image"){
		  set_img_att_html( t.target.attrs);
		  }
		  
		  if(t.target.attrs.typerect=="svg"){
		  //set_text_att_html( t.target.attrs);
		  }
		  
		  if(t.target.attrs.typerect=="line"){
		  set_pen_att_html( t.target.attrs);
		  }
	  
    //console.log(t.target);
});

}
function  convet_nan_to_zero(val){
    if(isNaN(val)==true){
        return 0;
    }else{
        return val; 
    }
}
function load_img_async(source) {
    return jQuery.Deferred (function (task) {
        var image = new Image();
        image.onload = function () {task.resolve(image);};
        image.onerror = function () {task.reject();};
        image.src=source;
    }).promise();
}
function reload_node_image(layerid,itemid,imageObj,type){
    jQuery(".kie_editor > .panel >  .loading").css("display","");
    jQuery(".kie_editor > .kie_blackscreen").css('display', "");
     
    if(type=="image"){
        stage.children[layerid].children[itemid].setImage(imageObj);  
    }
	if(type=="svg"){
        stage.children[layerid].children[itemid].setImage(imageObj);  
		//stage.children[layerid].children[itemid].attrs['svgorg'] = imageObj;
		var x2js = new X2JS();
		//console.log(imageObj);
		var svgjson=x2js.xml_str2json(xmlToString2(imageObj));
		stage.children[layerid].children[itemid].attrs['svgjson'] = svgjson;
		
    }
    if(type=="text"){
        stage.children[layerid].children[itemid].fillPatternImage(imageObj);
        stage.children[layerid].children[itemid].setAttr('image_url', imageObj); 
        var image_url_fillPatternRepeat=stage.children[layerid].children[itemid].getAttr('image_url_fillPatternRepeat');
       change_text_att("width",layerid,itemid,stage.children[layerid].children[itemid].width()-1);
	   setTimeout(function() {
            stage.children[layerid].children[itemid].fillPatternRepeat(image_url_fillPatternRepeat);
			change_text_att("width",layerid,itemid,stage.children[layerid].children[itemid].width()+1);
        }, 4000);
		
    }
    if(type=="bg"){
        stage.children[layerid].children[itemid].fillPatternImage(imageObj);
        stage.children[layerid].children[itemid].setAttr('image_url', imageObj.src);
        var image_url_fillPatternRepeat=stage.children[layerid].children[itemid].getAttr('image_url_fillPatternRepeat');
        setTimeout(function() {
            stage.children[layerid].children[itemid].fillPatternRepeat(image_url_fillPatternRepeat);
        }, 5000);
        
    }
       
    setTimeout(function() {
        stage.children[layerid].draw();
    stage.batchDraw();
 jQuery(".kie_editor > .kie_blackscreen").css('display', ' none');
    jQuery(".kie_editor > .panel >  .loading").css("display","none");
//	console.log(stage.children[layerid].children[itemid]);
    }, 6000);
    stage.children[layerid].draw();
    stage.batchDraw();
}
function getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we can find relative point
    return transform.point(pos);
}

function getPixelColor(x, y) {
    var pxData = ctx.getImageData(x, y, 1, 1);
    return ("rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")");
}

function color_code() {
    jQuery(".eyedroper_text").val(jQuery(".eyedroper").val());
    //      var copyText = document.getElementById("eyedroper_text");
    //      copyText.select();
    //      document.execCommand("copy");
}

function copy_color() {
    var copyText = document.getElementById("eyedroper_text");
    var code_color = document.getElementById("eyedroper_text").value;
    copyText.select();
    document.execCommand("copy");
    document.getElementById("eyedroper_text").value = datajs.copytext;
    setTimeout(function () {
        document.getElementById("eyedroper_text").value = code_color;
    }, 1000);

}

function standardize_color(str) {
    var ctxx = document.createElement('canvas').getContext('2d');
    ctxx.fillStyle = str;
    return ctxx.fillStyle;
}

function set_text_att_html(data) {
    //console.log(data);
    var objectkeyname = Object.keys(data);
    for (var i = 0; i < objectkeyname.length; i++) {
        //console.log(objectkeyname[i]+data[objectkeyname[i]]);
        if (objectkeyname[i] == "fill") {
            jQuery(".kie_editor > .panelr > .text_editor ." + objectkeyname[i]).val(standardize_color(data[objectkeyname[i]]));
			jQuery(".kie_editor > .panelr > .text_editor ." + objectkeyname[i]).css("background-color", standardize_color(data[objectkeyname[i]]));
			var hashcode_color=invertColor(data[objectkeyname[i]]);
			jQuery(".kie_editor > .panelr > .text_editor .fill").css("color",hashcode_color);
        } else {
            jQuery(".kie_editor > .panelr > .text_editor ." + objectkeyname[i]).val(data[objectkeyname[i]]);
        }

        if (objectkeyname[i] == "fillPriority") {
            jQuery(".kie_editor > .panelr > .text_editor .fillPriority_type").css("display", "none");
            jQuery(".kie_editor > .panelr > .text_editor ." + data[objectkeyname[i]]).css("display", "");
			jQuery(".kie_editor > .panelr > .text_editor .fillPriority").val(data[objectkeyname[i]]);
        }
		if(typeof data["fillPriority"] === 'undefined'){
			 jQuery(".kie_editor > .panelr > .text_editor .fillPriority_type").css("display", "none");
            jQuery(".kie_editor > .panelr > .text_editor .color").css("display", "");
			jQuery(".kie_editor > .panelr > .text_editor .fillPriority").val("color");
		}
		if (data['fillPriority'] == "linear-gradient") {
			jQuery(".kie_editor > .panelr > .text_editor .fillPriority_type").css("display", "none");
            jQuery(".kie_editor > .panelr > .text_editor .linear-gradient ").css("display", "");
           
			jQuery(".kie_editor > .panelr > .text_editor .linear-gradient > .grad_select_text").css("background-image",data["bg_grad"]);
			jQuery(".kie_editor > .panelr > .text_editor .linear-gradient > .grad_select_text").attr("bg_grad", data["bg_grad"]);
			jQuery(".kie_editor > .panelr > .text_editor .linear-gradient > .grad_select_text").attr("grad_code", data["grad_code"]);
			jQuery(".kie_editor > .panelr > .text_editor .linear-gradient > .grad_select_text").attr("deg_code", data["deg_code"]);
			
        } 
		
    }
    // jQuery(".kie_editor > .panelr > .text_editor > .fill").val(standardize_color(data.fill));
    // jQuery(".kie_editor > .panelr > .text_editor > .align ").val(data.align);
    // jQuery(".kie_editor > .panelr > .text_editor > .fontSize").val(parseInt(data.fontSize));
    // jQuery(".kie_editor > .panelr > .text_editor > .fontFamily ").val(data.fontFamily);
    // jQuery(".kie_editor > .panelr > .text_editor > .text ").val(data.text);

}
function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function select_image(parrent) {


    var button = jQuery(this),
        custom_uploader = wp.media({
            title: 'Insert image',
            library: {
                // uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
                type: ['image/png', 'image/jpeg']
            },
            button: {
                text: 'Use this image' // button label text
            },
            multiple: false
        }).on('select', function () { // it also has "open" and "close" events
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            jQuery(parrent + " .image_preview").attr("src", attachment.url);
            jQuery(parrent + " .imagecurrentSrc").val(attachment.url);
            change_image_att('imagecurrentSrc');
        }).open();
}

function set_img_att_html(data) {
  
    var objectkeyname = Object.keys(data);
    for (var i = 0; i < objectkeyname.length; i++) {

        if (objectkeyname[i] == "image") {
            //console.log(objectkeyname[i]);
            jQuery(".kie_editor > .panelr > .image_editor .image_preview").attr("src", (data[objectkeyname[i]].currentSrc));
            jQuery(".kie_editor > .panelr > .image_editor .imagecurrentSrc").val((data[objectkeyname[i]].currentSrc));
        } else {
            jQuery(".kie_editor > .panelr > .image_editor ." + objectkeyname[i]).val(data[objectkeyname[i]]);
        }

        if (objectkeyname[i] == "fillPriority") {
            jQuery(".kie_editor > .panelr > .image_editor ." + data[objectkeyname[i]]).css("display", "");
        }
        if (objectkeyname[i] == "stroke" || objectkeyname[i] =="shadowColor") {
            jQuery(".kie_editor > .panelr > .image_editor ." + objectkeyname[i]).css("background-color", data[objectkeyname[i]]);
        }
    }

}

function open_panell_grad(eleclick) {
    localStorage.setItem("elesgrad", jQuery(eleclick).attr("class"));
    jQuery(".kie_editor > .panell > div").css("display", "none");
    call_grad("update");
	var grad_code = jQuery(eleclick).attr("grad_code");
    var deg_code = jQuery(eleclick).attr("deg_code");
    var bg_grad = jQuery(eleclick).attr("bg_grad");
	jQuery(".grad_code").val(grad_code);
	jQuery(".deg_code").val(deg_code);
	jQuery(".grad_show").css("background-image",bg_grad);
	if(grad_code!=null){
		select_grad();
		convert_grad_code_to_form(grad_code);
		}
	
	
}

function open_panell_color(eleclick) {
    //console.log(traverseUp( eleclick ));
    jQuery('.newcolor_input').val(jQuery(eleclick).val());
    addnewcolor("update");
    localStorage.setItem("elescolor", traverseUp( eleclick ));
    jQuery(".kie_editor > .panell > div").css("display", "none");
  
}
function traverseUp(el){
    var result = el.tagName + ':nth-child(' + (jQuery(el).index() + 1) + ')',
        pare = jQuery(el).parent()[0];
        
    if (pare.tagName !== undefined && pare.tagName !== 'BODY'){
        result = [traverseUp(pare), result].join('>');
    }
    
    return result;
};
function open_panell_font(eleclick) {
    call_font("update");
    localStorage.setItem("elesfont", eleclick);
    jQuery(".kie_editor > .panell > div").css("display", "none");
  
}

function send_action(method, action, data) {
    jQuery(".kie_editor > .panel >  .loading").css("display","");
    var form_data = new FormData();
    //console.log(Object.keys(data).length);
    for (var i = 0; i < Object.keys(data).length; i++) {

        var objkey = Object.keys(data);
        
        var dir = King_kie_script.siteurl;
        
        console.log(King_kie_script);
        form_data.append(objkey[i], data[objkey[i]]);
    }
    form_data.append('method', method);
    form_data.append('action', action);
    jQuery.ajax({
        url: dir+"/wp-json/wp/v2/KgIeMr_action",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: form_data
    }).done(function (e) {

        var retdata = e;
        //console.log(retdata);
        callback_data(retdata, method, action);
        jQuery(".kie_editor > .panel >  .loading").css("display","none");
    });
}

function addnewcolor(action) {
    var newcolor = jQuery(".newcolor_input").val();
    var data = {
        newcolor: newcolor
    };
    send_action("color", action, data);
}

function callback_data(response, method, action) {
    if (method == "color") {
        var itemcolor = JSON.parse(response);
        //console.log([...e]);
        jQuery(".list_color").html("");
        for (var i = 0; i < itemcolor.length; i++) {
            var new_item = '<div class="coloritem" onclick="click_color(this)" style="background-color: ' + itemcolor[i] + '!important;"></div>';
            jQuery(".list_color").append(new_item);
        }
        jQuery(".kie_editor > .panell").css("display", "");
        jQuery(".kie_editor > .panell > div").css("display", "none");
        jQuery(".kie_editor > .panell > .colorselctor").css("display", "");
    }
    if (method == "grad") {
        var itemgrad = JSON.parse(response);
        //console.log(Object.keys(itemgrad).length);
        jQuery(".grad_list").html("");
        for (var i = 0; i < Object.keys(itemgrad).length; i++) {
            var newarray = itemgrad[i];
            //console.log(itemgrad[i]);
            //console.log(newarray);
            var splite_grad_stop = newarray[0].split(",");
            var stop_grad = "";
            for (var e = 0; e < splite_grad_stop.length - 1; e = e + 2) {
                stop_grad = stop_grad + splite_grad_stop[e + 1] + " " + (splite_grad_stop[e] * 100) + "%";
                stop_grad = stop_grad + ",";
            }
            stop_grad = stop_grad.slice(0, -1);
            var new_item = '<div class="graditemitem" onclick="click_grad(this)" codegrad="' + newarray[0] + '" deg_code="' + newarray[1] + '" style="background-image:linear-gradient( ' + newarray[1] + "deg," + stop_grad + ') !important;"></div>';
            jQuery(".grad_list").append(new_item);
            jQuery(".kie_editor > .panell").css("display", "");
    jQuery(".kie_editor > .panell > div").css("display", "none");
    jQuery(".kie_editor > .panell > .gradselector").css("display", "");


        }
    }
    if (method == "font") {
        var itemgrad = JSON.parse(response);
        //console.log(Object.keys(itemgrad).length);
        jQuery(".font_list").html("");
        for (var i = 0; i < Object.keys(itemgrad).length; i++) {
            var newarray = itemgrad[i];
            //console.log(itemgrad[i]);
            //console.log(newarray);
            var splite_grad_stop = newarray[0].split(",");
            var stop_grad = "";
            for (var e = 0; e < splite_grad_stop.length - 1; e = e + 2) {
                stop_grad = stop_grad + splite_grad_stop[e + 1] + " " + (splite_grad_stop[e] * 100) + "%";
                stop_grad = stop_grad + ",";
            }
            stop_grad = stop_grad.slice(0, -1);
            var new_item = '<p class="fontitem" onclick="click_font(this)" fontname="'+newarray[1]+'" style="font-family: '+newarray[1]+';"> نوع قلم '+newarray[0]+'</p>';
            jQuery(".font_list").append(new_item);
            jQuery(".kie_editor > .panell").css("display", "");
    jQuery(".kie_editor > .panell > div").css("display", "none");
    jQuery(".kie_editor > .panell > .fontselector").css("display", "");
    var queryString = '?reload=' + new Date().getTime();
    var newhref = jQuery("#King_kie_font-css").attr("href").replace(/\?.*|$/, queryString);
    jQuery("#King_kie_font-css").attr("href",newhref);

        }
    }
}

function addnewgrad() {
    var new_stop_color = '<div class="stop_color"><input  oninput="convert_gradlist_to_grad()" class="color" type="color"><input oninput="convert_gradlist_to_grad()" class="pos" type="number" min="0" max="100" value="0"> <a class="close" onclick="jQuery(this).parent().remove()"> <span class="dashicons dashicons-no"></span></a></div>';
    jQuery(".grad_node_list").append(new_stop_color);
    convert_gradlist_to_grad();
}
function call_grad(action) {
    var new_css_grad = jQuery(".css_grad_code").val();
    var new_konva_grad = jQuery(".grad_code").val();
    var new_deg_grad = jQuery(".deg_code").val();
    var data = {
        new_konva_grad: new_konva_grad,
        new_deg_grad: new_deg_grad
    };
    send_action("grad", action, data);
}
function call_font(action) {
    var font_name= jQuery(".font_name").val();
    var font_url= jQuery(".font_url").val();
    var font_select_name= jQuery(".font_select_name").val();
    var data = {
        font_name: font_name,
        font_url: font_url,
        font_select_name:font_select_name
    };
    send_action("font", action, data);
}

function convert_gradlist_to_grad() {
    var deg_grad = jQuery(".deg_code").val();
    var res = 'linear-gradient(' + deg_grad + "deg ,";
    var code_grand = "";
    var css_grad_code = "";
    jQuery('.grad_node_list').children().each(function (i, obj) {
        var childe = jQuery(obj).children('input');
        var count = jQuery(".grad_node_list").children().length - 1;
        res = res + jQuery(childe[0]).val() + " " + jQuery(childe[1]).val() + "%";
        css_grad_code = css_grad_code + jQuery(childe[0]).val() + " " + jQuery(childe[1]).val() + "%";
        code_grand = code_grand + (jQuery(childe[1]).val() / 100) + "," + jQuery(childe[0]).val();
        if (count != i) {
            res = res + ",";
            css_grad_code = css_grad_code + ",";
            code_grand = code_grand + ",";
        }


    });
    res = res + ")";
    jQuery(".grad_code").val(code_grand);
    jQuery(".css_grad_code").val(css_grad_code);
    jQuery(".grad_show").css("background-image", res);
    //console.log(res);
    //return res;
}


function select_font (){
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var ele = localStorage.getItem("elesfont"); 
    var font_name = jQuery(".font_preview").css("font-family");
    jQuery("." + ele).val(font_name); 
    jQuery("." + ele).trigger("onchange");
    
}
function select_grad() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var ele = localStorage.getItem("elesgrad");
    var grad_konva = jQuery(".grad_code").val();
    var deg_code = jQuery(".deg_code").val();
    var bg_grad = jQuery(".grad_show").css("background-image");
    jQuery("." + ele).css("background-image", bg_grad);
    jQuery("." + ele).attr("grad_code", grad_konva);
    jQuery("." + ele).attr("deg_code", deg_code);
	stage.children[current_layer_id].children[current_itemid].setAttr("deg_code",deg_code);
	stage.children[current_layer_id].children[current_itemid].setAttr("grad_code",grad_konva);
	stage.children[current_layer_id].children[current_itemid].setAttr("bg_grad",bg_grad);
    var splitcode = grad_konva.split(",");
    var w = stage.children[current_layer_id].children[current_itemid].width();
    var h = stage.children[current_layer_id].children[current_itemid].height();
    var cx = w / 2;
    var cy = h / 2;
    var cssAng = deg_code;
    var canAng = cssAng - 90;
    var ang = (canAng - 90) * (Math.PI / 180);
    var hypt = cy / Math.cos(ang);
    var fromTopRight = cx - Math.sqrt(hypt * hypt - cy * cy);
    var diag = Math.sin(ang) * fromTopRight;
    var len = hypt + diag;

    var topX = cx + Math.cos(-Math.PI / 2 + ang) * len;
    var topY = cy + Math.sin(-Math.PI / 2 + ang) * len;
    var botX = cx + Math.cos(Math.PI / 2 + ang) * len;
    var botY = cy + Math.sin(Math.PI / 2 + ang) * len;
    stage.children[current_layer_id].children[current_itemid].fillLinearGradientColorStops(splitcode);
    stage.children[current_layer_id].children[current_itemid].fillLinearGradientStartPoint({
        x: topX,
        y: topY
    });
    stage.children[current_layer_id].children[current_itemid].fillLinearGradientEndPoint({
        x: botX,
        y: botY
    });
    stage.children[current_layer_id].draw();
    //console.log(stage);
}

function click_grad(ele) {
    var grad_code = jQuery(ele).attr("codegrad");
    var deg_code = jQuery(ele).attr("deg_code");
    var gradshow = jQuery(ele).css("background-image");
    jQuery(".grad_code").val(grad_code);
    jQuery(".deg_code").val(deg_code);
    jQuery(".grad_show").css("background-image", gradshow);
    convert_grad_code_to_form(grad_code);

}
function font_selector() {
    //e.preventDefault();

    var button = jQuery(".img_selector"),
        custom_uploader = wp.media({
            title: 'Insert woff font',
            library: {
                // uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
                type: 'application/font-woff'
            },
            button: {
                text: 'Use this font' // button label text
            },
            multiple: false
        }).on('select', function () { // it also has "open" and "close" eventsvar text_id = localStorage.getItem("itemid");
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            var getfile=custom_uploader.state().get('selection').first();
            console.log();
            jQuery(".font_url").val(attachment.url);
            jQuery(".font_name").val(getfile.attributes.title);
            jQuery(".font_select_name").val(getfile.attributes.title);
            call_font("newfont");
            
        }).open();
}
function click_font(ele) {
    var font_name = jQuery(ele).attr("fontname");
    jQuery(".font_preview").css("font-family", font_name);

}

function convert_grad_code_to_form(gradcode) {
    var splite_grad_stop = gradcode.split(",");
    var stop_grad = "";
    var new_stop_color = "";
    for (var e = 0; e < splite_grad_stop.length - 1; e = e + 2) {
        // stop_grad = stop_grad + splite_grad_stop[e + 1] + " " + (splite_grad_stop[e] * 100) + "%";
        // stop_grad = stop_grad + ",";
        new_stop_color = new_stop_color + '<div class="stop_color"><input  oninput="convert_gradlist_to_grad()" class="color" type="color" value="' + splite_grad_stop[e + 1] + '"><input oninput="convert_gradlist_to_grad()" class="pos" type="number" min="0" max="100" value="' + (splite_grad_stop[e] * 100) + '"> <a class="close" onclick="jQuery(this).parent().remove()"> <span class="dashicons dashicons-no"></span></a></div>';
    }
    jQuery(".grad_node_list").html(new_stop_color);
    return new_stop_color;
}

function click_color(ele) {
    var bgcolor = jQuery(ele).css("background-color");
    jQuery(".newcolor_input").val(rgb2hex(bgcolor));
}

function select_color() {
    var bgcolor = jQuery(".newcolor_input").val();
    var ele = localStorage.getItem("elescolor");
    jQuery( ele).val((bgcolor));
    jQuery( ele).css("background-color", (bgcolor));
    jQuery( ele).trigger("oninput");
}

function clonecurrentitem() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    if(stage.children[current_layer_id].children[current_itemid].attrs.name!="bgcolor"){
        var clone_obj=stage.children[current_layer_id].children[current_itemid].clone();
        stage.children[current_layer_id].add(clone_obj);
        get_all_layers();
        console.log(stage);
        stage.children[current_layer_id].draw();
    }
    
}

function move_up_c_item() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");

    var max = Object.keys(stage.children[current_layer_id].children).length;
    max = max - 2;
    if (max <= localStorage.getItem("itemid")) {
        localStorage.setItem("itemid", max);
    } else {
        stage.children[current_layer_id].children[current_itemid].moveUp();
        localStorage.setItem("itemid", parseInt(current_itemid) + 1);
    }
    get_all_layers();
    stage.children[current_layer_id].draw();
}

function move_down_c_item() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    //console.log(stage.children[current_layer_id].children[current_itemid]);

    if (current_itemid != "0" && (current_itemid - 1) != "0") {
        stage.children[current_layer_id].children[current_itemid].moveDown();
        localStorage.setItem("itemid", parseInt(current_itemid) - 1);
    }

    get_all_layers();
    stage.children[current_layer_id].draw();
}

function set_pen_att_html() {

    jQuery(".kie_editor > .panelr > .pen_editor > .line_width").val(localStorage.getItem("line_width"));
    jQuery(".kie_editor > .panelr > .pen_editor > .line_color ").val(localStorage.getItem("line_color"));
    jQuery(".kie_editor > .panelr > .pen_editor > .line_color ").css("background-color", localStorage.getItem("line_color"));
    jQuery(".kie_editor > .panelr > .pen_editor > .line_type").val(localStorage.getItem("line_type"));


}

function set_layer_att_html() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    // var bgcolor = stage.children[current_layer_id].children[0].getAttr("fill");
    // var opacity_layer = stage.children[current_layer_id].opacity();
    // jQuery(".kie_editor > .panelr > .layeroption > .bgcolor").val(bgcolor);
    // jQuery(".kie_editor > .panelr > .layeroption > .bgcolor").css("background-color", bgcolor);
    // jQuery(".kie_editor > .panelr > .layeroption > .opacity_layer ").val(opacity_layer);
    //jQuery( ".kie_editor > .panelr > .option > .line_color " ).css("background-color",localStorage.getItem("line_color"));
    //jQuery(".kie_editor > .panelr > .option > .line_type").val(localStorage.getItem("line_type"));
    var data = stage.children[current_layer_id].children[0].getAttrs();
    //console.log(data);
    var objectkeyname = Object.keys(data);
    for (var i = 0; i < objectkeyname.length; i++) {
        //console.log(objectkeyname[i]+data[objectkeyname[i]]);
        if (objectkeyname[i] == "fill") {
            jQuery(".kie_editor > .panelr > .layeroption ." + objectkeyname[i]).val(standardize_color(data[objectkeyname[i]]));
        } else {
            jQuery(".kie_editor > .panelr > .layeroption ." + objectkeyname[i]).val(data[objectkeyname[i]]);
        }

        if (objectkeyname[i] == "fillPriority") {
            jQuery(".kie_editor > .panelr > .layeroption div").css("display", "none");
            jQuery(".kie_editor > .panelr > .layeroption ." + data[objectkeyname[i]]).css("display", "");
        }
    }

}

function set_option_att_html() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    getnamefile();
    //jQuery( ".kie_editor > .panelr > .option > .line_color " ).css("background-color",localStorage.getItem("line_color"));
    //jQuery(".kie_editor > .panelr > .option > .line_type").val(localStorage.getItem("line_type"));


}

function change_layer_att(att) {
    var text_id = localStorage.setItem("itemid", 0);
    var current_layer_id = localStorage.getItem("current_layer_id");
    var get_item_select = jQuery(".kie_editor > .panelr > .layeroption  ." + att).val();
    //console.log(stage.children[current_layer_id].children[0]);
    if (att == "fill") {
        stage.children[current_layer_id].children[0].attrs.fill = get_item_select;
    }
    if (att == "fillPriority") {
        jQuery(".kie_editor > .panelr > .layeroption  div").css("display", "none");
        stage.children[current_layer_id].children[0].fillPriority((get_item_select));
        jQuery(".kie_editor > .panelr > .layeroption ." + get_item_select).css("display", "");
    }
    if (att == "fillPatternImage") {
        var imageObj = new Image();
        imageObj.onload = function () {
            stage.children[current_layer_id].children[0].fillPatternImage(imageObj);
            stage.children[current_layer_id].children[0].setAttr('image_url', get_item_select);
            stage.children[current_layer_id].draw();
        };
        imageObj.src = get_item_select;
        

    }
    if (att == "fillPatternRepeat") {
        stage.children[current_layer_id].children[0].fillPatternRepeat((get_item_select));
        stage.children[current_layer_id].children[0].setAttr('image_url_fillPatternRepeat', get_item_select);
    }
    if (att == "fillPatternX") {
        stage.children[current_layer_id].children[0].fillPatternX(parseFloat(get_item_select));
    }
    if (att == "fillPatternY") {
        stage.children[current_layer_id].children[0].fillPatternY(parseFloat(get_item_select));
    }
    if (att == "fillPatternOffsetX") {
        stage.children[current_layer_id].children[0].fillPatternOffsetX(parseFloat(get_item_select));
    }
    if (att == "fillPatternOffsetY") {
        stage.children[current_layer_id].children[0].fillPatternOffsetY(parseFloat(get_item_select));
    }
    if (att == "fillPatternScaleX") {
        stage.children[current_layer_id].children[0].fillPatternScaleX(parseFloat(get_item_select));
    }
    if (att == "fillPatternScaleY") {
        stage.children[current_layer_id].children[0].fillPatternScaleY(parseFloat(get_item_select));
    }
    if (att == "fillPatternRotation") {
        stage.children[current_layer_id].children[0].fillPatternRotation(parseFloat(get_item_select));
    }

    if (att == "opacity") {
        stage.children[current_layer_id].children[0].opacity(parseFloat(get_item_select));
    }
    stage.children[current_layer_id].draw();
}

function change_text_att(att,current_layer_id=localStorage.getItem("current_layer_id"),text_id=localStorage.getItem("itemid"),get_item_select=jQuery(".kie_editor > .panelr > .text_editor  ." + att).val()) {
    //var text_id = localStorage.getItem("itemid");
    //var current_layer_id = localStorage.getItem("current_layer_id");
    //var get_item_select = jQuery(".kie_editor > .panelr > .text_editor  ." + att).val();
    //console.log(get_item_select);
    //console.log(stage.children[current_layer_id].children[text_id]);
    // get scene draw function

 if (att == "x") {
        stage.children[current_layer_id].children[text_id].x(parseFloat(get_item_select));
    }
     if (att == "y") {
        stage.children[current_layer_id].children[text_id].y(parseFloat(get_item_select));
    }

    if (att == "fill") {
        stage.children[current_layer_id].children[text_id].attrs.fill = get_item_select;
    }
    if (att == "fillPriority") {
        jQuery(".kie_editor > .panelr > .text_editor > #Color_and_design div").css("display", "none");
        stage.children[current_layer_id].children[text_id].setAttr("fillPriority",(get_item_select));
        jQuery(".kie_editor > .panelr > .text_editor ." + get_item_select).css("display", "");
    }
    if (att == "fillPatternImage") {
        var imageObj = new Image();
        imageObj.onload = function () {
            stage.children[current_layer_id].children[text_id].fillPatternImage(imageObj);
            stage.children[current_layer_id].children[text_id].setAttr('image_url', get_item_select);

        };
        imageObj.src = get_item_select;
        stage.children[current_layer_id].children[text_id].fillPatternRepeat("no-repeat");
    }
    if (att == "fillPatternRepeat") {
        stage.children[current_layer_id].children[text_id].fillPatternRepeat((get_item_select));
        stage.children[current_layer_id].children[text_id].setAttr('image_url_fillPatternRepeat', get_item_select);
    }
    if (att == "fillPatternX") {
        stage.children[current_layer_id].children[text_id].fillPatternX(parseFloat(get_item_select));
    }
    if (att == "fillPatternY") {
        stage.children[current_layer_id].children[text_id].fillPatternY(parseFloat(get_item_select));
    }
    if (att == "fillPatternOffsetX") {
        stage.children[current_layer_id].children[text_id].fillPatternOffsetX(parseFloat(get_item_select));
    }
    if (att == "fillPatternOffsetY") {
        stage.children[current_layer_id].children[text_id].fillPatternOffsetY(parseFloat(get_item_select));
    }
    if (att == "fillPatternScaleX") {
        stage.children[current_layer_id].children[text_id].fillPatternScaleX(parseFloat(get_item_select));
    }
    if (att == "fillPatternScaleY") {
        stage.children[current_layer_id].children[text_id].fillPatternScaleY(parseFloat(get_item_select));
    }
    if (att == "fillPatternRotation") {
        stage.children[current_layer_id].children[text_id].fillPatternRotation(parseFloat(get_item_select));
    }
    if (att == "height") {
        stage.children[current_layer_id].children[text_id].height(parseFloat(get_item_select));

    }
    if (att == "width") {
        stage.children[current_layer_id].children[text_id].width(parseFloat(get_item_select));

    }




    if (att == "opacity") {
        stage.children[current_layer_id].children[text_id].opacity(parseFloat(get_item_select));
    }
    if (att == "fontStyle") {
        stage.children[current_layer_id].children[text_id].fontStyle(get_item_select);
    }
    if (att == "fontVariant") {
        stage.children[current_layer_id].children[text_id].fontVariant(get_item_select);
    }
    if (att == "verticalAlign") {
        stage.children[current_layer_id].children[text_id].verticalAlign(get_item_select);
    }
    if (att == "padding") {
        stage.children[current_layer_id].children[text_id].padding(parseFloat(get_item_select));
    }
    if (att == "lineHeight") {
        stage.children[current_layer_id].children[text_id].lineHeight(parseFloat(get_item_select));
    }
    if (att == "textDecoration") {
        stage.children[current_layer_id].children[text_id].textDecoration(get_item_select);
    }
    if (att == "wrap") {
        stage.children[current_layer_id].children[text_id].wrap(get_item_select);
    }
    if (att == "stroke") {
        stage.children[current_layer_id].children[text_id].stroke(get_item_select);
    }
    if (att == "strokeWidth") {
        stage.children[current_layer_id].children[text_id].strokeWidth(parseInt(get_item_select));
    }
    if (att == "lineJoin") {
        stage.children[current_layer_id].children[text_id].lineJoin(get_item_select);
    }
    if (att == "lineCap") {
        stage.children[current_layer_id].children[text_id].lineCap(get_item_select);
    }
    if (att == "shadowOpacity") {
        stage.children[current_layer_id].children[text_id].shadowOpacity(parseFloat(get_item_select));
    }
    if (att == "shadowOffsetX") {
        stage.children[current_layer_id].children[text_id].shadowOffsetX(parseInt(get_item_select));
    }
    if (att == "shadowOffsetY") {
        stage.children[current_layer_id].children[text_id].shadowOffsetY(parseInt(get_item_select));
    }
    if (att == "shadowBlur") {
        stage.children[current_layer_id].children[text_id].shadowBlur(parseInt(get_item_select));
    }
    if (att == "shadowColor") {
        stage.children[current_layer_id].children[text_id].shadowColor(get_item_select);
    }

    if (att == "align") {
        stage.children[current_layer_id].children[text_id].attrs.align = jQuery(".kie_editor > .panelr > .text_editor  .align").val();
    }
    if (att == "fontSize") {
        var font_size = parseInt(jQuery(".kie_editor > .panelr > .text_editor  .fontSize").val());
        stage.children[current_layer_id].children[text_id].fontSize(font_size);

        var item_width = stage.children[current_layer_id].children[text_id].getWidth();
        var item_height = stage.children[current_layer_id].children[text_id].getHeight();
        var item_scaleX = stage.children[current_layer_id].children[text_id].getScaleX();
        var item_scaleY = stage.children[current_layer_id].children[text_id].getScaleY();
        var item_textwidth = stage.children[current_layer_id].children[text_id].getTextWidth();
        var item_X = stage.children[current_layer_id].children[text_id].getX();
        var item_Y = stage.children[current_layer_id].children[text_id].getY();
        if (font_size < item_textwidth) {

            //stage.children[current_layer_id].children[text_id].setWidth((font_size*3)+item_textwidth);
        } else {
            //stage.children[current_layer_id].children[text_id].setWidth(font_size*3);
        }
        stage.children[current_layer_id].children[text_id]._partialTextX = (item_width / 2) + (item_textwidth / 2);




    }
    if (att == "fontFamily") {
        var fontfamilly_get = jQuery(".kie_editor > .panelr > .text_editor  .fontFamily").val();
        stage.children[current_layer_id].children[text_id].attrs.fontFamily = fontfamilly_get;
        jQuery(".kie_editor > .panelr > .text_editor  .show_font_prive").css("font-family",fontfamilly_get);

    }
    if (att == "text") {
        var text = jQuery(".kie_editor > .panelr > .text_editor  .text").val();
        stage.children[current_layer_id].children[text_id].setText(text);
        //stage.children[current_layer_id].children[text_id]._partialText = text;


    }

    stage.children[current_layer_id].draw();

    get_all_layers();
}

function change_fontview() {
    var fontfamilly_get = jQuery(".kie_editor > .panelr > .text_editor > #text  .fontFamily").val();
    //console.log(fontfamilly_get);
    jQuery("#text > p.show_font_prive").css("font-family", fontfamilly_get);
    jQuery(".kie_editor > .panel >  .loading").css("display","");
    setTimeout(function () {
        jQuery(".kie_editor > .panel >  .loading").css("display","none");
        change_text_att("fontFamily");
    }, 2000);

}

function change_pen_att(att) {
    var text_id = localStorage.getItem("itemid");
    var current_layer_id = localStorage.getItem("current_layer_id");
    //console.log(stage.children[current_layer_id].children[text_id]);
    if (stage.children[current_layer_id].children[text_id] != undefined && stage.children[current_layer_id].children[text_id].attrs.typerect == "line") {


        if (att == "line_type") {
            localStorage.setItem("line_type", jQuery(".kie_editor > .panelr > .pen_editor > .line_type").val());
            var mode = localStorage.getItem("line_type") === 'brush' ? 'source-over' : 'destination-out';
            stage.children[current_layer_id].children[text_id].globalCompositeOperation(mode);
        }
        if (att == "line_color") {
            //console.log(jQuery(".kie_editor > .panelr > .pen_editor > .line_color").val());
            localStorage.setItem("line_color", jQuery(".kie_editor > .panelr > .pen_editor > .line_color").val());
            stage.children[current_layer_id].children[text_id].setStroke(localStorage.getItem("line_color"));
        }
        if (att == "line_width") {
            localStorage.setItem("line_width", jQuery(".kie_editor > .panelr > .pen_editor > .line_width").val());
            stage.children[current_layer_id].children[text_id].setStrokeWidth(parseInt(localStorage.getItem("line_width")));
        }

        stage.children[current_layer_id].draw();
    } else {
        if (att == "line_type") {
            localStorage.setItem("line_type", jQuery(".kie_editor > .panelr > .pen_editor > .line_type").val());
            var mode = localStorage.getItem("line_type") === 'brush' ? 'source-over' : 'destination-out';

        }
        if (att == "line_color") {
            //console.log(jQuery(".kie_editor > .panelr > .pen_editor > .line_color").val());
            localStorage.setItem("line_color", jQuery(".kie_editor > .panelr > .pen_editor > .line_color").val());

        }
        if (att == "line_width") {
            localStorage.setItem("line_width", jQuery(".kie_editor > .panelr > .pen_editor > .line_width").val());

        }

    }

}

function removeitem() {
    var itemid = localStorage.getItem("itemid");
    var current_layer_id = localStorage.getItem("current_layer_id");
    if (itemid != "" && itemid != "0") {
        stage.children[current_layer_id].children[itemid].destroy();
        jQuery(".kie_editor > .panelr").children("*").css('display', "none");
		jQuery(".kie_editor > .panelr .layers").css('display', "");
       tr.nodes([]);
        stage.children[current_layer_id].draw();

    }


}

function change_image_att(att) {

    var text_id = localStorage.getItem("itemid");
    var current_layer_id = localStorage.getItem("current_layer_id");
    var get_item_select = jQuery(".kie_editor > .panelr > .image_editor  ." + att).val();
    if (att == "width") {
        stage.children[current_layer_id].children[text_id].width(parseInt(get_item_select));

    }
    if (att == "height") {
        stage.children[current_layer_id].children[text_id].setAttr("height", parseInt(get_item_select));
    }
    if (att == "shadowColor") {
        stage.children[current_layer_id].children[text_id].shadowColor(get_item_select);
    }
    if (att == "shadowBlur") {
        stage.children[current_layer_id].children[text_id].shadowBlur(parseInt(get_item_select));
    }
    if (att == "shadowOffsetY") {
        stage.children[current_layer_id].children[text_id].shadowOffsetY(parseInt(get_item_select));
    }
    if (att == "shadowOffsetX") {
        stage.children[current_layer_id].children[text_id].lineCap('butt');
        stage.children[current_layer_id].children[text_id].shadowOffsetX(parseInt(get_item_select));
    }
    if (att == "lineJoin") {
        stage.children[current_layer_id].children[text_id].lineJoin(get_item_select);

    }
    if (att == "shadowOpacity") {
        stage.children[current_layer_id].children[text_id].shadowOpacity(parseFloat(get_item_select));
    }
    if (att == "opacity") {
        stage.children[current_layer_id].children[text_id].opacity(parseFloat(get_item_select));
    }
    if (att == "strokeWidth") {
        stage.children[current_layer_id].children[text_id].strokeWidth(parseInt(get_item_select));
    }
    if (att == "stroke") {
        stage.children[current_layer_id].children[text_id].stroke(get_item_select);
    }
    if (att == "imagecurrentSrc") {
        //stage.children[current_layer_id].children[text_id].setImage(jQuery(".kie_editor > .panelr > .image_editor > .imagecurrentSrc").val());
        var imageObj2 = new Image();
        imageObj2.onload = function () {
            //card.image(imageObj2);
            stage.children[current_layer_id].children[text_id].setImage(imageObj2);
            stage.children[current_layer_id].children[text_id].getLayer().draw();

        };
        imageObj2.src = jQuery(".kie_editor > .panelr > .image_editor  .imagecurrentSrc").val();
    }
    //transformers_forceupdate();
    stage.children[current_layer_id].draw();


}

function transformers_remover() {
    layers = stage.children;
    jQuery.each(layers, function (i) {

        stage.children[i].draw();

        jQuery.each(stage.children[i].children, function (e) {

            if (stage.children[i].children[e] != null) {
                if (stage.children[i].children[e].attrs.name == 'rected') {

                    stage.children[i].children[e].destroy();

                } else {}
            }
        });


    });
	console.log(stage.children);
}

function transformers_forceupdate() {
    layers = stage.children;
    jQuery.each(layers, function (i) {

        stage.children[i].draw();

        jQuery.each(stage.children[i].children, function (e) {

            if (stage.children[i].children[e] != null) {
                if (stage.children[i].children[e].attrs.name == 'rected') {

                    var data = stage.children[i].children[e]._cache;

                } else {}
            }
        });


    });
}

function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function opacitychange() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var opacity_layer = parseFloat(jQuery(".opacity_layer").val());
    stage.children[current_layer_id].opacity(opacity_layer);
    //stage.children[current_layer_id].children[0].opacity(opacity_layer);
    //stage.children[current_layer_id].children[0].destroy();

    stage.children[current_layer_id].draw();

}

function bgcolorchange() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    //stage.children[current_layer_id].setAttr("fill",jQuery('.bgcolor').val());
    //stage.container().style.backgroundColor = jQuery('.bgcolor').val();
    //console.log(stage);
    if (stage.children[current_layer_id].hasChildren() > 0 && stage.children[current_layer_id].children[0].getName() == "bgcolor") {
        //console.log("0");

        stage.children[current_layer_id].children[0].attrs.fill = jQuery('.bgcolor').val();
    } else {
        //console.log("1");
        var new_bg = new Konva.Rect({

            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            illLinearGradientStartPoint: {
                x: 0,
                y: 0
            },
            fillLinearGradientEndPoint: {
                x: stage.width(),
                y: stage.height()
            },
            // gradient into transparent color, so we can see CSS styles
            fill: jQuery('.bgcolor').val(),
            name: "bgcolor",
            typerect: "bgcolor",
            // remove background from hit graph for better perf
            // because we don't need any events on the background
            listening: false
        });
        new_bg.setName("bgcolor");
        stage.children[current_layer_id].add(new_bg);
    }



    stage.children[current_layer_id].children[0].moveToBottom();

    stage.children[current_layer_id].draw();
    get_all_layers();
}

function effect_change(effect, input) {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var current_val_effect = jQuery(input).val();
    console.log(stage);
    stage.children[current_layer_id].filters([Konva.Filters.RGBA]);
    if (effect == "alpha") {
        stage.children[current_layer_id].alpha(current_val_effect);
    }
    if (effect == "blue") {
        stage.children[current_layer_id].blue(current_val_effect);
    }
    if (effect == "green") {
        stage.children[current_layer_id].green(current_val_effect);
    }
    stage.children[current_layer_id].draw();
    get_all_layers();
}

function objSize(obj) {
    var count = 0;

    if (typeof obj == "object") {

        if (Object.keys) {
            count = Object.keys(obj).length;
        } else if (window._) {
            count = _.keys(obj).length;
        } else if (window.$) {
            count = $.map(obj, function () {
                return 1;
            }).length;
        } else {
            for (var key in obj)
                if (obj.hasOwnProperty(key)) count++;
        }

    }

    return count;
};

function change_curent_layer(name, id) {
    localStorage.setItem("current_layer", name);
    localStorage.setItem("current_layer_id", id);
    jQuery(".layers >  ul > li").css('border', '0px');
    jQuery(".layers >  ul > ." + name).css('border', '#9E9E9E solid 1px');

    jQuery(".kie_editor > .panelr").children("*").css('display', "none");
    jQuery(".kie_editor > .panelr > .layeroption").css('display', '');
    jQuery(".kie_editor > .panelr > .layers").css('display', '');
    get_all_layers();
    set_layer_att_html();
}

function remove_curent_layer() {
    var name = localStorage.getItem("current_layer");
    if (name != null) {
        layers = stage.children;
        var id_remove_item;
        jQuery.each(layers, function (i) {
            if (stage.children[i].attrs.name == name) {
                id_remove_item = i;
            } else {

            }

        });
        //console.log(stage);
        if(stage.children.length==1){
            layer.add(all_layer["background"]);
            stage.add(layer);
            stage.children[id_remove_item].remove();
            //stage.children[id_remove_item].destroy();
           
           
        }else{
            stage.children[id_remove_item].remove();
        }
        
        get_all_layers();

        jQuery(".layers >  ul > ." + name).remove();
        get_all_layers();
        //console.log();
        localStorage.setItem("current_layer", stage.children[0].attrs.name);
    }
}

function add_layer() {
    var newbg = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: "#000000",
        name: "bgcolor",
        fillPriority: 'color',
        fillPatternRepeat: 'repeat',
        fillPatternX:0,
        fillPatternY:0,
        fillPatternOffsetX:0,
        fillPatternOffsetY:0,
        fillPatternScaleX:1,
        fillPatternScaleY:1,
        fillPatternRotation: 0,
        image_url: "",
        opacity: 1,
        typerect: "bgcolor"
    });

    var countlayer = objSize(stage.children);
    var new_id_layer;
    layers = stage.children;
    jQuery.each(layers, function (i) {
        if (stage.children[i].attrs.name == 'layer' + i) {} else {
            new_id_layer = i;
        }

    });
    var new_layer_name = 'layer' + new_id_layer;
    var layer = new Konva.Layer({
        name: new_layer_name,
        id: "background"
    });
    layer.add(newbg);
    stage.add(layer);
    get_all_layers();

}

function selectitem(layerid, itemid,childeid=null) {
	var intlayerid = parseInt(layerid);
    var intitemid = parseInt(itemid);
	if(childeid!=null){
	var e = stage.children[intlayerid].children[itemid].children[parseInt(childeid)];
	}else{
		var e = stage.children[intlayerid].children[itemid];
	}   
    if (!e.hasName('rect')) {
        localStorage.setItem("Paint", false);
        return;
    } else {
        localStorage.setItem("Paint", false);
		jQuery(".kie_editor > .panelr >  div").css('display', 'none');
		jQuery(".panelr").css('display', '');
		jQuery(".kie_editor > .panelr  .layers").css('display', '');
		localStorage.setItem("itemid", e.index);

        if (e.attrs.typerect == "text") {
            jQuery(".kie_editor > .panelr > .text_editor").css('display', '');
            set_text_att_html(e.attrs);
        }
        if (e.attrs.typerect == "image") {
			jQuery(".kie_editor > .panelr > .image_editor").css('display', '');
            set_img_att_html(e.attrs);
        }

        if (e.attrs.typerect == "svg") {
            jQuery(".kie_editor > .panelr > .shape_editor").css('display', '');
		}
        if (e.attrs.typerect == "line") {
			localStorage.setItem("Paint", true);
            jQuery(".kie_editor > .panelr  .pen_editor").css('display', '');
		}

        //transformers_remover();
        var current_layer_id = localStorage.getItem("current_layer_id");
        //stage.children[current_layer_id].draw();
        localStorage.setItem("current_layer", e.parent.attrs.name);
        localStorage.setItem("current_layer_id", e.parent.index);



    }
//	console.log(e.getType());
//	console.log(stage);
//	console.log(e);
	tr.nodes([e]);
	if (e.getType() == "Group") {
			localStorage.setItem("current_layer", e.parent.attrs.name);
        localStorage.setItem("current_layer_id",e.parent.index);
			stage.children[e.parent.index].add(tr);
			  stage.children[e.parent.index].draw();
		
		}else if(e.parent.getType() == "Group"){
				localStorage.setItem("current_layer", e.parent.parent.attrs.name);
        localStorage.setItem("current_layer_id", e.parent.parent.index);
		stage.children[e.parent.parent.index].add(tr);	
			  stage.children[e.parent.parent.index].draw();
		}else{
		localStorage.setItem("current_layer", e.parent.attrs.name);
        localStorage.setItem("current_layer_id", e.parent.index);
		stage.children[e.parent.index].add(tr);	
			  stage.children[e.parent.index].draw();
		}
	
	
	//get_all_layers();

}

function replace_xml(current_image) {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");

    if (current_itemid != "" && stage.children[current_layer_id].children[current_itemid].attrs.typerect == 'svg') {


        //console.log(current_image);
        //var current_image=stage.children[current_layer_id].children[current_itemid].attrs.svgorg;

        jQuery('.loadedsvg').attr("src", xmlToString(jQuery.parseXML(current_image), ""));
        var load_image = jQuery('.loadedsvg').attr("src");
        var imageObj = new Image();
        imageObj.onload = function () {
//console.log(current_image);
                var x2js = new X2JS();
				var svgjson=x2js.xml_str2json((current_image));

            stage.children[current_layer_id].children[current_itemid].attrs.svgorg = jQuery.parseXML(current_image);
			stage.children[current_layer_id].children[current_itemid].attrs.svgjson =svgjson;
            stage.children[current_layer_id].children[current_itemid].image(imageObj);
            stage.children[current_layer_id].draw();





        };
        imageObj.src = load_image;

    } else {

    }
//	console.log(stage.children[current_layer_id].children[current_itemid]);
}

function get_all_layers() {
    jQuery(".layers >  ul").html('');
    layers = stage.children;
    //console.log(layers);
    var number = 0;
    jQuery.each(layers, function (i) {
        var html_li = '<li class="' + stage.children[i].attrs.name + '" >';
        html_li = html_li + '<div class="header_layer" onclick="change_curent_layer(\'' + stage.children[i].attrs.name + '\',' + number + ')">';
        html_li = html_li + stage.children[i].attrs.name;

        html_li = html_li + '</div>';
        //html_li=html_li+'<span onclick="option_curent_layer(\''+i+'\')" class="dashicons dashicons-admin-tools"></span>';
        //html_li=html_li+'<span   class="dashicons dashicons-trash"></span>';

        jQuery.each(stage.children[i].children, function (t) {
            if (stage.children[i].children[t].attrs.typerect != "transform" && stage.children[i].children[t].attrs.name != "bgcolor"  && stage.children[i].children[t].attrs.name != "selection" && stage.children[i].children[t].attrs.typerect != "group") {
                html_li = html_li + '<div class="l_item" onclick="selectitem(\'' + i + '\',\'' + t + '\')">';
                //html_li=html_li+'<span   class="dashicons dashicons-admin-tools l_item_select"></span>';
                //console.log(stage.children[i].children[t].attrs.name);
                html_li = html_li + stage.children[i].children[t].attrs.typerect;
                html_li = html_li + '</div>';
            }
			if(stage.children[i].children[t].attrs.typerect == "group"){
				html_li = html_li + '<div class="lgroup">';
				html_li = html_li + '<div class="tgroup" >';
				html_li = html_li + '<span onclick="collapsible_div(\'plus\',\''+t+'\');" class="dashicons dashicons-plus-alt2 plus plus'+t+'"></span>';
				html_li = html_li + '<span onclick="collapsible_div(\'minus\',\''+t+'\');" class="dashicons dashicons-minus minus minus'+t+'" style="display:none;"></span>';
				html_li = html_li + '<span onclick="selectitem(\'' + i + '\',\'' + t + '\'); " class="dashicons dashicons-external select_item"></span>';
				html_li = html_li + stage.children[i].children[t].attrs.name_group;
				html_li = html_li + '</div>';
				html_li = html_li + '<div class="lgroup_list" id="lgroup'+t+'" style="display:none;">';
				jQuery.each(stage.children[i].children[t].children, function (e) {
					html_li = html_li + '<div class="lgroup_item"   onclick="selectitem(\'' + i + '\',\'' + t + '\',\''+e+'\')">';
                //html_li=html_li+'<span   class="dashicons dashicons-admin-tools l_item_select"></span>';
                //console.log(stage.children[i].children[t].attrs.name);
                html_li = html_li + stage.children[i].children[t].children[e].attrs.typerect;
                html_li = html_li + '</div>';
					});
				 html_li = html_li + '</div>';
				html_li = html_li + '</div>';
			}
			 

        });


        html_li = html_li + '</li>';
        jQuery(".layers >  ul").append(html_li);
        number = number + 1;

    });
    name = localStorage.getItem("current_layer");
    jQuery(".layers >  ul > li").css('border', '0px');
    jQuery(".layers >  ul > ." + name).css('border', '#9E9E9E solid 1px');
}
function collapsible_div(action,lgroupid){
if(action=="plus"){
	jQuery(".layers > ul > li  > .lgroup #lgroup"+lgroupid).css("display","block");
	jQuery(".minus"+lgroupid).css("display","block");
	jQuery(".plus"+lgroupid).css("display","none");
}else if(action=="minus"){
	jQuery(".layers > ul > li  > .lgroup #lgroup"+lgroupid).css("display","none");
	jQuery(".plus"+lgroupid).css("display","block");
	jQuery(".minus"+lgroupid).css("display","none");
}
}
function unpack_group(layerid,itemid){
	//console.log(layerid);
	//console.log(stage.children[layerid].children[itemid]);
	var back_layer=layerid;
	var group_childe=stage.children[layerid].children[itemid].children.toArray();

	 for ( var i = 0; i < group_childe.length; i++ ) {
		 group_childe[i].draggable(true);
			stage.children[layerid].add(group_childe[i]);
	 }
	stage.children[layerid].children[itemid].destroy();
	stage.batchDraw();
	//console.log(stage);
}

function save_button() {
    //console.log(stage);
    transformers_remover();
    //var dataURL = stage.toDataURL({ pixelRatio: 3 });
    var width = parseFloat(localStorage.getItem("width"));
    var height = parseFloat(localStorage.getItem("height"));
    var rwidth = parseFloat(localStorage.getItem("rwidth"));
    var rheight = parseFloat(localStorage.getItem("rheight"));
    var max_width = parseFloat(localStorage.getItem("max_width"));
    var max_height = parseFloat(localStorage.getItem("max_height"));
    // get node size
    var size = stage.size();
    var x = size.x;
    var y = size.y;

    // set size
    stage.scale({
        x: (max_width),
        y: (max_height)
    });
    stage.size({
        width: (rwidth),
        height: (rheight)
    });
    //console.log(max_width);
    //change_att_all_layers("width",rwidth);
    //change_att_all_layers("height",rheight);
    // if(rwidth==rheight){
    //     stage.setWidth(500);
    //     stage.setHeight(498);
    // }
    stage.children[0].draw();
    stage.batchDraw;
    //console.log(stage);

    //console.log(stage);
    var dataURL = stage.toDataURL({
        width: rwidth,
        height: rheight
    });
    // const box = layer.getClientRect({
    //     relativeTo: stage
    // });
    //const { width, height } = box;
    //console.log(box);
    //
    //downloadURI(dataURL, 'stage.png');
    //            var base64ImageContent = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //            var blob = base64ToBlob(base64ImageContent, 'image/png');
    //
    send_new_post_image(dataURL, 'stage', 'png');
    stage.scale({
        x: 1,
        y: 1
    });
    stage.size({
        width: width,
        height: height
    });
}

function change_att_all_layers(nameatt, valueatt) {

    layers = stage.children;
    //console.log(layers);
    var number = 0;
    jQuery.each(layers, function (i) {
        stage.children[i].setAttr(nameatt, valueatt);

    });


}

function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {
        type: mime
    });
}


function send_new_post_image(image_post, filename, filtype) {
    var formData = new FormData();
    formData.append('image_post', image_post);
    formData.append('filename', localStorage.getItem("namefile"));
    formData.append('filtype', filtype);
    formData.append('width', localStorage.getItem("rwidth"));
    formData.append('height', localStorage.getItem("rheight"));
var dir = King_kie_script.siteurl;
    jQuery.ajax({
            url: dir+"/wp-json/wp/v2/KgIeMr_newimage",
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formData
        })
        .done(function (e) {
            var hstr = datajs.saveh;
            var mstr = datajs.savem;
            open_msg(hstr, mstr, "#8BC34A", "white");

        });



}


function option_button() {
    get_all_layers();
    jQuery(".kie_editor > .panelr").children("*").css('display', "none");
    jQuery(".panelr").css('display', '');
    jQuery(".kie_editor > .panelr > .option").css('display', '');
    jQuery(".kie_editor > .panelr > .layers").css('display', 'none');
    getnamefile();
}

function changenamefile() {
    var namefile = jQuery(".namefile").val();
    localStorage.setItem("namefile", namefile);
}

function getnamefile() {
    var namefile = localStorage.getItem("namefile");
    jQuery(".namefile").val(namefile);
    return namefile;
}

function paint_button() {
    get_all_layers();
    jQuery(".panelr").css('display', '');
    jQuery(".kie_editor > .panelr").children("*").css('display', "none");
    jQuery(".kie_editor > .panelr > .pen_editor").css('display', '');
    jQuery(".kie_editor > .panelr > .layers").css('display', '');
    localStorage.setItem("Paint", true);
    set_pen_att_html();
}

function set_svg_file(fileselect) {
    var file_patch = jQuery(fileselect).val();
    var res = file_patch.replace(/\\/g, "@");

    var newResult = res.split("@");

    var file_name = newResult[newResult.length - 1];

    jQuery('.support-title').val(file_name);
    var supporttitle = jQuery('.support-title').val();

    var querytype = jQuery('.support-query').val();
    var file_data = jQuery('#sortpicture').prop('files')[0];

    var form_data = new FormData();
    if (supporttitle == '') {
        jQuery('.support-title').css({
            "border": "1px solid red"
        });
        return false;
    } else {
        jQuery('.support-title').css({
            "border": "1px solid #e3ecf0"
        });
    }

    form_data.append('file', file_data);
    form_data.append('action', 'md_support_save');
    form_data.append('supporttitle', supporttitle);
var dir = King_kie_script.siteurl;


    jQuery.ajax({
        url: dir+"/wp-json/wp/v2/KgIeMr_svginsert",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: form_data
    }).done(function (e) {
        console.log(e);
        jQuery('.loadedsvg').attr("src", e);
    });

}

function select_svg(image) {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var color = jQuery(".svg_color").val();
    jQuery.get(image.src).success(function (data) {
        //console.log(data);
        localStorage.setItem("select_svg", xmlToString(data, color));
        var SVG = localStorage.getItem("select_svg");


        Konva.Image.fromURL(SVG, image => {

            image.draggable(true);
            image.name('rect');
            image.attrs['typerect'] = 'svg';
            image.attrs['svgorg'] = data;
            stage.children[current_layer_id].add(image);
            stage.children[current_layer_id].draw();
        });
        alert("selected");
    });
    get_all_layers();
}


function svg_change_color() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    var color = jQuery(".svg_color").val();
    if (current_itemid != "" && stage.children[current_layer_id].children[current_itemid].attrs.typerect == 'svg') {
        var width = stage.children[current_layer_id].children[current_itemid].getWidth();
        var Height = stage.children[current_layer_id].children[current_itemid].getHeight();
        var current_image = stage.children[current_layer_id].children[current_itemid].attrs.svgorg;

        var new_image = xmlToString(current_image, color);

        jQuery('.loadedsvg').attr("src", new_image);
        var load_image = jQuery('.loadedsvg').attr("src");
        var imageObj = new Image();
        imageObj.onload = function () {
            stage.children[current_layer_id].children[current_itemid].image(imageObj);
            stage.children[current_layer_id].draw();
        };
        imageObj.src = load_image;

    } else {
        jQuery.get(datajs.wpsvg, null, function (data) {
            var new_image = xmlToString(data, color);
            jQuery('.loadedsvg').attr("src", new_image);
        }, 'xml');
        //var current_image='<?php echo plugins_url('fonts/SVG/wordpress.svg', __FILE__); ?>';

    }
}

function xmlToString(xmlData, color) {
    // 1. Keep a DOM reference to the SVG element
    //var SVGDomElement = document.getElementById("mySvgElement");
    j = jQuery(xmlData);
    //j.find('path').attr('fill', color);

    //var patt1 = new RegExp("fill=\"(.*?)\"");
    // SVG = xmlData.replace(patt1, '#FFEB3B');
    // 2. Serialize element into plain SVG
    var serializedSVG = new XMLSerializer().serializeToString(xmlData);

    // 3. convert svg to base64
    var base64Data = window.btoa(serializedSVG);
    // The generated string will be something like:
    // PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdm.........

    // If you want to display it in the browser via URL:

    return "data:image/svg+xml;base64," + base64Data;
}


function shape_button() {
    var current_layer_id = localStorage.getItem("current_layer_id");
    var current_itemid = localStorage.getItem("itemid");
    get_all_layers();
    jQuery(".panelr").css('display', '');
    jQuery(".kie_editor > .panelr").children("*").css('display', "none");
    jQuery(".kie_editor > .panelr > .shape_editor").css('display', '');
    jQuery(".kie_editor > .panelr > .layers").css('display', '');


}


function addtext_button() {

    var Text = new Konva.Text({
        x: 20,
        y: 60,
        scaleX: 1,
        scaleY: 1,
        text: datajs.textnewtext,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#ffffff',
        width: 100,
        height: 100,
        padding: 20,
        align: 'center',
        draggable: true,
        name: 'rect',
        typerect: 'text',
        fillPriority: 'color',
        fillPatternRepeat: 'repeat',
        fillPatternX:0,
        fillPatternY:0,
        fillPatternOffsetX:0,
        fillPatternOffsetY:0,
        fillPatternScaleX:1,
        fillPatternScaleY:1,
        fillPatternRotation: 0,
        image_url: "",
        opacity: 1,
        fontStyle: "normal",
        fontVariant: "normal",
        verticalAlign: "middle",
        lineHeight: 1,
        textDecoration: "",
        wrap: "word",
        strokeWidth: 0,
        stroke: "#ffffff",
        lineJoin: "miter",
        lineCap: "butt",
        shadowColor: "#ffffff",
        shadowOpacity: 1,
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
        fillAfterStrokeEnabled: true
    });



    var name = localStorage.getItem("current_layer");
    if (name != null) {
        layers = stage.children;
        var id_remove_item;
        jQuery.each(layers, function (i) {
            if (stage.children[i].attrs.name == name) {
                stage.children[i].add(Text);

                stage.children[i].draw();

            } else {

            }

        });
        get_all_layers();


    }

}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function stage_action(action){
if(action=="save"){
   
    //console.log(stage.toJSON());
var namefile=localStorage.getItem("namefile");
	stage.setAttr("filename",namefile);
//	console.log(stage.toJSON());
    download(namefile+".kingie",stage.toJSON());
}

if(action=="opendialog"){
    var input = jQuery('<input/>').attr('type', "file").attr('name', "file").attr('id', "file").attr('accept', ".kingie").css("display","none");
    jQuery(".panel_left").append(input).attr("onchange","stage_action('load');");
    jQuery("#file").trigger("click");
    
    
}
    if(action=="load"){
   var fileReader = new FileReader();
    fileReader.readAsText(jQuery('#file').prop('files')[0]);
    //var filename=jQuery('#file').prop('files')[0].name;
    //localStorage.setItem("namefile",filename.split('.').slice(0, -1).join('.'));
    //console.log(jQuery('#file').prop('files')[0].name);
    fileReader.onload = function () {
      var data = fileReader.result;  // data <-- in this var you have the file data in Base64 format
        //console.log(jQuery('#file').prop('files')[0]);
        var stage_json=(data);
    var stage_obj = JSON.parse(stage_json);
load_stage(stage_obj.attrs.filename,stage_obj.attrs.width,stage_obj.attrs.height,stage_json);
stage.draw();

get_all_layers();
    };
    jQuery('#file').val("");
    
    //console.log(jQuery('#file').prop('files'));
    
}
    
}
function load_stage(name,width,height,jsondata) {
    //jQuery(".kie_blackscreen").css('display', '');
    jQuery(".startpanel").css('display', ' none');
    jQuery("#container").css('display', '');
    jQuery(".panel").css('display', '');
   localStorage.setItem("namefile", name);
   var get_userrw = width;
   var real_w = get_userrw;
   var get_userrh =height;
   var real_h = get_userrh;
   localStorage.setItem("rwidth", real_w);
   localStorage.setItem("rheight", real_h);
   
   if (get_userrw > get_userrh) {
           var drasad_100 = get_userrw / 100;
           var drasad_75 = get_userrh / drasad_100;
           var w_wpcontent = 500;
           var h_wpcontent = drasad_75 * 5;
           var max_width = get_userrw / 500;
           var max_height = get_userrw / 500;
       } else if (get_userrw < get_userrh) {
           var drasad_100 = get_userrh / 100;
           var drasad_75 = get_userrw / drasad_100;
           var w_wpcontent = drasad_75 * 5;
           var h_wpcontent = 500;
           var max_width = get_userrh / 500;
           var max_height = get_userrh / 500;
       } else if (get_userrw == get_userrh) {
//           get_userrw = get_userrw;
//           get_userrh = get_userrh;
           var w_wpcontent = 500;
           var h_wpcontent = 500;
           var max_width = get_userrw / 500;
           var max_height = get_userrh / 500;
       }
   
   
       get_userrw = parseFloat(w_wpcontent);
       get_userrh = parseFloat(h_wpcontent);
       localStorage.setItem("width", get_userrw);
       localStorage.setItem("height", get_userrh);
       localStorage.setItem("max_width", parseFloat(max_width));
       localStorage.setItem("max_height", parseFloat(max_height));
   var kie_editor_width=get_userrw + parseInt(jQuery(".panelr").width())+parseInt(jQuery(".panel_left").width());
       jQuery(".kie_editor").css("width",kie_editor_width);
       jQuery(".kie_editor").css("height", get_userrh + parseInt(jQuery(".panel").height()));
       starteditor(get_userrw, get_userrh ,jsondata);
       if(datajs.rtl_lang==1){
             jQuery(".konvajs-content").css("margin-right", jQuery(".panelr").width());
       jQuery(".konvajs-content").css("margin-left:", jQuery(".panel_left").width());
       }else{
             jQuery(".konvajs-content").css("margin-left", jQuery(".panelr").width());
       jQuery(".konvajs-content").css("margin-right:", jQuery(".panel_left").width());
       }
     
    
   }

function addimage_button() {


    var current_layer_id = localStorage.getItem("current_layer_id");
    var imageObj = new Image();
    var layer = stage.children[current_layer_id];
    imageObj.onload = function () {
        var yoda = new Konva.Image({
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            image: imageObj,
            image_url: datajs.imgsrc,
            draggable: true,
            name: 'rect',
            typerect: 'image',
            strokeWidth: 0,
            stroke: "#ffffff",
            opacity: 1,
            shadowBlur: 0,
            shadowColor: "#ffffff",
            shadowOpacity: 1,
            shadowOffsetY: 0,
            shadowOffsetX: 0,
            lineJoin: "miter"

        });
     
        stage.children[current_layer_id].add(yoda);
        stage.children[current_layer_id].batchDraw();
        get_all_layers();
    };
    imageObj.src = datajs.imgsrc;

    get_all_layers();
}

function maineffect_button() {
    get_all_layers();
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


function kingie_open_tab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
// window.setInterval(function(){
//    if(stage!=null){
//     stage.batchDraw();
//    }
//   }, 5000);

function open_store(){
	 jQuery(".kie_editor > .panell > div").css("display", "none");
	 jQuery(".kie_editor > .panell").css("display","");
	jQuery(".kie_editor > .panell > .king_store").css("display","");
}