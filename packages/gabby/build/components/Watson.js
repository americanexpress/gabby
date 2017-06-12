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
Object.defineProperty(exports, "__esModule", { value: true });
var watson_developer_cloud_1 = require("watson-developer-cloud");
var Watson = (function (_super) {
    __extends(Watson, _super);
    function Watson(_a) {
        var credentials = _a.credentials, routes = _a.routes, intents = _a.intents, entities = _a.entities;
        var _this = _super.call(this, {
            username: credentials.username,
            password: credentials.password,
            version_date: watson_developer_cloud_1.ConversationV1.VERSION_DATE_2017_04_21,
        }) || this;
        _this.credentials = credentials;
        _this.routes = routes;
        _this.intents = intents;
        _this.entities = entities;
        return _this;
    }
    Watson.prototype.setRoutes = function (routes) {
        // set our routes and upload them
    };
    return Watson;
}(watson_developer_cloud_1.ConversationV1));
