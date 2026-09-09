import type {
  HealthTip,
} from "@/data/healthTips";

export type DatabaseHealthTip =
  HealthTip & {
    databaseId: string;

    active: boolean;

    createdAt: string;

    updatedAt: string;
  };