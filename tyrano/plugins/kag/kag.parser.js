// noinspection EqualityComparisonWithCoercionJS

tyrano.plugin.kag.parser = {

  tyrano: null,
  kag: null,

  flag_script: false, //スクリプト解析中なら
  deep_if: 0,

  init: function () {
    //alert("kag.parser 初期化");
    //this.tyrano.test();
  },

  loadConfig: function (call_back) {

    const that = this;

    //同じディレクトリにある、KAG関連のデータを読み込み
    $.loadText("./data/system/Config.tjs", function (text_str) {

      const map_config = that.compileConfig(text_str);

      if (call_back) {
        call_back(map_config);
      }
    });
  },

  //コンフィグファイルをデータ構造に格納
  compileConfig: function (text_str) {

    let error_str = "";
    const map_config = {};

    const array_config = text_str.split("\n");

    array_config.forEach((config_line, index) => {
      try {

        let line_str = $.trim(config_line);
        if (line_str != "" && line_str.charAt(0) === ";") {

          const tmp_comment = line_str.split("//");
          if (tmp_comment.length > 1) {
            line_str = $.trim(tmp_comment[0]);
          }

          line_str = $.replaceAll(line_str, ";", "");
          line_str = $.replaceAll(line_str, "\"", "");

          const tmp = line_str.split("=");

          const key = $.trim(tmp[0]);
          const val = $.trim(tmp[1]);
          map_config[key] = val;
        }

      } catch (e) {
        // error_str += "Error:Config.tjsに誤りがあります/行:" + index;
        error_str += "Error: Error in Config.tjs, line: " + index;
      }
    });

    if (error_str != "") {
      alert(error_str);
    }

    return map_config;
  },

  //シナリオをオブジェクト化する
  parseScenario: function (text_str) {

    const array_s = [];
    const map_label = {}; //ラベル一覧
    const array_row = text_str.split("\n");
    let flag_comment = false; //コメント中なら

    for (let line_number = 0; line_number < array_row.length; line_number++) {

      let line_str = $.trim(array_row[line_number]);
      const first_char = line_str.charAt(0);

      if (line_str.indexOf("endscript") != -1) {
        this.flag_script = false;
      }

      //コメントの場合は無視する
      if (flag_comment === true && line_str === "*/") {
        flag_comment = false;
      } else if (line_str === "/*") {
        //TODO shouldn't this be line_str.startsWith("/*") ???
        flag_comment = true;
      } else if (flag_comment == true || first_char === ";") {
        //do nothing
      } else if (first_char === "#") {

        let tmp_line = $.trim(line_str.substring(1));
        let chara_name = "";
        let chara_face = "";
        if (tmp_line.split(":").length > 1) {
          const array_line = tmp_line.split(":");
          chara_name = array_line[0];
          chara_face = array_line[1];
        } else {
          chara_name = tmp_line;
        }
        //キャラクターボックスへの名前表示
        const text_obj = {
          line: line_number,
          name: "chara_ptext",
          pm: { "name": chara_name, "face": chara_face },
          // val: text // ???
        };

        array_s.push(text_obj);

      } else if (first_char === "*") {
        //ラベル

        const label_tmp = line_str.substring(1).split("|");

        let label_key = "";
        let label_val = "";

        label_key = $.trim(label_tmp[0]);

        if (label_tmp.length > 1) {
          label_val = $.trim(label_tmp[1]);
        }

        const label_obj = {
          name: "label",
          pm: {
            "line": line_number,
            "index": array_s.length,
            "label_name": label_key,
            "val": label_val
          },
          val: label_val
        };

        //ラベル
        array_s.push(label_obj);

        if (map_label[label_obj.pm.label_name]) {
          //this.kag.warning("警告:"+i+"行目:"+"ラベル名「"+label_obj.pm.label_name+"」は同一シナリオファイル内に重複しています");
          this.kag.warning("Warning, line:" + line_number + " " + $.lang("label") + "'" + label_obj.pm.label_name + "'" + $.lang("label_double"));
        } else {
          map_label[label_obj.pm.label_name] = label_obj.pm;
        }

      } else if (first_char === "@") {
        //コマンド行確定なので、その残りの部分を、ごそっと回す
        const tag_str = line_str.substring(1); // "image split=2 samba = 5"
        const tmpobj = this.makeTag(tag_str, line_number);
        array_s.push(tmpobj);
      } else {

        //半角アンダーバーで始まっている場合は空白ではじめる
        if (first_char === "_") {
          line_str = line_str.substring(1);
        }

        const array_char = line_str.split("");
        let text = "";//命令じゃない部分はここに配置していく
        let tag_str = "";

        //１文字づつ解析していく
        let flag_tag = false; //タグ解析中

        let num_kakko = 0; //embタグの中の配列[]扱うために

        for (let j = 0; j < array_char.length; j++) {
          const c = array_char[j];

          if (flag_tag === true) {

            if (c === "]" && this.flag_script == false) {

              num_kakko--;

              if (num_kakko == 0) {
                flag_tag = false;
                array_s.push(this.makeTag(tag_str, line_number));
                //tag_str をビルドして、命令配列に格納
                tag_str = "";
              } else {
                tag_str += c;
              }

            } else if (c === "[" && this.flag_script == false) {
              num_kakko++;
              tag_str += c;
            } else {
              tag_str += c;
            }

          } else if (flag_tag === false && c === "[" && this.flag_script == false) {

            num_kakko++;

            //テキストファイルを命令に格納
            if (text != "") {
              const text_obj = {
                line: line_number,
                name: "text",
                pm: { "val": text },
                val: text
              };

              array_s.push(text_obj);
              text = "";
            }

            flag_tag = true;

          } else {
            text += c;
          }
        }

        if (text != "") {
          const text_obj = {
            line: line_number,
            name: "text",
            pm: { "val": text },
            val: text
          };

          array_s.push(text_obj);
        }

        //console.log(array_char);
      }
      //１行づつ解析解析していく
    }

    const result_obj = {
      array_s: array_s,
      map_label: map_label
    };

    if (this.deep_if != 0) {
      // alert("[if]と[endif]の数が一致しません。シナリオを見直してみませんか？");
      const current_scenario = this.kag.stat.current_scenario;
      $.error_message(`${current_scenario}:\nThe amount of [if] and [endif] doesn't match.`);
      this.deep_if = 0;
    }

    return result_obj;
  },

  //タグ情報から、オブジェクトを作成して返却する
  makeTag: function (str, line) {

    const obj = {
      line: line,
      name: "",
      pm: {},
      val: ""
    };

    const array_c = str.split("");
    let isCharEscaped = false; // if a quote was escaped (`\"` or `\'`)
    let flag_quote_char = ""; // character used for quoting: " or '
    let tmp_str = "";
    let quoted_char_count = 0;

    for (let j = 0; j < array_c.length; j++) {
      let char = array_c[j];

      if (flag_quote_char == "" && (char === "\"" || char === "\'")) {
        flag_quote_char = char;
        quoted_char_count = 0;
      } else {
        //特殊自体発生中
        if (flag_quote_char != "") {

          //特殊状態解除
          // fix - end quote if quote was not escaped by \ char
          if (char === flag_quote_char && !isCharEscaped) {

            flag_quote_char = "";

            //""のように直後に"が出てきた場合undefinedを代入
            if (quoted_char_count == 0) {
              tmp_str += "undefined";
            } else {
              quoted_char_count = 0;
            }

          } else if (char === flag_quote_char && isCharEscaped) {
            // if a quote was escaped remove the \ character
            tmp_str = tmp_str.slice(0, -1) + char;
          } else {

            // fix for spaces in text inside macros (Determinable Unstable)
            // escape equals with #e
            if (char === "=") {
              char = "#e";
            }
            // escape spaces with #s
            else if (char === " ") {
              char = "#s";
            }

            tmp_str += char;
            quoted_char_count++;
          }

        } else {
          tmp_str += char;
        }

      }
      isCharEscaped = (char === "\\");
    }

    str = tmp_str;

    //str = $.replaceAll(str,'"','');
    //str = $.replaceAll(str,"'",'');

    const array = str.split(" ");

    //タグの名前 [xxx
    obj.name = $.trim(array[0]);

    //=のみが出てきた場合は前後のをくっつけて、ひとつの変数にしてしまって良い
    for (let k = 1; k < array.length; k++) {
      if (array[k] == "") {
        array.splice(k, 1);
        k--;
      } else if (array[k] === "=" && array[k - 1] && array[k + 1]) {
        array[k - 1] += "=" + array[k + 1];
        array.splice(k, 2);
        k--;
      } else if (array[k].charAt(0) === "=" && array[k - 1] && array[k]) {
        array[k - 1] += array[k];
        array.splice(k, 1);
        //k--;
      } else if (array[k].charAt(array[k].length - 1) === "=" && array[k + 1] && array[k]) {
        array[k] += array[k + 1];
        array.splice(k + 1, 1);
        //k--;
      }

    }

    for (let i = 1; i < array.length; i++) {

      const tmp = $.trim(array[i]).split("=");

      const pm_key = $.trim(tmp[0]);
      const pm_val = $.trim(tmp[1]);

      //全引き継ぎ対応
      if (pm_key == "*") {
        obj.pm["*"] = "";
      }
      //特殊変換された値はそのまま代入できない
      if (pm_val != "") {
        const unescaped_equals = $.replaceAll(pm_val, "#e", "=");
        // fix for spaces in text inside macros (Determinable Unstable)
        const unescaped_spaces = $.replaceAll(unescaped_equals, "#s", " ");
        obj.pm[pm_key] = unescaped_spaces.trim();
      }

      if (pm_val == "undefined") {
        obj.pm[pm_key] = "";
      }
    }

    switch (obj.name) {
      case "iscript":
        this.flag_script = true;
        break;
      case "endscript":
        this.flag_script = false;
        break;

      case "if":
        this.deep_if++;
        obj.pm.deep_if = this.deep_if;
        break;
      case "elsif":
      case "else":
        obj.pm.deep_if = this.deep_if;
        break;
      case "endif":
        obj.pm.deep_if = this.deep_if;
        this.deep_if--;
        break;
    }

    return obj;
  },

  test: function () {

  }
};


