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

    const [
      revenueTodayData,
      revenueWeekData,
      revenueMonthData,
      revenueYearData,
      totalOrdersData,
      totalRevenueData,
      returningCustomersData,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: today }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfWeek }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfMonth }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfYear }, payment_status: 'PAID' } }),
      prisma.order.count({ where: { payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { payment_status: 'PAID' } }),
      prisma.order.groupBy({ by: ['user_id'], _count: { id: true }, having: { id: { _count: { gt: 1 } } } })
    ]);

    const revenueToday = revenueTodayData._sum.total || 0;
    const revenueWeek = revenueWeekData._sum.total || 0;
    const revenueMonth = revenueMonthData._sum.total || 0;
    const revenueYear = revenueYearData._sum.total || 0;
    const totalRevenue = totalRevenueData._sum.total || 0;
    const aov = totalOrdersData > 0 ? (Number(totalRevenue) / totalOrdersData).toFixed(2) : 0;
    const returningCustomers = returningCustomersData.length;

    // Top Selling Products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['variant_id'],
      _sum: { quantity: true, total_price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const topProducts = await Promise.all(
      orderItems.map(async (item) => {
        if (!item.variant_id) return null;
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variant_id },
          include: { product: true }
        });
        return {
          name: variant?.product.name,
          size: variant?.size_ml,
          sold: item._sum.quantity,
          revenue: item._sum.total_price
        };
      })
    );

    res.json({
      success: true,
      data: {
        revenueToday,
        revenueWeek,
        revenueMonth,
        revenueYear,
        averageOrderValue: aov,
        returningCustomers,
        topProducts: topProducts.filter(Boolean)
      }
    });
  } catch (error) {
    console.error('ANALYTICS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
