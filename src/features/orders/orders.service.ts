import { productRepo } from "#features/products/product.repository";
import { Errors } from "#shared/error";
import { AuthUser } from "#types/express.d";
import { orderRepo } from "./orders.repository";
import { OrderInputs } from "./orders.schema";

class OrderService {
  createOrder = async (input: OrderInputs.CreateOrder) => {
    const items = input.body;
    const itemsIds = input.body.map((item) => item.productId);
    const products = await productRepo.findProducts(itemsIds);
    if (products.length !== itemsIds.length) {
      throw Errors.NotFound("One or more products not found");
    }
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    // validate stock
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const stock = product.stockCount ?? 0;
      if (item.quantity > stock) {
        throw Errors.BadRequest(
          `Insufficient stock for product ${item.productId}`,
        );
      }
    }
    const businessIds = new Set(products.map((product) => product.businessId));
    if (businessIds.size > 1) {
      throw Errors.BadRequest("Order must be from one business");
    }
    const businessId = products[0].businessId;
    let totalCost = 0;
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      totalCost += product.price * item.quantity;
    }
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });
    const createdOrder = await orderRepo.createOrder({
      userId: input.userId,
      businessId: businessId,
      totalCost,
      items: orderItems,
    });
    return createdOrder;
  };
  getOrderById = async (orderId: string) => {
    const order = await orderRepo.getOrderById(orderId);
    return order;
  };
  getUserOrders = async (
    input: OrderInputs.GetUserOrders & Pick<AuthUser, "id">,
  ) => {
    const { userOrders, totalOrders } = await orderRepo.getUserOrders(input);
    const totalPages = Math.ceil(totalOrders / input.query.limit);
    return { userOrders, totalOrders, totalPages };
  };
  getBusinessOrders = async (input: OrderInputs.GetBusinessOrders) => {
    const { businessOrders, totalOrders } =
      await orderRepo.getBusinessOrders(input);
    const totalPages = Math.ceil(totalOrders / input.query.limit);
    return { businessOrders, totalOrders, totalPages };
  };
  editOrder = async (input: OrderInputs.EditOrder, userId: string) => {
    const items = input.body;

    const order = await orderService.getOrderById(input.params.orderId);

    if (!order) throw Errors.NotFound("Order has not been found");

    if (order.userId !== userId) throw Errors.Unauthorized;

    if (!["Pending", "Rejected"].includes(order.status))
      throw Errors.Conflict("Order cannot be edited in current state");

    const oneHour = 60 * 60 * 1000;
    const isExpired =
      Date.now() - new Date(order.createdAt).getTime() > oneHour;
    if (isExpired)
      throw Errors.Conflict("Order cannot be edited after one hour");

    const productIds = items.map((i) => i.productId);
    const products = await productRepo.findProducts(productIds);
    if (products.length !== productIds.length)
      throw Errors.NotFound("Some products not found");

    let totalCost = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw Errors.BadRequest("Invalid product");
      if (product.stockCount !== null && product.stockCount < item.quantity)
        throw Errors.BadRequest(`Insufficient stock for ${product.title}`);
      totalCost += product.price * item.quantity;
    }
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    const updatedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: productMap.get(item.productId)!.price,
    }));

    return await orderRepo.updateOrder({
      orderId: input.params.orderId,
      totalCost,
      items: updatedItems,
    });
  };
}

export const orderService = new OrderService();
