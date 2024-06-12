// noinspection EqualityComparisonWithCoercionJS

tyrano.base = {

  //読み込み対象のモジュール
  tyrano: null,
  modules: [],
  options: {},

  init: function (tyrano) {
    this.tyrano = tyrano;
  },

  setBaseSize: function (width, height) {

    this.tyrano.get(".tyrano_base").css({
      "width": width,
      "height": height,
      "background-color": "black"
    });

  },

  fitBaseSize: function (width, height) {

    const that = this;
    setTimeout(function () {
      that._fitBaseSize(width, height);
    }, 100);

  },


  //画面サイズをぴったりさせます
  _fitBaseSize: function (width, height) {

    const that = this;
    const view_width = $.getViewPort().width;
    const view_height = $.getViewPort().height;

    const width_f = view_width / width;
    const height_f = view_height / height;

    let scale_f = 0;

    // let space_width = 0;

    const screen_ratio = this.tyrano.kag.config.ScreenRatio;

    //比率を固定にしたい場合は以下　以下のとおりになる
    if (screen_ratio == "fix") {
      if (width_f > height_f) {
        scale_f = height_f;
      } else {
        scale_f = width_f;
      }

      this.tyrano.kag.tmp.base_scale = scale_f;

      setTimeout(function () {
        const tyrano_base = $(".tyrano_base");

        //中央寄せなら、画面サイズ分を引く。
        if (that.tyrano.kag.config["ScreenCentering"] && that.tyrano.kag.config["ScreenCentering"] == "true") {
          tyrano_base.css({
            "transform-origin": "0 0",
            margin: 0
          });

          const width = Math.abs(parseInt(window.innerWidth) - parseInt(that.tyrano.kag.config.scWidth * scale_f)) / 2;
          const height = Math.abs(parseInt(window.innerHeight) - parseInt(that.tyrano.kag.config.scHeight * scale_f)) / 2;

          if (width_f > height_f) {
            const margin_top = document.documentElement.clientHeight - window.innerHeight;
            tyrano_base.css({
              "margin-left": width + "px",
              "margin-top": margin_top + "px"
            });
          } else {
            tyrano_base.css({
              "margin-left": "0px",
              "margin-top": height + "px"
            });
          }
        }

        // edit - properly center the game
        if (scale_f > 1) {
          tyrano_base.css("position", "");
        } else {
          tyrano_base.css("position", "absolute");
        }

        tyrano_base.css("transform", "scale(" + scale_f + ") ");
        if (parseInt(view_width) < parseInt(width)) {
          if (scale_f < 1) {
            window.scrollTo(width, height);
          }
        }

        //vchat形式が有効ならそのエリアも調整する
        if (that.tyrano.kag.config["vchat"] && that.tyrano.kag.config["vchat"] == "true") {

          const base_height = Math.round(parseInt($("#tyrano_base").css("height")) * scale_f);
          const vchat_height = (view_height - base_height);

          $("#vchat_base").css({
            "margin-top": base_height,
            "height": vchat_height
          });
        }

      }, 100);

    } else if (screen_ratio == "fit") {
      //スクリーンサイズに合わせて自動的に調整される
      setTimeout(function () {
        $(".tyrano_base").css("transform", "scaleX(" + width_f + ") scaleY(" + height_f + ")");
        window.scrollTo(width, height);
      }, 100);
    } else {
      //スクリーンサイズ固定
    }
  },

  test: function () {
    //alert("tyrano test");
  }

};
