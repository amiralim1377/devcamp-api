export const reviewDocs = {
  // ==========================================
  // روت‌های مستقل نظرات (Independent Routes)
  // ==========================================
  "/api/v1/reviews": {
    get: {
      summary: "دریافت تمام نظرات",
      description: "لیست تمام نظرات ثبت‌شده در پلتفرم را برمی‌گرداند.",
      tags: ["Reviews"],
      responses: {
        200: { description: "لیست نظرات با موفقیت دریافت شد." },
      },
    },
    post: {
      summary: "ثبت نظر جدید (مسیر مستقیم)",
      description:
        "ثبت نظر. (نیاز به لاگین و دسترسی student یا admin). در این حالت ارسال فیلد bootcamp در Body الزامی است.",
      tags: ["Reviews"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "text", "rating", "bootcamp"],
              properties: {
                title: { type: "string", example: "دوره بسیار کاربردی" },
                text: {
                  type: "string",
                  example:
                    "مباحث به صورت کاملاً عملی تدریس شد. پشتیبانی هم عالی بود.",
                },
                rating: {
                  type: "number",
                  example: 5,
                  description: "امتیاز بین ۱ تا ۵",
                },
                bootcamp: {
                  type: "string",
                  example: "64a7c1234567890abcdef123",
                  description: "آیدی بوت‌کمپی که نظر برای آن ثبت می‌شود",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "نظر با موفقیت ثبت شد." },
        400: {
          description:
            "خطای اعتبارسنجی مقادیر (مثلاً امتیاز خارج از بازه ۱ تا ۵).",
        },
        403: { description: "عدم دسترسی (مدرسین مجاز به ثبت نظر نیستند)." },
      },
    },
  },

  "/api/v1/reviews/{id}": {
    get: {
      summary: "دریافت یک نظر خاص",
      description:
        "دریافت جزئیات کامل یک نظر به همراه اطلاعات کاربر و بوت‌کمپ مرتبط.",
      tags: ["Reviews"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی نظر",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "نظر با موفقیت پیدا شد." },
        404: { description: "نظری با این آیدی یافت نشد." },
      },
    },
    put: {
      summary: "ویرایش نظر",
      description:
        "آپدیت کردن عنوان، متن یا امتیاز نظر. (نیاز به لاگین). کاربر فقط می‌تواند نظرات خودش را ویرایش کند.",
      tags: ["Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی نظر",
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
                title: { type: "string", example: "عنوان ویرایش شده" },
                text: { type: "string", example: "متن ویرایش شده نظر..." },
                rating: { type: "number", example: 4 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "نظر با موفقیت آپدیت شد." },
        403: { description: "عدم دسترسی (شما سازنده این نظر نیستید)." },
      },
    },
    delete: {
      summary: "حذف نظر",
      description:
        "حذف یک نظر از سیستم. کاربر فقط می‌تواند نظرات خودش را حذف کند (مگر اینکه ادمین باشد).",
      tags: ["Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی نظر",
          schema: { type: "string" },
        },
      ],
      responses: {
        204: { description: "نظر با موفقیت حذف شد." },
        403: { description: "عدم دسترسی برای حذف این نظر." },
      },
    },
  },

  // ==========================================
  // روت‌های تودرتو (Nested Routes with mergeParams)
  // ==========================================
  "/api/v1/bootcamps/{bootcampId}/reviews": {
    get: {
      summary: "دریافت نظرات یک بوت‌کمپ",
      description:
        "فقط لیست نظراتی که متعلق به یک بوت‌کمپ خاص هستند را برمی‌گرداند.",
      tags: ["Reviews"],
      parameters: [
        {
          name: "bootcampId",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "لیست نظرات این بوت‌کمپ دریافت شد." },
      },
    },
    post: {
      summary: "ثبت نظر برای یک بوت‌کمپ (Nested)",
      description:
        "از آنجا که آیدی بوت‌کمپ در URL پاس داده می‌شود، نیازی به ارسال آن در Body نیست.",
      tags: ["Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "bootcampId",
          in: "path",
          required: true,
          description: "آیدی بوت‌کمپ",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "text", "rating"],
              properties: {
                title: { type: "string", example: "تجربه عالی" },
                text: {
                  type: "string",
                  example: "بهترین بوت‌کمپی بود که شرکت کردم.",
                },
                rating: { type: "number", example: 5 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "نظر برای این بوت‌کمپ ثبت شد." },
      },
    },
  },
};
