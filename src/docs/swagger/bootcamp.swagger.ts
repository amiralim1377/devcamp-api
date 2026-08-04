export const bootcampDocs = {
  "/api/v1/bootcamps": {
    get: {
      summary: "دریافت تمام بوت‌کمپ‌ها",
      description:
        "لیست تمام بوت‌کمپ‌ها را برمی‌گرداند. از کوئری پارامترها برای فیلتر، سورت و صفحه‌بندی پشتیبانی می‌کند.",
      tags: ["Bootcamps"],
      parameters: [
        {
          name: "select",
          in: "query",
          description:
            "فیلدهایی که می‌خواهید برگردانده شوند (با کاما جدا کنید)",
          schema: { type: "string" },
        },
        {
          name: "sort",
          in: "query",
          description:
            "مرتب‌سازی بر اساس فیلد خاص (برای نزولی از - استفاده کنید)",
          schema: { type: "string" },
        },
        {
          name: "page",
          in: "query",
          description: "شماره صفحه",
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "لیست بوت‌کمپ‌ها با موفقیت دریافت شد." },
      },
    },
    post: {
      summary: "ایجاد بوت‌کمپ جدید",
      description:
        "فقط کاربران با نقش instructor یا admin می‌توانند بوت‌کمپ بسازند.",
      tags: ["Bootcamps"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "description", "price"],
              properties: {
                title: { type: "string", example: "بوت‌کمپ جامع Node.js" },
                description: {
                  type: "string",
                  example: "آموزش صفر تا صد بک‌اند با نود جی‌اس",
                },
                price: { type: "number", example: 150.5 },
                // بقیه فیلدهای اسکیما را در صورت نیاز اینجا اضافه کنید
              },
            },
          },
        },
      },
      responses: {
        201: { description: "بوت‌کمپ با موفقیت ایجاد شد." },
        400: { description: "خطای اعتبارسنجی مقادیر ارسالی." },
        403: { description: "عدم دسترسی (نقش کاربر مجاز نیست)." },
      },
    },
  },

  "/api/v1/bootcamps/{id}": {
    get: {
      summary: "دریافت یک بوت‌کمپ",
      description: "اطلاعات کامل یک بوت‌کمپ را بر اساس آیدی دریافت می‌کند.",
      tags: ["Bootcamps"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "بوت‌کمپ با موفقیت پیدا شد." },
        404: { description: "بوت‌کمپی با این آیدی یافت نشد." },
      },
    },
    patch: {
      summary: "ویرایش بوت‌کمپ",
      description: "آپدیت کردن اطلاعات بوت‌کمپ. (نیاز به لاگین و دسترسی مجاز)",
      tags: ["Bootcamps"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
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
                title: { type: "string", example: "عنوان جدید آپدیت شده" },
                price: { type: "number", example: 199.99 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "بوت‌کمپ با موفقیت آپدیت شد." },
        403: { description: "عدم دسترسی برای ویرایش." },
        404: { description: "بوت‌کمپی یافت نشد." },
      },
    },
    delete: {
      summary: "حذف بوت‌کمپ",
      description:
        "حذف کامل یک بوت‌کمپ از دیتابیس. (نیاز به لاگین و دسترسی مجاز)",
      tags: ["Bootcamps"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
          schema: { type: "string" },
        },
      ],
      responses: {
        204: { description: "بوت‌کمپ با موفقیت حذف شد (بدون دیتای بازگشتی)." },
        403: { description: "عدم دسترسی برای حذف." },
        404: { description: "بوت‌کمپی یافت نشد." },
      },
    },
  },

  "/api/v1/bootcamps/{id}/photo": {
    put: {
      summary: "آپلود تصویر برای بوت‌کمپ",
      description: "ارسال فایل عکس برای تنظیم به عنوان تصویر اصلی بوت‌کمپ.",
      tags: ["Bootcamps"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          // در اینجا به جای json از multipart/form-data استفاده می‌کنیم
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                photo: {
                  type: "string",
                  format: "binary", // این فرمت باعث ایجاد دکمه Choose File در Swagger می‌شود
                  description: "فایل تصویر (jpeg, jpg, png)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "تصویر با موفقیت آپلود و ذخیره شد." },
        400: { description: "خطا در فرمت یا سایز تصویر." },
      },
    },
  },
};
