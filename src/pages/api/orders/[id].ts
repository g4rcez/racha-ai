import { z } from "zod";
import { authMiddleware, endpoint } from "~/lib/http";
import { OrdersService } from "~/services/orders/orders.service";

const uuidSchema = z.object({ id: z.string().uuid() });

export default endpoint({
  get: authMiddleware(async (req, res, session) => {
    const hasAuthorization = await OrdersService.authorizedUser(
      session.user.id,
    );
    if (!hasAuthorization) {
      return res.status(401).json({ session });
    }
    const validation = uuidSchema.safeParse(req.query);
    if (!validation.success) return res.status(400).json({ notFound: true });
    const order = await OrdersService.getById(validation.data.id);
    return order.isSuccess()
      ? res.json(order.success as never)
      : res.status(400).json({ notFound: true });
  }),
});
