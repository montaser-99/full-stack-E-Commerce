import Product from '../models/product.js';
import Order from '../models/order.model.js';
import CartProduct from '../models/cartproduct.model.js';
import Address from '../models/address.model.js';
import User from '../models/user.model.js';
import Stripe from "stripe";
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const shippingFee = 50;

function pricewithDiscount(price, discount) {
  return Math.floor(price - (price * discount) / 100);
}

// ==================== Cash on Delivery ====================
export async function CashOnDeliveryOrder(req, res) {
  try {
    const userId = req.userid;

    const { list_items, addressId } = req.body;
    let subTotalAmt = 0;
 
    const products = await Promise.all(
      list_items.map(async (item) => {
        const product = await Product.findById(item.productId?._id || item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId._id}`);

        const quantity = item.quantity;
        const priceAfterDiscount = pricewithDiscount(product.price, product.discount);
        const totalForThisProduct = priceAfterDiscount * quantity;

        subTotalAmt += totalForThisProduct;

        return {
          productId: product._id,
          quantity,
          product_details: {
            name: product.name,
            image: product.image,
          },
        };
      })
    );

    const totalAmt = subTotalAmt + shippingFee;

    const orderData = {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      products,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    };

    const newOrder = await Order.create(orderData);

    await CartProduct.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    await User.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      success: true,
      error: false,
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ==================== Get User Orders ====================
export async function getUserOrders(req, res) {
  try {
    const userId = req.userid;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "Orders fetched successfully",
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
      success: false,
      error: true,
    });
  }
}

// ==================== Stripe Online Payment ====================
export const Onlinepayment = async (req, res) => {
  const { cartItems, addressId } = req.body;

  try {
   
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product_details.name,
          images: [item.product_details.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    
    const productIds = cartItems.map(item => item.productId).join(",");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: req.userid.toString(),
        addressId: addressId || '',
        productIds, 
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Stripe session creation failed",
      error: true,
      success: false,
    });
  }
};

// ==================== Stripe Webhook ====================
export async function webhookStripe(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
  
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = new mongoose.Types.ObjectId(session.metadata.userId);
      const addressId = session.metadata.addressId;
      const productIds = session.metadata.productIds.split(",");

     
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  
      const products = await Promise.all(
        productIds.map(async (id, index) => {
          const product = await Product.findById(id);
          if (!product) throw new Error(`Product not found: ${id}`);
          const quantity = lineItems.data[index].quantity;
          return {
            productId: product._id,
            quantity,
            product_details: {
              name: product.name,
              image: product.image,
            },
          };
        })
      );

      
      let subTotalAmt = 0;
      for (const p of products) {
        const product = await Product.findById(p.productId);
        const priceAfterDiscount = pricewithDiscount(product.price, product.discount);
        subTotalAmt += priceAfterDiscount * p.quantity;
      }

      const totalAmt = subTotalAmt + shippingFee;

    
      const newOrder = await Order.create({
        userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        products,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
        delivery_address: addressId,
        subTotalAmt,
        totalAmt,
      });

      await CartProduct.deleteMany({ userId });
      await User.findByIdAndUpdate(userId, { shopping_cart: [] });

      console.log("✅ Order created from Stripe:", newOrder);
    } catch (err) {
      console.error("Failed to process Stripe webhook:", err.message);
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

// ==================== Helper: Build Order from Stripe ====================
async function getOrderProductItems({ lineItems, userId, addressId, paymentId, payment_status }) {
  let subTotalAmt = 0;

  const products = await Promise.all(
    lineItems.data.map(async (item) => {
      const product = await Product.findById(item.metadata.productId); 
      if (!product) throw new Error(`Product not found for id: ${item.metadata.productId}`);

      const quantity = item.quantity;
      const priceAfterDiscount = pricewithDiscount(product.price, product.discount);
      const total = priceAfterDiscount * quantity;

      subTotalAmt += total;

      return {
        productId: product._id,
        quantity,
        product_details: {
          name: product.name,
          image: product.image,
        },
      };
    })
  );

  const totalAmt = subTotalAmt + shippingFee;

  return [{
    userId,
    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
    products,
    paymentId,
    payment_status,
    delivery_address: addressId,
    subTotalAmt,
    totalAmt,
  }];
}
