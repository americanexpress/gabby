/*
 * Copyright 2017 American Express
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var watson_developer_cloud_1 = require("watson-developer-cloud");
var createDialogTree_1 = require("./utils/createDialogTree");
var createIntents_1 = require("./utils/createIntents");
var createEntities_1 = require("./utils/createEntities");
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var Watson = (function () {
    function Watson(_a) {
        var name = _a.name, username = _a.username, password = _a.password, workspaceId = _a.workspaceId, _b = _a.statusPollRate, statusPollRate = _b === void 0 ? 3000 : _b, _c = _a.maxStatusPollCount, maxStatusPollCount = _c === void 0 ? 30 : _c, logger = _a.logger;
        this.workspaceName = name;
        this.credentials = {
            username: username,
            password: password,
            workspaceId: workspaceId
        };
        this.statusPollRate = statusPollRate;
        this.maxStatusPollCount = maxStatusPollCount;
        this.logger = logger;
        this.client = new watson_developer_cloud_1.ConversationV1({
            username: username,
            password: password,
            workspace_id: workspaceId,
            version_date: watson_developer_cloud_1.ConversationV1.VERSION_DATE_2017_04_21
        });
    }
    Watson.prototype.applyChanges = function (_a) {
        var _this = this;
        var routes = _a.routes, intents = _a.intents, entities = _a.entities;
        var parsedDialogTree = createDialogTree_1["default"](routes);
        var parsedIntents = createIntents_1["default"](intents);
        var parsedEntities = createEntities_1["default"](entities);
        return new Promise(function (resolve, reject) {
            _this.client.updateWorkspace({
                dialog_nodes: parsedDialogTree,
                intents: parsedIntents,
                entities: parsedEntities,
                name: _this.workspaceName,
                workspace_id: _this.credentials.workspaceId,
                description: ''
            }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                var pollCount, status, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, reject(err)];
                            }
                            /* istanbul ignore next */
                            if (this.logger) {
                                this.logger.log('Done with initialization.');
                            }
                            pollCount = 0;
                            _a.label = 1;
                        case 1:
                            if (!(pollCount < this.maxStatusPollCount)) return [3 /*break*/, 8];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.getWorkspaceStatus()];
                        case 3:
                            status = _a.sent();
                            switch (status) {
                                case 'TRAINING': {
                                    /* istanbul ignore next */
                                    if (this.logger) {
                                        this.logger.log('Training...');
                                    }
                                    break;
                                }
                                case 'AVAILABLE': {
                                    /* istanbul ignore next */
                                    if (this.logger) {
                                        this.logger.log('Done training.');
                                    }
                                    return [2 /*return*/, resolve()];
                                }
                                default: {
                                    /* istanbul ignore next */
                                    if (this.logger) {
                                        this.logger.error('unhandled', status);
                                    }
                                    return [2 /*return*/, reject(new Error("unhandled app status " + status))];
                                }
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            return [2 /*return*/, reject(e_1)];
                        case 5: return [4 /*yield*/, timeout(this.statusPollRate)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            pollCount++;
                            return [3 /*break*/, 1];
                        case 8: return [2 /*return*/, reject(new Error('Apply changes timed out.'))];
                    }
                });
            }); });
        });
    };
    Watson.prototype.getWorkspaceStatus = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getWorkspace({
                workspace_id: _this.credentials.workspaceId
            }, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data.status.toUpperCase());
            });
        });
    };
    Watson.prototype.sendMessage = function (msg, to, context) {
        var _this = this;
        if (context === void 0) { context = {}; }
        return new Promise(function (resolve, reject) {
            _this.client.message({
                context: context,
                input: { text: msg },
                workspace_id: _this.credentials.workspaceId
            }, function (err, response) {
                if (err) {
                    return reject(err);
                }
                var conversationId = response.context.conversation_id;
                var templateId = response.output.values[0].template;
                var _a = response.intents, intents = _a === void 0 ? [] : _a, _b = response.entities, entities = _b === void 0 ? [] : _b;
                if (!templateId) {
                    return reject(new Error('No template specified'));
                }
                return resolve({
                    conversationId: conversationId,
                    templateId: templateId,
                    intents: intents,
                    entities: entities,
                    context: response.context
                });
            });
        });
    };
    return Watson;
}());
exports["default"] = Watson;
