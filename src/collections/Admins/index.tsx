import type { CollectionConfig } from "payload";

export const Admins: CollectionConfig = {
  slug: "admins",
  labels: { singular: "Admin", plural: "Admins" },
  auth: true, // password-based auth enabled
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req }) => {
      // Allow admins to read themselves (adjust as needed)
      if (req.user) return true;
      return false;
    },
    create: ({ req }) => !!req.user, // tighten or loosen as you prefer
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    // password + email come from auth:true automatically
    {
      name: "role",
      type: "select",
      options: ["admin", "superadmin"],
      defaultValue: "admin",
      required: true,
    },
    // add other admin-only profile fields as you like
  ],
};
