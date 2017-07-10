"use strict";
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
var createDialogTree_1 = require("./utils/createDialogTree");
var createIntents_1 = require("./utils/createIntents");
var createEntities_1 = require("./utils/createEntities");
// create a map of handlers
var createHandlers_1 = require("./utils/createHandlers");
var Gabby = (function () {
    function Gabby(_a) {
        var adapter = _a.adapter, routes = _a.routes, _b = _a.intents, intents = _b === void 0 ? [] : _b, _c = _a.entities, entities = _c === void 0 ? [] : _c, logger = _a.logger, _d = _a.maxStatusPollCount, maxStatusPollCount = _d === void 0 ? 30 : _d, _e = _a.statusPollRate, statusPollRate = _e === void 0 ? 3000 : _e;
        this.contexts = new Map();
        this.adapter = adapter;
        this.routes = routes;
        this.intents = intents;
        this.entities = entities;
        this.logger = logger;
        this.maxStatusPollCount = maxStatusPollCount;
        this.statusPollRate = statusPollRate;
        this.handlers = createHandlers_1.default(this.routes);
    }
    Gabby.prototype.sendMessage = function (msg, to) {
        var _this = this;
        if (!this.routes) {
            return Promise.reject(new Error('No routes specified'));
        }
        return new Promise(function (resolve, reject) {
            _this.adapter.sendMessage(msg, to, _this.contexts.get(to))
                .then(function (_a) {
                var conversationId = _a.conversationId, context = _a.context, intents = _a.intents, entities = _a.entities, templateId = _a.templateId;
                return __awaiter(_this, void 0, void 0, function () {
                    var template, msg;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.contexts.set(conversationId, context);
                                if (!templateId) {
                                    return [2 /*return*/, reject(new Error('No template specified'))];
                                }
                                template = this.handlers.get(templateId);
                                if (!template) {
                                    return [2 /*return*/, reject(new Error(templateId + " has not been setup."))];
                                }
                                return [4 /*yield*/, new Promise(function (res) { return res(template({ context: context, intents: intents, entities: entities })); })];
                            case 1:
                                msg = _a.sent();
                                return [2 /*return*/, resolve({
                                        msg: msg,
                                        conversationId: conversationId,
                                    })];
                        }
                    });
                });
            });
        });
    };
    Gabby.prototype.applyChanges = function () {
        var parsedDialogTree = createDialogTree_1.default(this.routes);
        var parsedIntents = createIntents_1.default(this.intents);
        var parsedEntities = createEntities_1.default(this.entities);
        this.handlers = createHandlers_1.default(this.routes);
        return this.adapter.applyChanges({
            routes: parsedDialogTree,
            intents: parsedIntents,
            entities: parsedEntities,
        });
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
}());
exports.Gabby = Gabby;
exports.default = Gabby;
