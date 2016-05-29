// Do not edit this file; automatically generated by build.py.
'use strict';

Blockly.JobScheduler=new Blockly.Generator("JobScheduler");Blockly.JobScheduler.addReservedWords("insert_job,update_job,delete_job,machine,owner,command");Blockly.JobScheduler.ORDER_ATOMIC=0;Blockly.JobScheduler.ORDER_UNARY_POSTFIX=1;Blockly.JobScheduler.ORDER_UNARY_PREFIX=2;Blockly.JobScheduler.ORDER_MULTIPLICATIVE=3;Blockly.JobScheduler.ORDER_ADDITIVE=4;Blockly.JobScheduler.ORDER_SHIFT=5;Blockly.JobScheduler.ORDER_RELATIONAL=6;Blockly.JobScheduler.ORDER_EQUALITY=7;
Blockly.JobScheduler.ORDER_BITWISE_AND=8;Blockly.JobScheduler.ORDER_BITWISE_XOR=9;Blockly.JobScheduler.ORDER_BITWISE_OR=10;Blockly.JobScheduler.ORDER_LOGICAL_AND=11;Blockly.JobScheduler.ORDER_LOGICAL_OR=12;Blockly.JobScheduler.ORDER_CONDITIONAL=13;Blockly.JobScheduler.ORDER_ASSIGNMENT=14;Blockly.JobScheduler.ORDER_NONE=99;
var profile={JobScheduler:{description:"JobScheduler standard-compatible board",digital:[["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],["7","7"],["8","8"],["9","9"],["10","10"],["11","11"],["12","12"],["13","13"],["A0","A0"],["A1","A1"],["A2","A2"],["A3","A3"],["A4","A4"],["A5","A5"]],analog:[["A0","A0"],["A1","A1"],["A2","A2"],["A3","A3"],["A4","A4"],["A5","A5"]],serial:9600},JobScheduler_mega:{description:"JobScheduler Mega-compatible board"}};profile["default"]=profile.JobScheduler;
Blockly.JobScheduler.init=function(a){Blockly.JobScheduler.definitions_=Object.create(null);Blockly.JobScheduler.setups_=Object.create(null);Blockly.JobScheduler.variableDB_?Blockly.JobScheduler.variableDB_.reset():Blockly.JobScheduler.variableDB_=new Blockly.Names(Blockly.JobScheduler.RESERVED_WORDS_);var b=[];a=Blockly.Variables.allVariables(a);for(var c=0;c<a.length;c++)b[c]="int "+Blockly.JobScheduler.variableDB_.getName(a[c],Blockly.Variables.NAME_TYPE)+";\n";Blockly.JobScheduler.definitions_.variables=
b.join("\n")};Blockly.JobScheduler.finish=function(a){a="  "+a.replace(/\n/g,"\n  ");a=a.replace(/\n\s+$/,"\n");a="/* Blockly for JobScheduler */\n\n"+a;var b=[],c=[],d;for(d in Blockly.JobScheduler.definitions_){var e=Blockly.JobScheduler.definitions_[d];e.match(/^#include/)?b.push(e):c.push(e)}return a};Blockly.JobScheduler.scrubNakedValue=function(a){return a+";\n"};
Blockly.JobScheduler.quote_=function(a){a=a.replace(/\\/g,"\\\\").replace(/\n/g,"\\\n").replace(/\$/g,"\\$").replace(/'/g,"\\'");return'"'+a+'"'};
Blockly.JobScheduler.scrub_=function(a,b){if(null===b)return"";var c="";if(!a.outputConnection||!a.outputConnection.targetConnection){var d=a.getCommentText();d&&(c+=Blockly.JobScheduler.prefixLines(d,"// ")+"\n");for(var e=0;e<a.inputList.length;e++)a.inputList[e].type==Blockly.INPUT_VALUE&&(d=a.inputList[e].connection.targetBlock())&&(d=Blockly.JobScheduler.allNestedComments(d))&&(c+=Blockly.JobScheduler.prefixLines(d,"// "))}e=a.nextConnection&&a.nextConnection.targetBlock();e=Blockly.JobScheduler.blockToCode(e);
return c+b+e};Blockly.JobScheduler.base={};Blockly.JobScheduler.loops={};
Blockly.JobScheduler.controls_for=function(){var a=Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE),b=Blockly.JobScheduler.valueToCode(this,"FROM",Blockly.JobScheduler.ORDER_ASSIGNMENT)||"0",c=Blockly.JobScheduler.valueToCode(this,"TO",Blockly.JobScheduler.ORDER_ASSIGNMENT)||"0",d=Blockly.JobScheduler.statementToCode(this,"DO");Blockly.JobScheduler.INFINITE_LOOP_TRAP&&(d=Blockly.JobScheduler.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+this.id+"'")+d);var e;
if(b.match(/^-?\d+(\.\d+)?$/)&&c.match(/^-?\d+(\.\d+)?$/))e=parseFloat(b)<=parseFloat(c),e="for ("+a+" = "+b+"; "+a+(e?" <= ":" >= ")+c+"; "+a+(e?"++":"--")+") {\n"+d+"}\n";else{e="";var f=b;b.match(/^\w+$/)||b.match(/^-?\d+(\.\d+)?$/)||(f=Blockly.JobScheduler.variableDB_.getDistinctName(a+"_start",Blockly.Variables.NAME_TYPE),e+="int "+f+" = "+b+";\n");b=c;c.match(/^\w+$/)||c.match(/^-?\d+(\.\d+)?$/)||(b=Blockly.JobScheduler.variableDB_.getDistinctName(a+"_end",Blockly.Variables.NAME_TYPE),e+="int "+
b+" = "+c+";\n");e+="for ("+a+" = "+f+";\n    ("+f+" <= "+b+") ? "+a+" <= "+b+" : "+a+" >= "+b+";\n    "+a+" += ("+f+" <= "+b+") ? 1 : -1) {\n"+d+"}\n"}return e};
Blockly.JobScheduler.controls_whileUntil=function(){var a="UNTIL"==this.getFieldValue("MODE"),b=Blockly.JobScheduler.valueToCode(this,"BOOL",a?Blockly.JobScheduler.ORDER_LOGICAL_NOT:Blockly.JobScheduler.ORDER_NONE)||"false",c=Blockly.JobScheduler.statementToCode(this,"DO");Blockly.JobScheduler.INFINITE_LOOP_TRAP&&(c=Blockly.JobScheduler.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+this.id+"'")+c);a&&(b="!"+b);return"while ("+b+") {\n"+c+"}\n"};Blockly.JobScheduler.logic={};
Blockly.JobScheduler.controls_if=function(){for(var a=0,b=Blockly.JobScheduler.valueToCode(this,"IF"+a,Blockly.JobScheduler.ORDER_NONE)||"false",c=Blockly.JobScheduler.statementToCode(this,"DO"+a),d="if ("+b+") {\n"+c+"\n}",a=1;a<=this.elseifCount_;a++)b=Blockly.JobScheduler.valueToCode(this,"IF"+a,Blockly.JobScheduler.ORDER_NONE)||"false",c=Blockly.JobScheduler.statementToCode(this,"DO"+a),d+=" else if ("+b+") {\n"+c+"}";this.elseCount_&&(c=Blockly.JobScheduler.statementToCode(this,"ELSE"),d+=" else {\n"+
c+"\n}");return d+"\n"};Blockly.JobScheduler.logic_compare=function(){var a=this.getFieldValue("OP"),a=Blockly.JobScheduler.logic_compare.OPERATORS[a],b="=="==a||"!="==a?Blockly.JobScheduler.ORDER_EQUALITY:Blockly.JobScheduler.ORDER_RELATIONAL,c=Blockly.JobScheduler.valueToCode(this,"A",b)||"0",d=Blockly.JobScheduler.valueToCode(this,"B",b)||"0";return[c+" "+a+" "+d,b]};Blockly.JobScheduler.logic_compare.OPERATORS={EQ:"==",NEQ:"!=",LT:"<",LTE:"<=",GT:">",GTE:">="};
Blockly.JobScheduler.logic_operation=function(){var a="AND"==this.getFieldValue("OP")?"&&":"||",b="&&"==a?Blockly.JobScheduler.ORDER_LOGICAL_AND:Blockly.JobScheduler.ORDER_LOGICAL_OR,c=Blockly.JobScheduler.valueToCode(this,"A",b)||"false",d=Blockly.JobScheduler.valueToCode(this,"B",b)||"false";return[c+" "+a+" "+d,b]};Blockly.JobScheduler.logic_negate=function(){var a=Blockly.JobScheduler.ORDER_UNARY_PREFIX;return["!"+(Blockly.JobScheduler.valueToCode(this,"BOOL",a)||"false"),a]};
Blockly.JobScheduler.logic_boolean=function(){return["TRUE"==this.getFieldValue("BOOL")?"true":"false",Blockly.JobScheduler.ORDER_ATOMIC]};Blockly.JobScheduler.logic_null=function(){return["NULL",Blockly.JobScheduler.ORDER_ATOMIC]};Blockly.JobScheduler.math={};Blockly.JobScheduler.math_number=function(){var a=window.parseFloat(this.getFieldValue("NUM"));return[a,0>a?Blockly.JobScheduler.ORDER_UNARY_PREFIX:Blockly.JobScheduler.ORDER_ATOMIC]};
Blockly.JobScheduler.math_arithmetic=function(){var a=this.getFieldValue("OP"),b=Blockly.JobScheduler.math_arithmetic.OPERATORS[a],a=b[0],b=b[1],c=Blockly.JobScheduler.valueToCode(this,"A",b)||"0",d=Blockly.JobScheduler.valueToCode(this,"B",b)||"0";return a?[c+a+d,b]:["Math.pow("+c+", "+d+")",Blockly.JobScheduler.ORDER_UNARY_POSTFIX]};
Blockly.JobScheduler.math_arithmetic.OPERATORS={ADD:[" + ",Blockly.JobScheduler.ORDER_ADDITIVE],MINUS:[" - ",Blockly.JobScheduler.ORDER_ADDITIVE],MULTIPLY:[" * ",Blockly.JobScheduler.ORDER_MULTIPLICATIVE],DIVIDE:[" / ",Blockly.JobScheduler.ORDER_MULTIPLICATIVE],POWER:[null,Blockly.JobScheduler.ORDER_NONE]};Blockly.JobScheduler.procedures={};
Blockly.JobScheduler.procedures_defreturn=function(){var a=Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),b=Blockly.JobScheduler.statementToCode(this,"STACK");Blockly.JobScheduler.INFINITE_LOOP_TRAP&&(b=Blockly.JobScheduler.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+this.id+"'")+b);var c=Blockly.JobScheduler.valueToCode(this,"RETURN",Blockly.JobScheduler.ORDER_NONE)||"";c&&(c="  return "+c+";\n");for(var d=c?"int":"void",e=[],f=0;f<this.arguments_.length;f++)e[f]=
"int "+Blockly.JobScheduler.variableDB_.getName(this.arguments_[f],Blockly.Variables.NAME_TYPE);b=d+" "+a+"("+e.join(", ")+") {\n"+b+c+"}\n";b=Blockly.JobScheduler.scrub_(this,b);Blockly.JobScheduler.definitions_[a]=b;return null};Blockly.JobScheduler.procedures_defnoreturn=Blockly.JobScheduler.procedures_defreturn;
Blockly.JobScheduler.procedures_callreturn=function(){for(var a=Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),b=[],c=0;c<this.arguments_.length;c++)b[c]=Blockly.JobScheduler.valueToCode(this,"ARG"+c,Blockly.JobScheduler.ORDER_NONE)||"null";return[a+"("+b.join(", ")+")",Blockly.JobScheduler.ORDER_UNARY_POSTFIX]};
Blockly.JobScheduler.procedures_callnoreturn=function(){for(var a=Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),b=[],c=0;c<this.arguments_.length;c++)b[c]=Blockly.JobScheduler.valueToCode(this,"ARG"+c,Blockly.JobScheduler.ORDER_NONE)||"null";return a+"("+b.join(", ")+");\n"};
Blockly.JobScheduler.procedures_ifreturn=function(){var a="if ("+(Blockly.JobScheduler.valueToCode(this,"CONDITION",Blockly.JobScheduler.ORDER_NONE)||"false")+") {\n";if(this.hasReturnValue_)var b=Blockly.JobScheduler.valueToCode(this,"VALUE",Blockly.JobScheduler.ORDER_NONE)||"null",a=a+("  return "+b+";\n");else a+="  return;\n";return a+"}\n"};Blockly.JobScheduler.texts={};Blockly.JobScheduler.text=function(){return[Blockly.JobScheduler.quote_(this.getFieldValue("TEXT")),Blockly.JobScheduler.ORDER_ATOMIC]};Blockly.JobScheduler.variables={};Blockly.JobScheduler.variables_get=function(){return[Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE),Blockly.JobScheduler.ORDER_ATOMIC]};
Blockly.JobScheduler.variables_declare=function(){this.getFieldValue("TYPE");var a=Blockly.JobScheduler.valueToCode(this,"VALUE",Blockly.JobScheduler.ORDER_ASSIGNMENT)||"0",b=Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE);Blockly.JobScheduler.setups_["setup_var"+b]=b+" = "+a+";\n";return""};
Blockly.JobScheduler.variables_set=function(){var a=Blockly.JobScheduler.valueToCode(this,"VALUE",Blockly.JobScheduler.ORDER_ASSIGNMENT)||"0";return Blockly.JobScheduler.variableDB_.getName(this.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE)+" = "+a+";\n"};