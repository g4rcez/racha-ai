import { NextApiRequest, NextApiResponse } from "next";
import { parseMessageError } from "~/lib/http";
import { OrdersValidator } from "~/services/orders/order.validator";

export default function ordersHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const validation = OrdersValidator.cartSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json(parseMessageError(validation.error.issues));
}
