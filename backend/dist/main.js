/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const services_module_1 = __webpack_require__(/*! ./services/services.module */ "./src/services/services.module.ts");
const bookings_module_1 = __webpack_require__(/*! ./bookings/bookings.module */ "./src/bookings/bookings.module.ts");
const stripe_module_1 = __webpack_require__(/*! ./stripe/stripe.module */ "./src/stripe/stripe.module.ts");
const email_module_1 = __webpack_require__(/*! ./email/email.module */ "./src/email/email.module.ts");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const health_controller_1 = __webpack_require__(/*! ./health/health.controller */ "./src/health/health.controller.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uri = configService.get('MONGODB_URI');
                    if (!uri) {
                        throw new Error('MONGODB_URI is not defined');
                    }
                    const options = {
                        retryWrites: true,
                        dbName: 'nail-studio',
                    };
                    try {
                        const connection = await mongoose.connect(uri, options);
                        common_1.Logger.log('Successfully connected to MongoDB');
                        if (connection.connection.db) {
                            const collections = await connection.connection.db.listCollections().toArray();
                            common_1.Logger.log(`Available collections: ${collections.map(c => c.name).join(', ')}`);
                        }
                    }
                    catch (error) {
                        common_1.Logger.error(`Failed to connect to MongoDB: ${error.message}`);
                        throw error;
                    }
                    return {
                        uri,
                        ...options
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            services_module_1.ServicesModule,
            bookings_module_1.BookingsModule,
            stripe_module_1.StripeModule,
            email_module_1.EmailModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [],
    })
], AppModule);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const register_dto_1 = __webpack_require__(/*! ./dto/register.dto */ "./src/auth/dto/register.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/auth/dto/login.dto.ts");
const forgot_password_dto_1 = __webpack_require__(/*! ./dto/forgot-password.dto */ "./src/auth/dto/forgot-password.dto.ts");
const auth_1 = __webpack_require__(/*! ../middleware/auth */ "./src/middleware/auth.ts");
const auth_2 = __webpack_require__(/*! ../middleware/auth */ "./src/middleware/auth.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async forgotPassword(forgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return { message: 'If an account exists with this email, you will receive password reset instructions.' };
    }
    async resetPassword(token, newPassword) {
        await this.authService.resetPassword(token, newPassword);
        return { message: 'Password has been reset successfully' };
    }
    async logout(req) {
        await this.authService.logout(req.user?.userId);
        return { message: 'Logged out successfully' };
    }
    async logoutAll(req) {
        await this.authService.logoutAll(req.user?.userId);
        return { message: 'Logged out from all devices successfully' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(auth_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof auth_2.RequestWithUser !== "undefined" && auth_2.RequestWithUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout/all'),
    (0, common_1.UseGuards)(auth_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof auth_2.RequestWithUser !== "undefined" && auth_2.RequestWithUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/auth/schemas/user.schema.ts");
const email_module_1 = __webpack_require__(/*! ../email/email.module */ "./src/email/email.module.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: {
                        expiresIn: '24h',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            email_module_1.EmailModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, passport_1.PassportModule],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/auth/schemas/user.schema.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ../email/email.service */ "./src/email/email.service.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const user_role_enum_1 = __webpack_require__(/*! ./enums/user-role.enum */ "./src/auth/enums/user-role.enum.ts");
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, jwtService, emailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.logger = new common_2.Logger(AuthService_1.name);
    }
    async register(registerDto) {
        const { email, password, confirmPassword, firstName, lastName, phone, subscribe, agreeToTerms } = registerDto;
        if (!agreeToTerms) {
            throw new common_1.BadRequestException('You must agree to the Terms & Conditions');
        }
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException({
                success: false,
                error: 'PASSWORD_MISMATCH',
                message: 'Passwords do not match. Please make sure both password fields are identical.'
            });
        }
        try {
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new common_1.ConflictException({
                    success: false,
                    error: 'EMAIL_EXISTS',
                    message: 'This email is already registered. Please use a different email address.'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                subscribe: subscribe || false,
                agreeToTerms,
                role: user_role_enum_1.UserRole.CLIENT,
                emailVerified: false
            });
            const token = this.jwtService.sign({
                userId: user._id,
                email: user.email,
                role: user.role
            });
            this.emailService.sendWelcomeEmail(email, `${firstName} ${lastName}`)
                .catch(error => {
                this.logger.error('Failed to send welcome email:', error);
            });
            this.logger.log(`User registered successfully: ${email}`);
            return {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role
                },
                token
            };
        }
        catch (error) {
            this.logger.error(`Registration failed for email ${email}:`, {
                error: error.message,
                stack: error.stack,
                code: error.code
            });
            if (error.code === 11000) {
                throw new common_1.ConflictException({
                    success: false,
                    error: 'EMAIL_EXISTS',
                    message: 'This email is already registered. Please use a different email address.'
                });
            }
            if (error.name === 'ValidationError' && error.errors) {
                const validationErrors = Object.values(error.errors)
                    .map(err => err.message)
                    .join(', ');
                throw new common_1.BadRequestException({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: validationErrors
                });
            }
            throw new common_1.BadRequestException({
                success: false,
                error: 'REGISTRATION_FAILED',
                message: error.message || 'Registration failed. Please try again later.'
            });
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.jwtService.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        });
        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        };
    }
    async forgotPassword(email) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                this.logger.warn(`Password reset requested for non-existent email: ${email}`);
                return;
            }
            const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const resetPasswordExpires = new Date(Date.now() + 3600000);
            await this.userModel.updateOne({ _id: user._id }, {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
            });
            this.logger.log(`Reset token generated for user: ${email}`);
            await this.emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
            this.logger.log(`Password reset process completed for user: ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to process forgot password for ${email}:`, error);
            throw new Error('Failed to process password reset request. Please try again later.');
        }
    }
    async resetPassword(token, newPassword) {
        const user = await this.userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired password reset token');
        }
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.userModel.updateOne({ _id: user._id }, {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined,
            });
            this.logger.log(`Password reset successful for user: ${user.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to reset password for user ${user.email}:`, error);
            throw new Error('Failed to reset password');
        }
    }
    async logout(userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID is required');
        }
        try {
            await this.userModel.updateOne({ _id: userId }, {
                $set: {
                    lastLogout: new Date(),
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to logout user ${userId}:`, error);
            throw new Error('Failed to process logout request');
        }
    }
    async logoutAll(userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID is required');
        }
        try {
            await this.userModel.updateOne({ _id: userId }, {
                $set: {
                    tokenVersion: (Math.random() * 1000000).toString(),
                    lastLogout: new Date(),
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to logout user ${userId} from all devices:`, error);
            throw new Error('Failed to process logout from all devices request');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/dto/forgot-password.dto.ts":
/*!*********************************************!*\
  !*** ./src/auth/dto/forgot-password.dto.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email address of the user requesting password reset',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),

/***/ "./src/auth/dto/login.dto.ts":
/*!***********************************!*\
  !*** ./src/auth/dto/login.dto.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email address of the user',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'password123',
        description: 'The password for the account',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/auth/dto/register.dto.ts":
/*!**************************************!*\
  !*** ./src/auth/dto/register.dto.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'First name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'First name must not exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^[A-Za-z\s]+$/, { message: 'First name can only contain letters and spaces' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required' }),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Last name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Last name must not exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^[A-Za-z\s]+$/, { message: 'Last name can only contain letters and spaces' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }),
    (0, class_validator_1.Matches)(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password confirmation is required' }),
    (0, class_validator_1.IsString)({ message: 'Password confirmation must be a string' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string' }),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Subscribe must be a boolean value' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "subscribe", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'You must agree to the Terms & Conditions' }),
    (0, class_validator_1.IsBoolean)({ message: 'Terms agreement must be a boolean value' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "agreeToTerms", void 0);


/***/ }),

/***/ "./src/auth/enums/user-role.enum.ts":
/*!******************************************!*\
  !*** ./src/auth/enums/user-role.enum.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CLIENT"] = "CLIENT";
    UserRole["STAFF"] = "STAFF";
})(UserRole || (exports.UserRole = UserRole = {}));


/***/ }),

/***/ "./src/auth/guards/jwt-auth.guard.ts":
/*!*******************************************!*\
  !*** ./src/auth/guards/jwt-auth.guard.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/auth/interfaces/auth.interface.ts":
/*!***********************************************!*\
  !*** ./src/auth/interfaces/auth.interface.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/auth/schemas/user.schema.ts":
/*!*****************************************!*\
  !*** ./src/auth/schemas/user.schema.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const user_role_enum_1 = __webpack_require__(/*! ../enums/user-role.enum */ "./src/auth/enums/user-role.enum.ts");
let User = class User {
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: user_role_enum_1.UserRole, required: true, default: user_role_enum_1.UserRole.CLIENT }),
    __metadata("design:type", typeof (_a = typeof user_role_enum_1.UserRole !== "undefined" && user_role_enum_1.UserRole) === "function" ? _a : Object)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "subscribe", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], User.prototype, "agreeToTerms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "lastLogout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, virtual: true }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], User.prototype, "name", null);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 }, { unique: true });
exports.UserSchema.index({ role: 1 });
exports.UserSchema.index({ isActive: 1 });
exports.UserSchema.methods.toJSON = function () {
    const obj = this.toObject({
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.verificationToken;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordExpires;
            return ret;
        }
    });
    return obj;
};


/***/ }),

/***/ "./src/auth/strategies/jwt.strategy.ts":
/*!*********************************************!*\
  !*** ./src/auth/strategies/jwt.strategy.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
        });
        this.configService = configService;
    }
    async validate(payload) {
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/bookings/bookings.controller.ts":
/*!*********************************************!*\
  !*** ./src/bookings/bookings.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookingsController_1;
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/bookings/bookings.service.ts");
const create_booking_dto_1 = __webpack_require__(/*! ./dto/create-booking.dto */ "./src/bookings/dto/create-booking.dto.ts");
const stripe_service_1 = __webpack_require__(/*! ../stripe/stripe.service */ "./src/stripe/stripe.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const auth_interface_1 = __webpack_require__(/*! ../auth/interfaces/auth.interface */ "./src/auth/interfaces/auth.interface.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const service_schema_1 = __webpack_require__(/*! ./schemas/service.schema */ "./src/bookings/schemas/service.schema.ts");
let BookingsController = BookingsController_1 = class BookingsController {
    constructor(bookingsService, stripeService, serviceModel) {
        this.bookingsService = bookingsService;
        this.stripeService = stripeService;
        this.serviceModel = serviceModel;
        this.logger = new common_1.Logger(BookingsController_1.name);
    }
    async create(createBookingDto, req) {
        try {
            this.logger.debug(`Creating booking with service ID: ${createBookingDto.serviceId}`);
            const service = await this.serviceModel.findById(createBookingDto.serviceId);
            if (!service) {
                throw new common_1.NotFoundException('Service not found');
            }
            return await this.bookingsService.create(createBookingDto, req.user);
        }
        catch (error) {
            this.logger.error(`Error creating booking: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getBooking(req, id) {
        return this.bookingsService.findOne(id, req.user._id.toString());
    }
    async cancelBooking(req, id) {
        const booking = await this.bookingsService.cancel(id, req.user._id.toString());
        if (booking.paymentId && booking.paymentStatus !== 'UNPAID') {
            await this.stripeService.createRefund(booking.paymentId);
        }
        return booking;
    }
    async checkServiceStatus(serviceId) {
        const service = await this.serviceModel.findById(serviceId);
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return {
            id: service._id,
            name: service.name,
            isActive: service.isActive,
            exists: true
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_booking_dto_1.CreateBookingDto !== "undefined" && create_booking_dto_1.CreateBookingDto) === "function" ? _d : Object, typeof (_e = typeof auth_interface_1.RequestWithUser !== "undefined" && auth_interface_1.RequestWithUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof auth_interface_1.RequestWithUser !== "undefined" && auth_interface_1.RequestWithUser) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof auth_interface_1.RequestWithUser !== "undefined" && auth_interface_1.RequestWithUser) === "function" ? _g : Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)('service/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "checkServiceStatus", null);
exports.BookingsController = BookingsController = BookingsController_1 = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(2, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof bookings_service_1.BookingsService !== "undefined" && bookings_service_1.BookingsService) === "function" ? _a : Object, typeof (_b = typeof stripe_service_1.StripeService !== "undefined" && stripe_service_1.StripeService) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], BookingsController);


/***/ }),

/***/ "./src/bookings/bookings.module.ts":
/*!*****************************************!*\
  !*** ./src/bookings/bookings.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const bookings_controller_1 = __webpack_require__(/*! ./bookings.controller */ "./src/bookings/bookings.controller.ts");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/bookings/bookings.service.ts");
const service_schema_1 = __webpack_require__(/*! ./schemas/service.schema */ "./src/bookings/schemas/service.schema.ts");
const category_schema_1 = __webpack_require__(/*! ./schemas/category.schema */ "./src/bookings/schemas/category.schema.ts");
const addon_schema_1 = __webpack_require__(/*! ./schemas/addon.schema */ "./src/bookings/schemas/addon.schema.ts");
const booking_schema_1 = __webpack_require__(/*! ./schemas/booking.schema */ "./src/bookings/schemas/booking.schema.ts");
const stripe_module_1 = __webpack_require__(/*! ../stripe/stripe.module */ "./src/stripe/stripe.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
const email_module_1 = __webpack_require__(/*! ../email/email.module */ "./src/email/email.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const appointment_schema_1 = __webpack_require__(/*! ./schemas/appointment.schema */ "./src/bookings/schemas/appointment.schema.ts");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: service_schema_1.Service.name, schema: service_schema_1.ServiceSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: addon_schema_1.AddOn.name, schema: addon_schema_1.AddOnSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
            stripe_module_1.StripeModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            config_1.ConfigModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [bookings_controller_1.BookingsController],
        providers: [bookings_service_1.BookingsService],
        exports: [bookings_service_1.BookingsService]
    })
], BookingsModule);


/***/ }),

/***/ "./src/bookings/bookings.service.ts":
/*!******************************************!*\
  !*** ./src/bookings/bookings.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookingsService_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const appointment_schema_1 = __webpack_require__(/*! ./schemas/appointment.schema */ "./src/bookings/schemas/appointment.schema.ts");
const booking_schema_1 = __webpack_require__(/*! ./schemas/booking.schema */ "./src/bookings/schemas/booking.schema.ts");
const email_service_1 = __webpack_require__(/*! ../email/email.service */ "./src/email/email.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");
const service_schema_1 = __webpack_require__(/*! ./schemas/service.schema */ "./src/bookings/schemas/service.schema.ts");
const addon_schema_1 = __webpack_require__(/*! ./schemas/addon.schema */ "./src/bookings/schemas/addon.schema.ts");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(appointmentModel, bookingModel, serviceModel, addOnModel, emailService, configService) {
        this.appointmentModel = appointmentModel;
        this.bookingModel = bookingModel;
        this.serviceModel = serviceModel;
        this.addOnModel = addOnModel;
        this.emailService = emailService;
        this.configService = configService;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    async validateAddOns(addOnIds) {
        if (!addOnIds?.length)
            return [];
        const addOns = await this.addOnModel.find({
            _id: { $in: addOnIds.map(id => new mongoose_2.Types.ObjectId(id)) },
            isActive: true
        });
        if (addOns.length !== addOnIds.length) {
            throw new common_1.BadRequestException('One or more add-ons not found or inactive');
        }
        return addOns;
    }
    calculateTotalPrice(service, addOns) {
        const addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
        return service.price + addOnsTotal;
    }
    calculateTotalDuration(service, addOns) {
        const addOnsDuration = addOns.reduce((sum, addOn) => sum + (addOn.duration || 0), 0);
        return service.duration + addOnsDuration;
    }
    async validateService(serviceId) {
        const service = await this.serviceModel.findOne({
            _id: new mongoose_2.Types.ObjectId(serviceId),
            isActive: true
        }).exec();
        if (!service) {
            throw new common_1.NotFoundException('Service not found or inactive');
        }
        return service;
    }
    calculateDepositAmount(service) {
        if (service.price >= 50) {
            return Math.round(service.price * 0.2);
        }
        return 0;
    }
    async create(createBookingDto, user) {
        try {
            this.logger.debug(`Creating booking for user: ${user._id}, service: ${createBookingDto.serviceId}`);
            const service = await this.validateService(createBookingDto.serviceId);
            const addOns = await this.validateAddOns(createBookingDto.addOnIds || []);
            const totalPrice = this.calculateTotalPrice(service, addOns);
            const totalDuration = this.calculateTotalDuration(service, addOns);
            const depositAmount = this.calculateDepositAmount(service);
            if (createBookingDto.amount !== totalPrice) {
                throw new common_1.BadRequestException(`Invalid total amount. Expected: ${totalPrice}`);
            }
            const booking = new this.bookingModel({
                userId: user._id,
                serviceId: service._id,
                addOnIds: addOns.map(addOn => addOn._id),
                dateTime: createBookingDto.appointmentDate,
                duration: totalDuration,
                totalAmount: totalPrice,
                depositAmount,
                status: booking_schema_1.BookingStatus.PENDING,
                notes: createBookingDto.notes,
                paymentStatus: booking_schema_1.PaymentStatus.UNPAID
            });
            const savedBooking = await booking.save();
            const populatedBooking = await this.populateBookingDetails(savedBooking._id);
            if (!populatedBooking) {
                throw new common_1.NotFoundException('Booking not found after creation');
            }
            await this.emailService.sendBookingConfirmation({
                email: user.email,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' '),
                name: user.name,
                bookingDetails: {
                    id: populatedBooking._id.toString(),
                    dateTime: populatedBooking.dateTime,
                    totalAmount: populatedBooking.totalAmount,
                    status: populatedBooking.status,
                    paymentStatus: populatedBooking.paymentStatus,
                    serviceName: service.name,
                    notes: populatedBooking.notes,
                    addOnServices: addOns.map(addOn => ({
                        name: addOn.name,
                        price: addOn.price
                    }))
                }
            });
            return populatedBooking;
        }
        catch (error) {
            this.logger.error(`Failed to create booking: ${error.message}`, error.stack);
            throw error;
        }
    }
    handleBookingError(error, dto, user) {
        if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
            throw error;
        }
        this.logger.error('Failed to create booking:', {
            error: error.message,
            stack: error.stack,
            bookingDto: dto,
            userId: user._id
        });
        throw new common_1.InternalServerErrorException('Failed to create booking. Please try again later.');
    }
    async populateBookingDetails(bookingId) {
        return this.bookingModel
            .findById(bookingId)
            .populate('serviceId')
            .populate('addOnIds')
            .populate('userId', 'name email')
            .exec();
    }
    async validateAppointmentSlot(date, duration) {
    }
    async findOne(id, userId) {
        const booking = await this.bookingModel.findById(id)
            .populate('userId')
            .populate('serviceId');
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException();
        }
        return booking;
    }
    async cancel(id, userId, reason) {
        const booking = await this.findOne(id, userId);
        if (booking.status === booking_schema_1.BookingStatus.CANCELED) {
            throw new Error('Booking is already cancelled');
        }
        booking.status = booking_schema_1.BookingStatus.CANCELED;
        booking.cancelReason = reason;
        const updatedBooking = await booking.save();
        await this.emailService.sendBookingCancellationEmail(updatedBooking);
        return updatedBooking;
    }
    async sendReminderEmails() {
        try {
            const tomorrow = (0, date_fns_1.addDays)(new Date(), 1);
            const bookings = await this.bookingModel
                .find({
                dateTime: {
                    $gte: tomorrow,
                    $lt: (0, date_fns_1.addDays)(tomorrow, 1)
                },
                status: booking_schema_1.BookingStatus.CONFIRMED,
                reminderSent: false
            })
                .populate('userId')
                .populate('serviceId');
            this.logger.log(`Found ${bookings.length} bookings for tomorrow's reminders`);
            for (const booking of bookings) {
                await this.emailService.sendBookingReminderEmail(booking);
                booking.reminderSent = true;
                await booking.save();
            }
        }
        catch (error) {
            this.logger.error('Failed to send reminder emails:', error);
        }
    }
    async updatePaymentStatus(bookingId, status) {
        await this.bookingModel.findByIdAndUpdate(bookingId, {
            paymentStatus: status,
        });
    }
};
exports.BookingsService = BookingsService;
__decorate([
    (0, schedule_1.Cron)('0 12 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsService.prototype, "sendReminderEmails", null);
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __param(3, (0, mongoose_1.InjectModel)(addon_schema_1.AddOn.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _e : Object, typeof (_f = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _f : Object])
], BookingsService);


/***/ }),

/***/ "./src/bookings/dto/create-booking.dto.ts":
/*!************************************************!*\
  !*** ./src/bookings/dto/create-booking.dto.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBookingDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "addOnIds", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateBookingDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);


/***/ }),

/***/ "./src/bookings/enums/service-category.enum.ts":
/*!*****************************************************!*\
  !*** ./src/bookings/enums/service-category.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategory = void 0;
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["MANICURE"] = "MANICURE";
    ServiceCategory["PEDICURE"] = "PEDICURE";
    ServiceCategory["NAIL_ART"] = "NAIL_ART";
    ServiceCategory["SPECIAL"] = "SPECIAL";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));


/***/ }),

/***/ "./src/bookings/schemas/addon.schema.ts":
/*!**********************************************!*\
  !*** ./src/bookings/schemas/addon.schema.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddOnSchema = exports.AddOn = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let AddOn = class AddOn {
};
exports.AddOn = AddOn;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AddOn.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], AddOn.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], AddOn.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AddOn.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], AddOn.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'general' }),
    __metadata("design:type", String)
], AddOn.prototype, "category", void 0);
exports.AddOn = AddOn = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AddOn);
exports.AddOnSchema = mongoose_1.SchemaFactory.createForClass(AddOn);
exports.AddOnSchema.index({ category: 1 });
exports.AddOnSchema.index({ isActive: 1 });


/***/ }),

/***/ "./src/bookings/schemas/appointment.schema.ts":
/*!****************************************************!*\
  !*** ./src/bookings/schemas/appointment.schema.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentSchema = exports.Appointment = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Appointment = class Appointment extends mongoose_2.Document {
};
exports.Appointment = Appointment;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], Appointment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Schema.Types.ObjectId, ref: 'Service' }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Schema !== "undefined" && (_c = mongoose_2.Schema.Types) !== void 0 && _c.ObjectId) === "function" ? _d : Object)
], Appointment.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Appointment.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Appointment.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending', enum: ['pending', 'confirmed', 'cancelled', 'completed'] }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "paymentIntentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "notes", void 0);
exports.Appointment = Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);


/***/ }),

/***/ "./src/bookings/schemas/booking.schema.ts":
/*!************************************************!*\
  !*** ./src/bookings/schemas/booking.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingSchema = exports.Booking = exports.PaymentStatus = exports.BookingStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ../../auth/schemas/user.schema */ "./src/auth/schemas/user.schema.ts");
const service_schema_1 = __webpack_require__(/*! ./service.schema */ "./src/bookings/schemas/service.schema.ts");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELED"] = "CANCELED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["UNPAID"] = "UNPAID";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof user_schema_1.User !== "undefined" && user_schema_1.User) === "function" ? _a : Object)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", typeof (_b = typeof service_schema_1.Service !== "undefined" && service_schema_1.Service) === "function" ? _b : Object)
], Booking.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'AddOn' }] }),
    __metadata("design:type", Array)
], Booking.prototype, "addOnIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Booking.prototype, "dateTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: BookingStatus, default: BookingStatus.PENDING }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "cancelReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "reminderSent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Booking.prototype, "paymentId", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
exports.BookingSchema.index({ userId: 1, dateTime: -1 });
exports.BookingSchema.index({ status: 1, dateTime: 1 });
exports.BookingSchema.index({ dateTime: 1 });


/***/ }),

/***/ "./src/bookings/schemas/category.schema.ts":
/*!*************************************************!*\
  !*** ./src/bookings/schemas/category.schema.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Category = class Category extends mongoose_2.Document {
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Category.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "imageUrl", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategorySchema.index({ slug: 1 }, { unique: true });
exports.CategorySchema.index({ order: 1 });
exports.CategorySchema.index({ isActive: 1 });


/***/ }),

/***/ "./src/bookings/schemas/service.schema.ts":
/*!************************************************!*\
  !*** ./src/bookings/schemas/service.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceSchema = exports.Service = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const service_category_enum_1 = __webpack_require__(/*! ../enums/service-category.enum */ "./src/bookings/enums/service-category.enum.ts");
let Service = class Service {
};
exports.Service = Service;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Service.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Service.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Service.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Service.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Service.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: service_category_enum_1.ServiceCategory,
        required: true,
        index: true
    }),
    __metadata("design:type", typeof (_a = typeof service_category_enum_1.ServiceCategory !== "undefined" && service_category_enum_1.ServiceCategory) === "function" ? _a : Object)
], Service.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Service.prototype, "deposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Service.prototype, "isActive", void 0);
exports.Service = Service = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Service);
exports.ServiceSchema = mongoose_1.SchemaFactory.createForClass(Service);
exports.ServiceSchema.index({ category: 1 });
exports.ServiceSchema.index({ isActive: 1 });


/***/ }),

/***/ "./src/config/database.config.ts":
/*!***************************************!*\
  !*** ./src/config/database.config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connectToDatabase = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
exports["default"] = (0, config_1.registerAs)('database', () => ({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/nail-studio',
}));
const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose_1.default.connect(uri, {
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            dbName: 'nail-studio',
        });
        console.log('Successfully connected to MongoDB Atlas nail-studio database');
    }
    catch (err) {
        console.error('MongoDB Atlas connection error:', err);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;


/***/ }),

/***/ "./src/email/email.controller.ts":
/*!***************************************!*\
  !*** ./src/email/email.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/email/email.service.ts");
let EmailController = class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async testEmail(body) {
        try {
            await this.emailService.sendPasswordResetEmail(body.email, 'Test User', 'test-token-123');
            return { message: 'Test email sent successfully' };
        }
        catch (error) {
            return { error: error.message };
        }
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "testEmail", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object])
], EmailController);


/***/ }),

/***/ "./src/email/email.module.ts":
/*!***********************************!*\
  !*** ./src/email/email.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/email/email.service.ts");
const email_controller_1 = __webpack_require__(/*! ./email.controller */ "./src/email/email.controller.ts");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [email_controller_1.EmailController],
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);


/***/ }),

/***/ "./src/email/email.service.ts":
/*!************************************!*\
  !*** ./src/email/email.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");
const handlebars = __webpack_require__(/*! handlebars */ "handlebars");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.logger.log('Initializing email service...');
        const emailUser = this.configService.get('GMAIL_USER');
        this.logger.log(`Email configured for: ${emailUser}`);
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: this.configService.get('GMAIL_APP_PASSWORD'),
            },
        });
        this.verifyConnection();
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('Email service connected successfully');
        }
        catch (error) {
            this.logger.error('Email service connection failed:', error);
            throw error;
        }
    }
    async loadTemplate(templateName) {
        const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);
        try {
            const template = await fs.promises.readFile(templatePath, 'utf-8');
            return handlebars.compile(template);
        }
        catch (error) {
            this.logger.error(`Failed to load email template '${templateName}':`, error);
            throw error;
        }
    }
    async sendWelcomeEmail(email, name) {
        try {
            const template = await this.loadTemplate('welcome');
            const html = template({
                name,
                websiteName: this.configService.get('WEBSITE_NAME', 'Nail Studio'),
                bookingUrl: `${this.configService.get('FRONTEND_URL')}/appointments`,
                phoneNumber: this.configService.get('BUSINESS_PHONE'),
                businessAddress: this.configService.get('BUSINESS_ADDRESS'),
                instagramUrl: this.configService.get('INSTAGRAM_URL'),
                facebookUrl: this.configService.get('FACEBOOK_URL'),
                pinterestUrl: this.configService.get('PINTEREST_URL'),
                unsubscribeUrl: `${this.configService.get('FRONTEND_URL')}/unsubscribe?email=${email}`,
            });
            await this.transporter.sendMail({
                from: `"${this.configService.get('WEBSITE_NAME', 'Nail Studio')}" <${this.configService.get('GMAIL_USER')}>`,
                to: email,
                subject: `Welcome to ${this.configService.get('WEBSITE_NAME', 'Nail Studio')}! 🎉`,
                html,
            });
            this.logger.log(`Welcome email sent to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}:`, error);
            throw error;
        }
    }
    async sendPasswordResetEmail(email, name, resetToken) {
        try {
            this.logger.log('Loading reset password template...');
            const template = await this.loadTemplate('reset-password');
            const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
            this.logger.log(`Reset URL generated: ${resetUrl}`);
            const html = template({
                name,
                resetUrl,
                websiteName: this.configService.get('WEBSITE_NAME', 'Nail Studio'),
                phoneNumber: this.configService.get('BUSINESS_PHONE'),
                businessAddress: this.configService.get('BUSINESS_ADDRESS'),
            });
            const mailOptions = {
                from: `"${this.configService.get('WEBSITE_NAME', 'Nail Studio')}" <${this.configService.get('GMAIL_USER')}>`,
                to: email,
                subject: 'Reset Your Password',
                html,
            };
            this.logger.log('Preparing to send password reset email...');
            this.logger.debug('Mail options:', { ...mailOptions, html: 'HTML content hidden' });
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Password reset email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}:`, error);
            if (error.code) {
                this.logger.error(`Error code: ${error.code}`);
            }
            throw new Error('Failed to send password reset email. Please try again later.');
        }
    }
    async sendBookingConfirmationEmail(params) {
        const { email, name, bookingDetails } = params;
        try {
            const template = await this.loadTemplate('booking-confirmation');
            const formattedDate = (0, date_fns_1.format)(bookingDetails.dateTime, 'EEEE, MMMM do, yyyy');
            const formattedTime = (0, date_fns_1.format)(bookingDetails.dateTime, 'h:mm a');
            const html = template({
                name,
                service: bookingDetails.serviceName,
                date: formattedDate,
                time: formattedTime,
                price: bookingDetails.totalAmount.toFixed(2),
                depositAmount: bookingDetails.depositAmount.toFixed(2),
                remainingBalance: (bookingDetails.totalAmount - bookingDetails.depositAmount).toFixed(2),
                paymentStatus: bookingDetails.paymentStatus,
                notes: bookingDetails.notes,
                businessAddress: this.configService.get('BUSINESS_ADDRESS'),
                phoneNumber: this.configService.get('BUSINESS_PHONE'),
                managementUrl: `${this.configService.get('FRONTEND_URL')}/appointments/${bookingDetails.id}`,
            });
            await this.transporter.sendMail({
                from: `"${this.configService.get('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
                to: email,
                subject: 'Your Booking is Confirmed! 💅',
                html,
            });
            this.logger.log(`Booking confirmation email sent to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send booking confirmation email to ${email}:`, error);
            throw error;
        }
    }
    async sendBookingReminderEmail(booking) {
        try {
            const template = await this.loadTemplate('booking-reminder');
            const formattedDate = (0, date_fns_1.format)(booking.dateTime, 'EEEE, MMMM do, yyyy');
            const formattedTime = (0, date_fns_1.format)(booking.dateTime, 'h:mm a');
            const html = template({
                name: booking.userId.name,
                service: booking.serviceId.name,
                date: formattedDate,
                time: formattedTime,
                businessAddress: this.configService.get('BUSINESS_ADDRESS'),
                phoneNumber: this.configService.get('BUSINESS_PHONE'),
                googleMapsUrl: this.configService.get('GOOGLE_MAPS_URL'),
                managementUrl: `${this.configService.get('FRONTEND_URL')}/appointments/${booking._id}`,
            });
            await this.transporter.sendMail({
                from: `"${this.configService.get('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
                to: booking.userId.email,
                subject: 'Reminder: Your Appointment Tomorrow! 🗓️',
                html,
            });
            this.logger.log(`Reminder email sent to ${booking.userId.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send reminder email:`, error);
            throw error;
        }
    }
    async sendBookingCancellationEmail(booking) {
        try {
            const template = await this.loadTemplate('booking-cancellation');
            const formattedDate = (0, date_fns_1.format)(booking.dateTime, 'EEEE, MMMM do, yyyy');
            const formattedTime = (0, date_fns_1.format)(booking.dateTime, 'h:mm a');
            const html = template({
                name: booking.userId.name,
                service: booking.serviceId.name,
                date: formattedDate,
                time: formattedTime,
                cancelReason: booking.cancelReason || 'No reason provided',
                bookingUrl: `${this.configService.get('FRONTEND_URL')}/booking`,
                businessPhone: this.configService.get('BUSINESS_PHONE'),
            });
            await this.transporter.sendMail({
                from: `"${this.configService.get('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
                to: booking.userId.email,
                subject: 'Your Booking Has Been Cancelled',
                html,
            });
            this.logger.log(`Cancellation email sent to ${booking.userId.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send cancellation email:`, error);
            throw error;
        }
    }
    async sendMail(options) {
        await this.transporter.sendMail({
            from: `"${this.configService.get('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
            ...options
        });
    }
    async sendBookingConfirmation(params) {
        const { email, name, bookingDetails } = params;
        const addOnsHtml = bookingDetails.addOnServices?.length
            ? `
        <h3>Selected Add-ons:</h3>
        <ul>
          ${bookingDetails.addOnServices.map((addOn) => `
            <li>
              <strong>${addOn.name}</strong> - $${addOn.price.toFixed(2)}
            </li>
          `).join('')}
        </ul>
        <p><strong>Add-ons Total:</strong> $${bookingDetails.addOnServices.reduce((sum, addOn) => sum + addOn.price, 0).toFixed(2)}</p>
      `
            : '';
        const html = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your booking has been confirmed for the following service:</p>
      
      <h3>Service Details:</h3>
      <p>
        <strong>${bookingDetails.serviceName}</strong>
      </p>
      
      ${addOnsHtml}
      
      <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount.toFixed(2)}</p>
      <p><strong>Date & Time:</strong> ${bookingDetails.dateTime.toLocaleString()}</p>
      
      <p>Thank you for choosing our services!</p>
    `;
        await this.sendMail({
            to: email,
            subject: 'Booking Confirmation',
            html
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);


/***/ }),

/***/ "./src/health/health.controller.ts":
/*!*****************************************!*\
  !*** ./src/health/health.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let HealthController = class HealthController {
    constructor(connection) {
        this.connection = connection;
    }
    async checkHealth() {
        try {
            const state = this.connection.readyState;
            if (!this.connection.db) {
                return {
                    status: 'error',
                    message: 'Database connection not initialized'
                };
            }
            const collections = await this.connection.db.listCollections().toArray();
            return {
                status: 'ok',
                database: {
                    state: state === 1 ? 'connected' : 'disconnected',
                    collections: collections.map(c => c.name),
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Connection !== "undefined" && mongoose_2.Connection) === "function" ? _a : Object])
], HealthController);


/***/ }),

/***/ "./src/middleware/auth.ts":
/*!********************************!*\
  !*** ./src/middleware/auth.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthMiddleware = void 0;
exports.isAdmin = isAdmin;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let AuthMiddleware = class AuthMiddleware extends (0, passport_1.AuthGuard)('jwt') {
    constructor(jwtService) {
        super();
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.verify(token);
            request.user = decoded;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthMiddleware);
function isAdmin(req, res, next) {
    const user = req.user;
    if (user?.role !== 'admin') {
        throw new common_1.UnauthorizedException('Admin access required');
    }
    next();
}


/***/ }),

/***/ "./src/services/schemas/service.schema.ts":
/*!************************************************!*\
  !*** ./src/services/schemas/service.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceSchema = exports.Service = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let Service = class Service {
};
exports.Service = Service;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Service.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Service.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Service.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Service.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Service.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Service.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Service.prototype, "deposit", void 0);
exports.Service = Service = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Service);
exports.ServiceSchema = mongoose_1.SchemaFactory.createForClass(Service);


/***/ }),

/***/ "./src/services/services.controller.ts":
/*!*********************************************!*\
  !*** ./src/services/services.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const services_service_1 = __webpack_require__(/*! ./services.service */ "./src/services/services.service.ts");
const service_category_enum_1 = __webpack_require__(/*! ../bookings/enums/service-category.enum */ "./src/bookings/enums/service-category.enum.ts");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    async getServices(category) {
        let serviceCategory;
        if (category) {
            const normalizedCategory = category.toUpperCase();
            if (normalizedCategory in service_category_enum_1.ServiceCategory) {
                serviceCategory = service_category_enum_1.ServiceCategory[normalizedCategory];
            }
            else {
                throw new common_1.NotFoundException(`Category ${category} not found`);
            }
        }
        const services = await this.servicesService.findAll(serviceCategory);
        return services;
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServices", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [typeof (_a = typeof services_service_1.ServicesService !== "undefined" && services_service_1.ServicesService) === "function" ? _a : Object])
], ServicesController);


/***/ }),

/***/ "./src/services/services.module.ts":
/*!*****************************************!*\
  !*** ./src/services/services.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const services_controller_1 = __webpack_require__(/*! ./services.controller */ "./src/services/services.controller.ts");
const services_service_1 = __webpack_require__(/*! ./services.service */ "./src/services/services.service.ts");
const service_schema_1 = __webpack_require__(/*! ./schemas/service.schema */ "./src/services/schemas/service.schema.ts");
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: service_schema_1.Service.name, schema: service_schema_1.ServiceSchema }
            ])
        ],
        controllers: [services_controller_1.ServicesController],
        providers: [services_service_1.ServicesService],
        exports: [services_service_1.ServicesService]
    })
], ServicesModule);


/***/ }),

/***/ "./src/services/services.service.ts":
/*!******************************************!*\
  !*** ./src/services/services.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const service_schema_1 = __webpack_require__(/*! ./schemas/service.schema */ "./src/services/schemas/service.schema.ts");
let ServicesService = class ServicesService {
    constructor(serviceModel) {
        this.serviceModel = serviceModel;
    }
    async findAll(category) {
        const query = category ? {
            category: { $regex: new RegExp(`^${category}$`, 'i') },
            isActive: true
        } : {
            isActive: true
        };
        console.log('MongoDB query:', query);
        const services = await this.serviceModel.find(query).exec();
        console.log('Found services:', services);
        return services;
    }
    async findById(id) {
        const service = await this.serviceModel.findOne({ _id: id, isActive: true }).exec();
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ServicesService);


/***/ }),

/***/ "./src/stripe/stripe.module.ts":
/*!*************************************!*\
  !*** ./src/stripe/stripe.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StripeModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const stripe_service_1 = __webpack_require__(/*! ./stripe.service */ "./src/stripe/stripe.service.ts");
let StripeModule = class StripeModule {
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [stripe_service_1.StripeService],
        exports: [stripe_service_1.StripeService],
    })
], StripeModule);


/***/ }),

/***/ "./src/stripe/stripe.service.ts":
/*!**************************************!*\
  !*** ./src/stripe/stripe.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StripeService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const stripe_1 = __webpack_require__(/*! stripe */ "stripe");
let StripeService = class StripeService {
    constructor(configService) {
        this.configService = configService;
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }
        this.stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2025-01-27.acacia',
        });
    }
    async createPaymentIntent(params) {
        return this.stripe.paymentIntents.create({
            amount: Math.round(params.amount * 100),
            currency: params.currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }
    async createRefund(paymentIntentId) {
        return this.stripe.refunds.create({
            payment_intent: paymentIntentId,
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], StripeService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "date-fns":
/*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),

/***/ "handlebars":
/*!*****************************!*\
  !*** external "handlebars" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("handlebars");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const database_config_1 = __webpack_require__(/*! ./config/database.config */ "./src/config/database.config.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await (0, database_config_1.connectToDatabase)();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nail Studio API')
        .setDescription('Professional Nail Studio API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

})();

/******/ })()
;