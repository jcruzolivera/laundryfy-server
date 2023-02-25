const Order = require('../models/order');

const setTotalOrder = async (id) => {
  const order = await Order.findById(id);
  let total = 0;

  for (const line of order.orderLines) {
    total += line.subtotal;
  }

  order.total = total;
  order.save();
};

module.exports = setTotalOrder;
