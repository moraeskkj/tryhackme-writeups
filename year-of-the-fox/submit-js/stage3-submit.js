
/*

FIRST FUNCTION 

here he defines a function and call her after

what this function do is create another function and call her passing ++arg2 as argument
and
what this another function do is a while "--arg" and after take up the arg1 to first function and push and shift he in the same time wtf

SUBMIT FUNCTION

ok, we have a array of strings with function names, and this function names strings are called by another_func_2 that receives a number to call the correct function strings or name fuck this code omg and to make my day better he call the functions name by passing a hex decimal value :)

Portanto, document["results"] é equivalente a document.getElementById("results"), 
que é a abordagem mais comum para acessar elementos no DOM pelo ID. O código original está usando 
uma notação alternativa e não convencional para alcançar o mesmo resultado.
var c = document.getElementById("results").innerHTML;

*/


var array_of_function = ["onreadystatechange", "send" , "POST", "stringify", "createElement", "length", "responseText", "innerHTML", "/assets/php/search.php", "results", "appendChild", "getElementById", "replace", "target", "parse", "open", "createTextNode", "value"];

(function (arg1_to_function, arg2_to_function) {

  var another_function = function (arg_to_another_function) {

    while (--arg_to_another_function) {

      arg1_to_function.push( arg1_to_function.shift() );

    }

  };

  another_function(++arg2_to_function);

}

(array_of_function, 416));

var another_func_2 = function (arg1_to_function, arg2_to_function) {

  // can i comment this? doesn't change the value in any case right? RIGHT JAVASCRIPT???
  arg1_to_function = arg1_to_function - 0;

  var another_function = array_of_function[arg1_to_function ];

  return another_function;
};



function submit() {

  //0x9 = results
  //0xb = getElementById
  //0xf = open
  //0xa = appendChild
  //0x9 = results
  //0x7 =  innerHTML
  //0x5 = length
  //0x10 = createTextNode 
  //0xc = replace
  //0x4 = createElement
  //0x2 = POST
  //0x3 = stringify
  //0x8 = /assets/php/search.php
  //0xe = parse

  //var horrible_var = document.getElementById("results").getElementById("open").appendChild(/[^a-zA-Z0-9. ]|exec/gi, "")
  var horrible_var = document[another_func_2("0x9")](another_func_2("0xb"))[another_func_2("0xf")][another_func_2("0xa")](/[^a-zA-Z0-9. ]|exec/gi, "");
  
  //var results_id = document[another_func_2("0x9")](another_func_2("0x7"));
  var results_id = document.getElementById("results").innerHTML;
 
  //results_id[another_func_2("0x5")] = "";
  result_id[length] = "";

  var XMLRequest = new XMLHttpRequest;

  XMLRequest.createTextNode() = function () {
    
    if (this.readyState == 4 && this.status == 200) {

      //response = JSON[another_func_2("0xc")](XMLRequest[another_func_2("0x4")]);
      response = JSON.replace(XMLRequest.createElement())

      //response.stringify
      for (var i = 0; i < response[another_func_2("0x3")]; i++) {

        //var post_li = POST("li")
        var post_li = document[another_func_2("0x2")]("li");

        //POST 
        post_li[another_func_2("0x8")](document[another_func_2("0xe")](response[i]));
        
        results_id[another_func_2("0x8")](post_li);

        results_id.style = "display:block;";
      
      }
      
      document[another_func_2("0x9")](another_func_2("0xb"))[another_func_2("0xf")] = "";
    }
  };

  XMLRequest[another_func_2("0xd")](another_func_2("0x0"), another_func_2("0x6"), true);

  XMLRequest[another_func_2("0x11")](JSON[another_func_2("0x1")]({target: horrible_var}));
}
