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
 * @fileoverview Generating JobScheduler for variable blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

goog.provide('Blockly.JobScheduler.procedures');

goog.require('Blockly.JobScheduler');


Blockly.JobScheduler.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.JobScheduler.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.JobScheduler.statementToCode(this, 'STACK');
  if (Blockly.JobScheduler.INFINITE_LOOP_TRAP) {
    branch = Blockly.JobScheduler.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var returnValue = Blockly.JobScheduler.valueToCode(this, 'RETURN',
      Blockly.JobScheduler.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'int' : 'void';
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = 'int ' + Blockly.JobScheduler.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}\n';
  code = Blockly.JobScheduler.scrub_(this, code);
  Blockly.JobScheduler.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JobScheduler.procedures_defnoreturn = Blockly.JobScheduler.procedures_defreturn;

Blockly.JobScheduler.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.JobScheduler.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.JobScheduler.valueToCode(this, 'ARG' + x,
        Blockly.JobScheduler.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.JobScheduler.ORDER_UNARY_POSTFIX];
};

Blockly.JobScheduler.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.JobScheduler.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.JobScheduler.valueToCode(this, 'ARG' + x,
        Blockly.JobScheduler.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.JobScheduler.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.JobScheduler.valueToCode(this, 'CONDITION',
      Blockly.JobScheduler.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (this.hasReturnValue_) {
    var value = Blockly.JobScheduler.valueToCode(this, 'VALUE',
        Blockly.JobScheduler.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
