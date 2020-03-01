"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Visibility;
(function (Visibility) {
    Visibility["Home"] = "home";
    Visibility["Public"] = "public";
    Visibility["Followers"] = "followers";
    Visibility["Specified"] = "specified";
    Visibility["Private"] = "private";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.isNote = (arg) => {
    return (arg != null &&
        "string" === typeof arg.id &&
        "string" === typeof arg.userId &&
        "string" === typeof arg.createdAt);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.isVote = (arg) => {
    return (arg != null &&
        "number" === typeof arg.choice &&
        "string" === typeof arg.userId);
};
//# sourceMappingURL=types.js.map