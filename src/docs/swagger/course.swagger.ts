export const courseDocs = {
  // ==========================================
  // روت‌های مستقل دوره‌ها (Independent Routes)
  // ==========================================
  "/api/v1/courses": {
    get: {
      summary: "دریافت تمام دوره‌ها (Courses)",
      description: "لیست تمام دوره‌های ثبت‌شده در کل پلتفرم را برمی‌گرداند.",
      tags: ["Courses"],
      responses: {
        200: { description: "لیست دوره‌ها با موفقیت دریافت شد." },
      },
    },
    post: {
      summary: "ایجاد دوره جدید (مسیر مستقیم)",
      description:
        "ایجاد یک دوره جدید. (نیاز به لاگین و دسترسی instructor/admin). در این حالت ارسال فیلد bootcamp (آیدی بوت‌کمپ) در Body الزامی است.",
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "title",
                "description",
                "tuition",
                "minimumSkill",
                "bootcamp",
              ],
              properties: {
                title: { type: "string", example: "آموزش پیشرفته Express" },
                description: {
                  type: "string",
                  example: "یادگیری عمیق میدلورها و روتینگ",
                },
                weeks: { type: "number", example: 4 },
                tuition: { type: "number", example: 120 },
                minimumSkill: {
                  type: "string",
                  example: "intermediate",
                  description: "beginner, intermediate, advanced",
                },
                bootcamp: {
                  type: "string",
                  example: "64a7c1234567890abcdef123",
                  description: "آیدی بوت‌کمپی که این دوره متعلق به آن است",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "دوره با موفقیت ایجاد شد." },
        400: { description: "خطای اعتبارسنجی." },
      },
    },
  },

  "/api/v1/courses/{id}": {
    get: {
      summary: "دریافت یک دوره خاص",
      description: "اطلاعات کامل یک دوره را بر اساس آیدی دریافت می‌کند.",
      tags: ["Courses"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی دوره",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "دوره با موفقیت پیدا شد." },
        404: { description: "دوره‌ای با این آیدی یافت نشد." },
      },
    },
    patch: {
      summary: "ویرایش دوره",
      description: "آپدیت کردن اطلاعات دوره. (نیاز به لاگین و دسترسی مجاز)",
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی دوره",
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
                title: { type: "string", example: "عنوان جدید دوره" },
                tuition: { type: "number", example: 150 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "دوره با موفقیت آپدیت شد." },
      },
    },
    delete: {
      summary: "حذف دوره",
      description: "حذف کامل یک دوره. (نیاز به لاگین و دسترسی مجاز)",
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "آیدی دوره",
          schema: { type: "string" },
        },
      ],
      responses: {
        204: { description: "دوره با موفقیت حذف شد." },
      },
    },
  },

  // ==========================================
  // روت‌های تودرتو (Nested Routes with mergeParams)
  // ==========================================
  "/api/v1/bootcamps/{bootcampId}/courses": {
    get: {
      summary: "دریافت دوره‌های یک بوت‌کمپ خاص",
      description:
        "فقط لیست دوره‌هایی که متعلق به یک بوت‌کمپ خاص هستند را برمی‌گرداند (Nested Route).",
      tags: ["Courses"],
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
        200: { description: "لیست دوره‌های بوت‌کمپ دریافت شد." },
      },
    },
    post: {
      summary: "ایجاد دوره برای یک بوت‌کمپ (Nested)",
      description:
        "ایجاد دوره جدید. چون آیدی بوت‌کمپ در URL پاس داده می‌شود، نیازی به ارسال آن در Body نیست.",
      tags: ["Courses"],
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
              required: ["title", "description", "tuition", "minimumSkill"],
              properties: {
                title: { type: "string", example: "آموزش مقدماتی جاوااسکریپت" },
                description: { type: "string", example: "مبانی برنامه‌نویسی" },
                weeks: { type: "number", example: 8 },
                tuition: { type: "number", example: 80 },
                minimumSkill: { type: "string", example: "beginner" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "دوره با موفقیت برای بوت‌کمپ ایجاد شد." },
      },
    },
  },
};
