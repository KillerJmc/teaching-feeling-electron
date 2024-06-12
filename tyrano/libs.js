// noinspection EqualityComparisonWithCoercionJS

(function ($) {

  //jquery 拡張

  //アニメーション開始。未実装　キーフレアニメは投入したい
  /*$.fn.a2d = function () {
    return this.each(function (i) {
      $(this).css("-webkit-animation-play-state", str);
    });
  };*/

  $.getBaseURL = function () {
    const str = location.pathname;
    const i = str.lastIndexOf('/');
    return str.substring(0, i + 1);
  };

  $.getDirPath = function (str) {
    const i = str.lastIndexOf('/');
    return str.substring(0, i + 1);
  };

  $.isHTTP = function (str) {
    return str.substring(0, 4) === "http";
  };

  $.play_audio = function (audio_obj) {
    audio_obj.play();
  };

  $.toBoolean = function (str) {
    return str == "true";
  };

  $.getAngle = function () {
    let angle = screen && screen.orientation && screen.orientation.angle;
    if (angle === undefined) {
      angle = window.orientation; // iOS用
    }

    return angle;
  };

  $.localFilePath = function () {
    let path = "";
    //macOS Sierra 対応
    // edit - change the save path only for macOS (darwin)
    // changes the save directory from the temporary "delete after X days" folder to USER_HOME_FOLDER/_TyranoGameData
    if (process.platform === "darwin" && process.execPath.indexOf("var/folders") != -1) {
      path = process.env.HOME + "/_TyranoGameData";
    } else {
      path = $.getExePath();
    }

    return path;
  };

  $.getViewPort = function () {
    let width, height;

    if (self.innerHeight) {
      // all except Explorer
      width = self.innerWidth;
      height = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
      // Explorer 6 Strict Mode
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    } else if (document.body) {
      // other Explorers
      width = document.body.clientWidth;
      height = document.body.clientHeight;
    }

    return {
      width: width,
      height: height
    };
  };

  $.escapeHTML = function (val, replace_str) {
    val = val || "";
    let t = $("<div />").text(val).html();

    if (replace_str && t === "") {
      t = replace_str;
    }
    return t;
  };

  $.br = function (txtVal) {
    return txtVal.replace(/\r\n|[\r\n]/g, "<br />");
  };

  //現在時刻を取得
  //現在の日
  $.getNowDate = function () {
    const nowdate = new Date();
    const year = nowdate.getFullYear();
    // 年
    const mon = nowdate.getMonth() + 1;
    // 月
    const date = nowdate.getDate();
    // 日

    return year + "/" + mon + "/" + date;
  };

  //現在の時刻
  $.getNowTime = function () {
    const nowdate = new Date();

    let h = nowdate.getHours();
    let m = nowdate.getMinutes();
    let s = nowdate.getSeconds();

    //↓を追加 from 1.7.9
    // edit - add 0 if less than 10, taken from 1.7.9
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }

    return h + ":" + m + ":" + s;
  };

  $.convertRem = function (px_val) {
    function getRootElementFontSize() {
      // Returns a number
      return parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
          // for the root <html> element
          document.documentElement
        ).fontSize
      );
    }

    return px_val * getRootElementFontSize();
  };

  //複数のスクリプトを一括して読み込み
  $.getMultiScripts = function (arr, cb) {
    const cnt_script = arr.length;
    if (cnt_script == 0) {
      cb();
      return;
    }

    let load_cnt = 0;

    function getScript(src) {
      $.getScript(arr[load_cnt], function (e) {
        load_cnt++;
        if (cnt_script == load_cnt) {
          if (typeof cb == "function") {
            cb();
          }
        } else {
          getScript(arr[load_cnt]);
        }
      });
    }

    getScript(arr[0]);
  }

  $.convertSecToString = function (val) {
    if (val == 0) {
      return '-';
    }
    const day = Math.floor(val / (24 * 60 * 60));
    const hour = Math.floor((val % (24 * 60 * 60) / (60 * 60)));
    const minute = Math.floor(val % (24 * 60 * 60) % (60 * 60) / 60);
    const second = Math.floor(val % (24 * 60 * 60) % (60 * 60) % 60);

    let str = "";
    if (day !== 0) {
      str += day + "日";
    }
    if (hour !== 0) {
      str += hour + "時間";
    }
    if (minute !== 0) {
      str += minute + "分";
    }
    if (second !== 0) {
      str += second + "秒";
    }

    return str;
  };

  $.secToMinute = function (val) {
    if (val === 0) {
      return "-";
    }

    const m = Math.floor(val / 60);
    const s = Math.floor(val % 60);
    let str = "";

    if (m !== 0) {
      str += m + "分";
    }
    str += s + "秒";

    return str;
  };

  $.trim = function (str) {
    if (str) {
      //return str.replace(/^\s+|\s+$/g, "");
      return str.trim();
    } else {
      return "";
    }
  };

  $.rmspace = function (str) {
    //remove ' ', '　', '\r\n', '\r'
    return str.replace(/ |　|\r\n?/g, "");
  };

  $.replaceAll = function (text, searchString, replacement) {
    if (typeof text != "string") {
      return text;
    }

    //置換のコード変えてみた
    return text.split(searchString).join(replacement);
  };

  //確証しを取得
  $.getExt = function (str) {
    return str.split(".").pop();
  };

  //指定した拡張子を付ける。拡張子がなければ
  $.setExt = function (name, ext_str) {
    if (name.split(".").length == 1) {
      name += "." + ext_str;
    }

    return name;
  };

  //要素をクローンします
  $.cloneObject = function (source) {
    return $.extend(true, {}, source);
  };

  //透明度を適切な値に変更
  $.convertOpacity = function (val) {
    //255をマックスとして計算する
    const p = val / 255;
    return p;
  };

  //パスにfgimage bgimage image が含まれていた場合、それを適応する
  $.convertStorage = function (path) {

  };

  $.convertColor = function (val) {
    if (val.indexOf("0x") != -1) {
      return val.replace("0x", "#");
    }

    return val;
  };

  $.convertBold = function (flag) {
    if (flag == "true") {
      return "bold";
    }

    return "";
  };

  $.convertItalic = function (flag) {
    if (flag == "true") {
      return "italic";
    }

    return "";
  };

  /*$.send = function (url, obj, call_back) {
    //game.current_story_file = story_file;
    $.ajax({
      type: "POST",
      url: url,
      data: obj,
      dataType: 'json',
      complete: function () {
        //通信終了時の処理
        $.hideLoading();
      },
      success: function (data, status) {
        $.hideLoading();

        var data_obj = data;
        if (call_back) {
          call_back(data_obj);
        }
      }
    });
  };*/

  $.loadText = function (file_path, callback) {
    /*var httpObj = jQuery.get(file_path + "?" + Math.floor(Math.random() * 1000000), null, function (obj) {
      var order_str = "";

      if (httpObj) {
        if (httpObj.responseText) {
          order_str = httpObj.responseText;
        } else {
          order_str = obj;
        }
      } else {
        order_str = obj;
      }

      callback(order_str);
      // createOrder
    });*/

    $.ajax({
      url: file_path + "?" + Math.floor(Math.random() * 1000000),
      cache: false,
      success: function (order_str) {
        callback(order_str);
      },
      error: function () {
        alert("file not found:" + file_path);
        callback("");
      }
    });
  };

  //クッキーを取得
  $.getCookie = function (key) {
    let tmp = document.cookie + ";";
    const index1 = tmp.indexOf(key, 0);
    if (index1 != -1) {
      tmp = tmp.substring(index1);
      const index2 = tmp.indexOf("=", 0) + 1;
      const index3 = tmp.indexOf(";", index2);
      return tmp.substring(index2, index3);
    }
    return null;
  };

  $.isNull = function (str) {
    if (str == null) {
      return "";
    }
    return str;
  };

  /*$.dstop = function () {
    console.log("dstop");
  };*/

  //ユーザ環境を取得
  $.userenv = function () {
    const ua = navigator.userAgent;
    // edit - Fix for the Linux version - if 'Electron' is present in the UA then it's a 'pc'
    if (ua.indexOf('Electron') > -1) {
      return 'pc';
    } else if (ua.indexOf('iPhone') > -1) {
      return 'iphone';
    } else if (ua.indexOf('iPad') > -1) {
      return 'iphone';
    } else if (ua.indexOf('Android') > -1) {
      return 'android';
    } else if (ua.indexOf('Chrome') > -1 && navigator.platform.indexOf('Linux') > -1) {
      return 'android';
    } else {
      return 'pc';
    }
  };

  $.isTyranoPlayer = function () {
    return typeof _tyrano_player != "undefined";
  };

  $.lang = function (key) {
    if (tyrano_lang.word[key]) {
      return tyrano_lang.word[key];
    } else {
      return "NOT_DEFINED";
    }
  };

  $.novel = function (key) {
    if (tyrano_lang.novel[key]) {
      return tyrano_lang.novel[key];
    } else {
      return "NOT_DEFINED";
    }
  };

  //ユーザのブラウザ情報を取得
  $.getBrowser = function () {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('trident') >= 0) {
      return "msie";
    } else if (userAgent.indexOf("edge") > -1) {
      return "edge";
    } else if (userAgent.indexOf("firefox") > -1) {
      return "firefox";
    } else if (userAgent.indexOf("opera") > -1) {
      return "opera";
    } else if (userAgent.indexOf("chrome") > -1) {
      return "chrome";
    } else if (userAgent.indexOf("safari") > -1) {
      return "safari";
    } else if (userAgent.indexOf("applewebkit") > -1) {
      return "safari";
    } else {
      return "unknown";
    }
  };

  $.isNWJS = function () {
    //Electronならfalse
    if ($.isElectron()) {
      return false;
    }

    // Node.js で動作しているか
    const isNode = (typeof process !== "undefined" && typeof require !== "undefined");
    // ブラウザ上(非Node.js)で動作しているか
    const isBrowser = !isNode
    // node-webkitで動作しているか
    let isNodeWebkit;
    try {
      isNodeWebkit = isNode ? (typeof require('nw.gui') !== "undefined") : false;
    } catch (e) {
      isNodeWebkit = false;
    }

    if (isNodeWebkit) {
      // node-webkitで動作
      return true;
    } else if (isNode) {
      // Node.js上で動作している
      return true;
    } else {
      // 通常のWebページとして動作している
      return false;
    }
  };

  $.isNeedClickAudio = function () {
    //プレイヤーはクリックの必要なし
    if ($.isTyranoPlayer()) {
      return false;
    }

    //ブラウザやスマホアプリは必要
    if ($.isElectron() || $.isNWJS()) {
      return false;
    }

    return true;
  };

  $.isElectron = function () {
    return navigator.userAgent.indexOf("TyranoErectron") != -1
      || navigator.userAgent.indexOf("Electron") != -1;
  };

  //オブジェクトを引き継ぐ。
  $.extendParam = function (pm, target) {
    for (const key in target) {
      if (pm[key]) {
        if (pm[key] != "") {
          target[key] = pm[key];
        }
      }
    }

    return target;
  };

  $.insertRule = function (css_str) {
    const sheet = (function () {
      const style = document.createElement("style");
      document.getElementsByTagName("head")[0].appendChild(style);
      return style.sheet;
    })();
    sheet.insertRule(css_str, 0);
  };

  $.swfName = function (str) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
      return window[str];
    } else {
      return document[str];
    }
  };

  //古いトランス。
  $.trans_old = function (method, j_obj, time, mode, callback) {
    if (method == "crossfade" || mode == "show") {

      if (time == 0) {
        if (mode == "show") {
          j_obj.show();
        } else {
          j_obj.hide();
        }
        if (callback) {
          callback();
        }
      } else {
        let ta = {};

        if (mode == "show") {
          ta = { "opacity": "show" };
        } else {
          ta = { "opacity": "hide" };
        }

        j_obj.animate(ta, {
          duration: time,
          easing: "linear",
          complete: function () {
            if (callback) {
              callback();
            }
          } //end complete
        });
      }

      return false;

    } else {
      if (mode == "hide") {
        j_obj.hide(method, time, function () {
          if (callback)
            callback();
        });
      } else if (mode == "show") {
        j_obj.show(method, time, function () {
          if (callback)
            callback();
        });
      }
    }
  };

  //コンバート v450rc5以前
  const _map_conv_method = {
    "corssfade": { in: "fadeIn", out: "fadeOut" }, //corssfade, seriously?...
    "crossfade": { in: "fadeIn", out: "fadeOut" },
    "explode": { in: "zoomIn", out: "zoomOut" },
    "slide": { in: "slideInLeft", out: "slideOutLeft" },
    "blind": { in: "bounceIn", out: "bounceOut" },
    "bounce": { in: "bounceIn", out: "bounceOut" },
    "clip": { in: "flipInX", out: "flipOutX" },
    "drop": { in: "slideInLeft", out: "slideOutLeft" },
    "fold": { in: "fadeIn", out: "fadeOut" },
    "puff": { in: "fadeIn", out: "fadeOut" },
    "scale": { in: "zoomIn", out: "zoomOut" },
    "shake": { in: "fadeIn", out: "fadeOut" },
    "size": { in: "zoomIn", out: "zoomOut" }
  }

  $.trans = function (method, j_obj, time, mode, callback) {
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    method = _map_conv_method[method];
    j_obj.css("animation-duration", parseInt(time) + "ms");

    if (mode == "hide") {
      j_obj.show();
      j_obj.addClass('animated ' + method.out).one(animationEnd, function () {
        j_obj.off(animationEnd);
        j_obj.css("animation-duration", "");
        $(this).remove();
        // if (callback) {
          //callback();
        // }
      });

    } else if (mode == "show") {
      j_obj.show();
      j_obj.addClass('animated ' + method.in).one(animationEnd, function () {
        j_obj.off(animationEnd);
        j_obj.css("animation-duration", "");
        $(this).removeClass('animated ' + method);
        if (callback) {
          callback();
        }
      });
    }
  };

  //要素から空白のオブジェクトを削除して返却する
  $.minifyObject = function (obj) {
    for (const key in obj) {
      if (obj[key] == null || obj[key] == "") {
        delete obj[key];
      }
    }
    return obj;
  };

  $.preloadImgCallback = function (j_menu, callback, that) {
    const img_storage = j_menu.find("img").map(function () {
      return $(this).attr("src");
    });

    if (img_storage.length == 0) {
      callback();
      return;
    }

    //ロードが全て完了したら、ふわっと出す
    let sum = 0;
    for (let i = 0; i < img_storage.length; i++) {
      that.kag.preload(img_storage[i], function () {
        sum++;
        if (img_storage.length == sum) {
          callback();
        }
      });
    }
  };

  $.setStorage = function (key, val, type) {
    // edit - android port
    if ("appJsInterface" in window) {
      appJsInterface.setStorage(key, escape(JSON.stringify(val)));
      return;
    }

    if (type == "webstorage_compress") {
      $.setStorageCompress(key, val);
    } else if (type == "file") {
      $.setStorageFile(key, val);
    } else {
      $.setStorageWeb(key, val);
    }
  };

  //PC版のみ。実行フォルダを取得
  /*
  $.getProcessPath = function(){
      var path = process.execPath;
      var path_index = 0;
      if(process.platform == "darwin"){
          path_index = path.substr(0, path.indexOf(".app")).lastIndexOf("/");
      }else if(process.platform == "win32"){
          path_index = path.substr(0, path.indexOf(".exe")).lastIndexOf("\\");
      }else{
          return process.cwd();
      }
      var out_path = path.substr(0,path_index);
      return out_path;
  };
  */

  $.getOS = function () {
    if ($.isElectron()) {
      return process.platform;
    } else {
      return "";
    }
  };

  $.makeSaveKey = function () {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const key = Array.from(Array(N)).map(() => S[Math.floor(Math.random() * S.length)]).join('');
    return key;
  };

  $.getStorage = function (key, type) {
    // edit android port
    if ("appJsInterface" in window) {
      try {
        const json_str = appJsInterface.getStorage(key);
        if (!json_str) {
          return null;
        }
        return unescape(json_str);
      } catch (e) {
        console.error(e);
      }
    }

    let gv = "null";

    if (type == "webstorage_compress") {
      gv = $.getStorageCompress(key);
    } else if (type == "file") {
      gv = $.getStorageFile(key);
    } else {
      gv = $.getStorageWeb(key);
    }

    return gv;
  };

  $.setStorageWeb = function (key, val) {
    val = JSON.stringify(val);
    //localStorage.setItem(key, LZString.compress(escape(val)));
    try {
      localStorage.setItem(key, escape(val));
    } catch (e) {
      // console.error("セーブデータ。localstorageが利用できません。");
      console.error("Couldn't save data - localstorage is not available.");
    }
  };

  $.getStorageWeb = function (key) {
    let gv = "null";
    try {
      if (localStorage.getItem(key)) {
        //gv = unescape(LZString.decompress(localStorage.getItem(key)));
        gv = unescape(localStorage.getItem(key));
      }

      if (gv == "null") {
        return null;
      }
    } catch (e) {
      // alert("この環境はセーブ機能を利用できません。ローカルで実行している場合などに発生します");
      alert("The save function is not available for this environment. This happens, for example, when running locally.");
      $.confirmSaveClear();

      //console.error("セーブデータ。localstorageが利用できません。");
      // console.error("Couldn't load data - localstorage is not available.");
      return null;
    }

    return gv;
  };

  $.playerHtmlPath = function (html) {
    if ("appJsInterface" in window) {
      //Android
      return html;
    }

    if (typeof TyranoPlayer == "function") {
      //playerの場合HTMLを修正する必要がある
      let result_html = "";
      while (1) {
        const index = html.indexOf("file:///");
        if (index == -1) {
          result_html += html;
          break;
        } else {
          result_html += html.substring(0, index);
          html = html.substring(index);

          const replace_index = html.indexOf("/game/data");
          html = "./data" + html.substring(replace_index + "/game/data".length);
        }
      }

      if (result_html != "") {
        html = result_html;
      }
    }

    return html;
  };

  $.confirmSaveClear = function () {
    // if (confirm('セーブデータが壊れている可能性があります。セーブデータを初期化しますか？')) {
    if (confirm('Save data may be corrupted. Clear save data?')) {
      // alert("初期化");
      alert("Clearing");
      localStorage.clear();
    }
  };

  $.setStorageCompress = function (key, val) {
    val = JSON.stringify(val);
    localStorage.setItem(key, LZString.compress(escape(val)));
    //localStorage.setItem(key, escape(val));
  };

  $.getStorageCompress = function (key) {
    let gv = "null";
    try {
      if (localStorage.getItem(key)) {
        gv = unescape(LZString.decompress(localStorage.getItem(key)));

        if (gv == "null") {
          gv = unescape(localStorage.getItem(key));
        }
      }

      if (gv == "null") {
        return null;
      }
    } catch (e) {
      console.error(e);
      // alert("この環境はセーブ機能を利用できません。ローカルで実行している場合などに発生します");
      alert("The save function is not available for this environment. This happens, for example, when running locally.");
      $.confirmSaveClear();
    }

    return gv;
  };

  $.getExtWithFile = function (str) {
    let filename = "";
    if (str.indexOf("/") != -1) {
      filename = str.split("/").pop();
    } else {
      filename = str;
    }

    let dir_name = $.replaceAll(str, filename, "");

    let ext = "";
    if (filename.indexOf(".") != -1) {
      ext = str.split(".").pop();
    } else {
      ext = "";
      //拡張子がない場合はディレクトリ名とする。
      dir_name = str;
    }
    const name = $.replaceAll(filename, "." + ext, "");

    return { filename: filename, ext: ext, name: name, dir_name: dir_name };
  };

  //PC用の実行パスを取得
  $.getExePath = function () {
    //TyranoStudio.app/Contents/Resources/app
    // edit - don't require the remote package, just use __dirname
    let path = __dirname;

    if (process.platform == "darwin") {

      //TyranoStudio-darwin-x64.asar
      if (path.indexOf(".asar") != -1) {
        path = $.replaceAll(path, "/Contents/Resources/app.asar", "");
      } else {
        path = $.replaceAll(path, "/Contents/Resources/app", "");
      }

      path = $.getExtWithFile(path).dir_name;

    } else if (process.platform == "win32") {

      if (path.indexOf(".asar") != -1) {
        path = $.replaceAll(path, "\\resources\\app.asar", "");
      } else {
        path = $.replaceAll(path, "\\resources\\app", "");
      }

    // edit - support for Linux
    } else {
      if (path.indexOf(".asar") != -1) {
        path = $.replaceAll(path, "/resources/app.asar", "");
      } else {
        path = $.replaceAll(path, "/resources/app", "");
      }
    }

    return path;
  };

  //展開先のパスを返す。
  $.getUnzipPath = function () {
    let path = __dirname;
    if (path.indexOf(".asar") != -1) {
      return "asar";
    }
    return path;
  };

  $.setStorageFile = function (key, val) {
    val = JSON.stringify(val);
    const fs = require('fs');

    let out_path = "";

    //macOS Sierra 対応
    // edit - change the save path only for macOS (darwin)
    // changes the save directory from the temporary "delete after X days" folder to USER_HOME_FOLDER/_TyranoGameData
    if (process.platform === "darwin" && process.execPath.indexOf("var/folders") != -1) {
      out_path = process.env.HOME + "/_TyranoGameData";
      if (!fs.existsSync(out_path)) {
        fs.mkdirSync(out_path);
      }
    } else {
      out_path = $.getExePath();
    }

    fs.writeFileSync(out_path + "/" + key + ".sav", escape(val));
  };

  $.getStorageFile = function (key) {
    let gv = "null";
    try {
      const fs = require('fs');
      let out_path = "";

      //macOS Sierra 対応
      // edit - change the save path only for macOS (darwin)
      // changes the save directory from the temporary "delete after X days" folder to USER_HOME_FOLDER/_TyranoGameData
      if (process.platform === "darwin" && process.execPath.indexOf("var/folders") != -1) {
        out_path = process.env.HOME + "/_TyranoGameData";
        if (!fs.existsSync(out_path)) {
          fs.mkdirSync(out_path);
        }
      } else {
        out_path = $.getExePath();
      }

      if (fs.existsSync(out_path + "/" + key + ".sav")) {
        const str = fs.readFileSync(out_path + "/" + key + ".sav");
        gv = unescape(str);
      } else {
        //Fileが存在しない場合にローカルストレージから読み取る使用は破棄。
        //gv = unescape(localStorage.getItem(key));
      }

      if (gv == "null") {
        return null;
      }

    } catch (e) {
      console.error(e);
      // alert("この環境はセーブ機能を利用できません。ローカルで実行している場合などに発生します");
      alert("The save function is not available for this environment. This happens, for example, when running locally.");
      $.confirmSaveClear();

      //console.error("セーブデータ。localstorageが利用できません。");
      // console.error("Couldn't load data - localstorage is not available.");
      return null;
    }

    return gv;
  };

  $.alert = function (str, cb) {
    $(".remodal_title").html(str);

    const remodal = $(".remodal");
    remodal.find(".remodal-cancel").hide();
    remodal.find(".remodal-confirm").show();

    const inst = $('[data-remodal-id=modal]').remodal();
    inst.open();

    $(document).off('closed', '.remodal');
    $(document).on('closed', '.remodal', function (e) {
      if (typeof cb == "function") {
        cb();
      }
    });

    /*if ($.userenv() != "pc") {
      alert(str);
      if (typeof cb == "function") {
        cb();
      }
    } else {
      alertify.alert(str, function () {
        if (typeof cb == "function") {
          cb();
        }
      });
    }*/
  };

  $.inform = function (str, type) {
    alertify.log(str, type);
  };

  $.confirm = function (str, cb_ok, cb_cancel) {
    $(".remodal_title").html(str);

    const remodal = $(".remodal");
    remodal.find(".remodal-cancel").show();
    remodal.find(".remodal-confirm").show();

    const inst = $('[data-remodal-id=modal]').remodal();
    inst.open();

    /////////OK /////////////
    $(document).off('closed', '.remodal');

    $(document).off('confirmation', '.remodal');
    $(document).on('confirmation', '.remodal', function (e) {

      $(document).off('confirmation', '.remodal');
      $(document).off('cancellation', '.remodal');

      if (typeof cb_ok == "function") {
        cb_ok();
      }
    });

    ///////キャンセル//////////////
    $(document).off('cancellation', '.remodal');
    $(document).on('cancellation', '.remodal', function (e) {

      $(document).off('confirmation', '.remodal');
      $(document).off('cancellation', '.remodal');

      if (typeof cb_cancel == "function") {
        cb_cancel();
      }
    });

    /*if ($.userenv() != "pc") {

      if (window.confirm(str)) {
        cb_ok();
      } else {
        cb_cancel();
      }

    } else {
      alertify.confirm(str, function (e) {
        if (e) {
          // user clicked "ok"
          cb_ok();
        } else {
          // user clicked "cancel"
          cb_cancel();
        }
      });
    }*/

  };

  //オブジェクトの個数をもってきます。1
  $.countObj = function (obj) {
    return Object.keys(obj).length;
  };

  $.getUrlQuery = function (url) {
    const hash = url.slice(1).split('&');
    const max = hash.length;
    const vars = {};
    let array = "";

    for (let i = 0; i < max; i++) {
      array = hash[i].split('=');
      vars[array[0]] = array[1];
    }

    return vars;
  }

  //渡されたJqueryオブジェクトにクラスをセットします
  $.setName = function (jobj, str) {
    str = $.trim(str);

    if (str == "") {
      return;
    }

    const array = str.split(",");
    for (let i = 0; i < array.length; i++) {
      jobj.addClass(array[i]);
    }
  };

  //フラッシュのインストール判定
  /*$.isFlashInstalled = function () {
    if (navigator.plugins['Shockwave Flash']) {
      return true;
    }
    try {
      new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      return true;
    } catch (e) {
      return false;
    }
  };*/

  /*スマホの場合は、タッチでクリックを置き換える*/
  /*タッチ系、一応出来たけど、動作確認よくしなければならなｋ，問題なければR9にも適応*/
  if ($.userenv() != "pc") {
    $.event.tap = function (o) {

      o.on('touchstart', onTouchStart_);

      function onTouchStart_(e) {
        e.preventDefault();
        o.data('event.tap.moved', false).one('touchmove', onTouchMove_).one('touchend', onTouchEnd_);
        e.stopPropagation();
      }

      function onTouchMove_(e) {
        //o.data('event.tap.moved', true);
        e.stopPropagation();
      }

      function onTouchEnd_(e) {
        if (!o.data('event.tap.moved')) {
          o.off('touchmove', onTouchMove_);
          o.trigger('click');
          e.stopPropagation();
        }
      }
    };

    if ('ontouchend' in document) {
      $.fn.tap = function (data, fn) {
        //alert("tap!");

        if (fn == null) {
          fn = data;
          data = null;
        }

        if (arguments.length > 0) {
          this.on('tap', data, fn);
          $.event.tap(this);
        } else {
          this.trigger('tap');
        }
        return this;
      };

      if ($.attrFn) {
        $.attrFn['tap'] = true;
      }

      //クリック上書き
      $.fn.click = $.fn.tap;
    } else {
      //$.fn.tap = $.fn.click;
    }
  }

  // edit - for android
  $.pauseAllAudio = function () {
    //tyranoのすべてのaudioを停止する。
    // console.log("pause All Audio!");
    // console.log(TYRANO.kag.tmp.map_bgm);

    const bgm_objs = TYRANO.kag.tmp.map_bgm;
    const se_objs = TYRANO.kag.tmp.map_se;

    for (const key in bgm_objs) {
      bgm_objs[key].pause();
    }

    for (const key in se_objs) {
      // se_objs[key].pause();
      se_objs[key].stop(); //they aren't unpaused later anyway
    }

  }

  // edit - for android
  $.resumeAllAudio = function () {
    //tyranoのすべてのaudioを再開する。
    // console.log("resume All Audio!");
    const bgm_objs = TYRANO.kag.tmp.map_bgm;
    // const se_objs = TYRANO.kag.tmp.map_se;

    if (bgm_objs[TYRANO.kag.stat.current_bgm]) {
      bgm_objs[TYRANO.kag.stat.current_bgm].play();
    } else if (bgm_objs[0]) {
      bgm_objs[0].play();
    }

    //seは再開しない
    /*for (var key in se_objs) {
      se_objs[key].play();
    }*/

  }

  //////////////////////////////

  $.error_message = function (str) {
    console.error(str);
    alert(str);
  };

  //クッキー設定
  $.setCookie = function (key, val) {
    document.cookie = key + "=" + escape(val) + ";expires=Fri, 31-Dec-2030 23:59:59;path=/;";
  }
})(jQuery);

jQuery.fn.outerHTML = function (s) {
  return s
    ? this.before(s).remove()
    : jQuery("<p>").append(this.eq(0).clone()).html();
};

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t == 0)
      return b;
    if (t == d)
      return b + c;
    if ((t /= d / 2) < 1)
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0)
      return b;
    if ((t /= d) == 1)
      return b + c;
    if (!p)
      p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0)
      return b;
    if ((t /= d) == 1)
      return b + c;
    if (!p)
      p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0)
      return b;
    if ((t /= d / 2) == 2)
      return b + c;
    if (!p)
      p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else
      var s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1)
      return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined)
      s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined)
      s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined)
      s = 1.70158;
    if ((t /= d / 2) < 1)
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d / 2)
      return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
    return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }
});

