
var _0x49ca = ["onreadystatechange", "send", "POST", "stringify", "createElement", "length", "responseText", "innerHTML", "/assets/php/search.php", "results", "appendChild", "getElementById", "replace", "target", "parse", "open", "createTextNode", "value"];

(function (arg1_to_function, arg2_to_function) {
  var another_function = function (arg_to_another_function) {
    while (--arg_to_another_function) {
      arg1_to_function.push(arg1_to_function.shift());
    }
  };
  another_function(++arg2_to_function);
}(_0x49ca, 416));
var another_func_2 = function (arg1_to_function, arg2_to_function) {
  arg1_to_function = arg1_to_function - 0;
  var another_function = _0x49ca[arg1_to_function];
  return another_function;
};
function submit() {
  var _0x25c265 = document[another_func_2("0x9")](another_func_2("0xb"))[another_func_2("0xf")][another_func_2("0xa")](/[^a-zA-Z0-9. ]|exec/gi, "");
  var results_id = document[another_func_2("0x9")](another_func_2("0x7"));
  results_id[another_func_2("0x5")] = "";
  var XMLRequest = new XMLHttpRequest;
  XMLRequest[another_func_2("0x10")] = function () {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON[another_func_2("0xc")](XMLRequest[another_func_2("0x4")]);
      for (var i = 0; i < response[another_func_2("0x3")]; i++) {
        var post_li = document[another_func_2("0x2")]("li");
        post_li[another_func_2("0x8")](document[another_func_2("0xe")](response[i]));
        results_id[another_func_2("0x8")](post_li);
        results_id.style = "display:block;";
      }
      document[another_func_2("0x9")](another_func_2("0xb"))[another_func_2("0xf")] = "";
    }
  };
  XMLRequest[another_func_2("0xd")](another_func_2("0x0"), another_func_2("0x6"), true);
  XMLRequest[another_func_2("0x11")](JSON[another_func_2("0x1")]({target: _0x25c265}));
}
