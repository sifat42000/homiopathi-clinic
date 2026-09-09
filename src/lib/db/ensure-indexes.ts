import type {
  CreateIndexesOptions,
  IndexSpecification,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

type IndexTask = {
  collection: string;

  name: string;

  keys:
    IndexSpecification;

  options?:
    Omit<
      CreateIndexesOptions,
      "name"
    >;
};

const indexTasks:
  IndexTask[] = [
  /* Categories */
  {
    collection:
      "categories",

    name:
      "unique_category_slug",

    keys: {
      slug: 1,
    },

    options: {
      unique: true,
    },
  },

  /* Products */
  {
    collection:
      "products",

    name:
      "unique_product_numeric_id",

    keys: {
      id: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "products",

    name:
      "unique_product_slug",

    keys: {
      slug: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "products",

    name:
      "product_sku_index",

    keys: {
      sku: 1,
    },
  },

  {
    collection:
      "products",

    name:
      "public_products",

    keys: {
      active: 1,

      createdAt: -1,
    },
  },

  {
    collection:
      "products",

    name:
      "product_category",

    keys: {
      active: 1,

      categoryId: 1,

      createdAt: -1,
    },
  },

  /* Orders */
  {
    collection:
      "orders",

    name:
      "unique_order_number",

    keys: {
      orderNumber: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "orders",

    name:
      "customer_orders",

    keys: {
      userId: 1,

      createdAt: -1,
    },
  },

  {
    collection:
      "orders",

    name:
      "order_status",

    keys: {
      status: 1,

      createdAt: -1,
    },
  },

  {
    collection:
      "orders",

    name:
      "tracking_lookup",

    keys: {
      orderNumber: 1,

      "customer.phone": 1,
    },
  },

  /* Appointments */
  {
    collection:
      "appointments",

    name:
      "unique_appointment_number",

    keys: {
      appointmentNumber: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "appointments",

    name:
      "unique_active_appointment_slot",

    keys: {
      activeSlotKey: 1,
    },

    options: {
      unique: true,

      sparse: true,
    },
  },

  {
    collection:
      "appointments",

    name:
      "customer_appointments",

    keys: {
      userId: 1,

      createdAt: -1,
    },
  },

  {
    collection:
      "appointments",

    name:
      "appointment_schedule",

    keys: {
      date: 1,

      time: 1,
    },
  },

  /* Reviews */
  {
    collection:
      "reviews",

    name:
      "public_reviews",

    keys: {
      status: 1,

      createdAt: -1,
    },
  },

  {
    collection:
      "reviews",

    name:
      "customer_reviews",

    keys: {
      userId: 1,

      createdAt: -1,
    },
  },

  /* Treatments */
  {
    collection:
      "treatments",

    name:
      "unique_treatment_slug",

    keys: {
      slug: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "treatments",

    name:
      "public_treatments",

    keys: {
      active: 1,

      availability: 1,

      createdAt: -1,
    },
  },

  /* Health Tips */
  {
    collection:
      "healthTips",

    name:
      "unique_health_tip_slug",

    keys: {
      slug: 1,
    },

    options: {
      unique: true,
    },
  },

  {
    collection:
      "healthTips",

    name:
      "public_health_tips",

    keys: {
      active: 1,

      createdAt: -1,
    },
  },

  /* Customer Profile */
  {
    collection:
      "customerProfiles",

    name:
      "unique_customer_profile_user",

    keys: {
      userId: 1,
    },

    options: {
      unique: true,
    },
  },

  /* Website Settings */
  {
    collection:
      "websiteSettings",

    name:
      "unique_website_settings_key",

    keys: {
      key: 1,
    },

    options: {
      unique: true,
    },
  },
];

export async function ensureDatabaseIndexes() {
  const db =
    await getDb();

  const results: {
    collection: string;

    index: string;
  }[] = [];

  for (
    const task of
    indexTasks
  ) {
    const indexName =
      await db
        .collection(
          task.collection
        )
        .createIndex(
          task.keys,

          {
            ...task.options,

            name:
              task.name,
          }
        );

    results.push({
      collection:
        task.collection,

      index:
        indexName,
    });
  }

  return results;
}

export const productionIndexCollections =
  Array.from(
    new Set(
      indexTasks.map(
        (task) =>
          task.collection
      )
    )
  );