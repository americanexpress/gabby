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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var watson_developer_cloud_1 = require("watson-developer-cloud");
var createDialogTree_1 = require("../createDialogTree");
var createIntents_1 = require("../createIntents");
var createEntities_1 = require("../createEntities");
// create a map of handlers
var createHandlers_1 = require("../createHandlers");
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var Gabby = (function (_super) {
    __extends(Gabby, _super);
    function Gabby(_a) {
        var _b = _a.name, name = _b === void 0 ? '' : _b, credentials = _a.credentials, routes = _a.routes, _c = _a.intents, intents = _c === void 0 ? [] : _c, _d = _a.entities, entities = _d === void 0 ? [] : _d, logger = _a.logger, _e = _a.maxStatusPollCount, maxStatusPollCount = _e === void 0 ? 30 : _e, _f = _a.statusPollRate, statusPollRate = _f === void 0 ? 3000 : _f;
        var _this = _super.call(this, {
            username: credentials.username,
            password: credentials.password,
            version_date: watson_developer_cloud_1.ConversationV1.VERSION_DATE_2017_04_21,
        }) || this;
        _this.contexts = new Map();
        _this.workspaceName = name;
        _this.credentials = credentials;
        _this.routes = routes;
        _this.intents = intents;
        _this.entities = entities;
        _this.logger = logger;
        _this.maxStatusPollCount = maxStatusPollCount;
        _this.statusPollRate = statusPollRate;
        _this.handlers = createHandlers_1.default(_this.routes);
        return _this;
    }
    Gabby.prototype.getWorkspaceStatus = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getWorkspace({
                workspace_id: _this.credentials.workspaceId,
            }, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data.status.toUpperCase());
            });
        });
    };
    // apply the current routes, intents, entities, etc
    // to watson - this will wait until Watson is done training and then
    // resolve
    Gabby.prototype.applyChanges = function () {
        var _this = this;
        var parsedDialogTree = createDialogTree_1.default(this.routes);
        var parsedIntents = createIntents_1.default(this.intents);
        var parsedEntities = createEntities_1.default(this.entities);
        this.handlers = createHandlers_1.default(this.routes);
        return new Promise(function (resolve, reject) {
            _this.updateWorkspace({
                workspace_id: _this.credentials.workspaceId,
                name: _this.workspaceName,
                description: '',
                dialog_nodes: parsedDialogTree,
                intents: parsedIntents,
                entities: parsedEntities,
            }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                var pollCount, status_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!err) return [3 /*break*/, 9];
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
                            status_1 = _a.sent();
                            switch (status_1) {
                                case 'TRAINING': {
                                    if (this.logger) {
                                        this.logger.log('Training...');
                                    }
                                    break;
                                }
                                case 'AVAILABLE': {
                                    if (this.logger) {
                                        this.logger.log('Done training.');
                                    }
                                    return [2 /*return*/, resolve()];
                                }
                                default: {
                                    if (this.logger) {
                                        this.logger.error('unhandled', status_1);
                                    }
                                    return [2 /*return*/, reject(new Error("unhandled app status " + status_1))];
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
                        case 8: return [3 /*break*/, 10];
                        case 9: return [2 /*return*/, reject(err)];
                        case 10: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    Gabby.prototype.sendMessage = function (msg, to) {
        var _this = this;
        if (!this.routes) {
            return Promise.reject(new Error('No routes specified'));
        }
        return new Promise(function (resolve, reject) {
            _this.message({
                context: _this.contexts.get(to) || {},
                input: { text: msg },
                workspace_id: _this.credentials.workspaceId,
            }, function (err, response) { return __awaiter(_this, void 0, void 0, function () {
                var conversationId, templateId, template_1, msg_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, reject(err)];
                            }
                            conversationId = response.context.conversation_id;
                            this.contexts.set(conversationId, response.context);
                            if (!(response.output && response.output.values && response.output.values.length > 0)) return [3 /*break*/, 2];
                            templateId = response.output.values[0].template;
                            if (!templateId) {
                                return [2 /*return*/, reject(new Error('No template specified'))];
                            }
                            template_1 = this.handlers.get(templateId);
                            if (!template_1) {
                                return [2 /*return*/, reject(new Error(templateId + " has not been setup."))];
                            }
                            return [4 /*yield*/, new Promise(function (res) { return res(template_1({ response: response, context: response.context })); })];
                        case 1:
                            msg_1 = _a.sent();
                            return [2 /*return*/, resolve({
                                    msg: msg_1,
                                    response: response,
                                    conversationId: conversationId,
                                })];
                        case 2:
                            if (this.logger) {
                                // tslint:disable-next-line:max-line-length
                                this.logger.warn("Got unexpected response output from watson: " + JSON.stringify(response.output, null, 2));
                            }
                            return [2 /*return*/, reject(new Error('Incorrect output received'))];
                    }
                });
            }); });
        });
    };
    Gabby.prototype.getWorkspaceName = function () {
        return this.workspaceName;
    };
    Gabby.prototype.getRoutes = function () {
        return this.routes;
    };
    Gabby.prototype.setRoutes = function (routes) {
        this.routes = routes;
        return this;
    };
    Gabby.prototype.getIntents = function () {
        return this.intents;
    };
    Gabby.prototype.setIntents = function (intents) {
        this.intents = intents;
        return this;
    };
    Gabby.prototype.getEntities = function () {
        return this.entities;
    };
    Gabby.prototype.setEntities = function (entities) {
        this.entities = entities;
        return this;
    };
    return Gabby;
}(watson_developer_cloud_1.ConversationV1));
exports.Gabby = Gabby;
exports.default = Gabby;
