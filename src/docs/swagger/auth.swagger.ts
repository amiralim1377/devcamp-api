export const authDocs = {
  "/api/v1/auth/signup": {
    post: {
      summary: "ثبت‌نام کاربر جدید",
      description: "با ارسال اطلاعات پایه، یک حساب کاربری جدید ایجاد کنید.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "passwordConfirm"],
              properties: {
                name: { type: "string", example: "علی محمدی" },
                email: { type: "string", example: "test@example.com" },
                password: { type: "string", example: "password123" },
                passwordConfirm: { type: "string", example: "password123" },
                role: {
                  type: "string",
                  example: "student",
                  description: "student یا publisher",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "کاربر با موفقیت ثبت‌نام شد و توکن ارسال گردید." },
        400: { description: "خطای اعتبارسنجی دیتا یا تکراری بودن ایمیل." },
      },
    },
  },

  "/api/v1/auth/login": {
    post: {
      summary: "ورود به حساب کاربری",
      description: "دریافت توکن دسترسی (JWT) با استفاده از ایمیل و رمز عبور.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "test@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "ورود موفقیت‌آمیز بود." },
        401: { description: "ایمیل یا رمز عبور اشتباه است." },
      },
    },
  },

  "/api/v1/auth/logout": {
    post: {
      summary: "خروج از حساب کاربری",
      description: "پاک کردن کوکی‌ها و توکن کاربر برای خروج از سیستم.",
      tags: ["Auth"],
      responses: {
        200: { description: "کاربر با موفقیت خارج شد." },
      },
    },
  },

  "/api/v1/auth/refresh": {
    post: {
      summary: "تمدید توکن (Refresh Token)",
      description: "دریافت یک توکن جدید زمانی که توکن قبلی منقضی شده است.",
      tags: ["Auth"],
      responses: {
        200: { description: "توکن جدید با موفقیت صادر شد." },
        401: { description: "رفرش توکن نامعتبر است یا وجود ندارد." },
      },
    },
  },

  "/api/v1/auth/forgotpassword": {
    post: {
      summary: "فراموشی رمز عبور",
      description:
        "ارسال یک لینک حاوی توکن به ایمیل کاربر برای بازیابی رمز عبور.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", example: "test@example.com" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "ایمیل بازیابی با موفقیت ارسال شد." },
        404: { description: "کاربری با این ایمیل یافت نشد." },
      },
    },
  },

  // 🔴 نکته مهم: در اکسپرس متغیرهای مسیر را با `:token` می‌نویسیم،
  // اما در استاندارد Swagger باید داخل براکت `{token}` نوشته شود.
  "/api/v1/auth/resetpassword/{token}": {
    put: {
      summary: "بازیابی رمز عبور",
      description:
        "تنظیم رمز عبور جدید با استفاده از توکنی که به ایمیل ارسال شده بود.",
      tags: ["Auth"],
      parameters: [
        {
          name: "token",
          in: "path",
          required: true,
          description: "توکنِ ارسال شده به ایمیل کاربر",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password", "passwordConfirm"],
              properties: {
                password: { type: "string", example: "newPassword!@#" },
                passwordConfirm: { type: "string", example: "newPassword!@#" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "رمز عبور با موفقیت تغییر کرد." },
        400: { description: "توکن نامعتبر است یا منقضی شده است." },
      },
    },
  },

  "/api/v1/auth/updatepassword": {
    put: {
      summary: "تغییر رمز عبور (در حالت لاگین)",
      description:
        "کاربری که لاگین است می‌تواند با وارد کردن رمز عبور فعلی، رمز جدید تنظیم کند.",
      tags: ["Auth"],
      security: [
        {
          bearerAuth: [], // نیاز به لاگین دارد
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["passwordCurrent", "password", "passwordConfirm"],
              properties: {
                passwordCurrent: { type: "string", example: "oldPassword123" },
                password: { type: "string", example: "newPassword!@#" },
                passwordConfirm: { type: "string", example: "newPassword!@#" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "رمز عبور با موفقیت آپدیت شد." },
        401: { description: "رمز عبور فعلی اشتباه است یا کاربر لاگین نیست." },
      },
    },
  },
};
