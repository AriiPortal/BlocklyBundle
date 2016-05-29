/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Helper functions for generating JobScheduler for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.JobScheduler');

goog.require('Blockly.Generator');


/**
 * JobScheduler code generator.
 * @type !Blockly.Generator
 */
Blockly.JobScheduler = new Blockly.Generator('JobScheduler');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.JobScheduler.addReservedWords(
	'insert_job,update_job,delete_job,machine,owner,command'
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly.JobScheduler.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.JobScheduler.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.JobScheduler.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.JobScheduler.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.JobScheduler.ORDER_ADDITIVE = 4;       // + -
Blockly.JobScheduler.ORDER_SHIFT = 5;          // << >>
Blockly.JobScheduler.ORDER_RELATIONAL = 6;     // is is! >= > <= <
Blockly.JobScheduler.ORDER_EQUALITY = 7;       // == != === !==
Blockly.JobScheduler.ORDER_BITWISE_AND = 8;    // &
Blockly.JobScheduler.ORDER_BITWISE_XOR = 9;    // ^
Blockly.JobScheduler.ORDER_BITWISE_OR = 10;    // |
Blockly.JobScheduler.ORDER_LOGICAL_AND = 11;   // &&
Blockly.JobScheduler.ORDER_LOGICAL_OR = 12;    // ||
Blockly.JobScheduler.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.JobScheduler.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.JobScheduler.ORDER_NONE = 99;          // (...)

/*
 * JobScheduler Board profiles
 *
 */
var profile = {
  JobScheduler: {
    description: "JobScheduler standard-compatible board",
    digital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    analog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    serial: 9600
  },
  JobScheduler_mega: {
    description: "JobScheduler Mega-compatible board"
    //53 digital
    //15 analog
  }
};
//set default profile to JobScheduler standard-compatible board
profile["default"] = profile["JobScheduler"];
//alert(profile.default.digital[0]);

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.JobScheduler.init = function(workspace) {
  // Create a dictionary of definitions to be printed before setups.
  Blockly.JobScheduler.definitions_ = Object.create(null);
  // Create a dictionary of setups to be printed before the code.
  Blockly.JobScheduler.setups_ = Object.create(null);

	if (!Blockly.JobScheduler.variableDB_) {
		Blockly.JobScheduler.variableDB_ =
				new Blockly.Names(Blockly.JobScheduler.RESERVED_WORDS_);
	} else {
		Blockly.JobScheduler.variableDB_.reset();
	}

	var defvars = [];
	var variables = Blockly.Variables.allVariables(workspace);
	for (var x = 0; x < variables.length; x++) {
		defvars[x] = 'int ' +
				Blockly.JobScheduler.variableDB_.getName(variables[x],
				Blockly.Variables.NAME_TYPE) + ';\n';
	}
	Blockly.JobScheduler.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.JobScheduler.finish = function(code) {
  // Indent every line.
  code = '  ' + code.replace(/\n/g, '\n  ');
  code = code.replace(/\n\s+$/, '\n');
  code = '/* Blockly for JobScheduler */\n\n' + code;

  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.JobScheduler.definitions_) {
    var def = Blockly.JobScheduler.definitions_[name];
    if (def.match(/^#include/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }

  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.JobScheduler.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped JobScheduler string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} JobScheduler string.
 * @private
 */
Blockly.JobScheduler.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating JobScheduler from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The JobScheduler code created for this block.
 * @return {string} JobScheduler code with comments and subsequent blocks added.
 * @private
 */
Blockly.JobScheduler.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.JobScheduler.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.JobScheduler.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.JobScheduler.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.JobScheduler.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
