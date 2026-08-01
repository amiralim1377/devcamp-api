import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface ISession {
  _id: Types.ObjectId;

  user: Types.ObjectId;

  // SHA-256 hash of the Refresh Token
  tokenHash: string;

  ipAddress?: string;

  userAgent?: string;

  lastUsedAt: Date;

  expiresAt: Date;

  revokedAt?: Date | null;

  createdAt?: Date;

  updatedAt?: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "sessions",
  },
);

// --------------------
// Indexes
// --------------------

// TTL Index
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Find all sessions of a user
sessionSchema.index({ user: 1 });

// Refresh lookup
sessionSchema.index({
  user: 1,
  revokedAt: 1,
});

// Token validation
sessionSchema.index({
  user: 1,
  tokenHash: 1,
  revokedAt: 1,
});

export type SessionDocument = HydratedDocument<ISession>;

export const Session = model<ISession>("Session", sessionSchema);
