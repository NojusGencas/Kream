import db from '../db/mysql.js';

// GET /stats - bendra statistika admin dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    // Produktų statistika
    const [productsTotal] = await db.query(`SELECT COUNT(*) as count FROM products`);
    const [productsActive] = await db.query(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`);
    
    // Kategorijų statistika
    const [categoriesTotal] = await db.query(`SELECT COUNT(*) as count FROM categories`);
    
    // Vartotojų statistika
    const [usersTotal] = await db.query(`SELECT COUNT(*) as count FROM users`);
    
    // Užsakymų statistika
    let ordersStats = { total: 0, new: 0, confirmed: 0, completed: 0 };
    try {
      const [ordersTotal] = await db.query(`SELECT COUNT(*) as count FROM orders`);
      const [ordersNew] = await db.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'new'`);
      const [ordersConfirmed] = await db.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'confirmed'`);
      const [ordersCompleted] = await db.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'completed'`);
      ordersStats = {
        total: ordersTotal[0].count,
        new: ordersNew[0].count,
        confirmed: ordersConfirmed[0].count,
        completed: ordersCompleted[0].count
      };
    } catch (e) {
      // Jei orders lentelės dar nėra
      console.log('Orders table not found');
    }

    // Paskutiniai užsakymai
    let recentOrders = [];
    try {
      const [orders] = await db.query(`
        SELECT id, name, email, cake_type, status, created_at 
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      recentOrders = orders;
    } catch (e) {
      console.log('Could not fetch recent orders');
    }

    // Užsakymų per paskutines 7 dienas grafikui
    let ordersChart = [];
    try {
      const [chartData] = await db.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM orders 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);
      ordersChart = chartData;
    } catch (e) {
      console.log('Could not fetch orders chart data');
    }

    // Populiariausi produktai (pagal peržiūras ar užsakymus)
    let popularProducts = [];
    try {
      const [products] = await db.query(`
        SELECT id, name, price, is_active 
        FROM products 
        WHERE is_active = 1 
        ORDER BY sort_order ASC 
        LIMIT 5
      `);
      popularProducts = products;
    } catch (e) {
      console.log('Could not fetch popular products');
    }

    res.json({
      products: {
        total: productsTotal[0].count,
        active: productsActive[0].count,
        inactive: productsTotal[0].count - productsActive[0].count
      },
      categories: {
        total: categoriesTotal[0].count
      },
      users: {
        total: usersTotal[0].count
      },
      orders: ordersStats,
      recentOrders,
      ordersChart,
      popularProducts
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};
