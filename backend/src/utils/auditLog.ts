import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAdminAction = async (
  adminId: number,
  action: string,
  entityType: string,
  entityId?: number,
  previousValue?: any,
  newValue?: any
) => {
  try {
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        previous_value: previousValue ? JSON.stringify(previousValue) : null,
        new_value: newValue ? JSON.stringify(newValue) : null,
      }
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};
