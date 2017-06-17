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
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var Gab = (function (_super) {
    __extends(Gab, _super);
    function Gab(_a) {
        var _b = _a.name, name = _b === void 0 ? '' : _b, credentials = _a.credentials, routes = _a.routes, _c = _a.intents, intents = _c === void 0 ? [] : _c, _d = _a.entities, entities = _d === void 0 ? [] : _d, logger = _a.logger;
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
        return _this;
    }
    // apply the current routes, intents, entities, etc
    // to watson - this will wait until Watson is done training and then
    // resolve
    Gab.prototype.applyChanges = function () {
        var _this = this;
        var dialog_nodes = createDialogTree_1.default(this.routes);
        var parsedIntents = createIntents_1.default(this.intents);
        var parsedEntities = createEntities_1.default(this.entities);
        this.handlers = createHandlers_1.default(this.routes);
        return new Promise(function (resolve, reject) {
            _this.updateWorkspace({
                workspace_id: _this.credentials.workspaceId,
                name: _this.workspaceName,
                description: '',
                dialog_nodes: dialog_nodes,
                intents: parsedIntents,
                entities: parsedEntities,
            }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var step, dots, status_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!err) return [3 /*break*/, 5];
                            /* istanbul ignore next */
                            if (this.logger) {
                                this.logger.log('Done with initialization.');
                            }
                            step = 0;
                            _a.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 4];
                            return [4 /*yield*/, timeout(1000)];
                        case 2:
                            _a.sent();
                            step = step + 1 > 3 ? 0 : step + 1;
                            dots = '.'.repeat(step);
                            return [4 /*yield*/, new Promise(function (rs) {
                                    _this.getWorkspace({
                                        workspace_id: _this.credentials.workspaceId,
                                    }, function (err, data) {
                                        if (err) {
                                            return reject(err);
                                        }
                                        return rs(data.status.toUpperCase());
                                    });
                                })];
                        case 3:
                            status_1 = _a.sent();
                            switch (status_1) {
                                case 'TRAINING': {
                                    /* istanbul ignore next */
                                    if (this.logger) {
                                        this.logger.log("Training" + dots);
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
                                        this.logger.error('unhandled', status_1);
                                    }
                                    return [2 /*return*/, reject(new Error("unhandled app status " + status_1))];
                                }
                            }
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 6];
                        case 5: return [2 /*return*/, reject(err)];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    Gab.prototype.sendMessage = function (msg, to) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.message({
                context: _this.contexts.get(to) || {},
                input: { text: msg },
                workspace_id: _this.credentials.workspaceId,
            }, function (err, response) {
                if (err) {
                    return reject(err);
                }
                _this.contexts.set(response.context.conversation_id, response.context);
                if (response.output && response.output.values && response.output.values.length > 0) {
                    var templateId = response.output.values[0].template;
                    if (!templateId) {
                        return reject(new Error('No template specified'));
                    }
                    var template = _this.handlers.get(templateId);
                    if (!template) {
                        return reject(new Error(templateId + " has not been setup."));
                    }
                    return resolve(template({ raw: response, context: response.context }));
                }
                else {
                    console.log(response);
                    throw new Error('incorrect output received.');
                }
            });
        });
    };
    Gab.prototype.getWorkspaceName = function () {
        return this.workspaceName;
    };
    Gab.prototype.getRoutes = function () {
        return this.routes;
    };
    Gab.prototype.setRoutes = function (routes) {
        this.routes = routes;
        return this;
    };
    Gab.prototype.getIntents = function () {
        return this.intents;
    };
    Gab.prototype.setIntents = function (intents) {
        this.intents = intents;
        return this;
    };
    Gab.prototype.getEntities = function () {
        return this.entities;
    };
    Gab.prototype.setEntities = function (entities) {
        this.entities = entities;
        return this;
    };
    return Gab;
}(watson_developer_cloud_1.ConversationV1));
exports.Gab = Gab;
exports.default = Gab;
