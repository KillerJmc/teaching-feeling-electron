// noinspection EqualityComparisonWithCoercionJS

tyrano.plugin.kag.menu = {

  tyrano: null,
  kag: null,
  snap: null,

  init: function () {
  },

  showMenu: function (call_back) {

    if (this.kag.layer.layer_event.css("display") == "none" && this.kag.stat.is_strong_stop != true) {
      return false;
    }

    //wait中の時
    if (this.kag.stat.is_wait == true) {
      return false;
    }

    const that = this;

    this.kag.stat.is_skip = false;
    this.kag.stat.is_auto = false;
    this.kag.stat.is_auto_wait = false;

    const layer_menu = this.kag.layer.getMenuLayer();
    layer_menu.empty();

    let button_clicked = false;

    this.kag.html("menu", {
      "novel": $.novel
    }, function (html_str) {

      const j_menu = $(html_str);

      layer_menu.append(j_menu);

      layer_menu.find(".menu_skip").on("click", function (e) {

        //スキップを開始する
        //Start skipping
        layer_menu.html("").hide();

        if (that.kag.stat.visible_menu_button == true) {
          $(".button_menu").show();
        }
        //nextOrder にして、
        that.kag.stat.is_skip = true;

        //処理待ち状態の時は、実行してはいけない
        if (that.kag.layer.layer_event.css("display") == "none") {
          //alert("今、スキップしない");
          //that.kag.ftag.nextOrder();
        } else {
          //alert("スキップするよ");
          that.kag.ftag.nextOrder();
        }

        e.stopPropagation();
      });

      layer_menu.find(".menu_close").on("click", function (e) {
        layer_menu.hide();
        if (that.kag.stat.visible_menu_button == true) {
          $(".button_menu").show();
        }

        e.stopPropagation();
      });

      layer_menu.find(".menu_window_close").on("click", function (e) {

        //ウィンドウ消去
        //Hide window
        that.kag.layer.hideMessageLayers();

        layer_menu.hide();
        if (that.kag.stat.visible_menu_button == true) {
          $(".button_menu").show();
        }

        e.stopPropagation();
      });

      layer_menu.find(".menu_save").on("click", function (e) {

        //連続クリック対策
        // Prevent continuous clicking
        if (button_clicked == true) {
          return;
        }
        button_clicked = true;

        that.displaySave();
        e.stopPropagation();
      });

      layer_menu.find(".menu_load").on("click", function (e) {
        //連続クリック対策
        // Prevent continuous clicking
        if (button_clicked == true) {
          return;
        }
        button_clicked = true;

        that.displayLoad();
        e.stopPropagation();
      });

      //タイトルに戻る
      // Return to title screen
      layer_menu.find(".menu_back_title").on("click", function () {

        that.kag.backTitle();

        /*
        if (!confirm($.lang("go_title"))) {
            return false;
        }
        */
        //first.ks の *start へ戻ります
        //location.reload();
      });

      $.preloadImgCallback(j_menu, function () {
        layer_menu.stop(true, true).fadeIn(300);
        $(".button_menu").hide();
      }, that);

    });

  },

  displaySave: function (callback) {
    //セーブ画面作成
    const that = this;

    this.kag.stat.is_skip = false;

    const array_save = that.getSaveData();
    const array = array_save.data;
    //セーブデータ配列

    const layer_menu = that.kag.layer.getMenuLayer();

    for (let i = 0; i < array.length; i++) {
      array[i].num = i;
    }

    this.kag.html("save", {
      array_save: array,
      "novel": $.novel
    }, function (html_str) {

      const j_save = $(html_str);

      //フォントをゲームで指定されているフォントにする。
      j_save.find(".save_list").css("font-family", that.kag.config.userFace);

      j_save.find(".save_display_area").each(function () {
        $(this).on("click", function (e) {
          const num = $(this).attr("data-num");

          that.snap = null;

          /*
          const layer_menu = that.kag.layer.getMenuLayer();
          layer_menu.hide().empty();
          if (that.kag.stat.visible_menu_button == true) {
            $(".button_menu").show();
          }
          */

          that.doSave(num, function (save_data) {

            const j_slot = layer_menu.find("[data-num='" + num + "']");

            if (save_data["img_data"] != "") {

              const save_list_item_thumb = j_slot.find(".save_list_item_thumb");
              const thumb_img = save_list_item_thumb.find("img");
              if (thumb_img.get(0)) {
                thumb_img.attr("src", save_data["img_data"]);
              } else {
                save_list_item_thumb.css("background-image", "").append("<img>");
                save_list_item_thumb.attr("src", save_data["img_data"]);
              }

            }

            j_slot.find(".save_list_item_date").html(save_data["save_date"]);
            j_slot.find(".save_list_item_text").html(save_data["title"]);

            if (typeof callback == "function") {
              callback();
            }
          });

        });
      });

      //スマホの場合はボタンの上下でスクロールできるようにする
      const button_smart = j_save.find(".button_smart");
      button_smart.hide();
      if ($.userenv() != "pc") {
        button_smart.show();
        j_save.find(".button_arrow_up").on("click", function () {
          const now = j_save.find(".area_save_list").scrollTop();
          const pos = now - 160;
          layer_menu.find(".area_save_list").animate({ scrollTop: pos }, { queue: false });
        });

        j_save.find(".button_arrow_down").on("click", function () {
          const now = j_save.find(".area_save_list").scrollTop();
          const pos = now + 160;
          j_save.find(".area_save_list").animate({ scrollTop: pos }, { queue: false });
        });
      }

      that.setMenu(j_save, callback);
    });

    //背景素材挿入
    /*
     var j_menu_save_img =$("<img src='tyrano/images/kag/menu_save_bg.jpg' style='z-index:-1;left:0px;top:0px;position:absolute;' />");
     j_menu_save_img.css("width",this.kag.config.scWidth);
     j_menu_save_img.css("height",this.kag.config.scHeight);
     j_save.append(j_menu_save_img);
     */

  },

  //セーブを実行する
  doSave: function (num, callback) {

    let array_save = this.getSaveData();

    const that = this;

    if (this.snap == null) {
      //ここはサムネイルイメージ作成のため、callback指定する
      this.snapSave(this.kag.stat.current_save_str, function () {
        //現在、停止中のステータスなら、[_s]ポジションからセーブデータ取得

        /*if (that.snap.stat.is_strong_stop == true) {
          alert("ここではセーブできません");
          return false;
        }*/

        const data = that.snap;
        data.save_date = $.getNowDate() + "　" + $.getNowTime();
        array_save.data[num] = data;
        $.setStorage(that.kag.config.projectID + "_tyrano_data", array_save, that.kag.config.configSave);

        if (typeof callback == "function") {
          //終わったタイミングでコールバックを返す
          callback(data);
        }

      });

    } else {
      const data = that.snap;
      data.save_date = $.getNowDate() + "　" + $.getNowTime();
      array_save.data[num] = data;
      $.setStorage(that.kag.config.projectID + "_tyrano_data", array_save, that.kag.config.configSave);

      if (typeof callback == "function") {
        //終わったタイミングでコールバックを返す
        callback(data);
      }

    }

  },

  setQuickSave: function () {
    const that = this;

    const saveTitle = that.kag.stat.current_save_str;

    that.kag.menu.snapSave(saveTitle, function () {
      let data = that.snap;
      data.save_date = $.getNowDate() + "　" + $.getNowTime();
      $.setStorage(that.kag.config.projectID + "_tyrano_quick_save", data, that.kag.config.configSave);

      const layer_menu = that.kag.layer.getMenuLayer();
      layer_menu.hide();
    });
  },

  loadQuickSave: function () {
    let data = $.getStorage(this.kag.config.projectID + "_tyrano_quick_save", this.kag.config.configSave);

    if (data) {
      data = JSON.parse(data);
    } else {
      return false;
    }

    this.loadGameData($.extend(true, {}, data));
  },

  //doSaveSnap 自動セーブのデータを保存する
  doSetAutoSave: function () {
    let data = this.snap;
    data.save_date = $.getNowDate() + "　" + $.getNowTime();
    $.setStorage(this.kag.config.projectID + "_tyrano_auto_save", data, this.kag.config.configSave);

    const layer_menu = this.kag.layer.getMenuLayer();
    layer_menu.hide();
  },

  //自動保存のデータを読み込む
  loadAutoSave: function () {
    let data = $.getStorage(this.kag.config.projectID + "_tyrano_auto_save", this.kag.config.configSave);

    if (data) {
      data = JSON.parse(data);
    } else {
      return false;
    }

    this.loadGameData($.extend(true, {}, data), { "auto_next": "yes" });
  },

  //セーブ状態のスナップを保存します。
  snapSave: function (title, call_back, flag_thumb) {

    const that = this;

    //画面のキャプチャも取るよ
    const _current_order_index = that.kag.ftag.current_order_index - 1;
    const _stat = $.extend(true, {}, $.cloneObject(that.kag.stat));

    //3Dオブジェクトが実装されてる場合復元させる。////////////////////

    const three = this.kag.tmp.three;
    const models = three.models;

    const three_save = {};

    three_save.stat = three.stat;
    three_save.evt = three.evt;

    const save_models = {};

    for (const key in models) {
      const model = models[key];
      save_models[key] = model.toSaveObj();
    }

    three_save.models = save_models;

    /////////////////////////////////////////////////////////////

    if (typeof flag_thumb == "undefined") {
      flag_thumb = this.kag.config.configThumbnail;
    }

    if (flag_thumb == "false") {

      const data = {
        title: title,
        stat: _stat,
        three: three_save,
        current_order_index: _current_order_index,
        save_date: $.getNowDate() + "　" + $.getNowTime(), //１つ前
        img_data: "", //Do not save thumbnail data サムネデータを保存しない
        layer: that.kag.layer.getLayerHtml() //レイヤ部分のHTMLを取得
      };

      that.snap = $.extend(true, {}, $.cloneObject(data));

      if (call_back) {
        call_back();
      }

    } else {

      $("#tyrano_base").find(".layer_blend_mode").css("display", "none");

      setTimeout(function () {

        const completeImage = function (img_code) {

          const data = {
            title: title,
            stat: _stat,
            three: three_save,
            current_order_index: _current_order_index,
            save_date: $.getNowDate() + "　" + $.getNowTime(), //１つ前
            img_data: img_code,
            layer: that.kag.layer.getLayerHtml() //レイヤ部分のHTMLを取得
          };

          that.snap = $.extend(true, {}, $.cloneObject(data));

          if (call_back) {
            call_back();
          }

        };

        if (that.kag.stat.save_img != "") {
          const img = new Image();
          img.src = _stat.save_img;
          img.onload = function () {

            const canvas = document.createElement('canvas');
            canvas.width = that.kag.config.scWidth;
            canvas.height = that.kag.config.scHeight;
            // Draw Image
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // To Base64
            const img_code = that.createImgCode(canvas);

            completeImage(img_code);
          };

        } else {

          //ビデオをキャプチャするための仕組み
          const canvas = document.createElement('canvas'); // declare a canvas element in your html
          const ctx = canvas.getContext('2d');
          const videos = document.querySelectorAll('video');
          for (let i = 0, len = videos.length; i < len; i++) {
            const v = videos[i];
            //if (!v.src) continue // no video here
            try {
              const width = v.videoWidth;
              const height = v.videoHeight;

              canvas.style.left = v.style.left;
              canvas.style.top = v.style.top;

              canvas.style.width = v.style.width;
              canvas.style.height = v.style.height;

              canvas.width = width;
              canvas.height = height;

              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(v, 0, 0, width, height);
              v.style.backgroundImage = `url(${canvas.toDataURL()})`; // here is the magic
              v.style.backgroundSize = 'cover';
              v.classList.add("tmp_video_canvas");

              ctx.clearRect(0, 0, width, height); // clean the canvas

            } catch (e) {
            }

          }

          //canvasがある場合は、オリジナルをクローン。画面サイズによっては、カクつく問題が残る
          let flag_canvas = false;
          const array_canvas = [];
          let tmp_base = $("#tyrano_base");
          tmp_base.find("canvas").each(function (index, element) {
            array_canvas.push(element);
          });
          if (array_canvas.length > 0) {
            flag_canvas = true;
          }

          //canvasがある場合。
          if (!flag_canvas) {
            tmp_base = tmp_base.clone();
            tmp_base.addClass("snap_tmp_base");
            $("body").append(tmp_base);
          }

          const tmp_left = tmp_base.css("left");
          const tmp_top = tmp_base.css("top");
          const tmp_trans = tmp_base.css("transform");

          tmp_base.css({
            "left": 0,
            "top": 0,
            "transform": ""
          });
          tmp_base.find(".layer_menu").hide();

          const opt = {
            scale: 1,
            height: that.kag.config.scHeight,
            width: that.kag.config.scWidth
          };

          html2canvas(tmp_base.get(0), opt).then(function (canvas) {
            const tyrano_base = $("#tyrano_base");
            tyrano_base.find(".layer_blend_mode").css("display", "");
            tyrano_base.find(".tmp_video_canvas").css("backgroundImage", "");

            // canvas is the final rendered <canvas> element
            //console.log(canvas);
            const img_code = that.createImgCode(canvas);

            completeImage(img_code);
          });

          tmp_base.hide();
          tmp_base.css({
            "left": tmp_left,
            "top": tmp_top,
            "transform": tmp_trans
          });
          tmp_base.find(".layer_menu").show();
          $("body").find(".snap_tmp_base").remove();

          tmp_base.show();
        }

      }, 20);

    }

  },

  //サムネ画像の作成　thanks @hororo_memocho
  createImgCode: function (canvas) {
    let code = "";
    const q = this.kag.config.configThumbnailQuality

    if (q == "low") {
      code = canvas.toDataURL("image/jpeg", 0.3);
    } else if (q == "middle") {
      code = canvas.toDataURL("image/jpeg", 0.7);
    } else {
      code = canvas.toDataURL();
    }

    return code;

  },

  setGameSleep: function (next_flag) {
    //awake時にnextOrderするか否か
    if (next_flag) {
      this.kag.tmp.sleep_game_next = true;
    } else {
      this.kag.tmp.sleep_game_next = false;
    }

    this.kag.tmp.sleep_game = this.snap;
  },


  displayLoad: function (callback) {

    const that = this;

    this.kag.stat.is_skip = false;

    const array_save = that.getSaveData();
    const array = array_save.data;
    //セーブデータ配列
    for (let i = 0; i < array.length; i++) {
      array[i].num = i;
    }

    this.kag.html("load", {
      array_save: array,
      "novel": $.novel
    }, function (html_str) {
      const j_save = $(html_str);

      j_save.find(".save_list").css("font-family", that.kag.config.userFace);

      j_save.find(".save_display_area").each(function () {
        $(this).on("click", function (e) {
          const num = $(this).attr("data-num");

          //セーブデータが存在しない場合
          if (array[num].save_date == "") {
            return;
          }

          that.snap = null;
          that.loadGame(num);

          const layer_menu = that.kag.layer.getMenuLayer();
          layer_menu.hide().empty();
          if (that.kag.stat.visible_menu_button == true) {
            $(".button_menu").show();
          }

        });
      });

      //スマホの場合はボタンの上下でスクロールできるようにする
      const button_smart = j_save.find(".button_smart");
      button_smart.hide();
      if ($.userenv() != "pc") {
        button_smart.show();
        j_save.find(".button_arrow_up").on("click", function () {
          const now = j_save.find(".area_save_list").scrollTop();
          const pos = now - 160;
          const layer_menu = that.kag.layer.getMenuLayer();
          layer_menu.find(".area_save_list").animate({ scrollTop: pos }, { queue: false });
        });

        j_save.find(".button_arrow_down").on("click", function () {
          const now = j_save.find(".area_save_list").scrollTop();
          const pos = now + 160;
          j_save.find(".area_save_list").animate({ scrollTop: pos }, { queue: false });
        });
      }

      that.setMenu(j_save, callback);
    });

  },

  //ゲームを途中から開始します
  loadGame: function (num) {

    const array_save = this.getSaveData();
    const array = array_save.data;
    //セーブデータ配列

    //保存されていないデータはロード不可
    if (array[num].save_date == "") {
      return;
    }

    let auto_next = "no";

    if (array[num].stat.load_auto_next == true) {
      array[num].stat.load_auto_next = false;
      auto_next = "yes";
    }

    this.loadGameData($.extend(true, {}, array[num]), { "auto_next": auto_next });

  },

  loadGameData: function (data, options) {

    let auto_next = "no";

    //普通のロードの場合
    if (typeof options == "undefined") {
      options = { bgm_over: "false" };
    } else if (typeof options.bgm_over == "undefined") {
      options.bgm_over = "false";
    }

    if (options.auto_next) {
      auto_next = options.auto_next;
    }

    //Live2Dモデルがある場合の後始末
    if (typeof Live2Dcanvas != "undefined") {
      for (const model_id in Live2Dcanvas) {
        if (Live2Dcanvas[model_id]) {
          Live2Dcanvas[model_id].check_delete = 2;
          Live2D.deleteBuffer(Live2Dcanvas[model_id].modelno);
          delete Live2Dcanvas[model_id];
        }
      }
    }

    //layerの復元
    this.kag.layer.setLayerHtml(data.layer);

    //バックログの初期化
    //awakegame考慮もれ。一旦戻す
    //this.kag.variable.tf.system.backlog = [];

    //ステータスの設定、ディープに設定する
    this.kag.stat = data.stat;

    //ステータスがストロングストップの場合
    if (this.kag.stat.is_strong_stop == true) {
      auto_next = "stop";
    } else {
      //停止の場合は復活
      this.kag.stat.is_strong_stop = false;
    }

    //タイトルの復元
    this.kag.setTitle(this.kag.stat.title);

    //一旦音楽と効果音は全て止めないと

    //BGMを引き継ぐかどうか。
    if (options.bgm_over == "false") {

      //全BGMを一旦止める
      const map_se = this.kag.tmp.map_se;
      for (const key in map_se) {
        if (map_se[key]) {
          this.kag.ftag.startTag("stopse", {
            stop: "true",
            buf: key
          });
        }
      }

      const map_bgm = this.kag.tmp.map_bgm;
      for (const key in map_bgm) {
        this.kag.ftag.startTag("stopbgm", {
          stop: "true",
          buf: key
        });
      }

      //音楽再生
      if (this.kag.stat.current_bgm != "") {

        const mstorage = this.kag.stat.current_bgm;

        const pm = {
          loop: "true",
          storage: mstorage,
          html5: this.kag.stat.current_bgm_html5,
          /*fadein:"true",*/
          /*time:2000,*/
          stop: "true"
        };

        //ボリュームが設定されいる場合
        if (this.kag.stat.current_bgm_vol != "") {
          pm.volume = this.kag.stat.current_bgm_vol;
        }

        this.kag.ftag.startTag("playbgm", pm);
      }

      //効果音再生
      for (const key in this.kag.stat.current_se) {
        const pm_obj = this.kag.stat.current_se[key];
        pm_obj.stop = "true";
        this.kag.ftag.startTag("playse", pm_obj);
      }
    }

    //読み込んだCSSがある場合
    if (this.kag.stat.cssload) {
      for (const file in this.kag.stat.cssload) {
        const style = '<link rel="stylesheet" href="' + file + "?" + Math.floor(Math.random() * 10000000) + '">';
        $('head link').last().after(style);
      }
    } else {
      this.kag.stat.cssload = {};
    }

    if (!this.kag.stat.current_bgmovie) {
      this.kag.stat.current_bgmovie = {
        storage: "",
        volume: ""
      };
    }

    //カメラ設定を復旧 ///////////////
    if (this.kag.config.useCamera == "true") {

      const layer_camera = $(".layer_camera");

      layer_camera.css({
        "-animation-name": "",
        "-animation-duration": "",
        "-animation-play-state": "",
        "-animation-delay": "",
        "-animation-iteration-count": "",
        "-animation-direction": "",
        "-animation-fill-mode": "",
        "-animation-timing-function": ""
      });

      for (const key in this.kag.stat.current_camera) {

        const a3d_define = {
          frames: {
            "0%": {
              trans: this.kag.stat.current_camera[key]
            },
            "100%": {
              trans: this.kag.stat.current_camera[key]
            }
          },

          config: {
            duration: "5ms",
            state: "running",
            easing: "ease"
          },

          complete: function () {
            //特に処理なし
          }

        };

        //アニメーションの実行
        if (key == "layer_camera") {

          layer_camera.css("-webkit-transform-origin", "center center");
          setTimeout(function () {
            layer_camera.a3d(a3d_define);
          }, 1);

        } else {

          const key_fore = $("." + key + "_fore")
          key_fore.css("-webkit-transform-origin", "center center");
          setTimeout(function () {
            key_fore.a3d(a3d_define);
          }, 1);

        }

      }

    }
    ///////////カメラここまで

    //どの道動画削除。
    $(".tyrano_base").find("video").remove();
    this.kag.tmp.video_playing = false;

    //背景動画が設定中なら
    if (this.kag.stat.current_bgmovie.storage != "") {

      const vstorage = this.kag.stat.current_bgmovie.storage;
      const volume = this.kag.stat.current_bgmovie.volume;

      const pm = {
        storage: vstorage,
        volume: volume,
        stop: "true"
      };

      this.kag.tmp.video_playing = false;

      this.kag.ftag.startTag("bgmovie", pm);

    }

    //カメラが設定中なら
    if (this.kag.stat.current_bgcamera != "") {

      this.kag.stat.current_bgcamera.stop = "true";
      this.kag.ftag.startTag("bgcamera", this.kag.stat.current_bgcamera);
    }

    //3Dモデルの復元/////////////////////////////////////////////
    const three = data.three;
    if (three.stat.is_load == true) {

      this.kag.stat.is_strong_stop = true;
      const init_pm = three.stat.init_pm;

      this.kag.ftag.startTag("3d_close", {});

      //setTimeout((e)=>{

      init_pm["next"] = "false";
      this.kag.ftag.startTag("3d_init", init_pm);

      const models = three.models;

      const scene_pm = three.stat.scene_pm;
      scene_pm["next"] = "false";

      this.kag.ftag.startTag("3d_scene", scene_pm);

      for (const key in models) {

        const model = models[key];
        const pm = model.pm;

        pm["pos"] = model.pos;
        pm["rot"] = model.rot;
        pm["scale"] = model.scale;
        pm["_load"] = "true";

        let tag = pm._tag;

        if (key == "camera") {
          tag = "3d_camera";
        }

        pm["next"] = "false";

        this.kag.ftag.startTag(tag, pm);

      }

      //ジャイロの復元
      const gyro = three.stat.gyro;
      if (gyro.enable == 1) {
        //復活させる。
        const gyro_pm = gyro.pm;
        gyro_pm["next"] = "false";
        this.kag.ftag.startTag("3d_gyro", gyro_pm);
      }


      if (three.stat.canvas_show) {
        this.kag.tmp.three.j_canvas.show();
      } else {
        this.kag.tmp.three.j_canvas.hide();
      }

      this.kag.tmp.three.stat = three.stat;
      this.kag.tmp.three.evt = three.evt;

      //イベントが再開できるかどうか。
      this.kag.stat.is_strong_stop = false;

      //},10);
    }

    /////////////////////////////////////////////

    //カーソルの復元
    this.kag.setCursor(this.kag.stat.current_cursor);

    //メニューボタンの状態
    if (this.kag.stat.visible_menu_button == true) {
      $(".button_menu").show();
    } else {
      $(".button_menu").hide();
    }

    //イベントの復元
    $(".event-setting-element").each(function () {
      const j_elm = $(this);
      const kind = j_elm.attr("data-event-tag");
      const pm = JSON.parse(j_elm.attr("data-event-pm"));
      const event_tag = object(tyrano.plugin.kag.tag[kind]);
      event_tag.setEvent(j_elm, pm);
    });

    //ジャンプ
    //data.stat.current_scenario;
    //data.current_order_index;
    //必ず、ファイルロード。別シナリオ経由的な
    //this.kag.ftag.startTag("call",{storage:"make.ks"});

    //auto_next 一旦makeを経由するときに、auto_nextを考えておく
    //alert(auto_next);

    let insert = {
      name: "call",
      pm: {
        storage: "make.ks",
        auto_next: auto_next
      },
      val: ""
    };

    //auto_next = "yes";

    //make.ks を廃止したい
    //var insert =undefined;

    //添付変数は消す。
    this.kag.clearTmpVariable();

    //fix - restore the old tmp variables from before sleepgame
    this.kag.layer.layer_event[0].style.display = "";

    //store the newest backlog in memory
    const systemTemp = this.kag.variable.tf.system;
    //restore the old tf from before sleepgame
    this.kag.variable.tf = this.kag.variable.before_sleepgame_tf || {};
    delete this.kag.variable.before_sleepgame_tf;
    //restore the newest backlog
    this.kag.variable.tf.system = systemTemp;

    //fix - don't run make.ks on awakegame if do_not_run_make_ks == true
    if (options.do_not_run_make_ks === true) {
      insert = undefined;
    }

    this.kag.ftag.nextOrderWithIndex(data.current_order_index, data.stat.current_scenario, true, insert, "yes");


  },

  //メニュー画面に指定のJクエリオブジェクト追加
  setMenu: function (j_obj, callback) {
    const that = this;
    const layer_menu = this.kag.layer.getMenuLayer();

    // layer_menu.empty();

    j_obj.find(".menu_close").on("click", function (e) {

      layer_menu.fadeOut(300, function () {
        layer_menu.empty();

        if (typeof callback == "function") {
          //終わったタイミングでコールバックを返す
          callback();
        }

      });
      if (that.kag.stat.visible_menu_button == true) {
        $(".button_menu").show();
      }

    });

    j_obj.hide();
    layer_menu.append(j_obj).show();

    $.preloadImgCallback(layer_menu, function () {
      j_obj.stop(true, true).fadeIn(300);
      layer_menu.find(".block_menu").fadeOut(300);
    }, that);

  },

  //メニューを隠します
  hideMenu: function () {

  },

  //セーブデータを取得します
  getSaveData: function () {

    const saveArray = $.getStorage(this.kag.config.projectID + "_tyrano_data", this.kag.config.configSave);

    if (saveArray) {
      // データがある場合は一覧として表示します
      //return eval("(" + saveArray + ")");
      return JSON.parse(saveArray);
    }

    //セーブ数の上限を変更する。
    const save_slot_num = this.kag.config.configSaveSlotNum || 5;

    const tmp_array = [];
    for (let i = 0; i < save_slot_num; i++) {
      const json = {
        title: $.lang("not_saved"),
        // ラストテキスト
        current_order_index: 0,
        save_date: "",
        img_data: "",
        stat: {}
      };
      tmp_array.push(json);
    }

    const root = {
      kind: "save",
      hash: this.kag.save_key_val,
      data: tmp_array
    };

    return root;
  },

  //バックログ画面表示
  displayLog: function () {

    const that = this;
    this.kag.stat.is_skip = false;

    this.kag.html("backlog", {
      "novel": $.novel
    }, function (html_str) {

      const j_menu = $(html_str);

      const layer_menu = that.kag.layer.getMenuLayer();
      layer_menu.empty();
      layer_menu.append(j_menu);

      layer_menu.find(".menu_close").on("click", function () {
        layer_menu.fadeOut(300, function () {
          layer_menu.empty();
        });
        if (that.kag.stat.visible_menu_button == true) {
          $(".button_menu").show();
        }
      });

      //スマホの場合はボタンの上下でスクロールできるようにする
      const button_smart = layer_menu.find(".button_smart");
      button_smart.hide();
      if ($.userenv() != "pc") {
        button_smart.show();
        layer_menu.find(".button_arrow_up").on("click", function () {
          const now = layer_menu.find(".log_body").scrollTop();
          const pos = now - 60;
          layer_menu.find(".log_body").animate({ scrollTop: pos }, { queue: false });
        });

        layer_menu.find(".button_arrow_down").on("click", function () {
          const now = layer_menu.find(".log_body").scrollTop();
          const pos = now + 60;
          layer_menu.find(".log_body").animate({ scrollTop: pos }, { queue: false });
        });

      }

      let log_str = "";

      const array_log = that.kag.variable.tf.system.backlog;

      for (let i = 0; i < array_log.length; i++) {
        log_str += array_log[i] + "<br />";
      }

      layer_menu.find(".log_body")
        .html(log_str)
        .css("font-family", that.kag.config.userFace);

      $.preloadImgCallback(layer_menu, function () {
        layer_menu.stop(true, true).fadeIn(300);
        //一番下固定させる
        layer_menu.find(".log_body").scrollTop(9999999999);

      }, that);

      $(".button_menu").hide();
    });
  },

  //画面をフルスクリーンにします
  screenFull: function () {

    const isFullScreen = document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullScreenElement || false;
    const isEnableFullScreen = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || false;
    const elem = document.body;

    if (isEnableFullScreen) {

      if (elem.requestFullscreen) {
        if (isFullScreen) {
          document.exitFullscreen();
        } else {
          elem.requestFullscreen();
        }
      } else if (elem.webkitRequestFullscreen) {
        if (isFullScreen) {
          document.webkitExitFullscreen();
        } else {
          elem.webkitRequestFullscreen();
        }
      } else if (elem.mozRequestFullScreen) {
        if (isFullScreen) {
          document.mozCancelFullScreen();
        } else {
          elem.mozRequestFullScreen();
        }
      } else if (elem.msRequestFullscreen) {
        if (isFullScreen) {
          document.msExitFullscreen();
        } else {
          elem.msRequestFullscreen();
        }
      }
    }

  },

  test: function () {

  }
};

