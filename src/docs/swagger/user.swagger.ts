export const userDocs = {
  // ==========================================
  // روت‌های پروفایل کاربری (Current User)
  // ==========================================
  "/api/v1/users/me": {
    get: {
      summary: "دریافت اطلاعات پروفایل خودم",
      description:
        "برگرداندن اطلاعات کاربری که هم‌اکنون لاگین است (نیاز به توکن).",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "اطلاعات پروفایل با موفقیت دریافت شد." },
        401: { description: "توکن نامعتبر است یا کاربر لاگین نیست." },
      },
    },
    delete: {
      summary: "حذف حساب کاربری خودم",
      description: "غیرفعال کردن یا حذف کامل حساب کاربری شخصی که لاگین است.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "حساب کاربری با موفقیت حذف/غیرفعال شد." },
        401: { description: "توکن نامعتبر است یا کاربر لاگین نیست." },
      },
    },
  },

  "/api/v1/users/updatedetails": {
    put: {
      summary: "ویرایش اطلاعات پروفایل",
      description:
        "آپدیت کردن نام یا ایمیل کاربری که لاگین است. (برای تغییر رمز عبور از روت Auth استفاده کنید).",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "علی محمدی (آپدیت شده)" },
                email: { type: "string", example: "new.email@example.com" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "اطلاعات با موفقیت آپدیت شد." },
        400: {
          description: "خطای اعتبارسنجی (مثلاً ایمیل نامعتبر یا تکراری).",
        },
        401: { description: "توکن نامعتبر است." },
      },
    },
  },

  // ==========================================
  // روت‌های مدیریت کاربران (فقط ادمین)
  // ==========================================
  "/api/v1/users": {
    get: {
      summary: "دریافت لیست تمام کاربران (فقط ادمین)",
      description:
        "لیست تمام کاربران سایت را برمی‌گرداند. فقط کاربرانی که نقش admin دارند به این روت دسترسی دارند.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "لیست کاربران دریافت شد." },
        403: { description: "عدم دسترسی (شما ادمین نیستید)." },
      },
    },
    post: {
      summary: "ایجاد کاربر جدید توسط ادمین",
      description: "ایجاد یک کاربر با نقش دلخواه به صورت مستقیم توسط ادمین.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "role"],
              properties: {
                name: { type: "string", example: "کاربر تستی ادمین" },
                email: { type: "string", example: "admin.created@example.com" },
                password: { type: "string", example: "password123" },
                role: {
                  type: "string",
                  example: "publisher",
                  description: "user, publisher, admin",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "کاربر با موفقیت ایجاد شد." },
        403: { description: "عدم دسترسی (شما ادمین نیستید)." },
      },
    },
  },

  "/api/v1/users/{id}": {
    get: {
      summary: "دریافت یک کاربر خاص (فقط ادمین)",
      description: "دریافت اطلاعات کامل یک کاربر بر اساس آیدی.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی کاربر",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "اطلاعات کاربر یافت شد." },
        404: { description: "کاربری یافت نشد." },
      },
    },
    put: {
      summary: "ویرایش اطلاعات کاربر (فقط ادمین)",
      description:
        "ادمین می‌تواند تمام اطلاعات کاربر از جمله نقش (Role) را تغییر دهد.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی کاربر",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "نام ویرایش شده" },
                email: { type: "string", example: "updated@example.com" },
                role: { type: "string", example: "admin" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "اطلاعات کاربر با موفقیت ویرایش شد." },
      },
    },
    delete: {
      summary: "حذف دائمی کاربر (فقط ادمین)",
      description: "حذف کامل کاربر از دیتابیس توسط ادمین.",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی کاربر",
          schema: { type: "string" },
        },
      ],
      responses: {
        204: { description: "کاربر با موفقیت حذف شد." },
      },
    },
  },
};
