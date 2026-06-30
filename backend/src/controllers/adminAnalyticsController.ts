import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAnalytics = async (req: Request, res: Response) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Sales Trends: Last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d;
    }).reverse();

    const [
      revenueTodayData,
      revenueWeekData,
      revenueMonthData,
      revenueYearData,
      totalOrdersData,
      totalRevenueData,
      totalCustomersData,
      returningCustomersData,
      recentOrdersData,
      pendingOrders,
      orderItems,
      ...trendResults
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfWeek } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfYear } } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.user.count({ where: { is_email_verified: true, is_active: true } }),
      // Only fetch groups with more than 1 order — DB filters instead of loading all rows into memory
      prisma.order.groupBy({
        by: ['user_id'],
        where: { user_id: { not: null } },
        _count: { id: true },
        having: { id: { _count: { gt: 1 } } }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      // Moved pendingOrders into this Promise.all to save a round-trip
      prisma.order.count({ where: { status: 'PENDING' } }),
      // Top products groupBy — runs in parallel with everything else
      prisma.orderItem.groupBy({
        by: ['variant_id'],
        _sum: { quantity: true, total_price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      // Sales trends for last 7 days — all in parallel with the rest
      ...last7Days.map((date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        return prisma.order.aggregate({
          _sum: { total: true },
          where: { created_at: { gte: date, lt: nextDate }, payment_status: 'PAID' }
        });
      })
    ]);

    const salesTrends = last7Days.map((date, i) => ({
      date: date.toISOString().split('T')[0],
      revenue: trendResults[i]._sum.total || 0
    }));

    const revenueToday = revenueTodayData._sum.total || 0;
    const revenueWeek = revenueWeekData._sum.total || 0;
    const revenueMonth = revenueMonthData._sum.total || 0;
    const revenueYear = revenueYearData._sum.total || 0;
    const totalRevenue = totalRevenueData._sum.total || 0;
    const aov = totalOrdersData > 0 ? (Number(totalRevenue) / totalOrdersData).toFixed(2) : 0;
    const returningCustomers = returningCustomersData.length;
    const totalCustomers = totalCustomersData;

    // Fetch all top product variants in one query instead of N separate lookups
    const variantIds = orderItems.filter(i => i.variant_id).map(i => i.variant_id as number);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true } } }
    });
    const variantMap = new Map(variants.map(v => [v.id, v]));

    const topProducts = orderItems
      .filter(item => item.variant_id && variantMap.has(item.variant_id))
      .map(item => {
        const variant = variantMap.get(item.variant_id!);
        return {
          name: variant?.product.name,
          size: variant?.size_ml,
          sold: item._sum.quantity,
          revenue: item._sum.total_price
        };
      });

    res.json({
      success: true,
      data: {
        revenueToday,
        revenueWeek,
        revenueMonth,
        revenueYear,
        totalRevenue,
        totalOrders: totalOrdersData,
        pendingOrders,
        totalCustomers,
        averageOrderValue: Number(aov),
        returningCustomers,
        topProducts: topProducts.filter(Boolean),
        recentOrders: recentOrdersData,
        salesTrends
      }
    });
  } catch (error) {
    console.error('ANALYTICS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const [pendingOrders, unreadMessages, lowStockVariants] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.contactMessage.count({ where: { is_read: false } }),
      prisma.productVariant.findMany({
        where: {
          is_active: true,
        },
        select: {
          id: true,
          stock_quantity: true,
          low_stock_alert: true,
          sku: true,
          product: { select: { name: true } }
        }
      })
    ]);

    const lowStockItems = lowStockVariants.filter(v => v.stock_quantity <= v.low_stock_alert);

    const notifications = [
      ...(pendingOrders > 0 ? [{
        id: 'pending-orders',
        type: 'order',
        message: `${pendingOrders} order${pendingOrders > 1 ? 's' : ''} pending fulfillment`,
        link: '/admin/orders'
      }] : []),
      ...(unreadMessages > 0 ? [{
        id: 'unread-messages',
        type: 'message',
        message: `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`,
        link: '/admin/messages'
      }] : []),
      ...lowStockItems.slice(0, 5).map(v => ({
        id: `low-stock-${v.id}`,
        type: 'stock',
        message: `${v.product.name} (${v.sku}) is low on stock (${v.stock_quantity} left)`,
        link: '/admin/inventory'
      }))
    ];

    res.json({
      success: true,
      data: {
        count: notifications.length,
        notifications
      }
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          admin: { select: { first_name: true, last_name: true, email: true } }
        }
      })
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET AUDIT LOGS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
