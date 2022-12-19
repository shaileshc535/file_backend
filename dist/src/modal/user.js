"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
    GenderEnum["OTHER"] = "other";
})(GenderEnum || (GenderEnum = {}));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        validate: {
            validator: validator_1.default.isEmail,
            message: "Email is not a valid Email",
        },
        required: true,
    },
    profile_photo: { type: String },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!.%*?&]{6,}$/.test(value);
            },
            message: "{VALUE} is not a valid password",
        },
    },
    firstname: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastname: { type: String, required: true, minlength: 2, maxlength: 50 },
    fullname: { type: String },
    gender: { type: String, enum: GenderEnum },
    dob: {
        type: String,
        validate: {
            validator: (value) => {
                return validator_1.default.isDate(value, {
                    format: "YYYY/MM/DD",
                });
            },
            message: "{VALUE} is not a valid date",
        },
    },
    phone: { type: Number },
}, {
    timestamps: true,
});
userSchema
    .virtual("name")
    .get(function () {
    return `${this.firstname} ${this.lastname}`;
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    bcryptjs_1.default.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
    user.email = user.email.toLowerCase();
    user.fullname = user.firstname + " " + user.lastname;
});
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
userSchema.methods.comparePassword = function (password) {
    const user = this;
    return bcryptjs_1.default.compareSync(password, user.password);
};
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map