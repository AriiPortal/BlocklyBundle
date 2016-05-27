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
 * @fileoverview Variable blocks for Autosys.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Autosys.variables');

goog.require('Blockly.Autosys');


Blockly.Autosys.variables_get = function() {
  // Variable getter.
  var code = Blockly.Autosys.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Autosys.ORDER_ATOMIC];
};

Blockly.Autosys.variables_declare = function() {
  // Variable setter.
  var dropdown_type = this.getFieldValue('TYPE');
  //TODO: settype to variable
  var argument0 = Blockly.Autosys.valueToCode(this, 'VALUE',
      Blockly.Autosys.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Autosys.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  Blockly.Autosys.setups_['setup_var' + varName] = varName + ' = ' + argument0 + ';\n';
  return '';
};

Blockly.Autosys.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.Autosys.valueToCode(this, 'VALUE',
      Blockly.Autosys.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Autosys.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};
