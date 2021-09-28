<?php //include( ABSPATH . 'wp-admin/includes/image.php' );
/*
Plugin Name:king_IE
Plugin URI: http://kingblack.ir
Description:تصویر ساز قدرتمند  شاه سیاه 
Author: سید محسن سادات رسول
Version: 1.0
Author URI: http://kingblack.ir/
Text Domain: kie
Domain Path: /lang/
*/
 //Function Long  Name  : King Image Maker
//Function short  Name  : KgIeMr
if ( ! defined( 'ABSPATH' ) ) exit; 

//@
function KgIeMr_textdomain() {
  load_plugin_textdomain( 'kie', false, basename( dirname( __FILE__ ) ) . '/lang' ); 
}
add_action( 'init', 'KgIeMr_textdomain' );
//@ end

//@ add to admin menu
function KgIeMr_menu() {
		add_menu_page(
			__( 'تصویر ساز', 'kie' ),
			__( 'تصویر ساز', 'kie' ),
			'manage_options',
			'kingIE',
			'KgIeMr_menu_page_contents',
			plugins_url('icon.png',__FILE__),3
		);
   
  }
  add_action( 'admin_menu', 'KgIeMr_menu' );
//@ 
//@  html page
	function KgIeMr_menu_page_contents() {
    $json_font=KgIeMr_font("update","","","");
    
    wp_enqueue_style('King_kie_font', plugins_url('fonts/kie_font.css',__FILE__));
wp_enqueue_style('King_kie_style', plugins_url('kie_style.css',__FILE__));
wp_style_add_data( 'King_kie_style', 'rtl', "replace" );
//wp_enqueue_style('King_kie_xonomy', plugins_url('xonomy/xonomy.css',__FILE__));
//wp_enqueue_style('King_kie_chromoselector', plugins_url('src/chromoselector.css',__FILE__));
//wp_enqueue_script( 'King_kie_chromoselector', plugins_url('src/chromoselector.js', __FILE__), array('jquery') );
//wp_enqueue_script( 'King_kie_xonomy', plugins_url('xonomy/xonomy.js', __FILE__), array('jquery') );
//        wp_localize_script('King_kie_script', 'King_kie_script', array('pluginsUrl' => plugins_url(),));
		?>
<h1>

  <?php echo $pagename; ?>
</h1>
<div class="kie_editor" id="kie_editor">
  <div class="kie_msg">
    <span class="dashicons dashicons-no" onclick="close_msg()"></span>
    <div class="kie_msg_header">
      <b></b>

    </div>
    <div class="kie_msg_mtn"></div>
  </div>
     <div class="kie_blackscreen" style="display:none;">
    <div class="wait">
      <img src="<?php echo plugins_url('fonts/loading.gif', __FILE__) ?>">
        
    </div>
  </div>
  <div id="container"></div>
	 <div id="menu">
      <div>
        <button id="new-group"><?php _e( 'گروه جدید', 'kie' ) ?></</button>
		<button id="unpack-from-group"><?php _e( 'جدا کردن از گروه', 'kie' ) ?></</button>
		  <button id="unpack-group"> <?php _e( 'ملغی کردن گروه', 'kie' ) ?></</button>
		  <button id="delete-button"><?php _e( 'حذف', 'kie' ) ?></</button>
      </div>
    </div>
  <div class="splash_screen">
    <div class="title">king_ie</div>
    <div class="wait">
      <img src="<?php echo plugins_url('fonts/loading.gif', __FILE__) ?>">
    </div>
    <div class="discription"><?php _e( 'نام فایل', 'kie' ) ?></div>

  </div>
  <div class="startpanel" style="display:none">
     <span title="<?php _e( 'بازکردن فایل', 'kie' ) ?>" onclick="stage_action('opendialog')" class="dashicons dashicons-open-folder open_file"></span>
    <input type="text" class="nameimage" placeholder="<?php _e( 'نام فایل', 'kie' ) ?>"
      oninput="localStorage.setItem('namefile',this.value)">
    <a class="startbutton" onclick="setdivsize()"><?php _e( 'تایید', 'kie' ) ?></a>
    <input class="wstage" type="number" placeholder="<?php _e( 'عرض', 'kie' ) ?>">
    <input class="hstage" type="number" placeholder="<?php _e( 'ارتفاع', 'kie' ) ?>">

  </div>
  <div class="panelr" style="display: none;">
    <div class="layeroption" style="display: none;">
      <!-- <p><?php// _e( 'رنگ پس زمینه', 'kie' ) ?></p>
      <input class="bgcolor" onclick="open_panell_color(this)" type="text" oninput="bgcolorchange()"> -->
      <p><?php _e( 'شفافیت', 'kie' ) ?></p>
      <input class="opacity" type="number" step="0.1" min="0" max="1" oninput="change_layer_att('opacity')">

      <select class="fillPriority" onchange="change_layer_att('fillPriority')">
        <option value="color"><?php _e( 'رنگ', 'kie' ) ?></option>
        <option value="linear-gradient"><?php _e( 'گرادینت خطی', 'kie' ) ?></option>
        <!-- <option value="radial-graident"><?php //_e( 'گرادینت شعاعی', 'kie' ) ?></option> -->
        <option value="pattern"><?php _e( 'تصویر', 'kie' ) ?></option>
      </select>
      <div class="color" style="display: none;">
        <p><?php _e( 'رنگ', 'kie' ) ?> </p>
        <input class="fill" onclick="open_panell_color(this)" type="text" oninput="change_layer_att('fill')">
      </div>
      <div class="pattern" style="display: none;">
        <button onclick="img_selector('.fillPatternImage','layer')"><?php _e( 'انتخاب تصویر', 'kie' ) ?></button>
        <input type="hidden" class="fillPatternImage" value="" onchange="change_layer_att('fillPatternImage')">

        <select class="fillPatternRepeat" onchange="change_layer_att('fillPatternRepeat')">
          <option value="no-repeat"><?php _e( 'بدون تکرار', 'kie' ) ?></option>
          <option value="repeat"><?php _e( 'تکرار هر جهت', 'kie' ) ?></option>
          <option value="repeat-y"><?php _e( 'فقط جهت y', 'kie' ) ?></option>
          <option value="repeat-x"><?php _e( 'فقط جهت x', 'kie' ) ?></option>

        </select>

        <p><?php _e( 'x', 'kie' ) ?></p>
        <input class="fillPatternX" type="number" oninput="change_layer_att('fillPatternX')">
        <p><?php _e( 'y', 'kie' ) ?></p>
        <input class="fillPatternY" type="number" oninput="change_layer_att('fillPatternY')">

        <p><?php _e( 'x افست', 'kie' ) ?></p>
        <input class="fillPatternOffsetX" type="number" oninput="change_layer_att('fillPatternOffsetX')">
        <p><?php _e( 'y افست', 'kie' ) ?></p>
        <input class="fillPatternOffsetY" type="number" oninput="change_layer_att('fillPatternOffsetY')">

        <p><?php _e( 'x مقیاس در', 'kie' ) ?></p>
        <input class="fillPatternScaleX" type="number" step="0.1" oninput="change_layer_att('fillPatternScaleX')">
        <p><?php _e( 'y مقیاس در', 'kie' ) ?></p>
        <input class="fillPatternScaleY" type="number" step="0.1" oninput="change_layer_att('fillPatternScaleY')">

        <p><?php _e( 'چرخش', 'kie' ) ?></p>
        <input class="fillPatternRotation" type="number" step="1" min="0" max="360"
          oninput="change_layer_att('fillPatternRotation')">




      </div>
      <div class="linear-gradient" style="display: none;">
        <button class="grad_select_text" onclick="open_panell_grad(this)"></button>
      </div>
      <div class="radial-graident" style="display: none;">

      </div>

    </div>
    <div class="option" style="display: none;">
      <p><?php _e( 'نام فایل', 'kie' ) ?></p>
      <input class="namefile" type="text" oninput="changenamefile()">
    </div>
    <div class="text_editor" style="display: none;">

      <!-- Tab links -->
      <div class="tab">
        <button id="defOtext" class="tablinks" onclick="kingie_open_tab(event, 'text')"><span
            class="dashicons dashicons-editor-textcolor"></span></button>
        <button class="tablinks" onclick="kingie_open_tab(event, 'Detail')"><span
            class="dashicons dashicons-editor-spellcheck"></span></button>
        <button class="tablinks" onclick="kingie_open_tab(event, 'border')"><span
            class="dashicons dashicons-editor-bold"></span></button>
        <button class="tablinks" onclick="kingie_open_tab(event, 'Color_and_design')"><span
            class="dashicons dashicons-admin-appearance"></span></button>
      </div>

      <!-- Tab content -->
      <div id="text" class="tabcontent">

        <p>
            <p><?php _e( 'x', 'kie' ) ?></p>
          <input class="x" type="number" step="0.1"  oninput="change_text_att('x')">
          <p><?php _e( 'y', 'kie' ) ?></p>
          <input class="y" type="number" step="0.1"  oninput="change_text_att('y')">
          
          <p><?php _e( 'طول', 'kie' ) ?></p>
          <input class="width" type="number" step="1" min="0" oninput="change_text_att('width')">
          <p><?php _e( 'ارتفاع', 'kie' ) ?></p>
          <input class="height" type="number" step="1" min="1" oninput="change_text_att('height')">

          <input class="text" type="text" oninput="change_text_att('text')">
          <p><?php _e( 'فونت', 'kie' ) ?> </p>
          <!-- <select class="fontFamily" oninput="change_fontview()">
          <?php
          $json_font=KgIeMr_font("update","","","");
          //print_r($json_font);
          $fonts = json_decode($json_font);
          for ($i = 0; $i <= count($fonts)-1; $i++) {  
            //echo '<option value="'.$fonts[$i][1].'">'.$fonts[$i][0].'</option>';
          }
          ?>
             <option value="font1">B Elham</option>
            <option value="font2">B Farnaz</option>
            <option value="font3">B Morvarid</option>
            <option value="font4">B Narm</option>
            <option value="font5">B Traffic</option>
            <option value="font6">B Koodak Bold</option>
            <option value="font7">Sultan K Light</option>
            <option value="font8">Nabi</option>
            <option value="Calibri">Calibri</option>
            <option value="arial">arial</option>
            <option value="font9">operator-light</option>
            <option value="font10">Aulita</option>
            <option value="font11">Nightlife-Medium</option>
            <option value="font12">Nightlife-Bold</option> 
          </select> -->

          <input class="fontFamily" type="hidden" onchange="change_text_att('fontFamily')">
          <p class="show_font_prive" onclick="open_panell_font('fontFamily')"><?php _e( 'نوع قلم Font Style', 'kie' ) ?>
          </p>
          <input type="number" class="fontSize" id="fontSize" name="fontSize" min="0" max="400"
            oninput="change_text_att('fontSize')" value="0">

          <p><?php _e( 'استایل فونت', 'kie' ) ?> </p>
          <select class="fontStyle" onchange="change_text_att('fontStyle')">
            <option value="normal"><?php _e( 'معمولی', 'kie' ) ?></option>
            <option value="bold"><?php _e( 'توپُر', 'kie' ) ?></option>
            <option value="italic"><?php _e( 'کج', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'جهت نوشته', 'kie' ) ?></p>
          <select class="align" onchange="change_text_att('align')">
            <option value="right"><?php _e( 'راست', 'kie' ) ?></option>
            <option value="center"><?php _e( 'وسط', 'kie' ) ?></option>
            <option value="left"><?php _e( 'چپ', 'kie' ) ?></option>
          </select>
          <select class="verticalAlign" onchange="change_text_att('verticalAlign')">
            <option value="top"><?php _e( 'بالا', 'kie' ) ?></option>
            <option value="middle"><?php _e( 'وسط', 'kie' ) ?></option>
            <option value="bottom"><?php _e( 'پایین', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'خط دار بودن نوشته', 'kie' ) ?></p>
          <select class="textDecoration" onchange="change_text_att('textDecoration')">
            <option value=""><?php _e( 'معمولی', 'kie' ) ?></option>
            <option value="underline"><?php _e( 'زیرخط', 'kie' ) ?></option>
            <option value=" line-through"><?php _e( 'خط وسط', 'kie' ) ?></option>
          </select>

        </p>
      </div>

      <div id="Detail" class="tabcontent">

        <p>

          <p><?php _e( 'شفافیت', 'kie' ) ?></p>
          <input class="opacity" type="number" step="0.1" min="0" max="1" oninput="change_text_att('opacity')">
          <p><?php _e( 'نوع حروف', 'kie' ) ?> </p>
          <select class="fontVariant" onchange="change_text_att('fontVariant')">
            <option value="normal"><?php _e( 'معمولی', 'kie' ) ?></option>
            <option value="small-caps"><?php _e( 'حروف کوچک', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'شکسته شدن', 'kie' ) ?></p>
          <select class="wrap" onchange="change_text_att('wrap')">
            <option value="none"><?php _e( 'بی اثر', 'kie' ) ?></option>
            <option value="char"><?php _e( 'کاراکتر', 'kie' ) ?></option>
            <option value="word"><?php _e( 'کلمه', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'لفاف یا فاصله از طراف', 'kie' ) ?></p>
          <input class="padding" type="number" step="1" min="0" oninput="change_text_att('padding')">
          <p><?php _e( 'ارتفاع خط', 'kie' ) ?></p>
          <input class="lineHeight" type="number" step="0.1" min="1" oninput="change_text_att('lineHeight')">


        </p>
      </div>

      <div id="border" class="tabcontent">

        <p>
          <p><?php _e( 'حاشیه', 'kie' ) ?></p>
          <input class="stroke" onclick="open_panell_color(this)" type="text" oninput="change_text_att('stroke')">
          <input class="strokeWidth" type="number" step="1" min="0" oninput="change_text_att('strokeWidth')">
          <select class="lineJoin" onchange="change_text_att('lineJoin')">
            <option value="miter"><?php _e( 'صاف', 'kie' ) ?></option>
            <option value="round"><?php _e( 'گرد', 'kie' ) ?></option>
            <option value="bevel"><?php _e( 'مورب', 'kie' ) ?></option>
          </select>
          <select class="lineCap" onchange="change_text_att('lineCap')">
            <option value="butt"><?php _e( 'کپل', 'kie' ) ?></option>
            <option value="round"><?php _e( 'گرد', 'kie' ) ?></option>
            <option value="square"><?php _e( 'مربع', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'سایه', 'kie' ) ?></p>
          <input class="shadowColor" onclick="open_panell_color(this)" type="text"
            oninput="change_text_att('shadowColor')">
          <p><?php _e( 'جهت سایته در محور x', 'kie' ) ?></p>
          <input class="shadowOffsetX" type="number" oninput="change_text_att('shadowOffsetX')">
          <p><?php _e( 'جهت سایه در محور y', 'kie' ) ?></p>
          <input class="shadowOffsetY" type="number" oninput="change_text_att('shadowOffsetY')">
          <p><?php _e( 'مات سایه', 'kie' ) ?></p>
          <input class="shadowBlur" type="number" step="1" min="0" max="500" oninput="change_text_att('shadowBlur')">
          <p><?php _e( 'شفافیت سایه', 'kie' ) ?></p>
          <input class="shadowOpacity" type="number" step="0.1" min="0" max="1"
            oninput="change_text_att('shadowOpacity')">


        </p>
      </div>
      <div id="Color_and_design" class="tabcontent">

        <p>
          <select class="fillPriority" onchange="change_text_att('fillPriority')">
            <option value="color"><?php _e( 'رنگ', 'kie' ) ?></option>
            <option value="linear-gradient"><?php _e( 'گرادینت خطی', 'kie' ) ?></option>
            <!-- <option value="radial-graident"><?php //_e( 'گرادینت شعاعی', 'kie' ) ?></option> -->
            <option value="pattern"><?php _e( 'تصویر', 'kie' ) ?></option>
          </select>
          <div class="color fillPriority_type" style="display: none;">
            <p><?php _e( 'رنگ', 'kie' ) ?> </p>
            <input class="fill" onclick="open_panell_color(this)" type="text" oninput="change_text_att('fill')">
          </div>
          <div class="pattern fillPriority_type" style="display: none;">
            <button onclick="img_selector('.fillPatternImage','text')"><?php _e( 'انتخاب تصویر', 'kie' ) ?></button>
            <input type="hidden" class="fillPatternImage" value="" onchange="change_text_att('fillPatternImage')">

            <select class="fillPatternRepeat" onchange="change_text_att('fillPatternRepeat')">
              <option value="no-repeat"><?php _e( 'بدون تکرار', 'kie' ) ?></option>
              <option value="repeat"><?php _e( 'تکرار هر جهت', 'kie' ) ?></option>
              <option value="repeat-y"><?php _e( 'فقط جهت y', 'kie' ) ?></option>
              <option value="repeat-x"><?php _e( 'فقط جهت x', 'kie' ) ?></option>

            </select>

            <p><?php _e( 'x', 'kie' ) ?></p>
            <input class="fillPatternX" type="number" oninput="change_text_att('fillPatternX')">
            <p><?php _e( 'y', 'kie' ) ?></p>
            <input class="fillPatternY" type="number" oninput="change_text_att('fillPatternY')">

            <p><?php _e( 'x افست', 'kie' ) ?></p>
            <input class="fillPatternOffsetX" type="number" oninput="change_text_att('fillPatternOffsetX')">
            <p><?php _e( 'y افست', 'kie' ) ?></p>
            <input class="fillPatternOffsetY" type="number" oninput="change_text_att('fillPatternOffsetY')">

            <p><?php _e( 'x مقیاس در', 'kie' ) ?></p>
            <input class="fillPatternScaleX" type="number" step="0.1" oninput="change_text_att('fillPatternScaleX')">
            <p><?php _e( 'y مقیاس در', 'kie' ) ?></p>
            <input class="fillPatternScaleY" type="number" step="0.1" oninput="change_text_att('fillPatternScaleY')">

            <p><?php _e( 'چرخش', 'kie' ) ?></p>
            <input class="fillPatternRotation" type="number" step="1" min="0" max="360"
              oninput="change_text_att('fillPatternRotation')">




          </div>
          <div class="linear-gradient fillPriority_type" style="display: none;">
            <button class="grad_select_text" onclick="open_panell_grad(this)"></button>
          </div>
          <div class="radial-graident fillPriority_type" style="display: none;">

          </div>

        </p>
      </div>

      <a class="removeitembtn" onclick="removeitem();"><span class="dashicons dashicons-trash"></span></a>
    </div>
    <div class="image_editor" style="display: none;">
      <!-- Tab links -->
      <div class="tab">
        <button id="defOimg" class="tablinks" onclick="kingie_open_tab(event, 'Detail_img')"><span
            class="dashicons dashicons-format-image"></span></button>
        <button class="tablinks" onclick="kingie_open_tab(event, 'border_img')"><span
            class="dashicons dashicons-editor-bold"></span></button>
        <!-- <button class="tablinks" onclick="kingie_open_tab(event, 'Color_and_design')"><span
            class="dashicons dashicons-admin-appearance"></span></button> -->
      </div>
      <!-- Tab content -->
      <div id="Detail_img" class="tabcontent">

        <p>
          <p><?php _e( 'ویرایش عکس', 'kie' ) ?> </p>
          <img class="image_preview" style="max-width: 100%;" onclick="select_image('.image_editor')">
          <input type="hidden" class="imagecurrentSrc" value="">
          <!-- <input type="number" class="width" id="width" name="width" oninput="change_image_att('width')">
      <input type="number" class="height" id="height" name="height" oninput="change_image_att('height')">
       -->

        </p>
      </div>


      <div id="border_img" class="tabcontent">

        <p>
          <p><?php _e( 'نوع حاشیه', 'kie' ) ?></p>
          <select class="lineJoin" onchange="change_image_att('lineJoin')">
            <option value="round"><?php _e( 'گرد', 'kie' ) ?></option>
            <option value="bevel"><?php _e( 'مورب', 'kie' ) ?></option>
            <option value="miter"><?php _e( 'صاف', 'kie' ) ?></option>
          </select>
          <p><?php _e( 'رنگ حاشیه', 'kie' ) ?></p>
          <input class="stroke" type="text" onclick="open_panell_color(this)" oninput="change_image_att('stroke')">
          <p><?php _e( 'اندازه حاشیه', 'kie' ) ?></p>
          <input class="strokeWidth" type="number" min="0" oninput="change_image_att('strokeWidth')">
          <p><?php _e( 'شفافیت', 'kie' ) ?></p>
          <input class="opacity" type="number" step="0.1" min="0" max="1" oninput="change_image_att('opacity')">
          <p><?php _e( 'شفافیت سایه', 'kie' ) ?></p>
          <input class="shadowOpacity" type="number" step="0.1" min="0" max="1"
            oninput="change_image_att('shadowOpacity')">
          <p><?php _e( 'جهت سایته در محور x', 'kie' ) ?></p>
          <input class="shadowOffsetX" type="number" oninput="change_image_att('shadowOffsetX')">
          <p><?php _e( 'جهت سایه در محور y', 'kie' ) ?></p>
          <input class="shadowOffsetY" type="number" oninput="change_image_att('shadowOffsetY')">
          <p><?php _e( 'مات سایه', 'kie' ) ?></p>
          <input class="shadowBlur" type="number" step="1" min="0" max="500" oninput="change_image_att('shadowBlur')">
          <p><?php _e( 'رنگ سایه', 'kie' ) ?></p>
          <input class="shadowColor" type="text" onclick="open_panell_color(this)"
            oninput="change_image_att('shadowColor')">
        </p>
      </div>

      <a class="removeitembtn" onclick="removeitem();"> <span class="dashicons dashicons-trash"></span></a>

    </div>
    <div class="pen_editor" style="display: none;">
      <a class="removeitembtn" onclick="removeitem();"> <span class="dashicons dashicons-trash"></span></a>
      <p><?php _e( 'تنظیمات قلمو', 'kie' ) ?> </p>

      <input type="number" class="line_width" oninput="change_pen_att('line_width')">
      <input type="text" class="line_color " oninput="change_pen_att('line_color')" onclick="open_panell_color(this)">
      <select class="line_type" onchange="change_pen_att('line_type')">
        <option value="brush"><?php _e( 'قلمو', 'kie' ) ?></option>
        <option value="eraser"><?php _e( 'پاک کن', 'kie' ) ?></option>
      </select>

    </div>
    <div class="shape_editor" style="display: none;">
      <a class="removeitembtn" onclick="removeitem();"> <span class="dashicons dashicons-trash"></span></a>
      <!-- <input type="text" class="svg_color kie_color_piker"   oninput="svg_change_color()"> -->

      <!--
            <a href="#" class="misha-upl"><?php //_e( 'انتخاب تصویر', 'kie' ) ?></a>
	      <a href="#" class="misha-rmv" style="display:none"><?php //_e( 'بازنگری', 'kie' ) ?></a>
	      <input type="hidden" name="misha-img" class="imagecurrentSrc" value="">
-->

      <img class="loadedsvg" src="<?php echo plugins_url('fonts/SVG/wordpress.svg', __FILE__); ?>">
      <button onclick="svg_selector()"><?php _e( 'انتخاب SVG', 'kie' ) ?></button>
      <!-- <button onclick="jQuery('.svgeditor_form').css('display','');jQuery('.editor_nav').css('display','block');"><?php _e( 'ویرایش کد', 'kie' ) ?></button> -->
      <!--
          <form enctype="multipart/form-data">
   <input type="text" name="support_title" class="support-title">
   <input type="file" id="sortpicture" name="upload" onchange="set_svg_file(this)">
   <input class="save-support" name="save_support" type="button" onclick="set_svg_file(this)" value="Save">
 </form>
-->


      <!-- <select class="shapes_cats_list" onchange="load_shape_list">
          <option value="0"><?php _e( 'شکل ها', 'kie' ) ?></option>
          </select> -->
      <!-- <div class="list_svg">
        <img onclick="select_svg(this)" src="<?php //echo plugins_url('fonts/SVG/rectangle.svg', __FILE__); ?>">
        <img onclick="select_svg(this)" src="<?php //echo plugins_url('fonts/SVG/line.svg', __FILE__); ?>">
      </div> -->

    </div>
    <div class="layers">
      <div class="option_layres">
        <ul>
          <li title="<?php _e( 'لایه جدید', 'kie' ) ?>" onclick="add_layer()"><span class="dashicons dashicons-plus"></span></li>
          <li title="<?php _e( 'حذف لایه کنونی', 'kie' ) ?>"><span onclick="remove_curent_layer()" class="dashicons dashicons-minus"></span></li>
          <li title="<?php _e( 'ساخت مشابه', 'kie' ) ?>" ><span onclick="clonecurrentitem()" class="dashicons dashicons-admin-page"></span></li>
          <li title="<?php _e( 'بالا بردن لایه', 'kie' ) ?>"><span onclick="move_up_c_item()" class="dashicons dashicons-arrow-up-alt"></span></li>
          <li title="<?php _e( 'پایین بدن لایه', 'kie' ) ?>"><span onclick="move_down_c_item()" class="dashicons dashicons-arrow-down-alt"></span></li>
        </ul>
      </div>
      <ul>

      </ul>
    </div>
  </div>
  <div class="editor_nav">
    <ul>
      <li><span class="dashicons dashicons-migrate"
          onclick="jQuery('.svgeditor_form').css('display','none');jQuery('.editor_nav').css('display','none');"></span>
      </li>
      <li><span class="dashicons dashicons-update-alt" onclick="rest_xml()"></span></li>
      <li><span class="dashicons dashicons-yes" onclick="replace_xml()"></span></li>
    </ul>
  </div>
  <div class="svgeditor_form" style="display: none;">
    <a class="close_svg_form" onclick="jQuery('.svgeditor_form').css('display','none');"> <span
        class="dashicons dashicons-no"></span></a>
    <div class="main_svg_code_editor">

      <div id="svgeditor_form" class="svgeform"></div>
    </div>
  </div>
  <div class="panell" style="display: none;">
    <a class="close" onclick="jQuery('.panell').css('display','none');"> <span
        class="dashicons dashicons-no"></span></a>
    <div class="colorselctor">
      <input type="color" class="newcolor_input" style="width: 80%;">
      <button title="<?php _e( 'اضافه کردن رنگ به لیست ', 'kie' ) ?>" onclick="addnewcolor('newcolor')"><span class="dashicons dashicons-insert"></span></button>
      <button title="<?php _e( 'انتخاب رنگ', 'kie' ) ?>" onclick="select_color()"><span class="dashicons dashicons-yes"></span></button>
      <button title="<?php _e( 'حذف رنگ', 'kie' ) ?>" onclick="addnewcolor('removecolor')"><span class="dashicons dashicons-trash"></span></button>
      <div class="list_color">
        <div class="coloritem" style="background-color: #f44336!important;"></div>
        <div class="coloritem" style="background-color: #e91e63!important;"></div>
        <div class="coloritem" style="background-color: #2196F3!important;"></div>
        <div class="coloritem" style="background-color: #607d8b!important;"></div>
        <div class="coloritem" style="background-color: #009688!important;"></div>
      </div>
    </div>
    <div class="gradselector">
      <div class="grad_show" style="background-image: linear-gradient(rgb(73, 156, 234) 0%, rgb(32, 124, 229) 100%);">
      </div>
      <button title="<?php _e( 'رنگ جدید', 'kie' ) ?>" onclick="addnewgrad('newcolor')"><span class="dashicons dashicons-insert"></span></button>
      <button title="<?php _e( 'انتخاب', 'kie' ) ?>" onclick="select_grad()"><span class="dashicons dashicons-yes"></span></button>
      <button title="<?php _e( 'اضافه کردن به لیست', 'kie' ) ?>" onclick="call_grad('newgrad')"><span class="dashicons dashicons-download"></span></button>
      <button title="<?php _e( 'حذف', 'kie' ) ?>" onclick="call_grad('removecolor')"><span class="dashicons dashicons-trash"></span></button>
      <input class="grad_code" type="hidden" value="0,#499cea,1,#207ce5">
      <input class="css_grad_code" type="hidden">
      <input oninput="convert_gradlist_to_grad()" class="deg_code" type="number" min="-180" max="180" value="90">
      <div class="grad_node_list">
        <div class="stop_color"><input oninput="convert_gradlist_to_grad()" class="color" type="color"
            value="#499cea"><input oninput="convert_gradlist_to_grad()" class="pos" type="number" min="0" max="100"
            value="0"> <a class="close" onclick="jQuery(this).parent().remove()"> <span
              class="dashicons dashicons-no"></span></a></div>
        <div class="stop_color"><input oninput="convert_gradlist_to_grad()" class="color" type="color"
            value="#207ce5"><input oninput="convert_gradlist_to_grad()" class="pos" type="number" min="0" max="100"
            value="100"> <a class="close" onclick="jQuery(this).parent().remove()"> <span
              class="dashicons dashicons-no"></span></a></div>

      </div>
      <div class="grad_list"></div>
    </div>
    <div class="fontselector">
      <p class="font_preview">نوع قلم Font Style</p>
      <button onclick="font_selector()"><span class="dashicons dashicons-insert"></span></button>
      <button onclick="select_font()"><span class="dashicons dashicons-yes"></span></button>
      <button onclick="call_font('remove')"><span class="dashicons dashicons-trash"></span></button>
      <input class="font_select_name" type="hidden">
      <input class="font_url" type="hidden">
      <input class="font_name" type="hidden">
      <div class="font_list">
        <p class="fontitem"> نوع قلم Font Style</p>
      </div>
    </div>
	
	<div class="king_store">
       <div class="tab">
        <button id="defOimg" class="tablinks" onclick="kingie_open_tab(event, 'storefile')"><span
            class="dashicons dashicons-format-image"></span></button>
        <button class="tablinks" onclick="kingie_open_tab(event, 'myfile')"><span
            class="dashicons dashicons-editor-bold"></span></button>
      </div>
	   <div id="storefile" class="tabcontent">
	    <select class="line_type" onchange="cate_store()">
        <option value="svg">shape</option>
        <option value="img">images</option>
		<option value="font">fonts</option>
		<option value="stage">sample</option>
      </select>
		</div>
		 <div id="myfile" class="tabcontent">
		</div>
		   
    </div>
	
  </div>
  <div class="panel" style="display: none;">

    <ul>
      <li title="<?php _e( 'ذخیره کردن تصویر', 'kie' ) ?>"><span class="dashicons dashicons-yes" id="save" onclick="save_button()"></span></li>
      <li title="<?php _e( 'ایجاد یک فایل جدید ', 'kie' ) ?>"><span class="dashicons dashicons-insert" id="new" onclick="new_button()"></span></li>
      <li title="<?php _e( 'شکل ها', 'kie' ) ?>" ><span class="dashicons dashicons-carrot" id="shape" onclick="shape_button()"></span></li>
      <li title="<?php _e( 'نقاشی', 'kie' ) ?>"><span class="dashicons dashicons-admin-customizer" id="paint" onclick="paint_button()"></span></li>
      <!-- <li><span class="dashicons dashicons-image-filter" id="maineffect" onclick="maineffect_button()"></span></li> -->
      <li title="<?php _e( 'تصویر', 'kie' ) ?>"><span class="dashicons dashicons-format-image" id="addimage" onclick="addimage_button()"></span></li>
      <li title="<?php _e( 'نوشته', 'kie' ) ?>"><span class="dashicons dashicons-editor-textcolor" id="addtext" onclick="addtext_button()"></span></li>
      <li title="<?php _e( 'تنظیمات', 'kie' ) ?>"><span class="dashicons dashicons-admin-tools" id="option" onclick="option_button()"></span></li>
    </ul>
    <!--<input class="eyedroper" type="text" onchange="color_code()" onclick="copy_color()" >-->
    <input class="eyedroper eyedroper_text" id="eyedroper_text" onclick="copy_color()" type="text">
    <div class="loading" style="display: none;"><img src="<?php echo plugins_url('fonts/loading.gif', __FILE__) ?>">
    </div>
    
  </div>

  <div class="panel_left" style="display:none;" >

    <ul>
      <li title="<?php _e( 'بازکردن فایل', 'kie' ) ?>"><span class="dashicons dashicons-category"  onclick="stage_action('opendialog')" ></span></li>
      <li title="<?php _e( 'ذخیره فایل', 'kie' ) ?>"><span class="dashicons dashicons-download" onclick="stage_action('save')"></span></li>
      <li title="<?php _e( 'مخزن', 'kie' ) ?>"><span class="dashicons dashicons-superhero-alt" onclick="open_store()"></span></li>
      <!-- <li><span class="dashicons dashicons-admin-customizer" onclick="paint_button()"></span></li>
      <li><span class="dashicons dashicons-format-image"  onclick="addimage_button()"></span></li>
      <li><span class="dashicons dashicons-editor-textcolor"  onclick="addtext_button()"></span></li>
      <li><span class="dashicons dashicons-admin-tools"  onclick="option_button()"></span></li> -->
    </ul>
    
  </div>

</div>
<?php
  }
  //@

//@ allow use svg,svgz,woff in admin wordpress 
add_filter('upload_mimes', 'KgIeMr_svg_up_allow');
function KgIeMr_svg_up_allow ( $existing_mimes=array() ) {
    // add your extension to the mimes array as below
    $existing_mimes['svg'] = 'image/svg+xml';
    $existing_mimes['svgz'] = 'image/svg+xml';
    $existing_mimes['woff'] = 'application/font-woff';

    return $existing_mimes;
}
//@
//@ fix  svg tumbnails in media center wordpress with set default width
function KgIeMr_fix_svg_thumb_display() {
  echo '<style>
    .media-icon > img{ 
      width: 60px !important; 
      height: auto !important; 
    }
    .toplevel_page_kingIE > a > div > img {
    width: 16px;
}
  </style>';
}
add_action('admin_head', 'KgIeMr_fix_svg_thumb_display');
//@
//@ add api for insert svg file 
add_action('rest_api_init', function() {
	register_rest_route('wp/v2', '/KgIeMr_svginsert/', array(
	  'methods' => 'POST',
	  'callback' => 'KgIeMr_svg_insert'
	));
  });
//@
// get svg form api router and send to  save
  function KgIeMr_svg_insert($data){

$filename=explode(".",$_POST['supporttitle']);
return KgIeMr_save_file( $_FILES['file'], sanitize_file_name($filename[0]) ,sanitize_file_name($filename[1]) ,"image/svg+xml");
 
      die();
}
//@
//@ save file in wordpress
function KgIeMr_save_file( $file, $name ,$filtype,$mimetype ) {
if (!function_exists('wp_handle_upload')) {
           require_once(ABSPATH . 'wp-admin/includes/file.php');
       }
	// Upload dir.
	$upload_dir  = wp_upload_dir();
	$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;
	$filename        = $name . '.'.$filtype;
	$file_type       = $mimetype;
    $uploadedfile = $file;
    $upload_overrides = array('test_form' => false);
     $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

     $hashed_filename =  $filename;
    // echo $movefile['url'];
      if ($movefile && !isset($movefile['error'])) {
          $file_path=$movefile['file'];
          $file_url=$movefile['url'];
          
          $attachment = array(
		'post_mime_type' => $file_type,
		'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $hashed_filename ) ),
		'post_content'   => '',
		'post_status'    => 'inherit',
		'guid'           => $upload_dir['url'] . '/' . basename( $hashed_filename )
          );
          $attach_id = wp_insert_attachment( $attachment, $movefile['file'] );
          //generate metadata and thumbnails
//          apply_filters('wp_handle_upload', array('file' => $file_path, 'url' => $file_url, 'type' => $file_type), 'upload');
//          // Generate the metadata for the attachment, and update the database record.
//          if ($attach_data = wp_generate_attachment_metadata($attach_id, $file_path)) {
//              wp_update_attachment_metadata($attach_id, $attach_data);
//              return true;
//          } else {
//              $data = wp_get_attachment_metadata($attach_id);
//              //wp_update_attachment_metadata($attach_id, $data);
//              return print_r($data);
//          }
          return $movefile['url'];
      } else {
        /**
         * Error generated by _wp_handle_upload()
         * @see _wp_handle_upload() in wp-admin/includes/file.php
         */
        return $movefile['error'];
    }
    

    

	
    
}
//@
//@ api for get action 
add_action('rest_api_init', function() {
	register_rest_route('wp/v2', '/KgIeMr_action/', array(
	  'methods' => 'POST',
	  'callback' => 'KgIeMr_action'
	));
  });
//@
//@ action center 
  function KgIeMr_action($data){
    if($_REQUEST['method']=="color"){
      return KgIeMr_newcolor($_REQUEST['action'],$_REQUEST['newcolor']);
    }
    if($_REQUEST['method']=="grad"){
      return KgIeMr_newgrad($_REQUEST['action'],$_REQUEST['new_konva_grad'],$_REQUEST['new_deg_grad']);
    }
    if($_REQUEST['method']=="font"){
      return KgIeMr_font($_REQUEST['action'],$_REQUEST['font_name'],$_REQUEST['font_url'],$_REQUEST['font_select_name']);
    }

  }
//@
//@ font action 
  function KgIeMr_font($action,$font_name,$font_url,$font_select_name){
    if(get_option('KgIeMr_font')!=true){
      $fontdata = array (
        array("Calibri","Calibri","system"),
        array("arial","arial","system"),
        array("B Elham","font1",plugins_url('fonts/1.woff', __FILE__)),
        array("B Farnaz","font2",plugins_url('fonts/2.woff', __FILE__)),
        array("B Morvarid","font3",plugins_url('fonts/3.woff', __FILE__)),
        array("B Narm","font4",plugins_url('fonts/4.woff', __FILE__)),
        array("B Traffic","font5",plugins_url('fonts/5.woff', __FILE__)),
        array("B Koodak Bold","font6",plugins_url('fonts/6.woff', __FILE__)),
        array("Sultan K Light","font7",plugins_url('fonts/7.woff', __FILE__)),
        array("Nabi","font8",plugins_url('fonts/8.woff', __FILE__)),
        array("operator-light","font9",plugins_url('fonts/9.woff', __FILE__)),
        array("Aulita","font10",plugins_url('fonts/10.woff', __FILE__)),
        array("Nightlife-Medium","font11",plugins_url('fonts/11.woff', __FILE__)),
        array("Nightlife-Bold","font12",plugins_url('fonts/12.woff', __FILE__)),
      );
       add_option('KgIeMr_font', $fontdata);
    }
    if($action=="newfont"){
      $all_font = get_option('KgIeMr_font');
      $newarray=array($font_select_name,$font_name,($font_url));
      $all_font[]=$newarray;
      $all_font = array_filter($all_font );
      sort($all_font);
      update_option('KgIeMr_font', ($all_font));
    }
    if($action=="remove"){
      $all_font = get_option('KgIeMr_font');
      $pos = array_search(array($font_select_name,$font_name,$font_url), $all_font);
      $all_font[$pos]=null;
      $all_font = array_filter($all_font );
      sort($all_font);
      update_option('KgIeMr_font', ($all_font));
    }

    $all_font = get_option('KgIeMr_font');
    $all_font = array_filter($all_font );
    sort($all_font);
    $css="";
    for ($i = 0; $i <= count($all_font)-1; $i++) { 
      if($all_font[$i][2]!="system"){
        $css.="@font-face {
          font-family: ".$all_font[$i][1].";
          src: url('".$all_font[$i][2]."') format('woff');
      }";
      } 
     
    }
    KgIeMr_write_css_file( $css );
    return json_encode($all_font);
  }
  //@
  //@ append font to page for show in editor 
  function KgIeMr_write_css_file( $css ) {   
    $file = plugin_dir_path( __FILE__ ) . 'fonts/kie_font.css'; 
    $open = fopen( $file, "w+" ); 
    $write = fputs( $open, $css ); 
    fclose( $open );
}
//@
//@ gradiant action 
  function KgIeMr_newgrad($action,$new_konva_grad,$new_deg_grad){
    if(get_option('KgIeMr_allgrad')!=true){
      $graddata = array (
        array("0,#d34545,1,#710e0e",180),
        array("0,#499cea,1,#207ce5",180),
        array("0,#ffffff,0.47,#f6f6f6,1,#ededed",180),
        array("0,#b7deed,0.5,#71ceef,0.51,#21b5e2,1,#b7deed",180),
        array("0,#a9032a,0.44,#8f0223,1,#6d0019",180),
        array("0,#ffae4b,1,#ff920a",180),
        array("0,#a4b357,1,#75890c",180),
        array("0,#b3dced,0.5,#29b8e5,1,#bce0ee",180)
      );
       add_option('KgIeMr_allgrad', $graddata);
    }
    if($action=="newgrad"){
      $all_grad = get_option('KgIeMr_allgrad');
      $newarray=array($new_konva_grad,floatval($new_deg_grad));
      $all_grad[]=$newarray;
      $all_grad = array_filter($all_grad );
      sort($all_grad);
      update_option('KgIeMr_allgrad', ($all_grad));
    }
    if($action=="removecolor"){
      $all_grad = get_option('KgIeMr_allgrad');
      $pos = array_search(array($new_konva_grad,$new_deg_grad), $all_grad);
      $all_grad[$pos]=null;
      $all_grad = array_filter($all_grad );
      sort($all_grad);
      update_option('KgIeMr_allgrad', ($all_grad));
    }

    $all_grad = get_option('KgIeMr_allgrad');
    $all_grad = array_filter($all_grad );
    sort($all_grad);
    return json_encode($all_grad);
  }
//@

//@ color action 
  function KgIeMr_newcolor($action,$newcolor){
    if(get_option('KgIeMr_allcolor')!=true){
      $colordata = array("#000000","#C0C0C0","#808080","#FFFFFF","#FF00FF","#800080","#FF0000","#800000","#00FFFF","#008080","#0000FF","#000080","#008000","#00FF00");
      add_option('KgIeMr_allcolor', $colordata);
    }
    if($action=="newcolor"){
      $all_color = get_option('KgIeMr_allcolor');
      array_push($all_color,$newcolor);
      update_option('KgIeMr_allcolor', $all_color);
    }
    if($action=="removecolor"){
      $all_color = get_option('KgIeMr_allcolor');
      $pos = array_search($newcolor, $all_color);
      $all_color[$pos]=null;
      $all_color = array_filter($all_color );
      update_option('KgIeMr_allcolor', $all_color);
    }

    $all_color = get_option('KgIeMr_allcolor');
    $ret_color="[";
    for ($i = 0; $i <= count($all_color)-1; $i++) {
      $ret_color.='"'.$all_color[$i].'"';
      if($i!=count($all_color)-1){ $ret_color.=",";}
    }
    $ret_color.="]";
    return stripslashes($ret_color);
  }
//@
//@ api for get image
add_action('rest_api_init', function() {
	register_rest_route('wp/v2', '/KgIeMr_newimage/', array(
	  'methods' => 'POST',
	  'callback' => 'KgIeMr_newimage_insert'
	));
  });
//@
//@ insert image befor save image
  function KgIeMr_newimage_insert($data){

	
return KgIeMr_save_image( $_REQUEST['image_post'], sanitize_file_name($_REQUEST['filename']),KgIeMr_sanitize($_REQUEST['filtype']),KgIeMr_sanitize($_REQUEST['width']),KgIeMr_sanitize($_REQUEST['height'] ));
}
//@
//@ save image
function KgIeMr_save_image( $base64_img, $name ,$filtype, $width ,$height ) {
  include( ABSPATH . 'wp-admin/includes/image.php' );
  require_once( ABSPATH . 'wp-admin/includes/post.php' );
	// Upload dir.
  $upload_dir  = wp_upload_dir();
 
	$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;
  $decoded= base64_decode($base64_img) ;
    $decoded = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64_img));

//	$img             = str_replace( 'data:image/'.$filtype.';base64,', '', $base64_img );
//	$img             = str_replace( ' ', '+', $img );
//	$decoded         = base64_decode( $img );
	$filename        = $name . '.'.$filtype;
	$file_type       = 'image/png';
	//$hashed_filename = md5( $filename . microtime() ) . '_' . $filename;
    $hashed_filename =  $filename;

   
    $file_title = preg_replace( '/\.[^.]+$/', '', basename( $hashed_filename ) );
	// Save the image in the uploads directory.
	$upload_file = file_put_contents( $upload_path . $hashed_filename, $decoded );
    
    $file_path=$upload_dir['path'] . '/' . $hashed_filename;
    $file_url=$upload_dir['url'] . '/' . $hashed_filename;
	$attachment = array(
		'post_mime_type' => $file_type,
		'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $hashed_filename ) ),
		'post_content'   => '',
		'post_status'    => 'inherit',
		'guid'           => $upload_dir['url'] . '/' . basename( $hashed_filename )
	);
  if (post_exists($file_title,'','','attachment')){
    $page = get_page_by_title($hashed_filename, OBJECT, 'attachment');
    $attach_id = $page->ID;
    //update_attached_file($attach_id, $upload_dir['path'] . '/' . $hashed_filename);


}else{
	$attach_id = wp_insert_attachment( $attachment, $upload_dir['path'] . '/' . $hashed_filename );
}

    //generate metadata and thumbnails
   apply_filters('wp_handle_upload', array('file' => $file_path, 'url' => $file_url, 'type' => $file_type), 'upload');

  // Generate the metadata for the attachment, and update the database record.
  $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
if ($attach_data) {
    wp_update_attachment_metadata($attach_id, $attach_data);
    
    return true;
} else {
  return post_exists($file_title,'','','attachment');
}
    
}
//@
//@ append main js file to like konva.js 
function KgIeMr_script() {
  if(isset($_REQUEST['page']) && $_REQUEST['page']=="kingIE" ){
    wp_enqueue_script( 'King_kie_script', plugins_url('konva.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'King_kie_xml2json', plugins_url('xml2json.js', __FILE__), array('jquery') );
  }
   
        wp_localize_script('King_kie_script', 'King_kie_script', array('pluginsUrl' => plugins_url(), 'siteurl' => get_option('siteurl')));
}
add_action( 'admin_enqueue_scripts', 'KgIeMr_script' );
add_filter('admin_head', 'KgIeMr_script');
//@
//@load media selector 
function KgIeMr_load_media_files() {
    wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', 'KgIeMr_load_media_files' );
//@load media selector 
//@ if plugin page register script 
function KgIeMr_enqueue_my_scripts($hook) {

    if ( 'kingIE' == trim($_REQUEST['page'] )) {
      
      wp_register_script( 'King_kie_js', plugins_url('king_IE.js', __FILE__), array(), date("h:i:s") );
        $datajs = array(
          'textnewtext' => __( 'نوشته', 'kie'  ),
          'copytext' => __( 'کپی شد', 'kie'  ),
          'saveh' => __( 'ذخیره شد', 'kie'  ),
          'savem' => __( 'تصویر شما با موفقیت در گالری ذخیره شد', 'kie'  ),
          'imgsrc' => plugins_url('img.jpg', __FILE__),
          'svgsrc' => plugins_url('img.jpg', __FILE__),
            'rtl_lang'=>is_rtl(),
          'wpsvg' => plugins_url('fonts/SVG/wordpress.svg', __FILE__)
      );
      wp_localize_script( 'King_kie_js', 'datajs', $datajs );
      wp_enqueue_script( 'King_kie_js' );
    }

    // ENQUEUE SCRIPTS…

}
add_action( 'admin_footer', 'KgIeMr_enqueue_my_scripts' );
//@
//@ remove mailcious code from string 
function KgIeMr_sanitize ($sring){
    
  $valuere=htmlspecialchars($sring);
  $valuere=strip_tags($sring);
       return strip_tags($valuere);
  }
  //@