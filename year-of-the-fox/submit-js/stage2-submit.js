var array_of_function = ["onreadystatechange", "send" , "POST", "stringify", "createElement", "length", "responseText", "innerHTML", "/assets/php/search.php", "results", "appendChild", "getElementById", "replace", "target", "parse", "open", "createTextNode", "value"];
/*
here he defines a function and call her after

what this function do is create another function and call her passing ++arg2 as argument
and
what this another function do is a while "--arg" and after take up the arg1 to first function and push and shift he in the same time wtf

*/

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

// ok, we have a array of strings with function names, and this function names strings are called by another_func_2 that receives a number to call the correct function strings or name fuck this code omg 
// and to make my day better he call the functions name by passing a hex decimal value :)

function submit() {

  //0x9 = results
  //0xb = getElementById
  //0xf = open
  //0xa = appendChild
  //var horrible_var = document["results"]["getElementById"]["open"]["appendChild"](/[^a-zA-Z0-9. ]|exec/gi, "");
  var horrible_var = document[another_func_2("0x9")](another_func_2("0xb"))[another_func_2("0xf")][another_func_2("0xa")](/[^a-zA-Z0-9. ]|exec/gi, "");
  

  //0x9 = results
  //0x7 =  innerHTML
  //Portanto, document["results"] é equivalente a document.getElementById("results"), 
  //que é a abordagem mais comum para acessar elementos no DOM pelo ID. O código original está usando 
  //uma notação alternativa e não convencional para alcançar o mesmo resultado.
  //var c = document.getElementById("results").innerHTML;
  var results_id = document[another_func_2("0x9")](another_func_2("0x7"));
 
  //0x05 length
  results_id[another_func_2("0x5")] = "";

  var XMLRequest = new XMLHttpRequest;

  XMLRequest[another_func_2("0x10")] = function () {
    
    if (this.readyState == 4 && this.status == 200) {

      response = JSON[another_func_2("0xc")](XMLRequest[another_func_2("0x4")]);

      for (var i = 0; i < response[another_func_2("0x3")]; i++) {

        //0x02 = POST
        var post_li = document[another_func_2("0x2")]("li");

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
