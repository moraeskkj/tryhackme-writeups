var array_of_function = ["onreadystatechange", "send", "POST", "stringify", "createElement", "length", "responseText", "innerHTML", "/assets/php/search.php", "results", "appendChild", "getElementById", "replace", "target", "parse", "open", "createTextNode", "value"];

/*
here he defines a function and call her after
*/

(function (_0x4b4363, _0x49ca1a) {

  var _0x3926ef = function (_0x23f2a2) {

    while (--_0x23f2a2) {

      _0x4b4363.push(_0x4b4363.shift());

    }
  };

  _0x3926ef(++_0x49ca1a);

}

(array_of_function, 416));

var _0x3926 = function (_0x4b4363, _0x49ca1a) {

  _0x4b4363 = _0x4b4363 - 0;

  var _0x3926ef = array_of_function[_0x4b4363];

  return _0x3926ef;
};

function submit() {

  var _0x25c265 = document[_0x3926("0x9")](_0x3926("0xb"))[_0x3926("0xf")][_0x3926("0xa")](/[^a-zA-Z0-9. ]|exec/gi, "");
  
  var _0x33c045 = document[_0x3926("0x9")](_0x3926("0x7"));

  _0x33c045[_0x3926("0x5")] = "";

  var _0x5a6bb1 = new XMLHttpRequest;

  _0x5a6bb1[_0x3926("0x10")] = function () {
    
    if (this.readyState == 4 && this.status == 200) {

      response = JSON[_0x3926("0xc")](_0x5a6bb1[_0x3926("0x4")]);

      for (var _0xde072e = 0; _0xde072e < response[_0x3926("0x3")]; _0xde072e++) {

        var _0x6abcb4 = document[_0x3926("0x2")]("li");

        _0x6abcb4[_0x3926("0x8")](document[_0x3926("0xe")](response[_0xde072e]));

        _0x33c045[_0x3926("0x8")](_0x6abcb4);

        _0x33c045.style = "display:block;";
      
      }
      
      document[_0x3926("0x9")](_0x3926("0xb"))[_0x3926("0xf")] = "";
    }
  };

  _0x5a6bb1[_0x3926("0xd")](_0x3926("0x0"), _0x3926("0x6"), true);

  _0x5a6bb1[_0x3926("0x11")](JSON[_0x3926("0x1")]({target: _0x25c265}));
}
