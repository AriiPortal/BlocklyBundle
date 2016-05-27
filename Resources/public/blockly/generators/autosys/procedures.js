/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Autosys for variable blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Autosys.procedures');

goog.require('Blockly.Autosys');


Blockly.Autosys.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.Autosys.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Autosys.statementToCode(this, 'STACK');
  if (Blockly.Autosys.INFINITE_LOOP_TRAP) {
    branch = Blockly.Autosys.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var returnValue = Blockly.Autosys.valueToCode(this, 'RETURN',
      Blockly.Autosys.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'int' : 'void';
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = 'int ' + Blockly.Autosys.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}\n';
  code = Blockly.Autosys.scrub_(this, code);
  Blockly.Autosys.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Autosys.procedures_defnoreturn = Blockly.Autosys.procedures_defreturn;

Blockly.Autosys.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Autosys.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Autosys.valueToCode(this, 'ARG' + x,
        Blockly.Autosys.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Autosys.ORDER_UNARY_POSTFIX];
};

Blockly.Autosys.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Autosys.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Autosys.valueToCode(this, 'ARG' + x,
        Blockly.Autosys.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.Autosys.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.Autosys.valueToCode(this, 'CONDITION',
      Blockly.Autosys.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (this.hasReturnValue_) {
    var value = Blockly.Autosys.valueToCode(this, 'VALUE',
        Blockly.Autosys.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
